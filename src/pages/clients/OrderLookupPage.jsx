import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { orderApi } from '../../api/orderApi';
import { formatVnd } from '../../utils/price';
import { HiOutlineMagnifyingGlass, HiOutlineExclamationCircle, HiOutlineClock, HiOutlineTruck, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

const OrderLookupPage = () => {
  const { t } = useTranslation();
  const { orderNo: urlOrderNo } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderNo, setOrderNo] = useState(urlOrderNo || searchParams.get('orderNo') || '');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (urlOrderNo) {
      setOrderNo(urlOrderNo);
      handleLookup(urlOrderNo);
    } else if (searchParams.get('orderNo')) {
      const no = searchParams.get('orderNo');
      setOrderNo(no);
      handleLookup(no);
    }
  }, [urlOrderNo, searchParams]);

  const handleLookup = async (lookupNo) => {
    const no = lookupNo || orderNo;
    if (!no.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrderData(null);
    setSearchParams({ orderNo: no });

    try {
      const response = await orderApi.lookupOrder(no);
      if (response?.data?.success || response?.success) {
        setOrderData(response.data?.data || response.data);
      } else {
        setError(t('order_not_found') || 'Order not found or an error occurred.');
      }
    } catch (err) {
      console.error('Error fetching order lookup:', err);
      // Usually a 404 means order not found
      if (err.response?.status === 404) {
        setError(t('order_not_found') || 'Order not found. Please check your order number again.');
      } else {
        setError(t('error_occurred') || 'An error occurred while looking up the order.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      0: { color: 'bg-amber-100 text-amber-700', icon: <HiOutlineClock className="w-4 h-4" />, text: 'Pending' },
      1: { color: 'bg-blue-100 text-blue-700', icon: <HiOutlineCheckCircle className="w-4 h-4" />, text: 'Confirmed' },
      2: { color: 'bg-indigo-100 text-indigo-700', icon: <HiOutlineTruck className="w-4 h-4" />, text: 'Shipped' },
      3: { color: 'bg-green-100 text-green-700', icon: <HiOutlineCheckCircle className="w-4 h-4" />, text: 'Delivered' },
      4: { color: 'bg-red-100 text-red-700', icon: <HiOutlineXCircle className="w-4 h-4" />, text: 'Cancelled' },
    };
    const badge = badges[status] || badges[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      0: { color: 'bg-amber-100 text-amber-700', text: 'Unpaid' },
      1: { color: 'bg-green-100 text-green-700', text: 'Paid' },
      2: { color: 'bg-red-100 text-red-700', text: 'Refunded' },
    };
    const badge = badges[status] || badges[0];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('lookup_order') || 'Order Lookup'}</h1>
          <p className="text-slate-500">{t('lookup_order_desc') || 'Enter your order number to track current status and details.'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder={t('enter_order_number') || 'Enter Order Number (e.g., ORD-12345)'}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !orderNo.trim()}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                t('search') || 'Search'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in mb-8">
            <HiOutlineExclamationCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {orderData && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="border-b border-slate-100 p-6 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">{t('order_number') || 'Order Number'}</p>
                <p className="text-xl font-bold text-slate-800">{orderData.orderNo}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {getStatusBadge(orderData.status)}
                {getPaymentStatusBadge(orderData.paymentStatus)}
              </div>
            </div>

            {/* Items */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('order_items') || 'Items In Your Order'}</h3>
              <div className="divide-y divide-slate-100">
                {orderData.items?.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">{t('image') || 'IMG'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {item.variantName && <span className="mr-2">{item.variantName}</span>}
                        <span>SKU: {item.sku}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-slate-600">
                          {formatVnd(item.unitPrice)} x {item.quantity}
                        </p>
                        <p className="font-medium text-slate-800">{formatVnd(item.lineTotal)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 p-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">{t('total_amount') || 'Total Amount'}:</span>
                <span className="text-2xl font-bold text-slate-900">{formatVnd(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderLookupPage;
