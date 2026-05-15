import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Loader2, Save, X } from 'lucide-react';
import Modal from '../../../../components/common/Modal/Modal';
import { apiService } from '../../../../services';

const apiBody = (axiosRes) => axiosRes?.data?.data ?? axiosRes?.data;

const lineLabel = (inv) => {
  const product = inv?.productName?.trim() || 'Sản phẩm';
  const sub = inv?.variantLabel?.trim();
  const piece = sub ? `${product} · ${sub}` : product;
  return piece;
};

const InventoryStockModal = ({ isOpen, onClose, onSuccess, initialSelection = { warehouseId: '', variantId: '' } }) => {
  const [action, setAction] = useState('import');
  const [warehouseId, setWarehouseId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const [lines, setLines] = useState([]);
  const [linesLoading, setLinesLoading] = useState(false);
  const [linesError, setLinesError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const inventoryMap = useMemo(() => {
    const map = new Map();
    for (const inv of lines) {
      const wId = inv?.warehouseId != null ? String(inv.warehouseId) : '';
      const vId = inv?.variantId != null ? String(inv.variantId) : '';
      if (!wId || !vId) continue;
      map.set(`${wId}-${vId}`, inv);
    }
    return map;
  }, [lines]);

  const selectedInventory = useMemo(() => {
    const key = `${warehouseId}-${variantId}`;
    return inventoryMap.get(key) || null;
  }, [inventoryMap, warehouseId, variantId]);

  const currentQuantity = Number(selectedInventory?.quantity ?? 0);

  const warehouses = useMemo(() => {
    const map = new Map();
    for (const inv of lines) {
      const id = inv?.warehouseId != null ? String(inv.warehouseId) : '';
      if (!id) continue;
      if (!map.has(id)) {
        map.set(id, {
          warehouseId: id,
          warehouseName: inv.warehouseName || 'Kho',
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.warehouseName.localeCompare(b.warehouseName, 'vi'));
  }, [lines]);

  const variantsInWarehouse = useMemo(() => {
    if (!warehouseId) return [];
    return lines
      .filter((inv) => String(inv?.warehouseId ?? '') === warehouseId)
      .slice()
      .sort((a, b) => lineLabel(a).localeCompare(lineLabel(b), 'vi'));
  }, [lines, warehouseId]);

  const fetchAllInventoryLines = useCallback(async () => {
    const pageSize = 100;
    let p = 1;
    let all = [];
    let total = 0;
    const maxPages = 150;

    do {
      const axiosRes = await apiService.get('/inventories', { params: { page: p, pageSize } });
      const paged = apiBody(axiosRes);
      const batch = Array.isArray(paged?.items) ? paged.items : [];
      total = Number(paged?.totalItems ?? batch.length);
      all = all.concat(batch);
      if (batch.length === 0 || all.length >= total) break;
      p += 1;
    } while (p <= maxPages);

    return all;
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setLinesError('');
    setIsSaving(false);
    setLinesLoading(true);

    fetchAllInventoryLines()
      .then((all) => {
        setLines(all);
      })
      .catch(() => setLinesError('Không tải được danh sách để chọn.'))
      .finally(() => setLinesLoading(false));

    setAction('import');
    setWarehouseId(initialSelection?.warehouseId != null ? String(initialSelection.warehouseId) : '');
    setVariantId(initialSelection?.variantId != null ? String(initialSelection.variantId) : '');
    setQuantity('');
    setNote('');
  }, [isOpen, fetchAllInventoryLines, initialSelection]);

  useEffect(() => {
    if (!warehouseId || !variantId) return;
    const exists = lines.some(
      (inv) => String(inv?.warehouseId ?? '') === warehouseId && String(inv?.variantId ?? '') === variantId
    );
    if (!exists) setVariantId('');
  }, [warehouseId, variantId, lines]);

  const parsedQuantity = Number(quantity);
  const isQuantityValid = Number.isFinite(parsedQuantity) && parsedQuantity > 0;

  const canSubmit = () => {
    if (!warehouseId || !variantId || !selectedInventory) return false;
    if (!isQuantityValid) return false;
    if (action === 'export' && currentQuantity < parsedQuantity) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) {
      setError(
        action === 'export'
          ? 'Xuất kho không thể vượt quá số lượng tồn.'
          : 'Vui lòng chọn kho, dòng sản phẩm và số lượng hợp lệ.'
      );
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const nextQty =
        action === 'import'
          ? currentQuantity + parsedQuantity
          : Math.max(0, currentQuantity - parsedQuantity);

      const payload = {
        warehouseId,
        variantId,
        quantity: nextQty,
        reserved: 0,
      };

      await apiService.post('/inventories', payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Đã có lỗi khi lưu tồn kho.');
    } finally {
      setIsSaving(false);
    }
  };

  const title = action === 'import' ? 'Nhập kho (tăng tồn)' : 'Xuất kho (giảm tồn)';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 border border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            {action === 'import' ? (
              <ArrowUpFromLine className="w-5 h-5 text-indigo-600" />
            ) : (
              <ArrowDownToLine className="w-5 h-5 text-rose-600" />
            )}
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            type="button"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Thao tác</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAction('import')}
                className={[
                  'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  action === 'import'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                <ArrowUpFromLine className="w-4 h-4" />
                Nhập
              </button>
              <button
                type="button"
                onClick={() => setAction('export')}
                className={[
                  'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  action === 'export'
                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                <ArrowDownToLine className="w-4 h-4" />
                Xuất
              </button>
            </div>
          </div>

          {linesLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Đang tải danh sách tồn kho...
            </div>
          ) : null}
          {!linesLoading && linesError ? (
            <div className="text-sm text-rose-700 bg-rose-50 rounded-xl px-3 py-2 border border-rose-100">{linesError}</div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800">Kho</label>
              <select
                value={warehouseId}
                onChange={(e) => {
                  setWarehouseId(e.target.value);
                  setVariantId('');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Chọn kho</option>
                {warehouses.map((w) => (
                  <option key={w.warehouseId} value={w.warehouseId}>
                    {w.warehouseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800">Sản phẩm trong kho</label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                disabled={!warehouseId}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="">Chọn sản phẩm</option>
                {variantsInWarehouse.map((inv) => (
                  <option key={String(inv.variantId)} value={String(inv.variantId)}>
                    {lineLabel(inv)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Tồn hiện tại</p>
                <p className="text-xs text-slate-500 mt-0.5">Theo dòng kho + biến thể đã chọn</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Số lượng</p>
                <p className={`text-2xl font-bold tabular-nums ${currentQuantity > 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                  {selectedInventory ? currentQuantity : '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800">Số lượng *</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium bg-white"
                placeholder="VD: 10"
              />
              {action === 'export' && isQuantityValid && currentQuantity < parsedQuantity && (
                <p className="text-xs text-rose-600 mt-1">Chỉ xuất tối đa {currentQuantity}.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-800">Ghi chú</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                placeholder="Ghi chú"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-800 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || !canSubmit() || linesLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-60 shadow-sm shadow-indigo-500/25"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InventoryStockModal;
