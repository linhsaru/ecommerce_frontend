import { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import {
  HiArrowRight,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import { ProductCard } from '../../components/shop';
import { promotions as mockPromotions } from '../../data/mockData';
import { useCategoryStore } from '../../store/categoryStore';
import { useProductStore } from '../../store/productStore';
import { apiService } from '../../services';
import { formatVnd } from '../../utils/price';

const PROMO_THEMES = [
  { bgColor: 'from-blue-500 to-blue-700', textColor: 'white' },
  { bgColor: 'from-blue-600 to-indigo-600', textColor: 'white' },
  { bgColor: 'from-slate-700 to-slate-900', textColor: 'white' },
];

const HERO_GRADIENTS = [
  'from-blue-50 via-white to-blue-50',
  'from-blue-50 via-white to-indigo-50',
  'from-indigo-50 via-white to-blue-50',
];

const heroSlidesFallback = [
  {
    title: 'Build Your\nPerfect PC',
    subtitle: 'Premium CPU, GPU, RAM & components for gaming, AI & creative work',
    badgeText: 'PC Parts & Tech',
    cta: 'Shop Now',
    ctaLink: '/products',
    image: 'https://picsum.photos/seed/tech1/1200/800',
    gradient: HERO_GRADIENTS[0],
  },
  {
    title: 'AI-Ready\nComponents',
    subtitle: 'Optimize your workflow with hardware built for AI research & machine learning',
    badgeText: 'PC Parts & Tech',
    cta: 'Explore',
    ctaLink: '/products',
    image: 'https://picsum.photos/seed/tech2/1200/800',
    gradient: HERO_GRADIENTS[1],
  },
  {
    title: 'Gaming\nPerformance',
    subtitle: 'Top-tier GPUs and CPUs for the ultimate gaming experience',
    badgeText: 'PC Parts & Tech',
    cta: 'Shop GPUs',
    ctaLink: '/products?category=gpu',
    image: 'https://picsum.photos/seed/tech3/1200/800',
    gradient: HERO_GRADIENTS[2],
  },
];

const mapApiProductToCardViewModel = (p, { isNew = false } = {}) => {
  const price = p?.originalPrice ?? 0;
  const discountPrice = p?.discountedPrice ?? null;
  const discountPercent =
    typeof p?.discountPercent === 'number'
      ? p.discountPercent
      : price > 0 && discountPrice != null && discountPrice < price
        ? ((price - discountPrice) / price) * 100
        : null;

  // Prefer imageProduct gallery; fallback to thumbnailUrl
  const images =
    Array.isArray(p?.imageProduct) && p.imageProduct.length > 0
      ? [...p.imageProduct]
        .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0))
        .map((img) => img?.url)
        .filter(Boolean)
      : p?.thumbnailUrl
        ? [p.thumbnailUrl]
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
    // fields used by ProductCard/PriceDisplay
    price,
    discountPrice,
    rating: p?.averageRating ?? p?.rating ?? 4.8,
    reviewCount: p?.reviewCount ?? 0,

    badge,
    badgeColor: badge ? 'danger' : 'primary',
    isNew,

    // fields used by ProductCard image resolution
    images,
    thumbnailUrl: p?.thumbnailUrl ?? null,
  };
};

