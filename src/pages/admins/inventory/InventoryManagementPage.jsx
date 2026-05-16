import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Search, Download, RotateCw } from 'lucide-react';
import Pagination from '../../../components/data-displays/Pagination/Pagination';
import { apiService } from '../../../services';
import InventoryStockModal from './components/InventoryStockModal';

/** Lấy payload T trong ApiResponse (ASP.NET JSON camelCase). */
const apiBody = (axiosRes) => axiosRes?.data?.data ?? axiosRes?.data;

const InventoryManagementPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [inventories, setInventories] = useState([]);
  const [warehouseSummaries, setWarehouseSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalSelection, setStockModalSelection] = useState({ warehouseId: '', variantId: '' });

  const [refreshKey, setRefreshKey] = useState(0);

  const reloadList = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(searchInput.trim()), 420);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchDebounced]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const axiosRes = await apiService.get('/inventories/warehouse-summaries');
        const list = apiBody(axiosRes);
        if (!cancelled) setWarehouseSummaries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setWarehouseSummaries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = {
          page,
          pageSize,
          search: searchDebounced || undefined,
          warehouseId: warehouseFilter || undefined,
        };
        const axiosRes = await apiService.get('/inventories', { params });
        const paged = apiBody(axiosRes);
        const list = Array.isArray(paged?.items) ? paged.items : [];
        if (!cancelled) {
          setInventories(list);
          setTotalItems(Number(paged?.totalItems ?? 0));
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || 'Không thể tải danh sách tồn kho.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, searchDebounced, warehouseFilter, refreshKey]);

  const reloadSummaries = async () => {
    try {
      const axiosRes = await apiService.get('/inventories/warehouse-summaries');
      const list = apiBody(axiosRes);
      setWarehouseSummaries(Array.isArray(list) ? list : []);
    } catch {
      /* ignore */
    }
  };

  const topWarehouses = useMemo(
    () =>
      [...warehouseSummaries]
        .sort((a, b) => Number(b.totalQuantity ?? 0) - Number(a.totalQuantity ?? 0))
        .slice(0, 6),
    [warehouseSummaries]
  );

  const handleOpenStockModal = (inv = null) => {
    setStockModalSelection({
      warehouseId: inv?.warehouseId != null ? String(inv.warehouseId) : '',
      variantId: inv?.variantId != null ? String(inv.variantId) : '',
    });
    setIsStockModalOpen(true);
  };

  const handleExportCsv = async () => {
    const escapeCell = (value) => {
      const str = value === null || value === undefined ? '' : String(value);
      return `"${str.replaceAll('"', '""')}"`;
    };

    try {
      const header = ['Kho', 'Sản phẩm', 'Tồn', 'Cập nhật'];
      const rows = [];

      let p = 1;
      let total = Infinity;
      const batchSize = 100;
      const maxPages = 200;

      while (p <= maxPages && rows.length < total) {
        const params = {
          page: p,
          pageSize: batchSize,
          search: searchDebounced || undefined,
          warehouseId: warehouseFilter || undefined,
        };
        const axiosRes = await apiService.get('/inventories', { params });
        const pageData = apiBody(axiosRes);
        const list = Array.isArray(pageData?.items) ? pageData.items : [];
        total = Number(pageData?.totalItems ?? list.length);

        for (const inv of list) {
          const quantity = Number(inv?.quantity ?? 0);
          const updatedAt = inv?.updatedAt ? new Date(inv.updatedAt).toLocaleDateString('vi-VN') : '—';

          rows.push([inv?.warehouseName || '—', inv?.productName || '—', quantity, updatedAt]);
        }

        if (list.length === 0 || rows.length >= total) break;
        p += 1;
      }

      const csvContent = [header.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ton-kho_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setError('Không xuất được CSV. Vui lòng thử lại.');
    }
  };

  const rangeLabel = useMemo(() => {
    if (totalItems <= 0) return 'Không có bản ghi';
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `${start}–${end} trong ${totalItems}`;
  }, [page, pageSize, totalItems]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:items-center">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý tồn kho</h2>
        </div>
        <button
          type="button"
          onClick={() => handleOpenStockModal()}
          className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Điều chỉnh tồn
        </button>
      </div>

      {topWarehouses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {topWarehouses.map((w) => {
            const q = Number(w.totalQuantity ?? 0);
            return (
              <div
                key={String(w.warehouseId)}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Kho</p>
                <p className="text-base font-bold text-slate-900 truncate mt-0.5">{w.warehouseName}</p>
                <div className="mt-4">
                  <p className="text-[11px] text-slate-500">Tổng tồn</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">{q}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-end xl:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Tìm theo tên sản phẩm hoặc tên kho..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
              />
            </div>
            <select
              value={warehouseFilter}
              onChange={(e) => {
                setWarehouseFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-56 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
            >
              <option value="">Tất cả kho</option>
              {warehouseSummaries.map((w) => (
                <option key={String(w.warehouseId)} value={w.warehouseId}>
                  {w.warehouseName}
                </option>
              ))}
            </select>
            <select
              value={String(pageSize)}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="w-full sm:w-40 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / trang
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => reloadList()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"
            >
              <RotateCw className="w-4 h-4" />
              Làm mới
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Xuất CSV
            </button>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-sm">{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-14 text-center text-slate-500 text-sm">Đang tải dữ liệu tồn kho...</div>
        ) : inventories.length === 0 ? (
          <div className="p-14 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Không có bản ghi</h3>
            <p className="text-slate-500 text-sm max-w-md">
              Thử đổi bộ lọc kho hoặc từ khóa. Dòng chỉ hiện khi biến thể và sản phẩm chưa bị xóa mềm.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50/90 border-y border-slate-200">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Kho</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Sản phẩm</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Tồn kho</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventories.map((inv) => {
                  const quantity = Number(inv?.quantity ?? 0);
                  return (
                    <tr
                      key={`${inv?.warehouseId ?? ''}-${inv?.variantId ?? ''}`}
                      onClick={() => handleOpenStockModal(inv)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleOpenStockModal(inv);
                      }}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-slate-900">{inv?.warehouseName || '—'}</p>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-800">{inv?.productName || '—'}</p>
                      </td>
                      <td className="px-5 py-4 align-top whitespace-nowrap">
                        <p className="font-semibold text-slate-900 tabular-nums">{quantity}</p>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-600 whitespace-nowrap">
                        {inv?.updatedAt ? new Date(inv.updatedAt).toLocaleString('vi-VN') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && totalItems > 0 && (
          <div className="px-5 py-4 flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-sm text-slate-600 whitespace-nowrap shrink-0 tabular-nums">{rangeLabel}</span>
            <div className="min-w-0 flex justify-end overflow-x-auto sm:overflow-visible">
              <Pagination page={page} count={totalItems} pageSize={pageSize} onPageChange={(p) => setPage(p)} />
            </div>
          </div>
        )}
      </div>

      <InventoryStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        initialSelection={stockModalSelection}
        onSuccess={() => {
          reloadSummaries();
          reloadList();
        }}
      />
    </div>
  );
};

export default InventoryManagementPage;
