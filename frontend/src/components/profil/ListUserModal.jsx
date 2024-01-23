import { useNavigate } from "react-router-dom";
import { ChatIcon, FemaleIcon, MaleIcon } from "../icons/Icons";

const ListUserModal = ({ user, type = null }) => {
  const navigate = useNavigate();

  const mainPic = (currentUser) => {
    if (currentUser) {
      const res = currentUser.photos.find((photo) => photo.main === true);
      if (res) return res.path;
      return null;
    }
    return null;
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
        <p>{user.firstName}</p>
        <p>{user.lastName}</p>
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
      </div>
    </div>
  );
};

export default ListUserModal;
