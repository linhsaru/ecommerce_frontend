import { useState, useEffect, useCallback } from 'react';
import ToastNotification from '../../components/common/ToastNotification/ToastNotification';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { orderApi } from '../../services/orderApi';
import { formatVnd } from '../../utils/price';
import { useTranslation } from '../../context/LanguageContext';
import {
  HiOutlineChevronRight,
} from 'react-icons/hi2';

const ORDER_STATUS = {
  0: { label: 'Chờ xác nhận', badge: 'accent' },   // pending
  1: { label: 'Đã xác nhận', badge: 'primary' },   // confirmed
  2: { label: 'Đang xử lý', badge: 'primary' },   // processing
  3: { label: 'Đang giao', badge: 'primary' },       // shipping
  4: { label: 'Hoàn thành', badge: 'success' },   // completed
  5: { label: 'Đã hủy', badge: 'danger' },    // cancelled
  6: { label: 'Đã hoàn tiền', badge: 'accent' },   // refunded
};

const PAYMENT_STATUS = {
  0: { label: 'Chưa thanh toán', badge: 'accent' },  // unpaid
  1: { label: 'Đã thanh toán', badge: 'success' },  // paid
  2: { label: 'Thanh toán thất bại', badge: 'danger' },   // failed
  3: { label: 'Đã hoàn tiền', badge: 'accent' },  // refunded
  4: { label: 'Hoàn tiền một phần', badge: 'primary' },  // partially_refunded
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const normalizeOrder = (order) => {
  const statusNum = Number(order?.status ?? 0);
  const paymentNum = Number(order?.paymentStatus ?? 0);
  const statusMeta = ORDER_STATUS[statusNum] ?? { label: String(statusNum), badge: 'accent' };
  const paymentMeta = PAYMENT_STATUS[paymentNum] ?? { label: String(paymentNum), badge: 'accent' };

  const orderItems = toArray(order?.items).map((item) => ({
    id: item?.variantId || item?.productId || Math.random(),
    name: item?.name || 'Sản phẩm',
    variantName: item?.variantName || '',
    sku: item?.sku || '',
    productImageUrl: item?.productImageUrl || item?.imageUrl || '',
    quantity: Number(item?.quantity) || 1,
    unitPrice: Number(item?.unitPrice || 0),
    lineTotal: Number(item?.lineTotal || 0),
  }));

  return {
    id: order?.orderNo || order?.orderId || 'N/A',
    orderId: order?.orderId,
    date: new Date(order?.createdAt || Date.now()).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }),
    status: statusMeta.label,
    statusColor: statusMeta.badge,
    paymentStatus: paymentMeta.label,
    paymentStatusColor: paymentMeta.badge,
    total: Number(order?.totalAmount || 0),
    shipping: {
      recipient: order?.shipRecipient || '',
      phone: order?.shipPhone || '',
      address: [order?.shipLine1, order?.shipWard, order?.shipProvince]
        .filter(Boolean).join(', '),
    },
    items: orderItems,
  };
};

const AccountPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user: authUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', status: 'info' });

  const showToast = useCallback((message, status = 'info') => {
    setToast({ visible: true, message, status });
  }, []);

  useEffect(() => {
    if (!authUser?.id) return;
    const fetchMyOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const response = await orderApi.getMyOrders();
        const payload = response?.data?.data ?? response?.data ?? response;
        const mappedOrders = toArray(payload).map(normalizeOrder);
        setOrders(mappedOrders);
      } catch (error) {
        console.error('Failed to fetch my orders', error);
        showToast('Không tải được danh sách đơn hàng.', 'error');
      } finally {
        setIsLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [authUser?.id, showToast]);

  return (
    <div className="animate-fade-in">
      <ToastNotification
        message={toast.message}
        status={toast.status}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-caption text-neutral-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">{t('home')}</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{t('account_order_history')}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-heading-lg text-neutral-900 mb-6">{t('account_order_history')}</h2>
            <div className="space-y-4">
              {isLoadingOrders && (
                <div className="card p-6 text-center text-neutral-500">{t('account_loading_orders')}</div>
              )}
              {!isLoadingOrders && orders.length === 0 && (
                <div className="card p-6 text-center text-neutral-500">{t('account_no_orders')}</div>
              )}
              {!isLoadingOrders && orders.map((order) => (
                <div key={order.id} className="card p-5 md:p-6 hover:shadow-card-hover transition-all duration-300">
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
                    <div>
                      <p className="text-body-sm font-semibold text-neutral-800 mb-0.5">{order.id}</p>
                      <p className="text-caption text-neutral-500">{order.date}</p>
                      {order.shipping?.recipient && (
                        <p className="text-caption text-neutral-400 mt-1">
                          {order.shipping.recipient} • {order.shipping.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-heading-sm font-bold text-neutral-900">
                        {formatVnd(order.total)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-${order.statusColor}`}>{order.status}</span>
                        <span className={`badge badge-${order.paymentStatusColor}`}>{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          <img src={item.productImageUrl} alt="img" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                          {item.variantName && (
                            <p className="text-caption text-neutral-400">{item.variantName}</p>
                          )}
                          <p className="text-caption text-neutral-500">x{item.quantity}</p>
                        </div>
                        <p className="text-body-sm font-medium text-neutral-700 shrink-0">
                          {formatVnd(item.lineTotal)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-100">
                    <button className="btn-ghost btn-sm text-primary-600">
                      {t('account_view_detail')} <HiOutlineChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
