import React, { useState } from 'react';
import { Gift, Plus, Search, Filter } from 'lucide-react';

const CampaignManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Quản lý chương trình khuyến mãi</h2>
          <p className="text-sm text-slate-500 mt-1">Cấu hình các chiến dịch giảm giá, sự kiện đặc biệt (Flash Sale, Mega Sale,...).</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200">
          <Plus className="w-4 h-4" />
          <span>Tạo chương trình mới</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chương trình..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Chưa có CTKM nào</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Tạo chiến dịch khuyến mãi mới để tăng doanh số bán hàng.
        </p>
      </div>
    </div>
  );
};

export default CampaignManagementPage;
