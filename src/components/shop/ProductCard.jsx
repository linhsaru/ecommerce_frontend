import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiOutlineEye } from 'react-icons/hi2';
import StarRating from './StarRating';
import PriceDisplay from './PriceDisplay';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

const ProductCard = ({ product, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const badgeColors = {
    primary: 'bg-primary-500 text-white',
    accent: 'bg-accent-500 text-white',
    danger: 'bg-danger-500 text-white',
    success: 'bg-success-600 text-white',
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
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
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
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
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
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

        {/* Add to cart button */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/95 backdrop-blur-sm text-neutral-800 rounded-xl text-body-sm font-semibold shadow-soft-lg hover:bg-primary-600 hover:text-white transition-all duration-200"
          >
            <HiOutlineShoppingBag className="w-4 h-4" />
            Add to Cart
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
    </Link>
  );
};

export default ProductCard;
