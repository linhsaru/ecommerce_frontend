import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Search, RefreshCw } from 'lucide-react';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification';
import Pagination from '../../../components/data-displays/Pagination/Pagination';
import { orderApi } from '../../../services/orderApi';
import { formatVnd } from '../../../utils/price';

const ORDER_STATUS_OPTIONS = [
  { value: 0, label: 'Chờ xác nhận', color: 'text-amber-600' }, // pending
  { value: 1, label: 'Đã xác nhận', color: 'text-blue-600' }, // confirmed
  { value: 2, label: 'Đang xử lý', color: 'text-indigo-600' }, // processing
  { value: 3, label: 'Đang giao hàng', color: 'text-purple-600' }, // shipping
  { value: 4, label: 'Hoàn thành', color: 'text-emerald-600' }, // completed
  { value: 5, label: 'Đã hủy', color: 'text-rose-600' }, // cancelled
  { value: 6, label: 'Đã hoàn tiền', color: 'text-slate-600' }, // refunded
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 0, label: 'Chưa thanh toán', color: 'text-amber-600' }, // unpaid
  { value: 1, label: 'Đã thanh toán', color: 'text-emerald-600' }, // paid
  { value: 2, label: 'Thanh toán thất bại', color: 'text-rose-600' }, // failed
  { value: 3, label: 'Đã hoàn tiền', color: 'text-slate-600' }, // refunded
  { value: 4, label: 'Hoàn tiền một phần', color: 'text-blue-600' }, // partially_refunded
];

const SHIPMENT_STATUS_OPTIONS = [
  { value: 0, label: 'Chờ xử lý giao hàng', color: 'text-amber-600' }, // pending
  { value: 1, label: 'Sẵn sàng giao', color: 'text-blue-600' }, // ready
  { value: 2, label: 'Đang vận chuyển', color: 'text-purple-600' }, // shipped
  { value: 3, label: 'Đã giao', color: 'text-emerald-600' }, // delivered
  { value: 4, label: 'Đã hoàn trả', color: 'text-slate-600' }, // returned
  { value: 5, label: 'Đã hủy giao hàng', color: 'text-rose-600' }, // cancelled
];

const getStatusLabel = (options, value) => options.find((item) => item.value === Number(value))?.label || `#${value}`;
const getStatusColor = (options, value) => options.find((item) => item.value === Number(value))?.color || 'text-slate-600';
const normalizeStatusValue = (value, fallback = 0) => (value == null ? fallback : Number(value));

const OrdersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingOrderIds, setUpdatingOrderIds] = useState([]);
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '', status: 'info' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const skipStatusFilterEffect = useRef(true);

  const showToast = (message, status = 'info') => {
    setToastConfig({ isVisible: true, message, status });
  };

  const fetchOrders = async (p = page, search = searchTerm, status = statusFilter) => {
    setIsLoading(true);
    setError('');
    try {
      const envelope = await orderApi.getOrders({
        page: p,
        pageSize,
        search: search?.trim() || undefined,
        status: status === '' || status == null ? undefined : Number(status),
      });
      const paged = envelope?.data;
      const list = Array.isArray(paged?.items) ? paged.items : [];
      setOrders(list);
      setTotalItems(Number(paged?.totalItems ?? 0));
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, searchTerm, statusFilter).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        fetchOrders(1, searchTerm, statusFilter).catch(() => { });
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (skipStatusFilterEffect.current) {
      skipStatusFilterEffect.current = false;
      return;
    }
    if (page !== 1) {
      setPage(1);
    } else {
      fetchOrders(1, searchTerm, statusFilter).catch(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdateOrderStatus = async (orderId, nextPatch) => {
    const currentOrder = orders.find((item) => item.orderId === orderId);
    if (!currentOrder) return;

    setUpdatingOrderIds((prev) => [...new Set([...prev, orderId])]);
    try {
      const payload = {
        orderStatus: normalizeStatusValue(nextPatch.orderStatus ?? currentOrder.status, 0),
        paymentStatus: normalizeStatusValue(nextPatch.paymentStatus ?? currentOrder.paymentStatus, 0),
        shipmentStatus: normalizeStatusValue(nextPatch.shipmentStatus ?? currentOrder.shipmentStatus, 0),
      };

      const response = await orderApi.updateOrderStatus(orderId, payload);
      const updatedOrder = response?.data;

      setOrders((prev) =>
        prev.map((order) => (order.orderId === orderId ? { ...order, ...(updatedOrder || payload), status: payload.orderStatus, paymentStatus: payload.paymentStatus, shipmentStatus: payload.shipmentStatus } : order)),
      );
      showToast('Cập nhật trạng thái đơn hàng thành công.', 'success');
    } catch (updateError) {
      showToast(updateError?.response?.data?.message || 'Cập nhật trạng thái thất bại.', 'error');
    } finally {
      setUpdatingOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Danh sách đơn hàng</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý, theo dõi và xử lý các đơn đặt hàng từ khách hàng.</p>
        </div>
        <button
          onClick={() => fetchOrders(page, searchTerm, statusFilter).catch(() => { })}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-auto"
          >
            <option value="">Tất cả trạng thái</option>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải danh sách đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Hiện tại chưa có đơn hàng nào trong hệ thống hoặc không có đơn hàng nào khớp với tìm kiếm của bạn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Mã đơn</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Khách hàng</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Ngày tạo</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Tổng tiền</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Trạng thái đơn</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Thanh toán</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Giao hàng</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const isUpdating = updatingOrderIds.includes(order.orderId);

                  return (
                    <tr key={order.orderId} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{order.orderNo || order.orderId}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{order.orderId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{order.shipRecipient || '—'}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{order.shipPhone || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '—'}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        {formatVnd(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={normalizeStatusValue(order.status, 0)}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.orderId, { orderStatus: Number(e.target.value) })
                          }
                          className={`min-w-[150px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-70 ${getStatusColor(ORDER_STATUS_OPTIONS, order.status)}`}
                        >
                          {ORDER_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="text-slate-800">
                              {option.label}
                            </option>
                          ))}
                          {!ORDER_STATUS_OPTIONS.some((option) => option.value === normalizeStatusValue(order.status, 0)) && (
                            <option value={normalizeStatusValue(order.status, 0)} className="text-slate-800">
                              {getStatusLabel(ORDER_STATUS_OPTIONS, order.status)}
                            </option>
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={normalizeStatusValue(order.paymentStatus, 0)}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.orderId, { paymentStatus: Number(e.target.value) })
                          }
                          className={`min-w-[150px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-70 ${getStatusColor(PAYMENT_STATUS_OPTIONS, order.paymentStatus)}`}
                        >
                          {PAYMENT_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="text-slate-800">
                              {option.label}
                            </option>
                          ))}
                          {!PAYMENT_STATUS_OPTIONS.some((option) => option.value === normalizeStatusValue(order.paymentStatus, 0)) && (
                            <option value={normalizeStatusValue(order.paymentStatus, 0)} className="text-slate-800">
                              {getStatusLabel(PAYMENT_STATUS_OPTIONS, order.paymentStatus)}
                            </option>
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={normalizeStatusValue(order.shipmentStatus, 0)}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.orderId, { shipmentStatus: Number(e.target.value) })
                          }
                          className={`min-w-[150px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-70 ${getStatusColor(SHIPMENT_STATUS_OPTIONS, order.shipmentStatus)}`}
                        >
                          {SHIPMENT_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="text-slate-800">
                              {option.label}
                            </option>
                          ))}
                          {!SHIPMENT_STATUS_OPTIONS.some((option) => option.value === normalizeStatusValue(order.shipmentStatus, 0)) && (
                            <option value={normalizeStatusValue(order.shipmentStatus, 0)} className="text-slate-800">
                              {getStatusLabel(SHIPMENT_STATUS_OPTIONS, order.shipmentStatus)}
                            </option>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && totalItems > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Hiển thị tổng số {totalItems} bản ghi
            </span>
            <div className="flex-1 flex justify-end">
              <Pagination
                page={page}
                count={totalItems}
                pageSize={pageSize}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </div>
        )}
      </div>

      <ToastNotification
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        status={toastConfig.status}
        onClose={() => setToastConfig((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default OrdersManagementPage;
