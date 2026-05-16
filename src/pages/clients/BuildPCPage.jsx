import React, { useState, useEffect, useMemo } from 'react';
import {
    HiOutlineCpuChip,
    HiOutlineComputerDesktop,
    HiOutlinePrinter,
    HiOutlineArrowDownTray,
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineShoppingCart
} from 'react-icons/hi2';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, downloadQuotationExcel } from '../../services';
import { useCartStore } from '../../store/cartStore';
import { useCategoryStore } from '../../store/categoryStore';
import { AIBuilder } from '../../components/shop';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import { useTranslation } from '../../context/LanguageContext';

const BUILD_COMPONENTS = [
    { id: 'cpu', nameKey: 'build_cpu', shortNameKey: 'build_short_cpu', icon: 'processor', keywords: ['cpu', 'vi xu ly', 'bo vi xu ly', 'processor'] },
    { id: 'mainboard', nameKey: 'build_mainboard', shortNameKey: 'build_short_mainboard', icon: 'motherboard', keywords: ['mainboard', 'bo mach chu', 'motherboard'] },
    { id: 'ram', nameKey: 'build_ram', shortNameKey: 'build_short_ram', icon: 'memory', keywords: ['ram', 'bo nho trong', 'memory'] },
    { id: 'vga', nameKey: 'build_vga', shortNameKey: 'build_short_vga', icon: 'graphics', keywords: ['vga', 'gpu', 'card man hinh', 'graphics'] },
    { id: 'ssd', nameKey: 'build_ssd', shortNameKey: 'build_short_ssd', icon: 'ssd', keywords: ['ssd', 'o cung ssd', 'nvme'] },
    { id: 'hdd', nameKey: 'build_hdd', shortNameKey: 'build_short_hdd', icon: 'hdd', keywords: ['hdd', 'o cung hdd'] },
    { id: 'psu', nameKey: 'build_psu', shortNameKey: 'build_short_psu', icon: 'power', keywords: ['psu', 'nguon', 'power supply', 'bo nguon'] },
    { id: 'case', nameKey: 'build_case', shortNameKey: 'build_short_case', icon: 'case', keywords: ['case', 'vo may tinh', 'thung may'] },
    { id: 'cooler', nameKey: 'build_cooler', shortNameKey: 'build_short_cooler', icon: 'fan', keywords: ['tan nhiet', 'cooler', 'fan'] },
    { id: 'monitor', nameKey: 'build_monitor', shortNameKey: 'build_short_monitor', icon: 'display', keywords: ['man hinh', 'monitor', 'display'] },
];

