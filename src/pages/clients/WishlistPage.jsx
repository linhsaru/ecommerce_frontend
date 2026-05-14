import { Link } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { PriceDisplay, ProductCard } from '../../components/shop';
import { products } from '../../data/mockData';
import { useTranslation } from '../../context/LanguageContext';

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { t } = useTranslation();

  const suggestedProducts = products
    .filter((p) => !items.find((i) => i.id === p.id))
    .slice(0, 4);

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeItem(item.id);
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
              <HiOutlineHeart className="w-10 h-10 text-neutral-400" />
            </div>
            <h1 className="text-display-sm text-neutral-900 mb-3">{t('wishlist_empty_title')}</h1>
            <p className="text-body-md text-neutral-500 mb-8">
              {t('wishlist_empty_desc')}
            </p>
            <Link to="/products" className="btn-primary btn-lg">
              {t('wishlist_explore')}
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {suggestedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-heading-lg text-neutral-900 mb-6">{t('wishlist_popular')}</h2>
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
            <span className="text-neutral-800 font-medium">{t('wishlist_title')}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display-sm text-neutral-900 mb-1">{t('wishlist_title')}</h1>
            <p className="text-body-md text-neutral-500">{items.length} {t('wishlist_items_saved')}</p>
          </div>
          <button
            onClick={clearWishlist}
            className="btn-ghost text-danger-600 hover:text-danger-700 hover:bg-danger-50"
          >
            <HiOutlineTrash className="w-4 h-4" />
            {t('wishlist_clear')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.id} className="card p-4 group hover:shadow-card-hover transition-all duration-300">
              <div className="flex gap-4">
                <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-caption text-neutral-500 mb-0.5">{item.brand}</p>
                    <Link
                      to={`/products/${item.slug}`}
                      className="text-body-sm font-semibold text-neutral-800 hover:text-primary-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <PriceDisplay price={item.price} discountPrice={item.discountPrice} size="sm" />
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn-primary btn-sm flex-1"
                >
                  <HiOutlineShoppingBag className="w-4 h-4" />
                  {t('wishlist_move_to_cart')}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="btn-icon btn-sm border border-neutral-200 text-neutral-400 hover:text-danger-500 hover:border-danger-200 hover:bg-danger-50 transition-all duration-200"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-heading-lg text-neutral-900 mb-6">{t('wishlist_you_might_like')}</h2>
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
};

export default WishlistPage;
