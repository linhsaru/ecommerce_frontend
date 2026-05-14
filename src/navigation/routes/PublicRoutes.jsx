/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';
import BuildPCPage from '../../pages/clients/BuildPCPage';

const HomePage = lazy(() => import('../../pages/clients/HomePage'));
const ProductListingPage = lazy(() => import('../../pages/clients/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../../pages/clients/ProductDetailPage'));
const CartPage = lazy(() => import('../../pages/clients/CartPage'));
const CheckoutPage = lazy(() => import('../../pages/clients/CheckoutPage'));
const WishlistPage = lazy(() => import('../../pages/clients/WishlistPage'));
const AccountPage = lazy(() => import('../../pages/clients/AccountPage'));
const VNPayReturnPage = lazy(() => import('../../pages/clients/VNPayReturnPage'));
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/auth/RegisterPage'));
const AboutPage = lazy(() => import('../../pages/clients/About'));
const OrderLookupPage = lazy(() => import('../../pages/clients/OrderLookupPage'));
const QuotationPrint = lazy(() => import('../../pages/clients/QuotationPrint'));

export const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/app" /> : children;
};

const publicRoutes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/products',
        element: <ProductListingPage />,
      },
      {
        path: '/products/:slug',
        element: <ProductDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/payments/vnpay/return',
        element: <VNPayReturnPage />,
      },
      {
        path: '/wishlist',
        element: <WishlistPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/account/:tab',
        element: <AccountPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/build-pc',
        element: <BuildPCPage />
      },
      {
        path: '/quotation',
        element: <QuotationPrint />
      },
      {
        path: '/order-lookup',
        element: <OrderLookupPage />
      },
      {
        path: '/order-lookup/:orderNo',
        element: <OrderLookupPage />
      }
    ],
  },
];

export default publicRoutes;
