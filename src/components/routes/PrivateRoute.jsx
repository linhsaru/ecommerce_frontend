import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { NavigationContext } from '../../navigation/context/NavigationContext';
import MainLayout from '../layouts/MainLayout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(NavigationContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return <MainLayout>{children}</MainLayout>;
  }
};

export default PrivateRoute;
