import { Link } from 'react-router-dom';
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { useCartStore } from '../../store/cartStore';
import { QuantitySelector, ProductCard } from '../../components/shop';
import { useMemo, useEffect, useState } from 'react';
import { formatVnd } from '../../utils/price';
import { useTranslation } from '../../context/LanguageContext';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import { useProductStore } from '../../store/productStore';
import { imageUtils } from '../../utils/image';

const mapApiProductToCardViewModel = (p) => {
  const price = p?.originalPrice ?? 0;
  const discountPrice = p?.discountedPrice ?? null;
  const discountPercent =
    typeof p?.discountPercent === 'number' ? p.discountPercent : null;

  const images =
    Array.isArray(p?.imageProduct) && p.imageProduct.length > 0
      ? [...p.imageProduct]
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
        .map((img) => img?.url)
        .filter(Boolean)
      : [];

  const badge = typeof discountPercent === 'number' && discountPercent > 0
    ? `-${Math.round(discountPercent)}%`
    : null;

  return {
    id: p?.id,
    slug: p?.slug,
    name: p?.name ?? '',
    description: p?.description ?? '',
    brand: p?.brandName ?? '',
    price,
    discountPrice,
    rating: p?.averageRating ?? p?.rating ?? 4.8,
    reviewCount: p?.reviewCount ?? 0,
    badge,
    badgeColor: badge ? 'danger' : 'primary',
    isNew: false,
    images: images.length ? images : (p?.thumbnailUrl ? [p.thumbnailUrl] : []),
    thumbnailUrl: p?.thumbnailUrl ?? null,
  };
};

