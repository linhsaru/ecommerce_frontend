import { useState, useEffect, useMemo } from 'react';
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
import { useCategoryStore } from '../../store/categoryStore';
import { useProductStore } from '../../store/productStore';
import { apiService } from '../../services';



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
    primaryVariantId: p?.primaryVariantId ?? null,
    stockCount: typeof p?.stockCount === 'number' ? p.stockCount : p?.stockCount,
    inStock: typeof p?.inStock === 'boolean' ? p.inStock : p?.status === 1,
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
  const [newArrivals, setNewArrivals] = useState([]);
  const [categorySections, setCategorySections] = useState([]);

  const heroSlides = useMemo(() => [
    {
      title: t('hero_slide1_title'),
      subtitle: t('hero_slide1_subtitle'),
      badgeText: t('hero_slide1_badge'),
      cta: t('hero_slide1_cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=2000',
      gradient: 'from-slate-900 via-blue-900 to-slate-900',
    },
    {
      title: t('hero_slide2_title'),
      subtitle: t('hero_slide2_subtitle'),
      badgeText: t('hero_slide2_badge'),
      cta: t('hero_slide2_cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=2000',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
    },
    {
      title: t('hero_slide3_title'),
      subtitle: t('hero_slide3_subtitle'),
      badgeText: t('hero_slide3_badge'),
      cta: t('hero_slide3_cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=2000',
      gradient: 'from-slate-900 via-indigo-900 to-slate-900',
    },
    {
      title: t('hero_slide4_title'),
      subtitle: t('hero_slide4_subtitle'),
      badgeText: t('hero_slide4_badge'),
      cta: t('hero_slide4_cta'),
      ctaLink: '/products',
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=2000',
      gradient: 'from-slate-900 via-cyan-900 to-slate-900',
    }
  ], [t]);

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
        { slug: 'pc-nc', name: t('premium_pc_products') }
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
    if (!heroSlides?.length) return;
    // Reset slide index nếu API làm thay đổi số lượng slides.
    if (currentSlide >= heroSlides.length) setCurrentSlide(0);

    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const features = [
    { icon: HiOutlineTruck, title: t('feature_freeship'), desc: t('feature_freeship_desc') },
    { icon: HiOutlineShieldCheck, title: t('feature_secure_payment'), desc: t('feature_secure_payment_desc') },
    { icon: HiOutlineArrowPath, title: t('feature_easy_return'), desc: t('feature_easy_return_desc') },
    { icon: HiOutlineChatBubbleLeftRight, title: t('feature_tech_support'), desc: t('feature_tech_support_desc') },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} transition-colors duration-1000`}></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay transition-all duration-1000" style={{ backgroundImage: `url('${heroSlides[currentSlide].image}')` }}></div>
        <div className="container-custom relative z-10 transition-all duration-1000">
          <div className="flex flex-col justify-center items-center text-center min-h-[600px] md:min-h-[700px] pt-12 pb-24 md:pb-28 max-w-4xl mx-auto">
            <div className="space-y-6 md:space-y-8 animate-fade-in-up flex flex-col items-center">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30 backdrop-blur-md">
                  {heroSlides[currentSlide].badgeText || 'PC Parts & Tech'}
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.05] drop-shadow-lg text-white whitespace-pre-line">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{heroSlides[currentSlide].title}</span>
                </h1>
              </div>
              <p className="text-lg md:text-2xl text-blue-100 max-w-2xl mb-10 font-light opacity-90">{heroSlides[currentSlide].subtitle}</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to={heroSlides[currentSlide].ctaLink} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center group">
                  {heroSlides[currentSlide].cta}
                  <HiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                  {t('hero_browse_all')}
                </Link>
              </div>
              <div className="flex items-center gap-2 pt-4 justify-center">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'w-1.5 bg-slate-600 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Floating Info Bar */}
      <section className="relative z-20 -mt-10 md:-mt-16 mb-12">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-0.5 group-hover:text-blue-600 transition-colors duration-300">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 md:line-clamp-none">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
                <Link to="/build-pc" className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20">
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
