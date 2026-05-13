import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { formatVnd } from '../../utils/price';

const Sidebar = ({
  brands,
  usagePurposes,
  priceRange,
  selectedBrands,
  selectedUsagePurpose,
  priceSlider,
  onBrandToggle,
  onUsagePurposeChange,
  onPriceChange,
  onClearFilters,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  useEffect(() => {
    if (priceSlider[0] === priceRange.min && priceSlider[1] === priceRange.max) {
      setCustomMin('');
      setCustomMax('');
    }
  }, [priceSlider, priceRange]);

  const activeCount = [
    ...selectedBrands,
    selectedUsagePurpose,
    priceSlider[0] !== priceRange.min || priceSlider[1] !== priceRange.max,
  ].filter(Boolean).length;

  const handlePredefinedRange = (min, max) => {
    setCustomMin('');
    setCustomMax('');
    onPriceChange([min, max]);
  };

  const handleCustomApply = () => {
    const min = customMin ? Number(customMin) : 0;
    const max = customMax ? Number(customMax) : 999999999;
    onPriceChange([min, max]);
  };

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
          fixed md:relative top-0 right-0 h-full w-80 md:w-72 flex-shrink-0 z-50 md:z-10
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
              {t('filters')}
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
            <h3 className="text-base font-semibold text-slate-800">{t('filters')}</h3>
            {activeCount > 0 && (
              <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-4">{t('price_range') || 'Khoảng giá'}</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={priceSlider[0] === 0 && priceSlider[1] === 10000000}
                    onChange={(e) => {
                      if (e.target.checked) handlePredefinedRange(0, 10000000);
                      else handlePredefinedRange(priceRange.min, priceRange.max);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">Dưới 10 triệu</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={priceSlider[0] === 10000000 && priceSlider[1] === 30000000}
                    onChange={(e) => {
                      if (e.target.checked) handlePredefinedRange(10000000, 30000000);
                      else handlePredefinedRange(priceRange.min, priceRange.max);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">10 - 30 triệu</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={priceSlider[0] === 30000000 && priceSlider[1] === 999999999}
                    onChange={(e) => {
                      if (e.target.checked) handlePredefinedRange(30000000, 999999999);
                      else handlePredefinedRange(priceRange.min, priceRange.max);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800">Trên 30 triệu</span>
                </label>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-2">Hoặc nhập khoảng giá:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    placeholder="Từ"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    placeholder="Đến"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Brands */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">{t('brand')}</h4>
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

          </div>

          {activeCount > 0 && (
            <button
              onClick={onClearFilters}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              {t('clear_all_filters')}
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
