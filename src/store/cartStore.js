import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '../services';
import { useAuthStore } from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      total: 0,
      itemCount: 0,

      // Actions
      addItem: async (product, quantity = 1) => {
        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();
        const productId = product.id;
        const variantId =
          product.variantId ||
          product.variant_id ||
          (Array.isArray(product?.variants) && product.variants.length > 0 ? (product.variants[0]?.id ?? product.variants[0]?.variantId) : null);

        const resolvedImage =
          (typeof product?.image === 'string' && product.image) ? product.image
            : (typeof product?.thumbnailUrl === 'string' && product.thumbnailUrl) ? product.thumbnailUrl
              : (typeof product?.thumbnail_url === 'string' && product.thumbnail_url) ? product.thumbnail_url
                : (Array.isArray(product?.images) && product.images.length > 0)
                  ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.url || ''))
                  : '';

        const resolvedThumbnailUrl =
          (typeof product?.thumbnailUrl === 'string' && product.thumbnailUrl) ? product.thumbnailUrl
            : (typeof product?.thumbnail_url === 'string' && product.thumbnail_url) ? product.thumbnail_url
              : (typeof product?.image === 'string' && product.image) ? product.image
                : '';

        if (!variantId) {
          console.error('Missing variantId for product', product);
          return;
        }

        if (isAuthenticated) {
          try {
            await apiService.post('/cart/items', {
              productId,
              variantId,
              quantity
            });
          } catch (error) {
            console.error("Failed to add item to cart on server", error);
          }
        }

        const existingItemIndex = items.findIndex(item => item.id === productId && (item.variantId === variantId || !item.variantId));

        let newItems;
        if (existingItemIndex >= 0) {
          newItems = items.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  // Fill missing image fields if available
                  ...(item.image ? {} : (resolvedImage ? { image: resolvedImage } : {})),
                  ...(item.thumbnailUrl ? {} : (resolvedThumbnailUrl ? { thumbnailUrl: resolvedThumbnailUrl } : {})),
                }
              : item
          );
        } else {
          newItems = [
            ...items,
            {
              ...product,
              variantId,
              quantity,
              ...(resolvedImage ? { image: product.image || resolvedImage } : {}),
              ...(resolvedThumbnailUrl && !product.thumbnailUrl ? { thumbnailUrl: resolvedThumbnailUrl } : {}),
            }
          ];
        }

        const { total, itemCount } = calculateCartTotals(newItems);

        set({
          items: newItems,
          total,
          itemCount,
        });
      },

      removeItem: async (productId, variantId) => {
        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();

        if (isAuthenticated) {
          try {
            await apiService.delete(`/cart/items/${variantId}`);
          } catch (error) {
            console.error("Failed to remove item from server cart", error);
          }
        }

        const newItems = items.filter(item => !(item.id === productId && item.variantId === variantId));
        const { total, itemCount } = calculateCartTotals(newItems);

        set({
          items: newItems,
          total,
          itemCount,
        });
      },

      updateQuantity: async (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        const { isAuthenticated } = useAuthStore.getState();
        const { items } = get();

        const currentItem = items.find(item => item.id === productId && item.variantId === variantId);
        if (!currentItem) return;

        const delta = quantity - currentItem.quantity;

        if (isAuthenticated && delta !== 0) {
          try {
            await apiService.patch(`/cart/items/${variantId}/quantity`, { delta });
          } catch (error) {
            console.error("Failed to update quantity on server", error);
          }
        }

        const newItems = items.map(item =>
          (item.id === productId && item.variantId === variantId)
            ? { ...item, quantity }
            : item
        );

        const { total, itemCount } = calculateCartTotals(newItems);

        set({
          items: newItems,
          total,
          itemCount,
        });
      },

      clearCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          const { items } = get();
          // Backend chỉ có DELETE /cart/items/{variantId}, xóa từng item một
          await Promise.allSettled(
            items.map((item) =>
              apiService.delete(`/cart/items/${item.variantId}`).catch((err) =>
                console.error(`Failed to remove cart item ${item.variantId} from server`, err)
              )
            )
          );
        }

        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      // Fetch cart from API
      fetchCart: async () => {
        try {
          const { data: response } = await apiService.get('/cart');
          const cartData = response?.data ?? response;
          const itemsFromApi = cartData?.items || [];

          const mappedItems = itemsFromApi.map(item => ({
            id: item.productId,
            variantId: item.variantId,
            name: item.productName || item.variantName,
            price: item.price,
            quantity: item.quantity,
            slug: item.productSlug,
            image: item.productImage,
          }));

          const { total, itemCount } = calculateCartTotals(mappedItems);

          set({
            items: mappedItems,
            total,
            itemCount,
          });
        } catch (error) {
          console.error("Failed to fetch cart from server", error);
        }
      },

      // Get item quantity
      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },

      // Check if item is in cart
      isInCart: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      // Get cart summary
      getCartSummary: () => {
        const { items, total, itemCount } = get();
        return {
          items,
          total,
          itemCount,
          subtotal: total,
          // You can add tax, shipping calculations here
        };
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  const total = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { total, itemCount };
};

export { useCartStore };
