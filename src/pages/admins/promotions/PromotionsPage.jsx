import React, { useEffect, useMemo, useState } from 'react';
import { Gift, Plus, Search, Filter, Download } from 'lucide-react';
import { apiService } from '../../../services';
import { formatVnd } from '../../../utils/price';

const PromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response } = await apiService.get('/coupons');
      const items = response?.data?.items ?? response?.items ?? [];
      setCoupons(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách mã giảm giá.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedCoupons = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return coupons;

    return coupons.filter((c) => {
      const fields = [c?.code, c?.name, c?.discountType, c?.id];
      return fields.some((f) => (f ? String(f).toLowerCase().includes(keyword) : false));
    });
  }, [coupons, searchTerm]);

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
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>Tạo mã mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          <span>Lọc</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => fetchCoupons().catch(() => {})}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải danh sách mã giảm giá...</div>
        ) : normalizedCoupons.length === 0 ? (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {normalizedCoupons.map((c) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
