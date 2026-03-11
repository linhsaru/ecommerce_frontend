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
import { products, categories, promotions } from '../../data/mockData';

const HomePage = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNew);
  const dealProducts = products.filter((p) => p.discountPrice);

  const heroSlides = [
    {
      title: 'Build Your\nPerfect PC',
      subtitle: 'Premium CPU, GPU, RAM & components for gaming, AI & creative work',
      cta: 'Shop Now',
      ctaLink: '/products',
      image: 'https://picsum.photos/seed/tech1/1200/800',
      gradient: 'from-blue-50 via-white to-blue-50',
    },
    {
      title: 'AI-Ready\nComponents',
      subtitle: 'Optimize your workflow with hardware built for AI research & machine learning',
      cta: 'Explore',
      ctaLink: '/products',
      image: 'https://picsum.photos/seed/tech2/1200/800',
      gradient: 'from-blue-50 via-white to-indigo-50',
    },
    {
      title: 'Gaming\nPerformance',
      subtitle: 'Top-tier GPUs and CPUs for the ultimate gaming experience',
      cta: 'Shop GPUs',
      ctaLink: '/products?category=gpu',
      image: 'https://picsum.photos/seed/tech3/1200/800',
      gradient: 'from-indigo-50 via-white to-blue-50',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

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
                  <span className="badge-primary mb-4 inline-flex">PC Parts & Tech</span>
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

      {/* Categories */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-display-sm text-slate-900 mb-2">Shop by Category</h2>
              <p className="text-body-md text-slate-500">CPU, GPU, RAM, Storage & more</p>
            </div>
            <Link to="/products" className="btn-ghost text-blue-600 hover:text-blue-700 hidden md:flex">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-category overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-body-sm font-semibold text-white">{cat.name}</h3>
                      <p className="text-caption text-white/80">{cat.count} products</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <HiArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section bg-slate-50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="badge-primary mb-2 inline-flex">Popular</span>
              <h2 className="text-display-sm text-slate-900 mb-2">Featured Components</h2>
              <p className="text-body-md text-slate-500">Top picks for builds</p>
            </div>
            <Link to="/products" className="btn-secondary hidden md:flex">View All</Link>
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
            {promotions.slice(0, 2).map((promo) => (
              <Link
                key={promo.id}
                to="/products"
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${promo.bgColor} p-8 md:p-10 group min-h-[220px] flex flex-col justify-between`}
              >
                <div className="relative z-10">
                  <h3 className={`text-display-sm text-${promo.textColor} mb-2`}>{promo.title}</h3>
                  <p className={`text-body-md text-${promo.textColor} opacity-90 mb-4`}>{promo.subtitle}</p>
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
                <span className="badge-danger mb-2 inline-flex">Sale</span>
                <h2 className="text-display-sm text-slate-900 mb-2">Deals & Offers</h2>
                <p className="text-body-md text-slate-500">Save on components</p>
              </div>
              <Link to="/products" className="btn-secondary hidden md:flex">All Deals</Link>
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
                <span className="badge-primary mb-2 inline-flex">New</span>
                <h2 className="text-display-sm text-slate-900 mb-2">New Arrivals</h2>
                <p className="text-body-md text-slate-500">Latest components</p>
              </div>
              <Link to="/products" className="btn-secondary hidden md:flex">View All</Link>
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
              <h2 className="text-display-md md:text-display-lg text-white mb-4">Ready to Build?</h2>
              <p className="text-body-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Explore our full catalog of PC components. Use AI Builder for personalized recommendations.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/products" className="btn btn-lg bg-white text-blue-600 hover:bg-slate-50 shadow-lg">
                  Shop Now
                </Link>
                <Link to="/products#ai-builder" className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20">
                  Try AI Builder
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
