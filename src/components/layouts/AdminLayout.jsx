import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Cpu,
  Workflow,
  Tags,
  ShoppingCart,
  Receipt,
  CreditCard,
  Users,
  Shield,
  History,
  BarChart3,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: Users,
    to: '/admin/users'
  },
  {
    id: 'categories',
    label: 'Quản lý danh mục',
    icon: Tags,
    to: '/admin/categories'
  },
  {
    id: 'products',
    label: 'Quản lý sản phẩm',
    icon: Package,
    to: '/admin/products'
  },
  {
    id: 'inventory',
    label: 'Quản lý tồn kho',
    icon: History,
    to: '/admin/inventory'
  },
  {
    id: 'promotions',
    label: 'Quản lý mã giảm giá',
    icon: CreditCard,
    to: '/admin/promotions'
  },
  {
    id: 'orders',
    label: 'Quản lý đơn hàng',
    icon: ShoppingCart,
    to: '/admin/orders'
  },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState('products');
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const activeItem = menuItems.find((item) => item.to === currentPath);
  const sectionName = activeItem?.label;

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`h-full flex flex-col bg-white text-slate-600 transition-all duration-300 border-r border-slate-200 z-50 flex-shrink-0 ${collapsed ? 'w-20' : 'w-64'
          }`}
      >
        {/* Logo and collapse button */}
        <div className="h-[72px] flex items-center justify-between px-4 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-800 leading-tight">Admin<span className="text-indigo-600">Dash</span></span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight tracking-wide">ECOMMERCE</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-5 px-3">
          <div className="mb-2">
            {!collapsed && (
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">
                Home
              </p>
            )}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
          </div>

          <div className="mt-4 space-y-1">
            {!collapsed && (
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2 mt-6">
                Utilities
              </p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 min-w-5" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-100 px-4 py-4 text-xs font-medium text-slate-400 flex items-center gap-2">
          {!collapsed && (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin System Active</span>
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header */}
        <header className="flex-none h-[72px] flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shadow-sm xl:px-8 z-40">
          {/* Breadcrumbs */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
              <span>Admin</span>
              <span className="text-slate-300">/</span>
              <span className="capitalize text-slate-800">{location.pathname.replace('/admin', '').replace('/', ' ') || 'Dashboard'}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 mt-0.5 tracking-tight">
              {location.pathname === '/admin' ? 'Overview Dashboard' : sectionName || 'Management'}
            </h1>
          </div>

          {/* Admin Profile Area */}
          <div className="flex items-center gap-5">

            {/* Profile Menu Dropdown (Mocked) */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex flex-col items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm group-hover:shadow-md transition-all">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {user?.username || user?.unique_name || 'Admin'}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {user?.role || 'Administrator'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

