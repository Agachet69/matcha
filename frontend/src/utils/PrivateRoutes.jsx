import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../store/slices/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { initialiseUser, selectUser } from '../store/slices/userSlice';

export const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const authLogin = false /* some auth state provider */;
  const token = useSelector(getToken);
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log(token);
    if (token)
    axios.get("http://localhost:8000/users/me", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
    }).then(({data}) => {
      dispatch(initialiseUser(data));
    }).catch(() => {
      navigate("/login")
    })
  }, [])

  // if (authLogin === undefined) {
  //   return null; // or loading indicator/spinner/etc
  // }

  return token
    ? <>{children}</>
    : <Navigate to="/login" replace state={{ from: location }} />;
}