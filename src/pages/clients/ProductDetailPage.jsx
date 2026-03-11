import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiOutlineShare,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineChevronRight,
  HiOutlineHandThumbUp,
  HiStar,
  HiCheckCircle,
} from 'react-icons/hi2';
import { StarRating, PriceDisplay, QuantitySelector, ProductCard } from '../../components/shop';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { products, reviews as allReviews } from '../../data/mockData';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug) || products[0];
  const reviews = allReviews.filter((r) => r.productId === product.id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedColor, selectedSize }, quantity);
  };

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { dist[r.rating]++; });
    return dist;
  }, [reviews]);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <HiOutlineChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <HiOutlineChevronRight className="w-3 h-3" />
            <Link to={`/products?category=${product.categorySlug}`} className="hover:text-primary-600 transition-colors">
              {product.category}
            </Link>
            <HiOutlineChevronRight className="w-3 h-3" />
            <span className="text-neutral-800 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Product Main Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 cursor-zoom-in group"
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${isImageZoomed ? 'scale-150' : 'group-hover:scale-105'}`}
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-body-sm font-semibold shadow-soft-sm ${
                  product.badgeColor === 'primary' ? 'bg-primary-500 text-white' :
                  product.badgeColor === 'accent' ? 'bg-accent-500 text-white' :
                  product.badgeColor === 'danger' ? 'bg-danger-500 text-white' :
                  'bg-success-600 text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-primary-500 shadow-soft-md'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-body-sm text-primary-600 font-medium mb-1">{product.brand}</p>
              <h1 className="text-display-sm md:text-display-md text-neutral-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <StarRating rating={product.rating} size="md" showValue reviewCount={product.reviewCount} />
                {product.inStock ? (
                  <span className="badge-success">In Stock</span>
                ) : (
                  <span className="badge-danger">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="pb-6 border-b border-neutral-100">
              <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="lg" />
              {product.discountPrice && (
                <p className="text-body-sm text-success-600 mt-1 font-medium">
                  You save ${(product.price - product.discountPrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Short Description */}
            <p className="text-body-md text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-body-sm font-semibold text-neutral-800 mb-3">
                  Color: <span className="font-normal text-neutral-500">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-body-sm border transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium shadow-soft-sm'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-body-sm font-semibold text-neutral-800">
                    Size: <span className="font-normal text-neutral-500">{selectedSize}</span>
                  </p>
                  <button className="text-body-sm text-primary-600 hover:text-primary-700 font-medium">
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl text-body-sm font-medium border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-soft-sm'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stockCount} />
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary btn-lg flex-1 group"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`btn-icon btn-lg border transition-all duration-200 ${
                  isInWishlist
                    ? 'bg-danger-50 border-danger-200 text-danger-500'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:text-danger-500 hover:border-danger-200'
                }`}
              >
                {isInWishlist ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              </button>
              <button className="btn-icon btn-lg bg-white border border-neutral-200 text-neutral-500 hover:text-primary-600 hover:border-primary-200 transition-all duration-200">
                <HiOutlineShare className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100">
              {[
                { icon: HiOutlineTruck, text: 'Free Shipping', sub: 'Orders $99+' },
                { icon: HiOutlineShieldCheck, text: 'Secure Pay', sub: '100% Protected' },
                { icon: HiOutlineArrowPath, text: 'Easy Returns', sub: '30 Days' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-neutral-50">
                  <item.icon className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-caption font-semibold text-neutral-700">{item.text}</p>
                  <p className="text-[10px] text-neutral-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          {/* Tab Headers */}
          <div className="flex gap-1 border-b border-neutral-200 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-body-sm font-medium border-b-2 transition-all duration-200 -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-body-md text-neutral-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.tags?.map((tag) => (
                    <div key={tag} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <HiCheckCircle className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-body-sm text-neutral-700 capitalize">{tag.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <div className="card overflow-hidden">
                  {Object.entries(product.specifications || {}).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-5 py-3.5 ${
                        index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                      }`}
                    >
                      <span className="text-body-sm font-medium text-neutral-600">{key}</span>
                      <span className="text-body-sm text-neutral-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Review Summary */}
                <div className="card p-6 md:p-8 mb-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Overall Rating */}
                    <div className="text-center md:border-r border-neutral-100">
                      <div className="text-display-xl text-neutral-900 mb-1">{product.rating}</div>
                      <StarRating rating={product.rating} size="lg" />
                      <p className="text-body-sm text-neutral-500 mt-2">
                        Based on {product.reviewCount.toLocaleString()} reviews
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star];
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-body-sm text-neutral-600 w-8">{star} ★</span>
                            <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-body-sm text-neutral-500 w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-body-sm font-semibold text-neutral-800">{review.userName}</p>
                              {review.verified && (
                                <span className="badge-success text-[10px]">
                                  <HiCheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-caption text-neutral-500">{review.date}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>

                      <h4 className="text-body-sm font-semibold text-neutral-800 mb-2">{review.title}</h4>
                      <p className="text-body-sm text-neutral-600 leading-relaxed mb-3">{review.comment}</p>

                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((img, i) => (
                            <div key={i} className="w-16 h-16 rounded-lg overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <button className="flex items-center gap-1.5 text-caption text-neutral-500 hover:text-primary-600 transition-colors">
                        <HiOutlineHandThumbUp className="w-3.5 h-3.5" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>

                {/* Write Review Button */}
                <div className="mt-8 text-center">
                  <button className="btn-secondary">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-heading-lg text-neutral-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
