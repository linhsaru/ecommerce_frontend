import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      total: 0,
      itemCount: 0,

      // Actions
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);

        let newItems;
        if (existingItem) {
          newItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...items, { ...product, quantity }];
        }

        const { total, itemCount } = calculateCartTotals(newItems);

        set({
          items: newItems,
          total,
          itemCount,
        });
      },

      removeItem: (productId) => {
        const { items } = get();
        const newItems = items.filter(item => item.id !== productId);
        const { total, itemCount } = calculateCartTotals(newItems);

        set({
          items: newItems,
          total,
          itemCount,
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const newItems = items.map(item =>
          item.id === productId
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

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
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
