import { useDispatch, useSelector } from "react-redux";
import "../styles/header.scss";
import { Logout, UserIcon } from "./icons/Icons";
import { setToken } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../store/slices/userSlice";
import { useEffect, useState } from "react";

const Header = ({ children, connected = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [profilPic, setProfilPic] = useState(null);

  useEffect(() => {
    setProfilPic(user.photos.filter((photo) => photo.main === true)[0])
  }, [user])

  return (
    <div className="container">
      <div className="header">
        <div className="logo">Matcha ❤</div>

        {connected && (
          <div className="other">
            <div className="me">
              <div className="image">
                {
                  profilPic ?
                  <img src={`http://localhost:8000/${profilPic.path}`} />
                  :
                  <UserIcon />
                }
              </div>
              <div className="name">{user.username}</div>
            </div>

            <div className="limiter" />
            <div
              className="logout"
              onClick={() => {
                dispatch(setToken(null));
                navigate("/login");
              }}
            >
              <Logout />
            </div>
          </div>
        )}
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default Header;
