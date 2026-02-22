import { useState, useMemo } from 'react';
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
import { ProductCard } from '../../components/ecommerce';
import { products, categories, sortOptions, priceRanges, brands } from '../../data/mockData';

const ITEMS_PER_PAGE = 8;

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // Price range
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.value === selectedPriceRange);
      if (range) {
        result = result.filter((p) => {
          const price = p.discountPrice || p.price;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating
    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    // Sort
    switch (selectedSort) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, selectedSort, selectedPriceRange, selectedBrands, selectedRating]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [selectedCategory, selectedPriceRange, selectedBrands.length > 0, selectedRating > 0].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedBrands([]);
    setSelectedRating(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">Products</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-neutral-800 font-medium capitalize">{selectedCategory.replace('-', ' ')}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-display-sm text-neutral-900 mb-2">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Products'
              : 'All Products'}
          </h1>
          <p className="text-body-md text-neutral-500">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Search & Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn-secondary md:hidden relative ${activeFilterCount > 0 ? 'border-primary-300 text-primary-600' : ''}`}
            >
              <HiOutlineFunnel className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="input pr-10 appearance-none cursor-pointer min-w-[180px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>

            {/* View mode */}
            <div className="hidden md:flex items-center border border-neutral-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                <HiOutlineSquares2X2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}`}
              >
                <HiOutlineListBullet className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-body-sm text-neutral-500">Active filters:</span>
            {selectedCategory && (
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                className="badge-primary flex items-center gap-1 hover:bg-primary-100 transition-colors cursor-pointer"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name}
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            {selectedPriceRange && (
              <button
                onClick={() => { setSelectedPriceRange(''); setCurrentPage(1); }}
                className="badge-primary flex items-center gap-1 hover:bg-primary-100 transition-colors cursor-pointer"
              >
                {priceRanges.find((r) => r.value === selectedPriceRange)?.label}
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            {selectedBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="badge-primary flex items-center gap-1 hover:bg-primary-100 transition-colors cursor-pointer"
              >
                {brand}
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            ))}
            {selectedRating > 0 && (
              <button
                onClick={() => { setSelectedRating(0); setCurrentPage(1); }}
                className="badge-primary flex items-center gap-1 hover:bg-primary-100 transition-colors cursor-pointer"
              >
                {selectedRating}+ Stars
                <HiOutlineXMark className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-body-sm text-danger-600 hover:text-danger-700 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className={`
            ${isFilterOpen ? 'fixed inset-0 z-50 bg-black/40 md:relative md:bg-transparent md:z-auto' : 'hidden md:block'}
            md:w-64 md:flex-shrink-0
          `}>
            <div className={`
              ${isFilterOpen ? 'absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-soft-xl md:relative md:w-auto md:shadow-none md:p-0' : ''}
            `}>
              {/* Mobile filter header */}
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h3 className="text-heading-md text-neutral-900">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-neutral-500 hover:text-neutral-700">
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div className="card p-5">
                  <h4 className="text-body-sm font-semibold text-neutral-800 mb-3">Categories</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-body-sm transition-colors ${
                        !selectedCategory ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-body-sm transition-colors flex items-center justify-between ${
                          selectedCategory === cat.slug ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-caption text-neutral-400">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="card p-5">
                  <h4 className="text-body-sm font-semibold text-neutral-800 mb-3">Price Range</h4>
                  <div className="space-y-1.5">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => { setSelectedPriceRange(selectedPriceRange === range.value ? '' : range.value); setCurrentPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-body-sm transition-colors ${
                          selectedPriceRange === range.value ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="card p-5">
                  <h4 className="text-body-sm font-semibold text-neutral-800 mb-3">Brands</h4>
                  <div className="space-y-2">
                    {brands.slice(0, 8).map((brand) => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="text-body-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="card p-5">
                  <h4 className="text-body-sm font-semibold text-neutral-800 mb-3">Rating</h4>
                  <div className="space-y-1.5">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => { setSelectedRating(selectedRating === rating ? 0 : rating); setCurrentPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-body-sm transition-colors flex items-center gap-2 ${
                          selectedRating === rating ? 'bg-primary-50 text-primary-600 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-body-sm ${i < rating ? 'text-amber-400' : 'text-neutral-200'}`}>★</span>
                          ))}
                        </span>
                        <span>& up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile apply button */}
              <div className="mt-6 md:hidden">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="btn-primary w-full"
                >
                  Apply Filters ({filteredProducts.length} results)
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                    : 'space-y-4'
                }>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode === 'list' ? 'horizontal' : 'default'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn-secondary btn-sm disabled:opacity-40"
                    >
                      <HiChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-body-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-primary-600 text-white shadow-button'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn-secondary btn-sm disabled:opacity-40"
                    >
                      <HiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <HiOutlineMagnifyingGlass className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-heading-md text-neutral-800 mb-2">No products found</h3>
                <p className="text-body-sm text-neutral-500 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearAllFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
