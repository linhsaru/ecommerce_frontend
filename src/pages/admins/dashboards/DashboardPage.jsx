import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import {
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, isPositive, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[13px] font-medium text-slate-500 mb-1 leading-none">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 leading-none">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-auto">
      <span className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
        {trend}
      </span>
      <span className="text-xs text-slate-400">vs last month</span>
    </div>
  </div>
);

const recentOrders = [
  { id: '#ORD-001', customer: 'Nguyen Van A', date: '15 Oct 2026', total: '$1,249.00', status: 'Completed', color: 'emerald' },
  { id: '#ORD-002', customer: 'Tran Thi B', date: '15 Oct 2026', total: '$890.00', status: 'Processing', color: 'indigo' },
  { id: '#ORD-003', customer: 'Le Thanh C', date: '14 Oct 2026', total: '$2,100.50', status: 'Pending', color: 'amber' },
  { id: '#ORD-004', customer: 'Pham Dinh D', date: '14 Oct 2026', total: '$450.00', status: 'Cancelled', color: 'rose' },
  { id: '#ORD-005', customer: 'Hoang Van E', date: '13 Oct 2026', total: '$3,200.00', status: 'Completed', color: 'emerald' },
];

const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-600/20">
        <div className="relative z-10 w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-2">Welcome back to AdminDash!</h2>
          <p className="text-indigo-100 mb-6 text-sm leading-relaxed max-w-lg">
            You have 12 new orders to process and 3 support tickets waiting. Keep up the great work managing your tech store!
          </p>
          <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            View New Orders
          </button>
        </div>

        {/* Abstract decorative shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-32 translate-y-1/2 w-48 h-48 bg-indigo-400 rounded-full blur-2xl opacity-40" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Earnings"
          value="$94,250"
          icon={DollarSign}
          trend="12.5%"
          isPositive={true}
          colorClass="bg-indigo-500 text-indigo-500"
        />
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={ShoppingCart}
          trend="8.2%"
          isPositive={true}
          colorClass="bg-emerald-500 text-emerald-500"
        />
        <StatCard
          title="New Customers"
          value="342"
          icon={Users}
          trend="2.4%"
          isPositive={false}
          colorClass="bg-amber-500 text-amber-500"
        />
        <StatCard
          title="Products Sold"
          value="3,892"
          icon={Package}
          trend="18.2%"
          isPositive={true}
          colorClass="bg-sky-500 text-sky-500"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 border-b border-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800 text-right">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-${order.color}-50 text-${order.color}-600 border border-${order.color}-100`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-${order.color}-500`} />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products or Activity side block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Top PC Components</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
          </div>

          <div className="space-y-5 flex-1">
            {[
              { name: 'Intel Core i9-14900K', s: '840 sales', price: '$589', color: 'indigo' },
              { name: 'Nvidia RTX 4090 24GB', s: '620 sales', price: '$1599', color: 'emerald' },
              { name: 'Samsung 990 PRO 2TB', s: '1240 sales', price: '$189', color: 'sky' },
              { name: 'Corsair Vengeance 32GB', s: '980 sales', price: '$115', color: 'amber' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-${p.color}-50 text-${p.color}-500 flex items-center justify-center shrink-0`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate leading-snug">{p.name}</h4>
                  <p className="text-xs text-slate-500 leading-snug">{p.s}</p>
                </div>
                <div className="text-sm font-bold text-slate-700 shrink-0">
                  {p.price}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
