import React, { useState, useEffect, useMemo } from 'react';
import { Tags, Plus, Search, ChevronRight, ChevronDown, X, Loader2, Save } from 'lucide-react';
import { useCategoryStore } from '../../../store/categoryStore';
import { apiService } from '../../../services';
import Pagination from '../../../components/data-displays/Pagination/Pagination';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmDeleteModal from '../../../components/common/Modal/ConfirmDeleteModal';
import ToastNotification from '../../../components/common/ToastNotification/ToastNotification';

const INITIAL_FORM = {
  id: '',
  name: '',
  slug: '',
  parentId: '',
  sortOrder: 0,
};

const CategoryRow = ({ category, level = 0, onEdit, onDelete, isBusy }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center" style={{ paddingLeft: `${level * 2}rem` }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mr-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-6 inline-block" />
            )}
            <div>
              <p className="font-medium text-slate-800">{category.name}</p>
              {category.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{category.description}</p>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-slate-600">
          {category.slug}
        </td>
        <td className="px-6 py-4 text-center">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700">
            Hoạt động
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit(category)}
              disabled={isBusy}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              Sửa
            </button>
            <button
              onClick={() => onDelete(category)}
              disabled={isBusy}
              className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60"
            >
              Xóa
            </button>
          </div>
        </td>
      </tr>
      {expanded && hasChildren && category.children.map(child => (
        <CategoryRow
          key={child.id}
          category={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          isBusy={isBusy}
        />
      ))}
    </>
  );
};

const CategoryManagementPage = () => {
  const {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    search,
    isLoading,
    error,
    setFilters,
    setPage,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [localSearch, setLocalSearch] = useState(search || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, category: null });
  const [toast, setToast] = useState({ isVisible: false, message: '', status: 'info' });

  useEffect(() => {
    fetchCategories().catch(() => { });
  }, [page]);

  const showToast = (message, status = 'info') => {
    setToast({ isVisible: true, message, status });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setFormError('');
    if (mode === 'edit' && category) {
      setFormData({
        id: category.id,
        name: category.name || '',
        slug: category.slug || '',
        parentId: category.parentId || '',
        sortOrder: Number(category.sortOrder || 0),
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sortOrder' ? Number(value) : value,
    }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        parentId: formData.parentId || null,
        sortOrder: Number(formData.sortOrder || 0),
      };

      if (modalMode === 'add') {
        await createCategory(payload);
        showToast('Thêm danh mục thành công.', 'success');
      } else {
        await updateCategory(formData.id, payload);
        showToast('Cập nhật danh mục thành công.', 'success');
      }

      await fetchCategories({ page: 1, search: localSearch.trim() });
      setIsModalOpen(false);
    } catch (err) {
      const message = err.message || 'Không thể lưu danh mục.';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const hasProductsInCategory = async (categoryId) => {
    const { data: response } = await apiService.get('/products', {
      params: {
        page: 1,
        pageSize: 1,
        categoryId,
      },
    });
    const root = response?.data ?? response;
    const payload = root?.data ?? root;
    if (typeof payload?.totalItems === 'number') {
      return payload.totalItems > 0;
    }
    const items = Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];
    return items.length > 0;
  };

  const promptDelete = async (category) => {
    try {
      const hasProducts = await hasProductsInCategory(category.id);
      if (hasProducts) {
        showToast('Danh mục đang có sản phẩm, không thể xóa.', 'warning');
        return;
      }
      setDeleteModalState({ isOpen: true, category });
    } catch (err) {
      showToast(err.message || 'Không thể kiểm tra dữ liệu sản phẩm trong danh mục.', 'error');
    }
  };

  const executeDelete = async () => {
    const category = deleteModalState.category;
    if (!category?.id) return;
    await deleteCategory(category.id);
    await fetchCategories({ page: 1, search: localSearch.trim() });
    showToast('Xóa danh mục thành công.', 'success');
    setDeleteModalState({ isOpen: false, category: null });
  };

  const handleSearch = () => {
    setFilters({
      search: localSearch.trim(),
    });
    fetchCategories({
      page: 1,
      search: localSearch.trim(),
    }).catch(() => { });
  };

  const handleReset = () => {
    setLocalSearch('');
    setFilters({ search: '' });
    fetchCategories({
      page: 1,
      search: '',
    }).catch(() => { });
  };

  const handleChangePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const pageInfoText = useMemo(() => {
    if (!totalItems) return 'Không có dữ liệu';
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `Hiển thị ${start}–${end} / ${totalItems} mục`;
  }, [page, pageSize, totalItems]);

  const categoryTree = useMemo(() => {
    if (!items || items.length === 0) return [];
    const map = {};
    const roots = [];
    items.forEach(c => {
      map[c.id] = { ...c, children: [] };
    });
    items.forEach(c => {
      const parentId = c.parentId || c.parent_id;
      if (parentId && map[parentId]) {
        map[parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý danh mục</h2>
          <p className="text-sm text-slate-500 mt-1">Cấu trúc và sắp xếp danh mục sản phẩm của cửa hàng.</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium text-sm transition-colors"
          >
            Tìm
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors"
          >
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Content State */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Tên danh mục</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Slug</th>
                <th className="px-6 py-4 text-center font-semibold text-slate-700">Trạng thái</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!isLoading && (!items || items.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                        <Tags className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có danh mục nào</h3>
                      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                        Dữ liệu danh mục chưa được tạo. Hãy tạo danh mục trước khi thêm sản phẩm vào hệ thống.
                      </p>
                      <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl font-medium transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tạo danh mục mới</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && categoryTree && categoryTree.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onEdit={(selected) => handleOpenModal('edit', selected)}
                  onDelete={promptDelete}
                  isBusy={isLoading}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && items && items.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500 w-full">{pageInfoText}</span>
            <Pagination
              page={page}
              count={totalItems}
              pageSize={pageSize}
              onPageChange={handleChangePage}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {modalMode === 'add' ? 'Thêm danh mục' : 'Sửa danh mục'}
            </h2>
            <button
              onClick={handleCloseModal}
              disabled={isSaving}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors disabled:opacity-60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {formError && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6">
                {formError}
              </div>
            )}
            <form id="category-form" onSubmit={handleSubmitCategory} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tên danh mục *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Nhập tên danh mục"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Đường dẫn (Slug) *</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="linh-kien-may-tinh"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Danh mục cha</label>
                  <select
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">-- Không có --</option>
                    {items
                      .filter((item) => item.id !== formData.id)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Thứ tự sắp xếp</label>
                  <input
                    type="number"
                    name="sortOrder"
                    min="0"
                    value={formData.sortOrder}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-60"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              form="category-form"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, category: null })}
        onConfirm={executeDelete}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
      />

      <ToastNotification
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default CategoryManagementPage;
