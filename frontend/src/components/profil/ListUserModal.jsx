import { useNavigate } from "react-router-dom";
import { ChatIcon, FemaleIcon, MaleIcon } from "../icons/Icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../store/slices/authSlice";
import { getAuthorizedInstance } from "../../utils/Instance";
import { initialiseUser } from "../../store/slices/userSlice";

const ListUserModal = ({ user, type = null }) => {
  const navigate = useNavigate();
  const token = useSelector(getToken);
  const instance = getAuthorizedInstance(token.access_token);
  const dispatch = useDispatch();

  const mainPic = (currentUser) => {
    if (currentUser) {
      const res = currentUser.photos.find((photo) => photo.main === true);
      if (res) return res.path;
      return null;
    }
    return null;
  };

  const onBlockUser = () => {
    instance.post(`/users/block/${user.id}`).then(({ data }) => {
      dispatch(initialiseUser(data));
    });
  };

  return (
    <div
      className="userLiked"
      onClick={() =>
        type === null
          ? navigate("/profil/see", {
              state: user,
            })
          : null
      }
    >
      <div
        className="leftContent"
        onClick={() =>
          type !== null
            ? navigate("/profil/see", {
                state: user,
              })
            : null
        }
      >
        <div className="profilPic">
          {mainPic(user) && (
            <img
              src={`http://localhost:8000/${mainPic(user)}`}
              alt="photo de profil"
            />
          )}
        </div>
        <p>{user.username}</p>
        <p>{user.age}y</p>
      </div>
      <div className="rightContent">
        {user.gender === "FEMALE" ? <FemaleIcon /> : <MaleIcon />}
        {type === "modal" ? (
          <div
            onClick={() => navigate("/chat/" + user.id)}
            className="chatIcon"
          >
            <ChatIcon />
          </div>
        ) : null}
        {type === "block" ? (
          <div onClick={onBlockUser} className="unblock">
            unblock
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ListUserModal;
