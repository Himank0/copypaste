import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTE_PATHS } from './paths';

/**
 * Route guard: renders the nested route via <Outlet> when authenticated,
 * otherwise redirects to Login. Wrap protected <Route> elements with this
 * component rather than re-implementing the auth check per feature
 * (Constitution §13).
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
