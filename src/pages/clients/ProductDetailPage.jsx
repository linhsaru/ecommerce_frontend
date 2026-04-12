import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { PriceDisplay, QuantitySelector, ProductCard } from '../../components/shop';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { apiService } from '../../services';
import { formatVnd } from '../../utils/price';
import { useTranslation } from '../../context/LanguageContext';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';

const mapApiProductToViewModel = (p) => {
  let images = [];
  if (p.images && p.images.length > 0) {
    images = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.url);
  } else if (p.imageProduct && p.imageProduct.length > 0) {
    images = p.imageProduct.map((img) => img.url);
  } else {

    const thumb = p.thumbnailUrl;
    images = [thumb].filter(Boolean);
  }

  const primaryCategory = p.categories && p.categories.length > 0 ? p.categories[0] : null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    // Map giá sang cấu trúc cũ
    price: p.originalPrice ?? 0,
    discountPrice: p.discountedPrice ?? null,
    // Map brand từ API
    brand: p.brandName || '',
    categorySlug: primaryCategory ? primaryCategory.slug : '',
    category: primaryCategory ? primaryCategory.name : '',
    inStock: p.status === 1,
    stockCount: 10,
    rating: 4.8,
    reviewCount: 0,
    badge: p.discountPercent ? `-${Math.round(p.discountPercent)}%` : null,
    badgeColor: p.discountPercent ? 'danger' : 'primary',
    tags: [],
    specifications: {},
    specificationRows: [],
    images: images.length ? images : [],
    thumbnailUrl: p.thumbnailUrl ?? null,
    usage_tags: [],
  };
};

const normalizeVariantsPayload = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
};

const SPEC_CHIP_SIZE_MAX_LEN = 24;

const isDimensionSpecName = (nameLower) =>
  nameLower.includes('kích thước') ||
  nameLower.includes('dimension') ||
  nameLower.includes('chiều cao') ||
  nameLower.includes('chiều rộng') ||
  nameLower.includes('chân đế');

const buildSpecsFromVariant = (variant) => {
  const rows = Array.isArray(variant?.specifications) ? variant.specifications : [];
  const specifications = {};
  rows.forEach((s) => {
    const label = (s.name || '').trim();
    if (!label) return;
    const val = s.value != null ? String(s.value) : '';
    const unit = s.unit ? String(s.unit).trim() : '';
    const display = unit ? `${val} ${unit}`.trim() : val;
    if (Object.prototype.hasOwnProperty.call(specifications, label)) {
      specifications[label] = `${specifications[label]}; ${display}`;
    } else {
      specifications[label] = display;
    }
  });
  return { rows, specifications };
};

