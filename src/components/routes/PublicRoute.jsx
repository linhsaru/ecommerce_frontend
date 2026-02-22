import { Navigate } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