const CartPage = () => {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCartStore();
  const { t } = useTranslation();
  const { fetchProducts } = useProductStore();

  const placeholderSrc = useMemo(
    () => (typeof document !== 'undefined' ? imageUtils.generatePlaceholder(220, 220) : ''),
    []
  );
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'success' });

  const showToast = (message, status = 'success') => {
    setToastConfig({ isVisible: true, message, status });
  };

  const handleRemoveItem = async (productId, variantId) => {
    await removeItem(productId, variantId);
    showToast(`${t('remove_from_cart_success')}`, 'success');
  };

  const shipping = total >= 199 ? 0 : 9.99;
  const discount = promoApplied ? total * 0.1 : 0;
  const grandTotal = total + shipping - discount;

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState(false);

  const getCartItemImageSrc = (item) => {
    if (!item) return placeholderSrc;
    if (typeof item.image === 'string' && item.image) return item.image;
    if (typeof item.thumbnailUrl === 'string' && item.thumbnailUrl) return item.thumbnailUrl;

    if (Array.isArray(item.images) && item.images.length > 0) {
      const first = item.images[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.url === 'string') return first.url;
    }

    if (Array.isArray(item.imageProduct) && item.imageProduct.length > 0) {
      const first = item.imageProduct[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.url === 'string') return first.url;
    }

    if (typeof item.productImage === 'string' && item.productImage) return item.productImage;

    return placeholderSrc;
  };

  useEffect(() => {
    if (items.length !== 0) return;

    let cancelled = false;
    setIsSuggestedLoading(true);

    fetchProducts({ page: 1, pageSize: 20 })
      .then((res) => {
        const list = res?.items ?? [];
        const newest = [...list]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 4);
        if (cancelled) return;
        setSuggestedProducts(newest.map(mapApiProductToCardViewModel));
      })
      .catch(() => {
        if (cancelled) return;
        setSuggestedProducts([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsSuggestedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [items.length, fetchProducts]);

  const handleApplyPromo = () => {
    if (['BUILD15', 'FREESHIP', 'SAVE10'].includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <HiOutlineShoppingBag className="w-10 h-10 text-neutral-400" />
            </div>
            <h1 className="text-display-sm text-neutral-900 mb-3">{t('cart_empty_title')}</h1>
            <p className="text-body-md text-neutral-500 mb-8">
              {t('cart_empty_desc')}
            </p>
            <Link to="/products" className="btn-primary btn-lg">
              {t('cart_start_shopping')}
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Suggested Products */}
          {!isSuggestedLoading && suggestedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-heading-lg text-neutral-900 mb-6">{t('cart_you_might_like')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {suggestedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">{t('home')}</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{t('cart_shopping_cart')}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-sm text-neutral-900 mb-1">{t('cart_shopping_cart')}</h1>
            <p className="text-body-md text-neutral-500">{itemCount} {t('cart_items_count')}</p>
          </div>
          <button
            onClick={clearCart}
            className="btn-ghost text-danger-600 hover:text-danger-700 hover:bg-danger-50"
          >
            <HiOutlineTrash className="w-4 h-4" />
            {t('cart_clear')}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 md:p-6 group">
                <div className="flex gap-4 md:gap-6">
                  {/* Image */}
                  <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-neutral-100">
                      <img
                        src={getCartItemImageSrc(item)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-caption text-neutral-500 mb-0.5">{item.brand}</p>
                        <Link
                          to={`/products/${item.slug}`}
                          className="text-body-sm md:text-body-md font-semibold text-neutral-800 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.selectedColor && (
                          <p className="text-caption text-neutral-500 mt-0.5">Color: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-caption text-neutral-500">Size: {item.selectedSize}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.variantId)}
                        className="p-2 text-neutral-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-all duration-200"
                      >
                        <HiOutlineTrash className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.id, item.variantId, qty)}
                        size="sm"
                      />
                      <div className="text-right">
                        <p className="text-heading-sm font-bold text-neutral-900">
                          {formatVnd((item.discountPrice || item.price) * item.quantity)}
                        </p>
                        {item.discountPrice && (
                          <p className="text-caption text-neutral-400 line-through">
                            {formatVnd(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link to="/products" className="btn-ghost text-primary-600 hover:text-primary-700">
                {t('cart_continue_shopping')}
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-heading-md text-neutral-900 mb-6">{t('cart_order_summary')}</h3>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <HiOutlineTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder={t('cart_promo_placeholder')}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="input pl-9 text-body-sm"
                      disabled={promoApplied}
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode || promoApplied}
                    className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap active:scale-95 border ${
                      promoApplied
                        ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.4)] cursor-default'
                        : 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/20 disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:active:scale-100 disabled:cursor-not-allowed disabled:shadow-none'
                    }`}
                  >
                    {promoApplied ? t('cart_applied') : t('cart_apply')}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-caption text-success-600 mt-1.5 font-medium">
                    {t('cart_promo_applied')}
                  </p>
                )}
              </div>

              {/* Summary Lines */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">{t('cart_subtotal')}</span>
                  <span className="text-neutral-800 font-medium">{formatVnd(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-body-sm">
                    <span className="text-success-600">{t('cart_discount')}</span>
                    <span className="text-success-600 font-medium">-{formatVnd(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-body-sm">
                  <span className="text-neutral-500">{t('cart_shipping_label')}</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-success-600' : 'text-neutral-800'}`}>
                    {shipping === 0 ? t('free') : formatVnd(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-caption text-primary-600 bg-primary-50 rounded-lg px-3 py-2">
                    {t('cart_free_shipping_hint').replace('{amount}', formatVnd(199 - total))}
                  </p>
                )}
              </div>

              <div className="divider mb-4" />

              <div className="flex justify-between mb-6">
                <span className="text-heading-sm text-neutral-900">{t('cart_total')}</span>
                <span className="text-heading-md text-neutral-900 font-bold">{formatVnd(grandTotal)}</span>
              </div>

              <Link to="/checkout" className="btn-primary btn-lg w-full mb-4">
                {t('cart_checkout_btn')}
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-100">
                {[
                  { icon: HiOutlineTruck, textKey: 'cart_trust_freeship' },
                  { icon: HiOutlineShieldCheck, textKey: 'cart_trust_secure' },
                  { icon: HiOutlineArrowPath, textKey: 'cart_trust_returns' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-caption text-neutral-500">
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{t(item.textKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastNotification
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        status={toastConfig.status}
        onClose={() => setToastConfig(p => ({ ...p, isVisible: false }))}
      />
    </div>
  );
};

export default CartPage;
