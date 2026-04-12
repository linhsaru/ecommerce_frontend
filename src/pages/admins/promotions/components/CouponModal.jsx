import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { apiService } from '../../../../services';
import Modal from '../../../../components/common/Modal/Modal';

const INITIAL_STATE = {
  id: '',
  code: '',
  name: '',
  discountType: 'percent',
  discountValue: 0,
  minOrderValue: 0,
  maxDiscount: 0,
  usageLimit: 0,
  startAt: '',
  endAt: '',
  status: 1,
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const CouponModal = ({ isOpen, onClose, mode, couponId, onSuccess }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const title = mode === 'add' ? 'Tạo mã giảm giá' : 'Sửa mã giảm giá';

  useEffect(() => {
    if (isOpen && mode === 'edit' && couponId) {
      fetchCouponDetails(couponId);
    } else if (isOpen && mode === 'add') {
      setFormData(INITIAL_STATE);
      setError(null);
    }
  }, [isOpen, mode, couponId]);

  const fetchCouponDetails = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiService.get(`/coupons/${id}`);
      const c = data.data || data;
      setFormData({
        id: c.id || '',
        code: c.code || '',
        name: c.name || '',
        discountType: c.discountType || 'percent',
        discountValue: c.discountValue || 0,
        minOrderValue: c.minOrderValue || 0,
        maxDiscount: c.maxDiscount || 0,
        usageLimit: c.usageLimit || 0,
        startAt: formatDateForInput(c.startAt),
        endAt: formatDateForInput(c.endAt),
        status: (c.status !== undefined && c.status !== null) ? Number(c.status) : 1,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscount: Number(formData.maxDiscount),
        usageLimit: Number(formData.usageLimit),
        status: Number(formData.status),
      };

      if (formData.startAt) {
        payload.startAt = new Date(formData.startAt).toISOString();
      }
      if (formData.endAt) {
        payload.endAt = new Date(formData.endAt).toISOString();
      }

      if (mode === 'add') {
        await apiService.post('/coupons', payload);
      } else if (mode === 'edit') {
        await apiService.put(`/coupons/${formData.id}`, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <form id="coupon-form" onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-4 border border-rose-100">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Mã giảm giá (Code) *</label>
                  <input required type="text" name="code" value={formData.code} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase" placeholder="VD: SALE10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tên chương trình *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Tên hiển thị" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Loại giảm giá</label>
                  <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền trực tiếp (VNĐ)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Mức giảm *</label>
                  <input required type="number" min="0" name="discountValue" value={formData.discountValue} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Đơn hàng tối thiểu (VNĐ)</label>
                  <input type="number" min="0" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Giảm tối đa (VNĐ)</label>
                  <input type="number" min="0" name="maxDiscount" value={formData.maxDiscount} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Bắt đầu từ</label>
                  <input required type="datetime-local" name="startAt" value={formData.startAt} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Kết thúc lúc</label>
                  <input required type="datetime-local" name="endAt" value={formData.endAt} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Số lượng mã tối đa</label>
                  <input type="number" min="0" name="usageLimit" value={formData.usageLimit} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value={1}>Đang hoạt động</option>
                    <option value={0}>Tạm dừng</option>
                  </select>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button type="button" onClick={onClose} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Hủy bỏ
          </button>
          <button type="submit" form="coupon-form" disabled={isLoading || isSaving} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm shadow-indigo-200">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CouponModal;
