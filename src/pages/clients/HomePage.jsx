import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HiArrowRight,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import { ProductCard } from '../../components/ecommerce';
import { products, categories, promotions } from '../../data/mockData';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNew);
  const dealProducts = products.filter((p) => p.discount > 0);

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: 'Discover Premium\nLifestyle Products',
      subtitle: 'Curated collection of the finest products for modern living',
      cta: 'Shop Collection',
      ctaLink: '/products',
      image: 'https://picsum.photos/seed/hero1/1200/800',
      gradient: 'from-primary-50 via-white to-accent-50',
    },
    {
      title: 'Winter Sale\nUp to 50% Off',
      subtitle: 'Don\'t miss our biggest sale of the season on selected items',
      cta: 'Shop Deals',
      ctaLink: '/products?filter=deals',
      image: 'https://picsum.photos/seed/hero2/1200/800',
      gradient: 'from-accent-50 via-white to-primary-50',
    },
    {
      title: 'New Arrivals\nJust Dropped',
      subtitle: 'Be the first to explore our latest collection of trending products',
      cta: 'Explore New',
      ctaLink: '/products?filter=new',
      image: 'https://picsum.photos/seed/hero3/1200/800',
      gradient: 'from-neutral-50 via-white to-primary-50',
    },
  ];

  const features = [
    { icon: HiOutlineTruck, title: 'Free Shipping', desc: 'On orders over $99' },
    { icon: HiOutlineShieldCheck, title: 'Secure Payment', desc: '100% protected' },
    { icon: HiOutlineArrowPath, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: HiOutlineChatBubbleLeftRight, title: '24/7 Support', desc: 'Dedicated help' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`gradient-mesh min-h-[600px] md:min-h-[700px] transition-all duration-1000`}>
          <div className="container-custom relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center min-h-[600px] md:min-h-[700px] py-12">
              {/* Hero Content */}
              <div className="space-y-6 md:space-y-8 animate-fade-in-up">
                <div>
                  <span className="badge-primary mb-4 inline-flex">
                    ✨ {heroSlides[currentSlide].subtitle.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <h1 className="text-display-xl md:text-[4rem] leading-[1.05] tracking-tight text-neutral-900 whitespace-pre-line">
                    {heroSlides[currentSlide].title}
                  </h1>
                </div>
                <p className="text-body-lg text-neutral-500 max-w-lg">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex items-center gap-4">
                  <Link to={heroSlides[currentSlide].ctaLink} className="btn-primary btn-lg group">
                    {heroSlides[currentSlide].cta}
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/products" className="btn-secondary btn-lg">
                    Browse All
                  </Link>
                </div>

                {/* Slide indicators */}
                <div className="flex items-center gap-2 pt-4">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-primary-600'
                          : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative hidden md:block">
                <div className="relative z-10 animate-float">
                  <div className="relative rounded-3xl overflow-hidden shadow-soft-xl">
                    <img
                      src={heroSlides[currentSlide].image}
                      alt="Hero"
                      className="w-full h-[500px] object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent-100/40 rounded-full blur-3xl" />

                {/* Floating cards */}
                <div className="absolute -left-6 top-1/4 card-glass p-3 animate-fade-in-up shadow-glass" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <span className="text-success-600 text-body-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-neutral-800">2,341 Reviews</p>
                      <p className="text-[10px] text-neutral-500">4.8 avg rating</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 card-glass p-3 animate-fade-in-up shadow-glass" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 text-body-sm">🚀</span>
                    </div>
                    <div>
                      <p className="text-caption font-semibold text-neutral-800">Fast Delivery</p>
                      <p className="text-[10px] text-neutral-500">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-neutral-100 bg-white">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-neutral-800">{feature.title}</p>
                  <p className="text-caption text-neutral-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-display-sm text-neutral-900 mb-2">Shop by Category</h2>
              <p className="text-body-md text-neutral-500">Explore our curated collections</p>
            </div>
            <Link to="/products" className="btn-ghost text-primary-600 hover:text-primary-700 hidden md:flex">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-category overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-body-sm font-semibold text-white mb-0.5">{category.name}</h3>
                      <p className="text-caption text-white/70">{category.count} products</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <HiArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="badge-accent mb-2 inline-flex">🔥 Trending</span>
              <h2 className="text-display-sm text-neutral-900 mb-2">Featured Products</h2>
              <p className="text-body-md text-neutral-500">Handpicked favorites our customers love</p>
            </div>
            <Link to="/products" className="btn-secondary hidden md:flex">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="btn-secondary">
              View All Products <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {promotions.slice(0, 2).map((promo) => (
              <Link
                key={promo.id}
                to="/products"
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${promo.bgColor} p-8 md:p-10 group min-h-[240px] flex flex-col justify-between`}
              >
                <div className="relative z-10">
                  <h3 className={`text-display-sm text-${promo.textColor} mb-2`}>{promo.title}</h3>
                  <p className={`text-body-md text-${promo.textColor}/80 mb-4`}>{promo.subtitle}</p>
                  {promo.code && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-body-sm font-mono font-semibold text-white">
                      Code: {promo.code}
                    </span>
                  )}
                </div>
                <div className="relative z-10 mt-4">
                  <span className={`btn bg-white/20 backdrop-blur-sm text-${promo.textColor} border-white/30 hover:bg-white/30 group-hover:translate-x-1 transition-transform`}>
                    Shop Now <HiArrowRight className="w-4 h-4" />
                  </span>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/10 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Products */}
      {dealProducts.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge-danger mb-2 inline-flex">⚡ Limited Time</span>
                <h2 className="text-display-sm text-neutral-900 mb-2">Deals & Offers</h2>
                <p className="text-body-md text-neutral-500">Save big on these amazing products</p>
              </div>
              <Link to="/products?filter=deals" className="btn-secondary hidden md:flex">
                All Deals <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {dealProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge-primary mb-2 inline-flex">✨ Just In</span>
                <h2 className="text-display-sm text-neutral-900 mb-2">New Arrivals</h2>
                <p className="text-body-md text-neutral-500">Fresh additions to our collection</p>
              </div>
              <Link to="/products?filter=new" className="btn-secondary hidden md:flex">
                View All <HiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials / Social Proof */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-display-sm text-neutral-900 mb-2">Loved by Thousands</h2>
            <p className="text-body-md text-neutral-500">See what our customers are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', role: 'Verified Buyer', text: 'Absolutely love the quality of products. The shipping was fast and the packaging was beautiful. Will definitely order again!', rating: 5 },
              { name: 'James K.', role: 'Verified Buyer', text: 'Best online shopping experience I\'ve had. The customer service team was incredibly helpful when I needed to exchange a size.', rating: 5 },
              { name: 'Emily R.', role: 'Verified Buyer', text: 'The attention to detail is remarkable. Every product I\'ve purchased has exceeded my expectations. Highly recommend!', rating: 5 },
            ].map((testimonial, index) => (
              <div key={index} className="card p-6 hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <span key={i} className="text-amber-400 text-body-md">★</span>
                  ))}
                </div>
                <p className="text-body-sm text-neutral-600 mb-4 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-body-sm">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-neutral-800">{testimonial.name}</p>
                    <p className="text-caption text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 p-10 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-display-md md:text-display-lg text-white mb-4">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers and discover products that make a difference.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/products" className="btn btn-lg bg-white text-primary-700 hover:bg-neutral-50 shadow-soft-lg">
                  Start Shopping
                </Link>
                <Link to="/register" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  Create Account
                </Link>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full" />
            <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
