import { Filter, X } from 'lucide-react';

const Sidebar = ({
  categories,
  brands,
  usagePurposes,
  priceRange,
  selectedCategories,
  selectedBrands,
  selectedUsagePurpose,
  priceSlider,
  onCategoryToggle,
  onBrandToggle,
  onUsagePurposeChange,
  onPriceChange,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  const activeCount = [
    ...selectedCategories,
    ...selectedBrands,
    selectedUsagePurpose,
    priceSlider[0] !== priceRange.min || priceSlider[1] !== priceRange.max,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:relative top-0 right-0 h-full w-80 md:w-72 flex-shrink-0 z-50
          bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none
          border-l border-slate-100
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto p-6 md:p-0">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              Filters
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-blue-500" />
            <h3 className="text-base font-semibold text-slate-800">Filters</h3>
            {activeCount > 0 && (
              <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Price Range Slider */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-4">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceSlider[0]}
                  onChange={(e) =>
                    onPriceChange([Number(e.target.value), Math.max(Number(e.target.value), priceSlider[1])])
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={priceSlider[1]}
                  onChange={(e) =>
                    onPriceChange([Math.min(Number(e.target.value), priceSlider[0]), Number(e.target.value)])
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-sm text-slate-600">
                  ${priceSlider[0].toFixed(0)} - ${priceSlider[1].toFixed(0)}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Category</h4>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => onCategoryToggle(cat.slug)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Brand</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.slug)}
                      onChange={() => onBrandToggle(brand.slug)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Usage Purpose */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Usage Purpose</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => onUsagePurposeChange('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    !selectedUsagePurpose
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {usagePurposes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onUsagePurposeChange(selectedUsagePurpose === p.id ? '' : p.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedUsagePurpose === p.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <button
              onClick={onClearFilters}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              Clear all filters
            </button>
          )}

          <div className="mt-6 md:hidden">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
