/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import MainLayout from '../../components/layouts/MainLayout';

const HomePage = lazy(() => import('../../pages/clients/HomePage'));
const ProductListingPage = lazy(() => import('../../pages/clients/ProductListingPage'));
const ProductDetailPage = lazy(() => import('../../pages/clients/ProductDetailPage'));
const CartPage = lazy(() => import('../../pages/clients/CartPage'));
const CheckoutPage = lazy(() => import('../../pages/clients/CheckoutPage'));
const WishlistPage = lazy(() => import('../../pages/clients/WishlistPage'));
const AccountPage = lazy(() => import('../../pages/clients/AccountPage'));
const LoginPage = lazy(() => import('../../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/auth/RegisterPage'));

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
    ],
  },
];

export default publicRoutes;