const extractColorSizeChips = (variantsData) => {
  const colors = new Set();
  const sizes = new Set();
  variantsData.forEach((v) => {
    v.specifications?.forEach((spec) => {
      const nameLower = (spec.name || '').toLowerCase().trim();
      const val = String(spec.value || '').trim();
      if (!val) return;
      const isColor = ['color', 'màu sắc', 'màu'].includes(nameLower);
      const looksLikeSizeName =
        nameLower === 'size' ||
        nameLower === 'kích cỡ' ||
        nameLower === 'cỡ';
      const shortEnoughForChip = val.length <= SPEC_CHIP_SIZE_MAX_LEN;
      const isSizeChip =
        looksLikeSizeName && shortEnoughForChip && !isDimensionSpecName(nameLower);
      if (isColor) colors.add(val);
      if (isSizeChip) sizes.add(val);
    });
  });
  return { colors: Array.from(colors), sizes: Array.from(sizes) };
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'success' });

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Tìm sản phẩm chi tiết theo slug
        const { data: response } = await apiService.get(`/products/slug/${slug}`);

        const found = response?.data ?? response;

        if (!found) {
          setError('Không tìm thấy sản phẩm');
          setProduct(null);
        } else {
          const mappedProduct = mapApiProductToViewModel(found);

          try {
            const { data: varResponse } = await apiService.get(`/products/${found.id}/variants`);
            const variantsData = normalizeVariantsPayload(varResponse?.data ?? varResponse);

            const primaryVariant =
              variantsData.find(
                (v) => (v.variantName || '').toLowerCase().trim() === 'default'
              ) || variantsData[0];

            if (primaryVariant && typeof primaryVariant.price === 'number') {
              const sale = primaryVariant.price;
              const compare = primaryVariant.compareAt;
              if (typeof compare === 'number' && compare > sale) {
                mappedProduct.price = compare;
                mappedProduct.discountPrice = sale;
              } else {
                mappedProduct.price = sale;
                mappedProduct.discountPrice = null;
              }
              if (
                mappedProduct.discountPrice != null &&
                mappedProduct.price > mappedProduct.discountPrice
              ) {
                const pct = Math.round(
                  ((mappedProduct.price - mappedProduct.discountPrice) / mappedProduct.price) * 100
                );
                mappedProduct.badge = `-${pct}%`;
                mappedProduct.badgeColor = 'danger';
              } else {
                mappedProduct.badge = null;
              }
            }

            if (primaryVariant) {
              const { rows, specifications } = buildSpecsFromVariant(primaryVariant);
              mappedProduct.specificationRows = rows;
              mappedProduct.specifications = specifications;
            }

            const { colors, sizes } = extractColorSizeChips(variantsData);
            mappedProduct.colors = colors;
            mappedProduct.sizes = sizes;
            mappedProduct.variants = variantsData;
          } catch (varErr) {
            console.error('Failed to fetch variants:', varErr);
          }

          setProduct(mappedProduct);
        }

        // Load thêm danh sách sản phẩm đề xuất
        const { data: relResponse } = await apiService.get('/products', {
          params: {
            page: 1,
            pageSize: 8,
            status: 1,
          },
        });

        const relRoot = relResponse?.data ?? relResponse;
        const relPayload = relRoot?.data ?? relRoot;
        const relItems = Array.isArray(relPayload?.items)
          ? relPayload.items
          : Array.isArray(relPayload)
            ? relPayload
            : [];

        const mappedRelated = relItems
          .filter((p) => !found || p.id !== found.id)
          .slice(0, 4)
          .map(mapApiProductToViewModel);

        setRelatedProducts(mappedRelated);
      } catch (e) {
        setError(e.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);



  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setSelectedImage(0);
    }
  }, [product]);

  const addToCart = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => (product ? state.isInWishlist(product.id) : false));

  const getSelectedVariantId = () => {
    let selectedVariantId = product.id;
    if (product.variants && product.variants.length > 0) {
      const selectedVariant = product.variants.find(v => {
        let match = true;
        if (selectedColor) {
          const hasColor = v.specifications?.some((s) => {
            const n = (s.name || '').toLowerCase().trim();
            return (
              (n === 'color' || n === 'màu sắc' || n === 'màu') &&
              s.value === selectedColor
            );
          });
          if (!hasColor) match = false;
        }
        if (selectedSize) {
          const hasSize = v.specifications?.some((s) => {
            const n = (s.name || '').toLowerCase().trim();
            return (
              (n === 'size' || n === 'kích cỡ' || n === 'cỡ') &&
              !isDimensionSpecName(n) &&
              s.value === selectedSize
            );
          });
          if (!hasSize) match = false;
        }
        return match;
      });
      if (selectedVariant) {
        selectedVariantId = selectedVariant.id;
      }
    }
    return selectedVariantId;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const variantId = getSelectedVariantId();
    addToCart({ ...product, selectedColor, selectedSize, variantId }, quantity);
    setToastConfig({ isVisible: true, message: `${t('add_to_cart_success')}`, status: 'success' });
  };

  const handleBuyNow = () => {
    if (!product) return;
    const variantId = getSelectedVariantId();
    navigate('/checkout', { state: { buyNowItem: { ...product, selectedColor, selectedSize, variantId, quantity } } });
  };



  const tabs = [
    { id: 'description', label: t('description') },
    { id: 'specifications', label: t('specifications') },
  ];

  if (isLoading || !product) {
    return (
      <div className="container-custom py-12">
        <p className="text-center text-neutral-500">
          {isLoading ? 'Đang tải thông tin sản phẩm...' : error || 'Không tìm thấy sản phẩm'}
        </p>
        {!isLoading && (
          <div className="text-center mt-4">
            <Link to="/products" className="btn-primary">
              {t('backToShop')}
            </Link>
          </div>
        )}
      </div>
    );
  }

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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16 md:items-start">
          {/* Image Gallery */}
          <div className="space-y-4 min-w-0">
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
                <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-body-sm font-semibold shadow-soft-sm ${product.badgeColor === 'primary' ? 'bg-primary-500 text-white' :
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
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
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
          <div className="space-y-6 min-w-0">
            {/* Brand & Title */}
            <div>
              <p className="text-body-sm text-primary-600 font-medium mb-1">{product.brand}</p>
              <h1 className="text-display-sm md:text-display-md text-neutral-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
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
                  You save {formatVnd(product.price - product.discountPrice)}
                </p>
              )}
            </div>

            {/* Short Description */}
            <p className="text-body-md text-neutral-600 leading-relaxed break-words">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="w-full min-w-0">
                <p className="text-body-sm font-semibold text-neutral-800 mb-3 break-words">
                  Color: <span className="font-normal text-neutral-500">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2 w-full">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-body-sm border transition-all duration-200 max-w-full text-left break-words whitespace-normal ${selectedColor === color
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
              <div className="w-full min-w-0">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <p className="text-body-sm font-semibold text-neutral-800 min-w-0 break-words">
                    Size: <span className="font-normal text-neutral-500">{selectedSize}</span>
                  </p>
                  <button
                    type="button"
                    className="text-body-sm text-primary-600 hover:text-primary-700 font-medium shrink-0"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-12 px-3 py-2 rounded-xl text-body-sm font-medium border transition-all duration-200 max-w-full text-left break-words whitespace-normal ${selectedSize === size
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
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-stretch lg:flex-nowrap lg:items-center">
              <div className="shrink-0 w-full sm:w-auto">
                <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stockCount} />
              </div>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="btn-lg btn-primary flex-1 group w-full sm:min-w-[140px] whitespace-nowrap"
              >
                {t('buy_now')}
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-lg btn-outline px-6 bg-white rounded-xl border border-primary-600 text-primary-600 font-semibold shadow-soft-sm hover:bg-primary-50 transition-all duration-200 flex items-center justify-center whitespace-nowrap sm:min-w-0"
                title="Add to Cart"
              >
                <HiOutlineShoppingBag className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">{t('add_to_cart')}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`btn-icon btn-lg border transition-all duration-200 shrink-0 ${isInWishlist
                  ? 'bg-danger-50 border-danger-200 text-danger-500'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-danger-500 hover:border-danger-200'
                  }`}
              >
                {isInWishlist ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
              </button>
              <button
                type="button"
                className="btn-icon btn-lg bg-white border border-neutral-200 text-neutral-500 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 shrink-0"
              >
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
                className={`px-6 py-3 text-body-sm font-medium border-b-2 transition-all duration-200 -mb-px ${activeTab === tab.id
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
              <div className="max-w-3xl">
                <div className="card overflow-hidden divide-y divide-neutral-100">
                  {(product.specificationRows || []).length === 0 &&
                    Object.keys(product.specifications || {}).length === 0 ? (
                    <p className="px-5 py-6 text-body-sm text-neutral-500">
                      No specifications listed for this product.
                    </p>
                  ) : (product.specificationRows || []).length > 0 ? (
                    product.specificationRows.map((spec, index) => {
                      const label = (spec.name || '').trim();
                      const val = spec.value != null ? String(spec.value) : '';
                      const unit = spec.unit ? String(spec.unit).trim() : '';
                      const valueDisplay = unit ? `${val} ${unit}`.trim() : val;
                      return (
                        <div
                          key={`${label}-${index}`}
                          className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 ${index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                            }`}
                        >
                          <span className="text-body-sm font-medium text-neutral-600 shrink-0 sm:max-w-[38%] break-words">
                            {label}
                          </span>
                          <span className="text-body-sm text-neutral-800 font-medium min-w-0 break-words sm:text-right sm:flex-1">
                            {valueDisplay}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    Object.entries(product.specifications || {}).map(([key, value], index) => (
                      <div
                        key={key}
                        className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 ${index % 2 === 0 ? 'bg-neutral-50' : 'bg-white'
                          }`}
                      >
                        <span className="text-body-sm font-medium text-neutral-600 shrink-0 sm:max-w-[38%] break-words">
                          {key}
                        </span>
                        <span className="text-body-sm text-neutral-800 font-medium min-w-0 break-words sm:text-right sm:flex-1">
                          {value}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-heading-lg text-neutral-900 mb-6">{t('related_products')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
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

export default ProductDetailPage;
