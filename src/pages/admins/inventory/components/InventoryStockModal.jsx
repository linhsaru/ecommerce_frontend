import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Loader2, Save, X } from 'lucide-react';
import Modal from '../../../../components/common/Modal/Modal';
import { apiService } from '../../../../services';

const InventoryStockModal = ({
  isOpen,
  onClose,
  onSuccess,
  inventories = [],
  initialSelection = { warehouseId: '', variantId: '' },
}) => {
  const [action, setAction] = useState('import'); // 'import' | 'export'
  const [warehouseId, setWarehouseId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const inventoryMap = useMemo(() => {
    const map = new Map();
    for (const inv of inventories) {
      const wId = inv?.warehouseId;
      const vId = inv?.variantId;
      if (wId == null || vId == null) continue;
      map.set(`${wId}-${vId}`, inv);
    }
    return map;
  }, [inventories]);

  const selectedInventory = useMemo(() => {
    const key = `${warehouseId}-${variantId}`;
    return inventoryMap.get(key) || null;
  }, [inventoryMap, warehouseId, variantId]);

  const currentQuantity = Number(selectedInventory?.quantity ?? 0);
  const currentReserved = Number(selectedInventory?.reserved ?? 0);
  const available = currentQuantity - currentReserved;

  const warehouses = useMemo(() => {
    const map = new Map();
    for (const inv of inventories) {
      if (inv?.warehouseId == null) continue;
      const id = inv.warehouseId;
      if (!map.has(id)) {
        map.set(id, {
          warehouseId: inv.warehouseId,
          warehouseName: inv.warehouseName || 'Unknown warehouse',
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.warehouseName.localeCompare(b.warehouseName));
  }, [inventories]);

  const variants = useMemo(() => {
    const map = new Map();
    for (const inv of inventories) {
      if (inv?.variantId == null) continue;
      const id = inv.variantId;
      if (!map.has(id)) {
        map.set(id, { variantId: inv.variantId, variantSku: inv.variantSku || '' });
      }
    }
    return Array.from(map.values()).sort((a, b) => String(a.variantSku).localeCompare(String(b.variantSku)));
  }, [inventories]);

  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setIsSaving(false);

    setAction('import');
    setWarehouseId(initialSelection?.warehouseId != null ? String(initialSelection.warehouseId) : '');
    setVariantId(initialSelection?.variantId != null ? String(initialSelection.variantId) : '');
    setQuantity('');
    setNote('');
  }, [isOpen, initialSelection]);

  const parsedQuantity = Number(quantity);
  const isQuantityValid = Number.isFinite(parsedQuantity) && parsedQuantity > 0;

  const canSubmit = () => {
    if (!warehouseId || !variantId) return false;
    if (!isQuantityValid) return false;

    if (action === 'export') {
      if (available < parsedQuantity) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) {
      setError(
        action === 'export'
          ? 'Xuất kho không thể vượt quá số lượng có thể bán.'
          : 'Vui lòng kiểm tra lại thông tin nhập/xuất kho.'
      );
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // Backend hiện có bảng `inventory` (warehouse_id, variant_id, quantity, reserved).
      // Popup này gửi "delta quantity" để backend cộng/trừ.
      const payload = {
        warehouseId: Number(warehouseId),
        variantId: Number(variantId),
        quantityDelta: action === 'import' ? parsedQuantity : -parsedQuantity,
        type: action,
        note: note?.trim() || undefined,
      };

      // TODO: cập nhật endpoint nếu backend dùng tên route khác.
      await apiService.post('/inventories/adjust', payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.message || 'Đã có lỗi xảy ra khi thao tác tồn kho.');
    } finally {
      setIsSaving(false);
    }
  };

  const title =
    action === 'import' ? 'Nhập kho (tăng tồn)' : 'Xuất kho (giảm tồn)';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {action === 'import' ? (
              <ArrowUpFromLine className="w-5 h-5 text-indigo-600" />
            ) : (
              <ArrowDownToLine className="w-5 h-5 text-rose-600" />
            )}
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Chọn thao tác</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAction('import')}
                className={[
                  'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  action === 'import'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                <ArrowUpFromLine className="w-4 h-4" />
                Nhập kho
              </button>
              <button
                type="button"
                onClick={() => setAction('export')}
                className={[
                  'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  action === 'export'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                <ArrowDownToLine className="w-4 h-4" />
                Xuất kho
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kho</label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
              >
                <option value="">Chọn kho...</option>
                {warehouses.map((w) => (
                  <option key={w.warehouseId} value={w.warehouseId}>
                    {w.warehouseName} (ID: {w.warehouseId})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Biến thể (SKU / ID)</label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
              >
                <option value="">Chọn biến thể...</option>
                {variants.map((v) => (
                  <option key={v.variantId} value={v.variantId}>
                    {v.variantSku ? `${v.variantSku} (ID: ${v.variantId})` : `ID: ${v.variantId}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Tình trạng tồn hiện tại</p>
                <p className="text-xs text-slate-500 mt-1">
                  Dựa trên dữ liệu `inventory` (quantity và reserved).
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Có thể bán</p>
                <p
                  className={[
                    'text-lg font-bold',
                    available > 0 ? 'text-emerald-600' : 'text-rose-600',
                  ].join(' ')}
                >
                  {available}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="bg-white border border-slate-100 rounded-lg p-3">
                <p className="text-xs text-slate-500">Tổng tồn</p>
                <p className="text-base font-bold text-slate-800">{currentQuantity}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-lg p-3">
                <p className="text-xs text-slate-500">Giữ chỗ</p>
                <p className="text-base font-bold text-slate-800">{currentReserved}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-lg p-3">
                <p className="text-xs text-slate-500">Có thể bán</p>
                <p className="text-base font-bold text-slate-800">{available}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Số lượng {action === 'import' ? 'nhập' : 'xuất'} *
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                placeholder="VD: 10"
              />
              {action === 'export' && isQuantityValid && available < parsedQuantity && (
                <p className="text-xs text-rose-600 mt-1">
                  Chỉ có thể xuất tối đa {available}.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Ghi chú</label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="VD: Nhập hàng từ NCC A, Xuất cho đơn ... (tuỳ chọn)"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm p-4">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || !canSubmit()}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{action === 'import' ? 'Xác nhận nhập' : 'Xác nhận xuất'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InventoryStockModal;

