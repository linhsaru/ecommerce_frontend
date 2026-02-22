/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
const UserManagementPage = lazy(
  () => import('../../pages/admins/users/UserManagementPage')
);
const DashboardPage = lazy(
  () => import('../../pages/admins/dashboards/DashboardPage')
);

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
