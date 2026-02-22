/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import publicRoutes from './PublicRoutes';
import privateRoutes from './PrivateRoutes';

const PrivateRoute = lazy(() => import('../../components/routes/PrivateRoute'));
const NotFoundPage = lazy(() => import('../../pages/errors/NotFoundPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="w-10 h-10 mx-auto mb-3 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-body-sm text-neutral-500">Loading...</p>
    </div>
  </div>
);

const userRoles = 'USER';

const checkAccess = (userRoles, routeRoles) => {
  if (!routeRoles || routeRoles.length === 0) {
    return true;
  }
  return routeRoles.some((role) => userRoles.includes(role));
};

const wrapWithSuspense = (routes) => {
  return routes.map((route) => {
    const wrappedRoute = { ...route };

    if (route.element) {
      wrappedRoute.element = (
        <Suspense fallback={<LoadingFallback />}>
          {route.element}
        </Suspense>
      );
    }

    if (route.children) {
      wrappedRoute.children = route.children.map((child) => ({
        ...child,
        element: child.element ? (
          <Suspense fallback={<LoadingFallback />}>
            {child.element}
          </Suspense>
        ) : child.element,
      }));
    }

    return wrappedRoute;
  });
};

const router = createBrowserRouter(
  [
    ...wrapWithSuspense(publicRoutes),
    ...privateRoutes.map((route) => ({
      ...route,
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <PrivateRoute isAuthenticated={true}>
            {route.element}
          </PrivateRoute>
        </Suspense>
      ),
    })),
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
    },
  }
);

export default router;
