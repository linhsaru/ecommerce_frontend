import { useEffect, useState, useMemo } from 'react';
import { useProductStore } from '../../../store/productStore';
import Pagination from '../../../components/data-displays/Pagination/Pagination';
import ProductModal from './components/ProductModal';
import ConfirmDeleteModal from '../../../components/common/Modal/ConfirmDeleteModal';
import { Plus, Search } from 'lucide-react';
import { apiService } from '../../../services';

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '—';
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });
};

const getStatusBadge = (status) => {
  // Giả định backend dùng: 1 = active, 0 = inactive, 2 = draft
  switch (status) {
    case 1:
      return {
        label: 'Còn hàng',
        className:
          'bg-emerald-50 text-emerald-700',
      };
    case 0:
      return {
        label: 'Hết hàng',
        className:
          'bg-rose-50 text-rose-700',
      };
    default:
      return {
        label: 'Không rõ',
        className:
          'bg-slate-100 text-slate-600',
      };
  }
};

const ProductManagementPage = () => {
  const {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext,
    hasPrev,
    search,
    status,
    isLoading,
    error,
    setFilters,
    setPage,
    fetchProducts,
  } = useProductStore();

  const [localSearch, setLocalSearch] = useState(search || '');
  const [localStatus, setLocalStatus] = useState(status ?? '');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, id: null });

  const handleOpenModal = (mode, slug = null) => {
    setModalMode(mode);
    setSelectedSlug(slug);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlug(null);
  };

  const handleModalSuccess = () => {
    fetchProducts().catch(() => { });
  };

  useEffect(() => {
    fetchProducts().catch(() => { });
  }, [page]);

  const promptDelete = (id) => {
    setDeleteModalState({ isOpen: true, id });
  };

  const executeDelete = async () => {
    const id = deleteModalState.id;
    if (!id) return;
    try {
      await apiService.delete(`/products/${id}`);
      fetchProducts().catch(() => { });
      setDeleteModalState({ isOpen: false, id: null });
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa sản phẩm.');
    }
  };

  const handleSearch = () => {
    setFilters({
      search: localSearch.trim(),
      status: localStatus,
    });
    fetchProducts({
      page: 1,
      search: localSearch.trim(),
      status: localStatus,
    }).catch(() => { });
  };

  const handleReset = () => {
    setLocalSearch('');
    setLocalStatus('');
    setFilters({ search: '', status: '' });
    fetchProducts({
      page: 1,
      search: '',
      status: '',
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-sm text-slate-500 mt-1">
            Tìm kiếm, lọc và quản lý danh sách sản phẩm trên hệ thống.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-2xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SKU..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <select
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Còn hàng</option>
            <option value="0">Hết hàng</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
            >
              Tìm kiếm
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 pb-2 text-xs text-rose-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Sản phẩm</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Slug</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700">Giá</th>
                <th className="px-6 py-4 text-center font-semibold text-slate-700">Trạng thái</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500 text-sm"
                  >
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              )}

              {!isLoading && (!items || items.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}

              {!isLoading &&
                items &&
                items.map((product) => {
                  const badge = getStatusBadge(product.status);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.thumbnailUrl && (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover border border-slate-200"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-800 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="text-xs break-all">{product.slug}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-800 font-semibold">
                        {product.discountedPrice != null
                          ? formatCurrency(product.discountedPrice)
                          : formatCurrency(product.originalPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal('view', product.slug)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Xem
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', product.slug)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => promptDelete(product.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
          <span className="text-sm text-slate-500">{pageInfoText}</span>
          <div className="flex-1 flex justify-end">
            <Pagination
              page={page}
              count={totalItems}
              pageSize={pageSize}
              onPageChange={(p) => handleChangePage(p)}
            />
          </div>
        </div>
      </div>

      {/* Product Add/Edit/View Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        productSlug={selectedSlug}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: null })}
        onConfirm={executeDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ProductManagementPage;

