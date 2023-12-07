import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getToken, selectAuth } from '../store/slices/authSlice';
import axios from 'axios';
import { useEffect } from 'react';

export const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const authLogin = false /* some auth state provider */;
  const token = useSelector(getToken);
  const navigate = useNavigate()


  useEffect(() => {
    if (token)
    axios.get("http://localhost:8000/users/me", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
    }).then(({data}) => {
      // TODO: stock this user in a persitant reducer, to avoid non-necesary call to the back 
      const my_user = data


    }).catch((error) => {
      // console.log(error)
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