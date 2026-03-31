import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HiOutlineFunnel,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
} from 'react-icons/hi2';
import { ProductCard, Sidebar } from '../../components/shop';
import CategoryHoverMenu from '../../components/shop/CategoryHoverMenu';
import Pagination from '../../components/data-displays/Pagination/Pagination';
import { apiService } from '../../services';
import { useCategoryStore } from '../../store/categoryStore';
import { sortOptions, usagePurposes } from '../../data/mockData';
import { formatVnd } from '../../utils/price';
import { useTranslation } from '../../context/LanguageContext';

const ITEMS_PER_PAGE = 20;
const LARGE_FETCH_PAGE_SIZE = 500;

const ProductListingPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const { items: categories, fetchCategories } = useCategoryStore();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(categoryFromUrl ? [categoryFromUrl] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedUsagePurpose, setSelectedUsagePurpose] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [priceSlider, setPriceSlider] = useState([0, 0]);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [serverTotalItems, setServerTotalItems] = useState(0);

  const priceFilterActive =
    priceRange.max > 0 &&
    (priceSlider[0] > priceRange.min || priceSlider[1] < priceRange.max);

  const useLargeFetch =
    selectedBrands.length > 0 ||
    !!selectedUsagePurpose ||
    priceFilterActive ||
    !!searchQuery.trim();

  useEffect(() => {
    if (categoryFromUrl) {
      if (!selectedCategories.includes(categoryFromUrl)) {
        setSelectedCategories([categoryFromUrl]);
      }
    } else if (selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [categoryFromUrl, selectedCategories]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        await fetchCategories();
        const { data: brandResponse } = await apiService.get('/brands');
        const brandRoot = brandResponse?.data ?? brandResponse;
        const brandPayload = brandRoot?.data ?? brandRoot;
        const brandItems = Array.isArray(brandPayload)
          ? brandPayload
          : Array.isArray(brandPayload?.items)
            ? brandPayload.items
            : [];
        setBrands(brandItems);
      } catch (error) {
        console.error('Failed to load metadata', error);
      }
    };
    loadMeta();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, selectedBrands, selectedUsagePurpose]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        let categorySlug = '';
        if (selectedCategories.length > 0) {
          categorySlug = selectedCategories[0];
          const matchedById = categories.find((c) => c.id === categorySlug);
          if (matchedById) {
            categorySlug = matchedById.slug;
          }
        }

        const endpoint = categorySlug
          ? `/products/by-category/${categorySlug}`
          : '/products';

        const page = useLargeFetch ? 1 : currentPage;
        const pageSize = useLargeFetch ? LARGE_FETCH_PAGE_SIZE : ITEMS_PER_PAGE;

        const { data: response } = await apiService.get(endpoint, {
          params: {
            page,
            pageSize,
            status: 1,
          },
        });

        const root = response?.data ?? response;
        const payload = root?.data ?? root;
        const items = Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];

        const totalFromApi =
          typeof payload?.totalItems === 'number'
            ? payload.totalItems
            : typeof payload?.totalCount === 'number'
              ? payload.totalCount
              : typeof payload?.total === 'number'
                ? payload.total
                : items.length;

        setProducts(items);
        setServerTotalItems(totalFromApi);

        if (items.length > 0) {
          // Backend đôi khi trả giá dạng string; cần ép kiểu để tính min/max đúng.
          const prices = items
            .map((p) => p.discountedPrice ?? p.originalPrice ?? 0)
            .map((v) => (typeof v === 'number' ? v : Number(v)))
            .filter((v) => Number.isFinite(v) && !Number.isNaN(v));

          if (prices.length > 0) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);

            if (!priceFilterActive) {
              setPriceRange({ min, max });
              setPriceSlider([min, max]);
            } else if (useLargeFetch) {
              setPriceRange({ min, max });
            }
          }
        }
      } catch (error) {
        setLoadError(error.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategories, categories, currentPage, useLargeFetch]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    const actualPrice = (p) => {
      const raw = p.discountedPrice ?? p.originalPrice ?? 0;
      const v = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(v) ? v : 0;
    };

    if (priceFilterActive) {
      result = result.filter(
        (p) => actualPrice(p) >= priceSlider[0] && actualPrice(p) <= priceSlider[1]
      );
    }

    // Local category filtering removed since it's handled via API

    if (selectedBrands.length > 0 && brands.length > 0) {
      result = result.filter((p) => {
        const brand = brands.find((b) => b.id === p.brandId);
        return brand && selectedBrands.includes(brand.slug);
      });
    }

    if (selectedUsagePurpose) {
      const purpose = usagePurposes.find((u) => u.id === selectedUsagePurpose);
      if (purpose) {
        const keywords = purpose.keywords.map((k) => k.toLowerCase());
        result = result.filter((p) => {
          const text = `${p.description || ''} ${(p.usage_tags || []).join(' ')}`.toLowerCase();
          return keywords.some((kw) => text.includes(kw));
        });
      }
    }

    switch (selectedSort) {
      case 'price-low':
        result.sort(
          (a, b) =>
            (a.discountedPrice ?? a.originalPrice ?? 0) -
            (b.discountedPrice ?? b.originalPrice ?? 0)
        );
        break;
      case 'price-high':
        result.sort(
          (a, b) =>
            (b.discountedPrice ?? b.originalPrice ?? 0) -
            (a.discountedPrice ?? a.originalPrice ?? 0)
        );
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [
    products,
    brands,
    searchQuery,
    priceSlider,
    selectedCategories,
    selectedBrands,
    selectedUsagePurpose,
    selectedSort,
    priceFilterActive,
    priceRange,
  ]);

  const paginationCount = useLargeFetch ? filteredProducts.length : serverTotalItems;
  const totalPages = Math.max(1, Math.ceil(paginationCount / ITEMS_PER_PAGE));
  const paginatedProducts = useLargeFetch
    ? filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
    : filteredProducts;

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const productCountLabel = useLargeFetch ? filteredProducts.length : serverTotalItems;

  const activeFilterCount = [
    selectedBrands.length > 0,
    !!selectedUsagePurpose,
    priceSlider[0] !== priceRange.min || priceSlider[1] !== priceRange.max,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedUsagePurpose('');
    setPriceSlider([priceRange.min, priceRange.max]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleBrand = (slug) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Shop</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">{t('product_listing')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{productCountLabel} products found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-auto">
            <CategoryHoverMenu categories={categories} />
          </div>
          <div className="relative flex-1 max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search CPU, GPU, RAM..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`md:hidden btn-secondary relative ${activeFilterCount > 0 ? 'border-blue-400 text-blue-600' : ''}`}
            >
              <HiOutlineFunnel className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="input pr-10 appearance-none cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="hidden md:flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <HiOutlineSquares2X2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <HiOutlineListBullet className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-body-sm text-slate-500">Active filters:</span>
            {selectedBrands.map((slug) => (
              <button key={slug} onClick={() => toggleBrand(slug)} className="badge-primary flex items-center gap-1 hover:bg-blue-100">
                {brands.find((b) => b.slug === slug)?.name} <HiOutlineXMark className="w-3 h-3" />
              </button>
            ))}
            {selectedUsagePurpose && (
              <button onClick={() => { setSelectedUsagePurpose(''); setCurrentPage(1); }} className="badge-primary flex items-center gap-1 hover:bg-blue-100">
                {usagePurposes.find((u) => u.id === selectedUsagePurpose)?.label} <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            {(priceSlider[0] !== priceRange.min || priceSlider[1] !== priceRange.max) && (
              <button
                onClick={() => setPriceSlider([priceRange.min, priceRange.max])}
                className="badge-primary flex items-center gap-1 hover:bg-blue-100"
              >
                {formatVnd(priceSlider[0])} - {formatVnd(priceSlider[1])}
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            <button onClick={clearAllFilters} className="text-body-sm text-red-600 hover:text-red-700 font-medium">Clear all</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-6 w-full md:w-72 flex-shrink-0">
            <Sidebar
              brands={brands}
              usagePurposes={usagePurposes}
              priceRange={priceRange}
              selectedBrands={selectedBrands}
              selectedUsagePurpose={selectedUsagePurpose}
              priceSlider={priceSlider}
              onBrandToggle={toggleBrand}
              onUsagePurposeChange={(v) => { setSelectedUsagePurpose(v); setCurrentPage(1); }}
              onPriceChange={(v) => { setPriceSlider(v); setCurrentPage(1); }}
              onClearFilters={clearAllFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6' : 'space-y-4'}>
                  {paginatedProducts.map((product) => {
                    const mappedProduct = {
                      ...product,
                      brand: product.brandName || '',
                      image: product.thumbnailUrl,
                      price: product.originalPrice ?? 0,
                      discountPrice: product.discountedPrice ?? null,
                      rating: product.rating ?? 4.8,
                      reviewCount: product.reviewCount ?? 0,
                      badge: product.discountPercent
                        ? `-${Math.round(product.discountPercent)}%`
                        : null,
                      badgeColor: product.discountPercent ? 'danger' : 'primary',
                    };

                    return (
                      <ProductCard
                        key={product.id}
                        product={mappedProduct}
                        variant={viewMode === 'list' ? 'horizontal' : 'default'}
                      />
                    );
                  })}
                </div>
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      page={currentPage}
                      count={paginationCount}
                      pageSize={ITEMS_PER_PAGE}
                      onPageChange={(p) => setCurrentPage(p)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <HiOutlineMagnifyingGlass className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No products found</h3>
                <p className="text-sm text-slate-500 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearAllFilters} className="btn-primary">Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
