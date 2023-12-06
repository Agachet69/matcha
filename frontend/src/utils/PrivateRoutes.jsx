import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectAuth } from '../store/slices/authSlice';

export const PrivateRoutes = () => {
  const location = useLocation();
  const authLogin = false /* some auth state provider */;
  const isAuth = useSelector(selectAuth);

  // if (authLogin === undefined) {
  //   return null; // or loading indicator/spinner/etc
  // }

  return isAuth
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}