const HomePage = () => {
  const { items: categories, fetchCategories } = useCategoryStore();
  const { fetchProducts } = useProductStore();
  const { t } = useTranslation();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [isPromotionsLoading, setIsPromotionsLoading] = useState(false);
  const [heroSlides, setHeroSlides] = useState(heroSlidesFallback);
  const [categorySections, setCategorySections] = useState([]);

  useEffect(() => {
    fetchCategories({ page: 1, pageSize: 8 }).catch(() => { });

    // Fetch Featured (Top rated)
    fetchProducts({ page: 1, pageSize: 20 }).then(res => {
      if (res?.items) {
        // Sort by averageRating descending and take top 4
        const topRated = [...res.items]
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
        setFeaturedProducts(topRated.map((p) => mapApiProductToCardViewModel(p)));

        // Sort by biggest discount difference
        const bestDeals = [...res.items]
          .filter(p => p.discountedPrice != null && p.originalPrice > p.discountedPrice)
          .sort((a, b) => {
            const diffA = a.originalPrice - a.discountedPrice;
            const diffB = b.originalPrice - b.discountedPrice;
            return diffB - diffA;
          })
          .slice(0, 4);
        setDealProducts(bestDeals.map((p) => mapApiProductToCardViewModel(p)));

        // Use newest products for new arrivals
        const newest = [...res.items]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 4);
        setNewArrivals(newest.map((p) => mapApiProductToCardViewModel(p, { isNew: true })));
      }
    }).catch(() => { });
  }, []);

  useEffect(() => {
    let active = true;
    const loadCategoryProducts = async () => {
      const customSections = [
        { slug: 'pc-nc', name: 'Sản phẩm PC cao cấp' }
      ];

      if (categories && categories.length > 0) {
        const others = categories.filter(c => c.slug !== 'pc-nc').slice(0, 2);
        customSections.push(...others.map(c => ({ slug: c.slug, name: c.name })));
      }
      
      const promises = customSections.map(async (catInfo) => {
        try {
          const { data: response } = await apiService.get(`/products/by-category/${catInfo.slug}`, {
            params: { page: 1, pageSize: 8, status: 1 }
          });
          const root = response?.data ?? response;
          const payload = root?.data ?? root;
          const items = Array.isArray(payload?.items) ? payload.items : (Array.isArray(payload) ? payload : []);
          
          return {
            category: { id: catInfo.slug, slug: catInfo.slug, name: catInfo.name },
            products: items.map(p => mapApiProductToCardViewModel(p))
          };
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      if (active) {
        setCategorySections(results.filter(r => r && r.products.length > 0));
      }
    };
    
    loadCategoryProducts();
    return () => { active = false; };
  }, [categories]);

  useEffect(() => {
    let cancelled = false;
    const loadPromotions = async () => {
      setIsPromotionsLoading(true);
      try {
        const { data: response } = await apiService.get('/promotions');
        const items = response?.data?.items ?? response?.data ?? response?.items ?? [];

        const now = new Date();
        const activeItems = (Array.isArray(items) ? items : [])
          .filter((p) => {
            const statusOk = p?.status === 'active' || p?.status === 1 || p?.status === true;
            const startOk = p?.startDate ? new Date(p.startDate) <= now : true;
            const endOk = p?.endDate ? new Date(p.endDate) >= now : true;
            return statusOk && startOk && endOk;
          })
          .slice(0, 3);

        const mapped = activeItems.map((p, idx) => {
          const theme = PROMO_THEMES[idx % PROMO_THEMES.length];
          const discountText =
            p?.discountType === 'percent'
              ? `-${Math.round(Number(p?.discountValue ?? 0))}%`
              : `-${formatVnd(Number(p?.discountValue ?? 0))}`;

          return {
            id: p?.id,
            title: p?.title ?? '',
            subtitle: p?.description ?? '',
            bannerImage: p?.bannerImage ?? '',
            code: discountText,
            bgColor: theme.bgColor,
            textColor: theme.textColor,
          };
        });

        const heroMapped = activeItems
          .filter((p) => p?.bannerImage)
          .slice(0, 3)
          .map((p, idx) => {
            const discountText =
              p?.discountType === 'percent'
                ? `-${Math.round(Number(p?.discountValue ?? 0))}%`
                : `-${formatVnd(Number(p?.discountValue ?? 0))}`;

            return {
              title: p?.title ?? '',
              subtitle: p?.description ?? '',
              badgeText: discountText,
              cta: 'Shop Now',
              ctaLink: '/products',
              image: p?.bannerImage ?? '',
              gradient: HERO_GRADIENTS[idx % HERO_GRADIENTS.length],
            };
          });

        if (!cancelled) {
          setPromotions(mapped);
          if (heroMapped.length > 0) setHeroSlides(heroMapped);
        }
      } catch (e) {
        if (!cancelled) setPromotions([]);
      } finally {
        if (!cancelled) setIsPromotionsLoading(false);
      }
    };

    loadPromotions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!heroSlides?.length) return;
    // Reset slide index nếu API làm thay đổi số lượng slides.
    if (currentSlide >= heroSlides.length) setCurrentSlide(0);

    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const features = [
    { icon: HiOutlineTruck, title: t('freeship'), desc: 'On orders over $199' },
    { icon: HiOutlineShieldCheck, title: t('secure_payment'), desc: '100% protected' },
    { icon: HiOutlineArrowPath, title: t('easy_return'), desc: '30-day return policy' },
    { icon: HiOutlineChatBubbleLeftRight, title: t('tech_support'), desc: 'Expert advice' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-br ${heroSlides[currentSlide].gradient} min-h-[600px] md:min-h-[700px] transition-all duration-1000`}>
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center min-h-[600px] md:min-h-[700px] py-12">
              <div className="space-y-6 md:space-y-8 animate-fade-in-up">
                <div>
                  <span className="badge-primary mb-4 inline-flex">
                    {heroSlides[currentSlide].badgeText || 'PC Parts & Tech'}
                  </span>
                  <h1 className="text-display-xl md:text-[4rem] leading-[1.05] tracking-tight text-slate-900 whitespace-pre-line">
                    {heroSlides[currentSlide].title}
                  </h1>
                </div>
                <p className="text-body-lg text-slate-500 max-w-lg">{heroSlides[currentSlide].subtitle}</p>
                <div className="flex items-center gap-4">
                  <Link to={heroSlides[currentSlide].ctaLink} className="btn-primary btn-lg group">
                    {heroSlides[currentSlide].cta}
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/products" className="btn-secondary btn-lg">Browse All</Link>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-blue-500' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="relative z-10 animate-float">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl">
                    <img src={heroSlides[currentSlide].image} alt="Hero" className="w-full h-[500px] object-cover transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute -left-6 top-1/4 card-glass p-3 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-body-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-slate-800">Trusted</p>
                      <p className="text-[10px] text-slate-500">Top brands</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 bottom-1/4 card-glass p-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-body-sm">⚡</span>
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-slate-800">Fast Delivery</p>
                      <p className="text-[10px] text-slate-500">2-3 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-100 bg-white">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-slate-800">{f.title}</p>
                  <p className="text-caption text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categorySections.map(({ category, products }) => (
        <section key={category.id} className="section bg-slate-50 border-y border-slate-100">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge-primary mb-2 inline-flex">{t('popular')}</span>
                <h2 className="text-display-sm text-slate-900 mb-2">{category.name}</h2>
                <p className="text-body-md text-slate-500">{t('top_picks_for_builds') || 'Top picks for'} {category.name}</p>
              </div>
              <Link to={`/products?category=${category.slug}`} className="btn-secondary hidden md:flex">
                {t('view_all')} {category.name}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Featured */}
      <section className="section bg-slate-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="badge-primary mb-2 inline-flex">{t('popular')}</span>
              <h2 className="text-display-sm text-slate-900 mb-2">{t('featured_components')}</h2>
              <p className="text-body-md text-slate-500">{t('top_picks_for_builds')}</p>
            </div>
            <Link to="/products" className="btn-secondary hidden md:flex">{t('view_all')}</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Promos */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {mockPromotions.slice(0, 2).map((promo) => (
              <Link
                key={promo.id}
                to="/products"
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${promo.bgColor} p-8 md:p-10 group min-h-[220px] flex flex-col justify-between`}
              >
                {promo.bannerImage && (
                  <img
                    src={promo.bannerImage}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div className="relative z-10">
                  
                  <h3 className="text-display-sm text-white mb-2">{promo.title}</h3>
                  <p className="text-body-md text-white opacity-90 mb-4">{promo.subtitle}</p>
                  {promo.code && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg text-sm font-mono font-semibold text-white">
                      Code: {promo.code}
                    </span>
                  )}
                </div>
                <div className="relative z-10 mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-white font-medium hover:bg-white/30 transition-colors">
                    Shop Now <HiArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      {dealProducts.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge-danger mb-2 inline-flex">{t('sale')}</span>
                <h2 className="text-display-sm text-slate-900 mb-2">{t('deals_and_offers')}</h2>
                <p className="text-body-md text-slate-500">{t('save_on_components')}</p>
              </div>
              <Link to="/products" className="btn-secondary hidden md:flex">{t('all_deals')}</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {dealProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge-primary mb-2 inline-flex">{t('new')}</span>
                <h2 className="text-display-sm text-slate-900 mb-2">{t('new_arrivals')}</h2>
                <p className="text-body-md text-slate-500">{t('latest_components')}</p>
              </div>
              <Link to="/products" className="btn-secondary hidden md:flex">{t('view_all')}</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-blue-700 p-10 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-display-md md:text-display-lg text-white mb-4">{t('ready_to_build')}</h2>
              <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
                {t('explore_our_full_catalog_of_pc_components')}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/products" className="btn btn-lg bg-white text-blue-600 hover:bg-slate-50 shadow-lg">
                  {t('shop_now')}
                </Link>
                <Link to="/products#ai-builder" className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20">
                  {t('try_ai_builder')}
                </Link>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
