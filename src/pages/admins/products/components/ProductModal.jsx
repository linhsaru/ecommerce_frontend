import React, { useState, useEffect } from 'react';
import { X, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { apiService } from '../../../../services';
import Modal from '../../../../components/common/Modal/Modal';
import { useTranslation } from '../../../../context/LanguageContext';
import { formatVnd } from '../../../../utils/price';
import { useCategoryStore } from '../../../../store/categoryStore';

const INITIAL_STATE = {
  id: '',
  name: '',
  slug: '',
  brandId: '',
  categoryId: '',
  description: '',
  originalPrice: 0,
  discountedPrice: 0,
  status: 1,
  thumbnailUrl: '',
  primaryVariantId: '',
  primaryVariantSku: '',
  sku: '',
  variantName: '',
  price: '',
  compareAt: '',
  cost: '',
};

const ProductModal = ({ isOpen, onClose, mode, productSlug, onSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [brands, setBrands] = useState([]);
  const { items: categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories().catch(() => { });
    apiService.get('/brands')
      .then(res => {
        const root = res?.data ?? res;
        const payload = root?.data ?? root;
        setBrands(Array.isArray(payload) ? payload : (payload?.items ?? []));
      })
      .catch(err => console.error('Failed to load brands', err));
  }, []);

  const isViewMode = mode === 'view';
  const title = {
    add: t('add'),
    view: t('view'),
    edit: t('edit'),
  }[mode];

  // Fetch product data if in view or edit mode
  useEffect(() => {
    if (isOpen && (mode === 'view' || mode === 'edit') && productSlug) {
      fetchProductDetails(productSlug);
    } else if (isOpen && mode === 'add') {
      setFormData(INITIAL_STATE);
      setError(null);
    }
  }, [isOpen, mode, productSlug]);

  const pickPrimaryVariant = (productData) => {
    const variants = Array.isArray(productData?.variants) ? productData.variants : [];
    const active = variants.filter((v) => Number(v.status) === 1);
    const pool = active.length ? active : variants;
    if (!pool.length) return null;
    return [...pool].sort((a, b) => Number(a.price) - Number(b.price))[0];
  };

  const fetchProductDetails = async (slug) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiService.get(`/products/slug/${slug}`);
      const productData = data.data || data;
      const primary = pickPrimaryVariant(productData);
      setFormData({
        id: productData.id || '',
        name: productData.name || '',
        slug: productData.slug || '',
        brandId: productData.brandId || '',
        categoryId: (productData.categories && productData.categories.length > 0) ? productData.categories[0].id : (productData.categoryIds && productData.categoryIds.length > 0) ? productData.categoryIds[0] : '',
        description: productData.description || '',
        originalPrice: productData.originalPrice || 0,
        discountedPrice: productData.discountedPrice || 0,
        status: productData.status ?? 1,
        thumbnailUrl: productData.thumbnailUrl || '',
        primaryVariantId: primary?.id || '',
        primaryVariantSku: primary?.sku || '',
        sku: '',
        variantName: '',
        price: primary != null ? String(primary.price ?? '') : '',
        compareAt: primary != null && primary.compareAt != null ? String(primary.compareAt) : '',
        cost: primary != null && primary.cost != null ? String(primary.cost) : '',
      });
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        status: Number(formData.status),
        thumbnailUrl: formData.thumbnailUrl,
        brandId: formData.brandId || undefined,
        categoryIds: formData.categoryId ? [formData.categoryId] : []
      };

      if (mode === 'add') {
        const price = Number(formData.price);
        if (!Number.isFinite(price) || price < 0) throw new Error('Giá bán không hợp lệ.');
        payload.initialVariant = {
          sku: formData.sku || '',
          variantName: formData.variantName || 'Mặc định',
          price,
          compareAt: formData.compareAt === '' || formData.compareAt == null ? null : Number(formData.compareAt),
          cost: formData.cost === '' || formData.cost == null ? null : Number(formData.cost),
        };
        await apiService.post('/products', payload);
      } else if (mode === 'edit') {
        if (!formData.id) throw new Error('Missing Product ID');
        const price = Number(formData.price);
        if (!Number.isFinite(price) || price < 0) throw new Error('Giá bán không hợp lệ.');
        if (!formData.primaryVariantId) throw new Error('Không tìm thấy biến thể để cập nhật giá.');
        payload.variantPricing = {
          variantId: formData.primaryVariantId,
          price,
          compareAt: formData.compareAt === '' || formData.compareAt == null ? null : Number(formData.compareAt),
          cost: formData.cost === '' || formData.cost == null ? null : Number(formData.cost),
        };
        await apiService.put(`/products/${formData.id}`, payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-sm text-slate-500">Đang tải dữ liệu sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6">
              {error}
            </div>
          ) : (
            <form id="product-form" onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 object-cover">
                  <label className="text-sm font-medium text-slate-700">Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Đường dẫn (Slug) *</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    disabled={isViewMode || mode === 'edit'}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                    placeholder="nhap-duong-dan-slug"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Thương hiệu</label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Danh mục</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                  >
                    <option value={1}>Còn hàng</option>
                    <option value={0}>Hết hàng</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Variant Section */}
              {mode === 'add' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-semibold text-indigo-900">Chi tiết biến thể mặc định</h3>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Mã SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="VD: ASUS-RTX4090"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tên biến thể</label>
                    <input
                      type="text"
                      name="variantName"
                      value={formData.variantName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="VD: Mặc định"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Giá bán (VNĐ) *</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="1"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Giá gốc / Niêm yết (VNĐ)</label>
                    <input
                      type="number"
                      name="compareAt"
                      min="0"
                      step="1"
                      value={formData.compareAt}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder="Để trống nếu không hiển thị giá gốc"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Giá nhập (VNĐ)</label>
                    <input
                      type="number"
                      name="cost"
                      min="0"
                      step="1"
                      value={formData.cost}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                      placeholder="Giá vốn / nhập kho"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-semibold text-slate-800">Giá biến thể chính</h3>
                    {formData.primaryVariantSku ? (
                      <p className="text-xs text-slate-500 mt-1">SKU: {formData.primaryVariantSku}</p>
                    ) : (
                      <p className="text-xs text-amber-700 mt-1">Không có biến thể hoạt động — không thể cập nhật giá.</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Giá gốc / Niêm yết (VNĐ)</label>
                    {isViewMode ? (
                      <div className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800">
                        {formData.compareAt === '' || formData.compareAt == null ? '—' : formatVnd(Number(formData.compareAt))}
                      </div>
                    ) : (
                      <input
                        type="number"
                        name="compareAt"
                        min="0"
                        step="1"
                        value={formData.compareAt}
                        onChange={handleChange}
                        disabled={!formData.primaryVariantId}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition-all"
                        placeholder="Để trống nếu không hiển thị giá gốc"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Giá bán (VNĐ) *</label>
                    {isViewMode ? (
                      <div className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-semibold">
                        {formData.price === '' ? '—' : formatVnd(Number(formData.price))}
                      </div>
                    ) : (
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="1"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        disabled={!formData.primaryVariantId}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition-all font-medium"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Giá nhập (VNĐ)</label>
                    {isViewMode ? (
                      <div className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800">
                        {formData.cost === '' || formData.cost == null ? '—' : formatVnd(Number(formData.cost))}
                      </div>
                    ) : (
                      <input
                        type="number"
                        name="cost"
                        min="0"
                        step="1"
                        value={formData.cost}
                        onChange={handleChange}
                        disabled={!formData.primaryVariantId}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 transition-all"
                        placeholder="Giá vốn / nhập kho (tuỳ chọn)"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Description Section */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all resize-none"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                />
              </div>

              {/* URL Thumbnail Section */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">URL Ảnh đại diện (Thumbnail)</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      disabled={isViewMode}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-60 disabled:bg-slate-100 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {formData.thumbnailUrl ? (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/100x100?text=Error';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            {isViewMode ? 'Đóng' : 'Hủy bỏ'}
          </button>

          {!isViewMode && (
            <button
              type="submit"
              form="product-form"
              disabled={isLoading || isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Lưu thay đổi</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
