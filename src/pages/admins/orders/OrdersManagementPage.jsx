import React, { useState } from 'react';
import { ShoppingCart, Search, Filter, Download } from 'lucide-react';

const OrdersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Danh sách đơn hàng</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý, theo dõi và xử lý các đơn đặt hàng từ khách hàng.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm">
          <Download className="w-4 h-4" />
          <span>Xuất dữ liệu</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-auto">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white justify-center">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Lọc nâng cao</span>
          </button>
        </div>
      </div>

      {/* Content State */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có đơn hàng nào</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Hiện tại chưa có đơn hàng nào trong hệ thống hoặc không có đơn hàng nào khớp với tìm kiếm của bạn.
        </p>
      </div>
    </div>
  );
};

export default OrdersManagementPage;
