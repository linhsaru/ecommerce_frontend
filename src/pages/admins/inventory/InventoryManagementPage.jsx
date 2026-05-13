import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Search, Filter, Download, RotateCw } from 'lucide-react';
import { apiService } from '../../../services';
import InventoryStockModal from './components/InventoryStockModal';

const InventoryManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalSelection, setStockModalSelection] = useState({ warehouseId: '', variantId: '' });

  const fetchInventories = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data: response } = await apiService.get('/inventories');
      const items = response?.data?.items ?? response?.items ?? [];
      setInventories(Array.isArray(items) ? items : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Không thể tải danh sách tồn kho.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredInventories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return inventories;

    return inventories.filter((inv) => {
      const fields = [inv?.warehouseName, inv?.variantSku, inv?.variantId, inv?.warehouseId];
      return fields.some((f) => (f ? String(f).toLowerCase().includes(keyword) : false));
    });
  }, [inventories, searchTerm]);

  const warehouseSummary = useMemo(() => {
    const map = new Map();
    for (const inv of inventories) {
      const key = inv?.warehouseId || inv?.warehouseName || 'unknown';
      const name = inv?.warehouseName || 'Unknown warehouse';

      if (!map.has(key)) {
        map.set(key, { warehouseId: inv?.warehouseId, warehouseName: name, quantity: 0, reserved: 0 });
      }
      const current = map.get(key);
      current.quantity += Number(inv?.quantity ?? 0);
      current.reserved += Number(inv?.reserved ?? 0);
    }

    return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
  }, [inventories]);

  const handleOpenStockModal = (inv = null) => {
    setStockModalSelection({
      warehouseId: inv?.warehouseId ?? '',
      variantId: inv?.variantId ?? '',
    });
    setIsStockModalOpen(true);
  };

  const handleExportExcel = () => {
    const header = ['Kho', 'SKU', 'Biến thể', 'Tồn', 'Giữ chỗ', 'Có thể bán', 'Cập nhật'];

    const rows = filteredInventories.map((inv) => {
      const quantity = Number(inv?.quantity ?? 0);
      const reserved = Number(inv?.reserved ?? 0);
      const available = quantity - reserved;

      const updatedAt = inv?.updatedAt ? new Date(inv.updatedAt).toLocaleDateString('vi-VN') : '—';

      return [
        inv?.warehouseName || '—',
        inv?.variantSku || '—',
        inv?.variantId || '—',
        quantity,
        reserved,
        available,
        updatedAt,
      ];
    });

    const escapeCell = (value) => {
      const str = value === null || value === undefined ? '' : String(value);
      // CSV escape: wrap in quotes, double any quotes inside
      return `"${str.replaceAll('"', '""')}"`;
    };

    const csvContent = [
      header.map(escapeCell).join(','),
      ...rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ton-kho_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý tồn kho</h2>
          <p className="text-sm text-slate-500 mt-1">Kiểm soát và theo dõi số lượng tồn kho của các sản phẩm trên hệ thống.</p>
        </div>
        <button
          onClick={() => handleOpenStockModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nhập/Xuất kho</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm trong kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
          <button
            type="button"
            onClick={() => fetchInventories().catch(() => { })}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      {warehouseSummary.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {warehouseSummary.slice(0, 3).map((w) => {
            const available = w.quantity - w.reserved;
            return (
              <div
                key={w.warehouseId || w.warehouseName}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-2"
              >
                <p className="text-sm font-semibold text-slate-700 truncate">{w.warehouseName}</p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Tổng tồn</p>
                    <p className="text-lg font-bold text-slate-800">{w.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Có thể bán</p>
                    <p className="text-lg font-bold text-emerald-600">{available}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Đang tải danh sách tồn kho...</div>
        ) : filteredInventories.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có dữ liệu tồn kho</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Dữ liệu tồn kho sẽ được hiển thị tại đây khi bạn nhập hàng vào kho.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Kho</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">SKU</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Biến thể</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Tồn / Giữ chỗ</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventories.map((inv) => {
                  const quantity = Number(inv?.quantity ?? 0);
                  const reserved = Number(inv?.reserved ?? 0);
                  const available = quantity - reserved;
                  return (
                    <tr
                      key={`${inv?.warehouseId || ''}-${inv?.variantId || ''}`}
                      onClick={() => handleOpenStockModal(inv)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleOpenStockModal(inv);
                      }}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{inv?.warehouseName || '—'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{inv?.warehouseId || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-700">{inv?.variantSku || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{inv?.variantId || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <p>Tồn: {quantity}</p>
                        <p className="text-xs text-slate-500">Giữ chỗ: {reserved} | Có thể bán: {available}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {inv?.updatedAt ? new Date(inv.updatedAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InventoryStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        inventories={inventories}
        initialSelection={stockModalSelection}
        onSuccess={() => fetchInventories().catch(() => { })}
      />
    </div>
  );
};

export default InventoryManagementPage;
