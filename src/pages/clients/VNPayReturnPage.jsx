import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineHome, HiOutlineDocumentText } from 'react-icons/hi2';
import { paymentApi } from '../../api/paymentApi';
import { useCartStore } from '../../store/cartStore';
import { useTranslation } from '../../context/LanguageContext';

const VNPayReturnPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!location.search) {
          setStatus('error');
          setMessage('Không tìm thấy thông tin thanh toán.');
          return;
        }

        const response = await paymentApi.verifyVNPayReturn(location.search);
        const responseData = response?.data || response;
        const paymentData = responseData?.data || {};
        const isSuccess = Boolean(
          paymentData?.isSuccess
          ?? responseData?.isSuccess
          ?? responseData?.success
        );

        if (isSuccess) {
          clearCart();
          setStatus('success');
          setMessage(responseData?.message || 'Thanh toán thành công!');
        } else {
          setStatus('error');
          setMessage(responseData?.message || 'Thanh toán thất bại hoặc đã bị hủy.');
        }
      } catch (error) {
        console.error('Error verifying VNPay payment:', error);
        setStatus('error');
        setMessage('Đã có lỗi xảy ra khi xác thực thanh toán.');
      }
    };

    verifyPayment();
  }, [location.search, clearCart]);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => {
      navigate('/account/orders', { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-50 px-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-lg text-neutral-600">Đang xác thực thông tin thanh toán...</p>
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
          {status === 'success' ? 'Thanh Toán Thành Công' : 'Thanh Toán Thất Bại'}
        </h2>
        <p className="text-slate-500 mb-2">{message}</p>
        {status === 'success' && (
          <p className="text-xs text-slate-400 mb-8">Đang chuyển đến trang đơn hàng...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/account/orders"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <HiOutlineDocumentText className="w-5 h-5" />
            {t('view_orders')}
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <HiOutlineHome className="w-5 h-5" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturnPage;
