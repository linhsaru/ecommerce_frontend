import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiOutlineEye } from 'react-icons/hi2';
import StarRating from './StarRating';
import PriceDisplay from './PriceDisplay';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useTranslation } from '../../context/LanguageContext';
import { apiService } from '../../services';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import { imageUtils } from '../../utils/image';

const getPrimaryImageSrc = (p) => {
  if (!p) return '';

  if (typeof p.thumbnailUrl === 'string' && p.thumbnailUrl) return p.thumbnailUrl;
  if (typeof p.image === 'string' && p.image) return p.image;

  // Support arrays of string urls or objects with { url }
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    if (typeof first === 'string') return first;
    if (first && typeof first.url === 'string') return first.url;
  }

  if (Array.isArray(p.imageProduct) && p.imageProduct.length > 0) {
    const first = p.imageProduct[0];
    if (typeof first === 'string') return first;
    if (first && typeof first.url === 'string') return first.url;
  }

  return '';
};

const ProductCard = ({ product, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const placeholderSrc = useMemo(
    () => (typeof document !== 'undefined' ? imageUtils.generatePlaceholder(400, 300) : ''),
    []
  );
  const primarySrcFromProduct = useMemo(() => getPrimaryImageSrc(product), [product]);
  const [imageSrc, setImageSrc] = useState(() => primarySrcFromProduct || placeholderSrc);

  useEffect(() => {
    setImageSrc(primarySrcFromProduct || placeholderSrc);
    setImageLoaded(false);
  }, [primarySrcFromProduct, placeholderSrc]);

  useEffect(() => {
    if (!imageSrc) {
      setImageLoaded(true);
      return;
    }

    let cancelled = false;

    const preload = new Image();
    preload.onload = () => {
      if (cancelled) return;
      setImageLoaded(true);
    };
    preload.onerror = () => {
      if (cancelled) return;
      if (placeholderSrc && imageSrc !== placeholderSrc) {
        setImageSrc(placeholderSrc);
        setImageLoaded(false);
        return;
      }
      setImageLoaded(true);
    };
    preload.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc, placeholderSrc]);

  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { t } = useTranslation();

  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'success' });

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let variantId = product.id;
    try {
      const { data: response } = await apiService.get(`/products/${product.id}/variants`);
      const variants = response?.data ?? response ?? [];
      if (variants && variants.length > 0) {
        variantId = variants[0].id;
      }
    } catch (error) {
      console.error("Failed to fetch variants for buy now", error);
    }

    navigate('/checkout', { state: { buyNowItem: { ...product, variantId, quantity: 1 } } });
  };

  const badgeColors = {
    primary: 'bg-primary-500 text-white',
    accent: 'bg-accent-500 text-white',
    danger: 'bg-danger-500 text-white',
    success: 'bg-success-600 text-white',
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let variantId = product.id;
    try {
      const { data: response } = await apiService.get(`/products/${product.id}/variants`);
      const variants = response?.data ?? response ?? [];
      if (variants && variants.length > 0) {
        variantId = variants[0].id;
      }
    } catch (error) {
      console.error("Failed to fetch variants for add to cart", error);
    }

    addToCart({ ...product, variantId }, 1);
    setToastConfig({ isVisible: true, message: `${t('add_to_cart_success')}`, status: 'success' });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="card card-hover flex gap-4 p-4 group"
      >
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
            onError={() => {
              if (placeholderSrc && imageSrc !== placeholderSrc) setImageSrc(placeholderSrc);
            }}
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColors[product.badgeColor] || badgeColors.primary}`}>
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-caption text-neutral-500 mb-0.5">{product.brand}</p>
            <h3 className="text-body-sm font-semibold text-neutral-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <StarRating rating={product.rating} size="sm" reviewCount={product.reviewCount} />
          </div>
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card card-hover group block overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-product overflow-hidden bg-neutral-100">
        {/* Shimmer placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer" />
        )}
        <img
          src={imageSrc}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (placeholderSrc && imageSrc !== placeholderSrc) {
              setImageSrc(placeholderSrc);
              setImageLoaded(false);
              return;
            }
            setImageLoaded(true);
          }}
        />

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-caption font-semibold shadow-soft-sm ${badgeColors[product.badgeColor] || badgeColors.primary}`}>
            {product.badge}
          </span>
        )}

        {/* Action buttons */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-soft-md backdrop-blur-sm transition-all duration-200 hover:scale-110
              ${isInWishlist ? 'bg-danger-50 text-danger-500' : 'bg-white/90 text-neutral-600 hover:text-danger-500'}`}
          >
            {isInWishlist ? <HiHeart className="w-4.5 h-4.5" /> : <HiOutlineHeart className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="p-2 rounded-full bg-white/90 text-neutral-600 shadow-soft-md backdrop-blur-sm hover:text-primary-600 transition-all duration-200 hover:scale-110"
          >
            <HiOutlineEye className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Action buttons on hover bottom */}
        <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center py-2.5 bg-primary-600 text-white rounded-xl text-body-sm font-semibold shadow-soft-lg hover:bg-primary-700 transition-all duration-200"
          >
            {t('buy_now')}
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2.5 flex items-center justify-center bg-white/95 backdrop-blur-sm text-neutral-800 rounded-xl shadow-soft-lg hover:bg-neutral-100 transition-all duration-200"
            title="Add to Cart"
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-caption text-neutral-500 font-medium">{product.brand}</p>
          {product.isNew && (
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">New</span>
          )}
        </div>
        <h3 className="text-body-sm font-semibold text-neutral-800 line-clamp-1 group-hover:text-primary-600 transition-colors duration-200 mb-1.5">
          {product.name}
        </h3>
        <div className="mb-2">
          <StarRating rating={product.rating} size="sm" reviewCount={product.reviewCount} />
        </div>
        <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" />
      </div>

      {toastConfig.isVisible && (
        <ToastNotification
          isVisible={toastConfig.isVisible}
          message={toastConfig.message}
          status={toastConfig.status}
          onClose={() => setToastConfig(p => ({ ...p, isVisible: false }))}
        />
      )}
    </Link>
  );
};

export default ProductCard;
