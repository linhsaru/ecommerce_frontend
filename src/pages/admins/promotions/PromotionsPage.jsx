import React, { useState } from 'react';
import { Gift, Plus, Search, Filter } from 'lucide-react';

const PromotionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Mã giảm giá & Khuyến mãi</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý các chương trình khuyến mãi và mã giảm giá cho khách hàng.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>Tạo mã mới</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã giảm giá..."
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

      {/* Content State */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có mã giảm giá nào</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Bạn chưa tạo mã giảm giá hoặc chương trình khuyến mãi nào. Hãy tạo mã đầu tiên để thu hút khách hàng.
        </p>
        <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-medium transition-colors text-sm">
          <Plus className="w-4 h-4" />
          <span>Tạo mã giảm giá</span>
        </button>
      </div>
    </div>
  );
};

export default PromotionsPage;
