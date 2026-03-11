/* eslint-disable react-refresh/only-export-components */
import { useContext, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { NavigationContext } from '../context/NavigationContext';
import MainLayout from '../../components/layouts/MainLayout';

const UserManagementPage = lazy(
  () => import('../../pages/admins/users/UserManagementPage')
);
const DashboardPage = lazy(
  () => import('../../pages/admins/dashboards/DashboardPage')
);

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(NavigationContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <MainLayout>{children}</MainLayout>;
};

const privateRoutes = [
  {
    path: 'app',
    element: <DashboardPage />,
    access: ['ADMIN'],
  },
  {
    path: 'users',
    element: <UserManagementPage />,
    access: ['ADMIN', 'USER'],
  },
];

export default privateRoutes;
