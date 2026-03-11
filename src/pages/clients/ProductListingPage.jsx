import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HiOutlineFunnel,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineXMark,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import { ProductCard, Sidebar } from '../../components/shop';
import {
  products,
  categories,
  brands,
  sortOptions,
  usagePurposes,
  priceRange,
} from '../../data/mockData';

const ITEMS_PER_PAGE = 8;

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(categoryFromUrl ? [categoryFromUrl] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedUsagePurpose, setSelectedUsagePurpose] = useState('');
  const [priceSlider, setPriceSlider] = useState([priceRange.min, priceRange.max]);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (categoryFromUrl && !selectedCategories.includes(categoryFromUrl)) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category_slug?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    const actualPrice = (p) => p.discountPrice ?? p.price;
    result = result.filter((p) => actualPrice(p) >= priceSlider[0] && actualPrice(p) <= priceSlider[1]);

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category_slug));
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const brandSlug = brands.find((b) => b.id === p.brand_id)?.slug;
        return selectedBrands.includes(brandSlug);
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
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
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
    searchQuery,
    priceSlider,
    selectedCategories,
    selectedBrands,
    selectedUsagePurpose,
    selectedSort,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [
    selectedCategories.length > 0,
    selectedBrands.length > 0,
    !!selectedUsagePurpose,
    priceSlider[0] !== priceRange.min || priceSlider[1] !== priceRange.max,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedUsagePurpose('');
    setPriceSlider([priceRange.min, priceRange.max]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleCategory = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
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
          <h1 className="text-2xl font-bold text-slate-800">PC Components</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filteredProducts.length} products found</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
            {selectedCategories.map((slug) => (
              <button key={slug} onClick={() => toggleCategory(slug)} className="badge-primary flex items-center gap-1 hover:bg-blue-100">
                {categories.find((c) => c.slug === slug)?.name} <HiOutlineXMark className="w-3 h-3" />
              </button>
            ))}
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
              <button onClick={() => setPriceSlider([priceRange.min, priceRange.max])} className="badge-primary flex items-center gap-1 hover:bg-blue-100">
                ${priceSlider[0].toFixed(0)}-${priceSlider[1].toFixed(0)} <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            <button onClick={clearAllFilters} className="text-body-sm text-red-600 hover:text-red-700 font-medium">Clear all</button>
          </div>
        )}

        <div className="flex gap-8">
          <Sidebar
            categories={categories}
            brands={brands}
            usagePurposes={usagePurposes}
            priceRange={priceRange}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedUsagePurpose={selectedUsagePurpose}
            priceSlider={priceSlider}
            onCategoryToggle={toggleCategory}
            onBrandToggle={toggleBrand}
            onUsagePurposeChange={(v) => { setSelectedUsagePurpose(v); setCurrentPage(1); }}
            onPriceChange={(v) => { setPriceSlider(v); setCurrentPage(1); }}
            onClearFilters={clearAllFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' : 'space-y-4'}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary btn-sm disabled:opacity-40">
                      <HiChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-xl text-body-sm font-medium transition-all ${currentPage === page ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                        {page}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary btn-sm disabled:opacity-40">
                      <HiChevronRight className="w-4 h-4" />
                    </button>
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
