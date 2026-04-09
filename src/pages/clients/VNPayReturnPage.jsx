import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi2';
import { paymentApi } from '../../api/paymentApi';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../context/LanguageContext';

const VNPayReturnPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!location.search) {
          setStatus('error');
          setMessage(t('payment_not_found'));
          return;
        }

        const urlParams = new URLSearchParams(location.search);
        const orderNoFromQuery = urlParams.get('orderNo') || '';

        const response = await paymentApi.verifyVNPayReturn(location.search);
        const responseData = response?.data || response;
        const paymentData = responseData?.data || {};
        const orderNoFromApi =
          paymentData?.orderNo ||
          responseData?.orderNo ||
          '';
        const isSuccess = Boolean(
          paymentData?.isSuccess
          ?? responseData?.isSuccess
          ?? responseData?.success
        );

        if (isSuccess) {
          clearCart();
          setStatus('success');
          setMessage(responseData?.message || t('payment_success'));
          setOrderNo(orderNoFromApi || orderNoFromQuery);
        } else {
          setStatus('error');
          setMessage(responseData?.message || t('payment_failed'));
          setOrderNo(orderNoFromApi || orderNoFromQuery);
        }
      } catch (error) {
        console.error('Error verifying VNPay payment:', error);
        setStatus('error');
        setMessage(t('error_occurred'));
      }
    };

    verifyPayment();
  }, [location.search, clearCart]);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => {
      if (!isAuthenticated && orderNo) {
        navigate(`/order-lookup/${orderNo}`, { replace: true });
        return;
      }
      navigate('/account/orders', { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [status, navigate, isAuthenticated, orderNo]);

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-lg text-neutral-600">{t('loading')}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 text-center">
        {status === 'success' ? (
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
            <HiOutlineCheckCircle className="h-16 w-16 text-green-600" />
          </div>
        ) : (
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <HiOutlineXCircle className="h-16 w-16 text-red-600" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {status === 'success' ? t('payment_success') : t('payment_failed')}
        </h2>
        <p className="text-slate-500 mb-2">{message}</p>
        {status === 'success' && (
          <p className="text-xs text-slate-400 mb-8">
            {t('redirecting_to_order_page')} {isAuthenticated ? t('orders') : t('order_lookup')}...
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            to={isAuthenticated ? '/account/orders' : (orderNo ? `/order-lookup/${orderNo}` : '/order-lookup')}
            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <HiOutlineDocumentText className="w-5 h-5 shrink-0" />
            <span className="text-[15px] mt-1">{isAuthenticated ? t('view_orders') : t('lookup_order')}</span>
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors whitespace-nowrap"
          >
            <HiOutlineHome className="w-5 h-5 shrink-0" />
            <span className="text-[15px] mt-1">{t('back_to_home')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturnPage;
