import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getToken } from "../store/slices/authSlice";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import Snackbar from "@mui/material/Snackbar";
import SnackBarsManager from "./SnackBarsManager";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const PrivateRoutes = ({ children }) => {
  const [pos, setPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const location = useLocation();
  const authLogin = false; /* some auth state provider */
  const token = useSelector(getToken);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPos({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          axios.get("https://ipapi.co/json/").then(({ data }) => {
            setPos({
              latitude: data.latitude,
              longitude: data.longitude,
            });
          });
        }
      );
    } else {
      axios.get("https://ipapi.co/json/").then(({ data }) => {
        setPos({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (user && pos.latitude) {
      const newSocket = io("http://localhost:8000", {
        path: "/ws/socket.io/",
        transports: ["websocket", "polling"],
        auth: { user_id: user.id, localisation: pos },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, pos]);

  useEffect(() => {
    if (token)
      axios
        .get("http://localhost:8000/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        .then(({ data }) => {
          dispatch(initialiseUser(data));
        })
        .catch((error) => {
          navigate("/login");
        });
  }, [token]);

  if (!token)
    return <Navigate to="/login" replace state={{ from: location }} />;
  if (!socket || !user) return <></>;
  console.log(user.email_check)
  if (!user.email_check)
    return <Navigate to="/verify_email" replace state={{ from: location }} />;
  return (
    <SocketContext.Provider value={socket}>
      {children}
      <SnackBarsManager />
    </SocketContext.Provider>
  );
};
