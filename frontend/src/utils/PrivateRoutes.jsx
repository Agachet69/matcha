import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getToken, selectAuth } from '../store/slices/authSlice';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { initialiseUser, selectUser } from '../store/slices/userSlice';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const PrivateRoutes = ({ children }) => {
  const location = useLocation();
  const authLogin = false /* some auth state provider */;
  const token = useSelector(getToken);
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch()
  const user = useSelector(selectUser);


  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:8000", { path: "/ws/socket.io/", transports: ['websocket', 'polling'], auth: { user_id: user.id } })
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  

  useEffect(() => {
    if (token)
    axios.get("http://localhost:8000/users/me", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
    }).then(({data}) => {
      dispatch(initialiseUser(data));
      // TODO: stock this user in a persitant reducer, to avoid non-necesary call to the back 
    }).catch((error) => {
      navigate("/login")
    })
  }, [])

  // if (authLogin === undefined) {
  //   return null; // or loading indicator/spinner/etc
  // }

  return token
    ? <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
    : <Navigate to="/login" replace state={{ from: location }} />;
}