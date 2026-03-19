import React, { useState } from 'react';
import { Package, Plus, Search, Filter } from 'lucide-react';

const InventoryManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý tồn kho</h2>
          <p className="text-sm text-slate-500 mt-1">Kiểm soát và theo dõi số lượng tồn kho của các sản phẩm trên hệ thống.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>Nhập/Xuất kho</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm trong kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          <span>Lọc</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có dữ liệu tồn kho</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Dữ liệu tồn kho sẽ được hiển thị tại đây khi bạn nhập hàng vào kho.
        </p>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
