import React, { useEffect, useState } from 'react';
import { Gift, Plus, Search, RotateCw } from 'lucide-react';
import { apiService } from '../../../services';
import { formatVnd } from '../../../utils/price';
import Pagination from '../../../components/data-displays/Pagination/Pagination';
import ConfirmDeleteModal from '../../../components/common/Modal/ConfirmDeleteModal';
import CouponModal from './components/CouponModal';

const PromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, id: null });

  const fetchCoupons = async (p = page, q = searchTerm) => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response } = await apiService.get('/coupons', {
        params: { page: p, pageSize, search: q?.trim() || undefined }
      });
      const root = response?.data || response;
      const items = root?.items || [];
      setCoupons(Array.isArray(items) ? items : []);
      setTotalItems(root?.totalItems || items.length);
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách mã giảm giá.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(page, searchTerm).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounce search or call search manually
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        fetchCoupons(1, searchTerm).catch(() => { });
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchCoupons(1, searchTerm).catch(() => { });
    }
  };

  const handleOpenModal = (mode, id = null) => {
    setModalMode(mode);
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchCoupons().catch(() => { });
  };

  const promptDelete = (id) => {
    setDeleteModalState({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const id = deleteModalState.id;
    if (!id) return;
    try {
      await apiService.delete(`/coupons/${id}`);
      fetchCoupons().catch(() => { });
      setDeleteModalState({ isOpen: false, id: null });
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa mã giảm giá');
    }
  };

  const formatDiscount = (coupon) => {
    const discountValue = Number(coupon?.discountValue ?? 0);
    const type = String(coupon?.discountType ?? '').toLowerCase();

    if (type === 'percent' || type === 'percentage' || type === '%') return `-${Math.round(discountValue)}%`;
    if (type === 'flat' || type === 'money' || type === 'vnd') return `-${formatVnd(discountValue)}`;

    // fallback: if we cannot detect type, assume it's percent when value looks small
    return `-${discountValue}${type ? ` (${type})` : ''}`;
  };

  const formatStatus = (status) => {
    const s = status == null ? null : Number(status);
    if (s === null || Number.isNaN(s)) return status ?? '—';
    return s === 1 ? 'Đang hoạt động' : s === 0 ? 'Tạm dừng' : String(status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Mã giảm giá & Khuyến mãi</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý các chương trình khuyến mãi và mã giảm giá cho khách hàng.</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mã mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-1/3 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => fetchCoupons().catch(() => { })}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <RotateCw className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải danh sách mã giảm giá...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có mã giảm giá nào</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Bạn chưa tạo mã giảm giá hoặc không có dữ liệu phù hợp với bộ lọc hiện tại.
            </p>
            <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
              <Plus className="w-4 h-4" />
              <span>Tạo mã giảm giá</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Mã</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Tên</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Giảm giá</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Điều kiện</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Giới hạn sử dụng</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Thời gian</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Trạng thái</th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-indigo-600">{c.code || '—'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{c.name || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-800 font-semibold">{formatDiscount(c)}</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.discountType ? `(${String(c.discountType)})` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>Min order: {c.minOrderValue ? formatVnd(c.minOrderValue) : '—'}</p>
                      <p className="text-xs text-slate-500">Max: {c.maxDiscount ? formatVnd(c.maxDiscount) : '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>Đã dùng: {c.usageCount ?? 0}</p>
                      <p className="text-xs text-slate-500">Giới hạn: {c.usageLimit ?? 0}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>
                        {c.startAt ? new Date(c.startAt).toLocaleDateString('vi-VN') : '—'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {c.endAt ? `đến ${new Date(c.endAt).toLocaleDateString('vi-VN')}` : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {formatStatus(c.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', c.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => promptDelete(c.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && coupons.length > 0 && (
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

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        couponId={selectedId}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Xóa mã giảm giá"
        message="Bạn có chắc chắn muốn xóa mã giảm giá này không? Thao tác này không thể khôi phục."
      />
    </div>
  );
};

export default PromotionsPage;