const normalizeText = (value) =>
    (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

/** Biến thể dùng cho giỏ hàng / API (đồng bộ với ProductCard + cartStore). */
const resolveProductVariantId = (product) => {
    if (!product) return null;
    const fromTop =
        product.primaryVariantId ??
        product.variantId ??
        product.primary_variant_id ??
        product.variant_id;
    if (fromTop) return fromTop;
    const list = product.variants ?? product.productVariants ?? product.ProductVariants;
    if (Array.isArray(list) && list.length > 0) {
        const v = list[0];
        return v?.id ?? v?.variantId ?? null;
    }
    return null;
};

const mapComponentsToRelatedCategories = (components, apiCategories) =>
    components.map((component) => {
        const related = apiCategories.filter((cat) => {
            const text = `${normalizeText(cat?.name)} ${normalizeText(cat?.slug)}`;
            return component.keywords.some((keyword) => text.includes(normalizeText(keyword)));
        });

        return {
            ...component,
            relatedCategorySlugs: related.map((cat) => cat.slug).filter(Boolean),
        };
    });

const PartSelectionModal = ({ isOpen, onClose, category, onSelectProduct, formatCurrency, t }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isOpen || !category) return;
        const fetchParts = async () => {
            setIsLoading(true);
            try {
                const categorySlugs = Array.isArray(category.relatedCategorySlugs)
                    ? category.relatedCategorySlugs
                    : [];

                if (categorySlugs.length === 0) {
                    setProducts([]);
                    return;
                }

                const responses = await Promise.all(
                    categorySlugs.map((slug) =>
                        apiService.get('/products/by-category/' + slug, {
                            params: { page: 1, pageSize: 150, status: 1 }
                        })
                    )
                );

                const merged = [];
                responses.forEach(({ data: res }) => {
                    const root = res?.data ?? res;
                    const payload = root?.data ?? root;
                    const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
                    merged.push(...items);
                });

                const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values());
                setProducts(deduped);
            } catch (err) {
                console.error(err);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchParts();
    }, [isOpen, category]);

    if (!isOpen || !category) return null;

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-fade-in-up">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">{t('build_modal_select')} {t(category.nameKey)}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('build_modal_search_placeholder')}
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="font-medium">{t('build_modal_loading')}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-slate-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-1">{t('build_modal_empty_title')}</h4>
                            <p className="text-slate-500">{t('build_modal_empty_desc')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all group bg-white">
                                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-xl p-1.5 flex-shrink-0">
                                        <img src={p.thumbnailUrl || p.imageProduct?.[0]?.url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors" title={p.name}>{p.name}</h4>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-xs text-slate-500 max-w-[120px] truncate">{t('build_modal_brand')} {p.brandName || 'Oem'}</span>
                                            {p.status === 1 && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-red-500 font-bold text-sm select-all">{formatCurrency(p.discountedPrice ?? p.originalPrice ?? 0)}</span>
                                            <button
                                                onClick={() => onSelectProduct(p)}
                                                className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                {t('build_modal_add')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BuildPCPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const addToCart = useCartStore(state => state.addItem);
    const { items: categoryItems, fetchCategories } = useCategoryStore();
    const [selectedItems, setSelectedItems] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'success' });
    const [exportingExcel, setExportingExcel] = useState(false);

    useEffect(() => {
        fetchCategories().catch((error) => {
            console.error('Failed to load categories', error);
        });
    }, [fetchCategories]);

    const categories = useMemo(
        () => mapComponentsToRelatedCategories(BUILD_COMPONENTS, categoryItems),
        [categoryItems]
    );

    const showToast = (message, status = 'success') => {
        setToastConfig({ isVisible: true, message, status });
    };

    const handleAddToCart = async () => {
        const items = Object.values(selectedItems);
        if (items.length === 0) {
            showToast(`${t('please_select_at_least_one_component')}`, 'warning');
            return;
        }
        const missing = items.filter((item) => !item.variantId);
        if (missing.length > 0) {
            showToast(t('build_cart_missing_variant'), 'error');
            return;
        }
        for (const item of items) {
            await addToCart(item, item.quantity);
        }
        showToast(`${t('added_to_cart_successfully')}`, 'success');
    };

    const handleBuyNow = async () => {
        const items = Object.values(selectedItems);
        if (items.length === 0) {
            showToast(`${t('please_select_at_least_one_component')}`, 'warning');
            return;
        }
        const missing = items.filter((item) => !item.variantId);
        if (missing.length > 0) {
            showToast(t('build_cart_missing_variant'), 'error');
            return;
        }
        for (const item of items) {
            await addToCart(item, item.quantity);
        }
        navigate('/checkout');
    };

    const handleExportExcel = async () => {
        const items = Object.values(selectedItems).map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            variantId: item.variantId ?? null,
        }));
        if (items.length === 0) {
            showToast(t('build_please_select_download'), 'warning');
            return;
        }
        setExportingExcel(true);
        try {
            await downloadQuotationExcel({
                items,
                shippingFee: 0,
                otherCosts: 0,
                discount: 0,
            });
        } catch (e) {
            showToast(e?.message || t('build_export_error'), 'error');
        } finally {
            setExportingExcel(false);
        }
    };

    const handleSelectProduct = (product) => {
        if (!activeCategory) return;
        const variantId = resolveProductVariantId(product);
        if (!variantId) {
            showToast(t('build_product_no_variant'), 'error');
            return;
        }
        const mappedProduct = {
            id: product.id,
            variantId,
            slug: product.slug,
            thumbnailUrl: product.thumbnailUrl,
            name: product.name,
            price: product.discountedPrice ?? product.originalPrice ?? 0,
            quantity: 1,
            image: product.thumbnailUrl || product.imageProduct?.[0]?.url || 'https://via.placeholder.com/150',
            warranty: '36 Tháng',
        };
        setSelectedItems(prev => ({
            ...prev,
            [activeCategory.id]: mappedProduct
        }));
        setActiveCategory(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const calculateTotal = () => {
        return Object.values(selectedItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleUpdateQuantity = (categoryId, delta) => {
        setSelectedItems(prev => {
            const current = prev[categoryId];
            if (!current) return prev;

            const newQuantity = current.quantity + delta;
            if (newQuantity <= 0) return prev; // Don't delete on 0, use delete button

            return {
                ...prev,
                [categoryId]: {
                    ...current,
                    quantity: newQuantity
                }
            };
        });
    };

    const handleRemoveItem = (categoryId) => {
        setSelectedItems(prev => {
            const newState = { ...prev };
            delete newState[categoryId];
            return newState;
        });
    };

    const mapAiPartToSelectedItem = (part, defaultName) => {
        if (!part) return null;
        const variantId = part.variantId ?? part.id;
        const productId = part.productId ?? null;
        if (!variantId || !productId) return null;

        return {
            id: productId,
            variantId,
            name: part?.productName || defaultName,
            price: Number(part?.variantPrice ?? part?.price ?? 0),
            quantity: 1,
            image: part?.productThumbnailUrl || 'https://via.placeholder.com/150',
            warranty: '36 Tháng',
        };
    };

    const handleApplyAiSuggestion = (suggestion) => {
        const finalBuild = suggestion?.finalBuild;
        if (!finalBuild) {
            showToast(t('build_ai_no_detail'), 'warning');
            return;
        }

        const mapped = {
            cpu: mapAiPartToSelectedItem(finalBuild.cpu, 'CPU'),
            mainboard: mapAiPartToSelectedItem(finalBuild.motherboard, 'Mainboard'),
            ram: mapAiPartToSelectedItem(finalBuild.ram, 'RAM'),
            vga: mapAiPartToSelectedItem(finalBuild.gpu, 'VGA'),
            ssd: mapAiPartToSelectedItem(finalBuild.storage, 'SSD'),
            psu: mapAiPartToSelectedItem(finalBuild.psu, 'PSU'),
            case: mapAiPartToSelectedItem(finalBuild.case, 'Case'),
            cooler: mapAiPartToSelectedItem(finalBuild.cooling, 'Cooler'),
        };

        const nextSelectedItems = Object.fromEntries(
            Object.entries(mapped).filter(([, value]) => Boolean(value))
        );

        setSelectedItems(nextSelectedItems);
        showToast(t('build_ai_filled'), 'success');
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* Header Banner */}
            <div className="bg-white border-b border-slate-200 sticky top-16 md:top-18 z-40 shadow-sm">
                <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                            <HiOutlineComputerDesktop className="text-blue-600 w-8 h-8" />
                            {t('build_pc_title')}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{t('build_pc_subtitle')}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button
                            type="button"
                            disabled={exportingExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap disabled:opacity-60 disabled:pointer-events-none"
                            onClick={handleExportExcel}
                        >
                            <HiOutlineArrowDownTray className="w-4 h-4" />
                            {exportingExcel ? t('build_downloading') : t('build_download')}
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                            onClick={() => {
                                const items = Object.values(selectedItems).map((item) => ({
                                    productId: item.id,
                                    quantity: item.quantity,
                                    variantId: item.variantId ?? null,
                                }));
                                if (items.length === 0) {
                                    showToast(t('build_please_select_print'), 'warning');
                                    return;
                                }
                                navigate('/quotation', { state: { items } });
                            }}
                        >
                            <HiOutlinePrinter className="w-4 h-4" />
                            {t('build_print')}
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-red-600 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                            onClick={() => setSelectedItems({})}
                        >
                            <HiOutlineTrash className="w-4 h-4" />
                            {t('build_refresh')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-custom py-8 space-y-8">
                {/* AI Builder Section */}
                <div>
                    <AIBuilder onApplySuggestion={handleApplyAiSuggestion} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content - Parts List */}
                    <div className="lg:col-span-8 space-y-4">
                        {categories.map((cat, index) => {
                            const selectedPart = selectedItems[cat.id];

                            return (
                                <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Category Header */}
                                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        <h2 className="font-semibold text-slate-700 text-base">{t(cat.nameKey)}</h2>
                                    </div>

                                    {/* Part Content */}
                                    <div className="p-4 sm:p-5">
                                        {selectedPart ? (
                                            <div className="flex flex-col sm:flex-row gap-5">
                                                <div className="w-full sm:w-24 h-24 rounded-xl border border-slate-100 flex-shrink-0 overflow-hidden bg-white p-1 relative group">
                                                    <img src={selectedPart.image} alt={selectedPart.name} className="w-full h-full object-contain" />
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-slate-800 text-base leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer">
                                                            {selectedPart.name}
                                                        </h3>
                                                        <div className="mt-1 text-sm text-slate-500">
                                                            {t('build_warranty')} <span className="font-medium text-slate-700">{selectedPart.warranty}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                                        <div className="text-red-500 font-bold text-lg">
                                                            {formatCurrency(selectedPart.price)}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {/* Quantity Control */}
                                                            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(cat.id, -1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                                                >
                                                                    <HiOutlineMinus className="w-3 h-3" />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-medium text-slate-700 bg-white h-8 flex items-center justify-center border-x border-slate-200">
                                                                    {selectedPart.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => handleUpdateQuantity(cat.id, 1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                                                                >
                                                                    <HiOutlinePlus className="w-3 h-3" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => handleRemoveItem(cat.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                title={t('build_remove_item')}
                                                            >
                                                                <HiOutlineTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                                                <div className="flex items-center gap-4 text-slate-400">
                                                    <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                                                        <HiOutlineCpuChip className="w-6 h-6 opacity-50" />
                                                    </div>
                                                    <span className="text-sm">{t('please_select_component')}</span>
                                                </div>
                                                <button
                                                    onClick={() => setActiveCategory(cat)}
                                                    className="flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-medium transition-colors w-full sm:w-auto group"
                                                >
                                                    <HiOutlinePlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                                    {t('build_select')} {t(cat.shortNameKey)}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Sidebar - Summary (Desktop only, sticky) */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        <div className="sticky top-40 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">
                                {t('summary')}
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">{t('number_of_components')}</span>
                                    <span className="font-semibold text-slate-800">{Object.keys(selectedItems).length}/{categories.length}</span>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-800 font-medium">{t('total_price')}</span>
                                    <span className="text-2xl font-bold text-red-500">{formatCurrency(calculateTotal())}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <HiOutlineShoppingCart className="w-5 h-5" />
                                    {t('add_to_cart')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] p-4 pb-safe">
                <div className="container-custom flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs text-slate-500 mb-0.5">{t('total_price')}: {formatCurrency(calculateTotal())}</div>
                        <div className="text-xl font-bold text-red-500 leading-none">{formatCurrency(calculateTotal())}</div>
                    </div>
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 max-w-[200px]"
                    >
                        <HiOutlineShoppingCart className="w-5 h-5" />
                        {t('buy_now')}
                    </button>
                </div>
            </div>

            <PartSelectionModal
                isOpen={!!activeCategory}
                category={activeCategory}
                onClose={() => setActiveCategory(null)}
                onSelectProduct={handleSelectProduct}
                formatCurrency={formatCurrency}
                t={t}
            />

            <ToastNotification
                isVisible={toastConfig.isVisible}
                message={toastConfig.message}
                status={toastConfig.status}
                onClose={() => setToastConfig(p => ({ ...p, isVisible: false }))}
            />
        </div>
    );
};

export default BuildPCPage;
