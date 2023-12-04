import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const PrivateRoutes = () => {
  const location = useLocation();
  const authLogin = false /* some auth state provider */;

  if (authLogin === undefined) {
    return null; // or loading indicator/spinner/etc
  }

  return authLogin
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}