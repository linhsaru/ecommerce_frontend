import React, { useState, useEffect, useMemo } from 'react';
import { Tags, Plus, Search } from 'lucide-react';
import { useCategoryStore } from '../../../store/categoryStore';
import Pagination from '../../../components/data-displays/Pagination/Pagination';

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
  } = useCategoryStore();

  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    fetchCategories().catch(() => { });
  }, [page]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý danh mục</h2>
          <p className="text-sm text-slate-500 mt-1">Cấu trúc và sắp xếp danh mục sản phẩm của cửa hàng.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
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
                      <button className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
                        <Plus className="w-4 h-4" />
                        <span>Tạo danh mục mới</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && items && items.map((category) => (
                <tr key={category.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{category.description}</p>
                    )}
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
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                        Sửa
                      </button>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
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
    </div>
  );
};

export default CategoryManagementPage;
