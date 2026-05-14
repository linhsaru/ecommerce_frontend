import React from 'react';
import { ShieldCheck, Truck, Headphones, ChevronRight, Zap } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden py-32 px-4 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30 backdrop-blur-md">
                        {t('landing_welcome')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-lg">
                        {t('landing_elevate')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t('landing_tech')}</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-light opacity-90">
                        {t('landing_desc')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center group">
                            {t('landing_explore_products')}
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                            {t('landing_about_us')} <br />
                            <span className="text-blue-600">{t('landing_about_subtitle')}</span>
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            {t('landing_about_desc1')}
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            {t('landing_about_desc2')}
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex flex-col border-l-4 border-blue-500 pl-4">
                                <span className="text-3xl font-black text-slate-800">5+</span>
                                <span className="text-sm text-slate-500 font-medium">{t('landing_years_experience')}</span>
                            </div>
                            <div className="flex flex-col border-l-4 border-cyan-500 pl-4">
                                <span className="text-3xl font-black text-slate-800">10k+</span>
                                <span className="text-sm text-slate-500 font-medium">{t('landing_happy_customers')}</span>
                            </div>
                            <div className="flex flex-col border-l-4 border-indigo-500 pl-4">
                                <span className="text-3xl font-black text-slate-800">100%</span>
                                <span className="text-sm text-slate-500 font-medium">{t('landing_genuine_products')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative group perspective">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:rotate-1">
                            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" alt="Về chúng tôi" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <h3 className="text-2xl font-bold mb-2">{t('landing_max_quality')}</h3>
                                    <p className="text-white/80">{t('landing_quality_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values / Features */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{t('landing_why_choose_us')}</h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />, title: t('landing_feature1_title'), desc: t('landing_feature1_desc') },
                            { icon: <Truck className="w-10 h-10 text-blue-500" />, title: t('landing_feature2_title'), desc: t('landing_feature2_desc') },
                            { icon: <Headphones className="w-10 h-10 text-purple-500" />, title: t('landing_feature3_title'), desc: t('landing_feature3_desc') }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Showcase */}
            <section className="py-24 px-4 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing_featured_categories')}</h2>
                            <p className="text-slate-400 text-lg">{t('landing_categories_desc')}</p>
                        </div>
                        <button className="flex items-center text-blue-400 hover:text-blue-300 font-semibold group transition-colors">
                            {t('landing_view_all_categories')}
                            <Zap className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: t('landing_cat1_title'), img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400", count: t('landing_cat1_desc') },
                            { title: t('landing_cat2_title'), img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400", count: t('landing_cat2_desc') },
                            { title: t('landing_cat3_title'), img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400", count: t('landing_cat3_desc') }
                        ].map((cat, idx) => (
                            <div key={idx} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg isolate">
                                <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30 mb-3 backdrop-blur-sm">
                                        {cat.count}
                                    </span>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                                    <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                                        {t('landing_learn_more')} <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPgo8L3N2Zz4=')] opacity-50"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">{t('landing_cta_title')}</h2>
                    <p className="text-lg md:text-xl text-blue-100 mb-10 font-light">
                        {t('landing_cta_desc')}
                    </p>
                    <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-slate-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform">
                        {t('landing_cta_button')}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
