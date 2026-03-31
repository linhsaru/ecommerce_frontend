import React, { useEffect, useMemo, useState } from 'react';
import { Gift, Plus, Search, Filter, Download } from 'lucide-react';
import { apiService } from '../../../services';
import { formatVnd } from '../../../utils/price';

const CampaignManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPromotions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response } = await apiService.get('/promotions');
      const items = response?.data?.items ?? response?.items ?? [];
      setPromotions(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách chương trình khuyến mãi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPromotions = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return promotions;

    return promotions.filter((p) => {
      const fields = [p?.title, p?.description, p?.discountType, p?.status, p?.id];
      return fields.some((f) => (f ? String(f).toLowerCase().includes(keyword) : false));
    });
  }, [promotions, searchTerm]);

  const formatDiscount = (p) => {
    const discountValue = Number(p?.discountValue ?? 0);
    const type = String(p?.discountType ?? '').toLowerCase();

    if (type === 'percent' || type === 'percentage' || type === '%') return `-${Math.round(discountValue)}%`;
    if (type === 'flat' || type === 'money' || type === 'vnd') return `-${formatVnd(discountValue)}`;
    return `-${discountValue}${type ? ` (${type})` : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý chương trình khuyến mãi</h2>
          <p className="text-sm text-slate-500 mt-1">Cấu hình các chiến dịch giảm giá, sự kiện đặc biệt (Flash Sale, Mega Sale,...).</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>Tạo chương trình mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chương trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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
          onClick={() => fetchPromotions().catch(() => {})}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải chương trình khuyến mãi...</div>
        ) : filteredPromotions.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có CTKM nào</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Tạo chiến dịch khuyến mãi mới để tăng doanh số bán hàng hoặc không có dữ liệu phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Tiêu đề</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Mô tả</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Giảm giá</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Thời gian</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPromotions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-indigo-600">{p.title || '—'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-2">{p.description || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-800 font-semibold">{formatDiscount(p)}</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.discountType ? `(${String(p.discountType)})` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p>
                        {p.startDate ? new Date(p.startDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {p.endDate ? `đến ${new Date(p.endDate).toLocaleDateString('vi-VN')}` : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {p.status || '—'}
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

export default CampaignManagementPage;
