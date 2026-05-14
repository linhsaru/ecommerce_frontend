import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AdminLayout from '../../components/layouts/AdminLayout';

const UserManagementPage = lazy(
  () => import('../../pages/admins/users/UserManagementPage')
);
const DashboardPage = lazy(
  () => import('../../pages/admins/dashboards/DashboardPage')
);
const ProductManagementPage = lazy(
  () => import('../../pages/admins/products/ProductManagementPage')
);
const InventoryManagementPage = lazy(
  () => import('../../pages/admins/inventory/InventoryManagementPage')
);
const PromotionsPage = lazy(
  () => import('../../pages/admins/promotions/PromotionsPage')
);
const OrdersManagementPage = lazy(
  () => import('../../pages/admins/orders/OrdersManagementPage')
);
const CategoryManagementPage = lazy(
  () => import('../../pages/admins/products/CategoryManagementPage')
);

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // NOTE: You can also check for user?.role here to prevent non-admins 
  // from accessing the admin route, for example:
  // if (user?.role !== 'RoleAdmin') return <Navigate to="/" replace />
  
  return <AdminLayout>{children}</AdminLayout>;
};

const privateRoutes = [
  {
    path: 'admin',
    element: <DashboardPage />,
    access: ['RoleAdmin'],
  },
  {
    path: 'admin/users',
    element: <UserManagementPage />,
    access: ['RoleAdmin', 'RoleUser'],
  },
  {
    path: 'admin/categories',
    element: <CategoryManagementPage />,
    access: ['RoleAdmin'],
  },
  {
    path: 'admin/products',
    element: <ProductManagementPage />,
    access: ['RoleAdmin'],
  },
  {
    path: 'admin/inventory',
    element: <InventoryManagementPage />,
    access: ['RoleAdmin'],
  },
  {
    path: 'admin/promotions',
    element: <PromotionsPage />,
    access: ['RoleAdmin'],
  },
  {
    path: 'admin/orders',
    element: <OrdersManagementPage />,
    access: ['RoleAdmin'],
  },
];

export default privateRoutes;
