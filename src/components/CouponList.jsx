import { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

/**
 * CouponList - Modal/dropdown to select coupons (members only)
 * Filters: status === 1, (usage_limit == null || usage_limit > usage_count), min_order_value <= subtotal_amount
 */
const CouponList = ({ coupons, subtotalAmount, selectedCoupon, onSelect, onClose }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const eligibleCoupons = coupons.filter((c) => {
    if (c.status !== 1) return false;
    if (c.usage_limit != null && c.usage_count >= c.usage_limit) return false;
    return Number(c.min_order_value) <= subtotalAmount;
  });

  const formatDiscount = (c) => {
    if (c.discount_type === 'percent') {
      return c.max_discount
        ? `${c.discount_value}% (max ${formatCurrency(c.max_discount)})`
        : `${c.discount_value}% off`;
    }
    return `${formatCurrency(c.discount_value)} off`;
  };

  const formatCurrency = (v) => {
    const n = Number(v);
    return n >= 1000 ? `$${n.toLocaleString()}` : `${n.toLocaleString()}₫`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white text-left hover:border-slate-300 transition-colors"
      >
        <span className="flex items-center gap-2 text-slate-700">
          <Tag className="w-4 h-4 text-blue-500" />
          {selectedCoupon ? (
            <span className="font-medium text-blue-600">{selectedCoupon.code}</span>
          ) : (
            <span>{t('select_coupon')}</span>
          )}
        </span>
        <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setExpanded(false)}
            aria-hidden="true"
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{t('available_coupons')}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {eligibleCoupons.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">{t('no_coupons_available')}</div>
              ) : (
                eligibleCoupons.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelect(selectedCoupon?.id === c.id ? null : c);
                      setExpanded(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                      selectedCoupon?.id === c.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{c.code}</span>
                      {c.name && <span className="block text-xs text-slate-500">{c.name}</span>}
                    </div>
                    <span className="text-sm font-medium text-green-600">{formatDiscount(c)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CouponList;
