import { Tooltip } from "@mui/material";
import GenderEnum from "../Enum/GenderEnum";
import { ChatIcon, Fire, HeartIcon, NoSymbol, Sparkless } from "./icons/Icons";
import "../styles/userCard.scss";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const UserCard = ({
  user,
  me,
  onLikeUser,
  selector = false,
  onBlockUser = undefined,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  function navigateChat() {
    if (location.pathname.startsWith("/chat")) navigate(`/chat/${user.id}`);
  }

  function navigateProfilSee() {
    if (!location.pathname.startsWith("/chat"))
      navigate(`/profil/see`, { state: user });
  }

  const isLiked = () => {
    return me.likes.find((like) => like.user_target_id == user.id);
  };

  const isMatched = () => {
    return me.matches.find(
      (match) => match.user_A_id == user.id || match.user_B_id == user.id
    );
  };

  return (
    <div
      className={
        user.gender == GenderEnum.MALE
          ? "user-card-item male"
          : "user-card-item female"
      }
      // onWheel={(e) => {
      //   console.log('ok');
      //   e.currentTarget.scrollLeft += e.deltaY;
      // }}
      onClick={navigateChat}
    >
      {user && user.photos ? (
        <div className="mainContentCard">
          <div className="leftContent" onClick={navigateProfilSee}>
            <div
              className={
                user.status === "ONLINE" ? "image online" : "image offline"
              }
            >
              <img
                src={
                  user.photos.find((photo) => photo.main)
                    ? `http://localhost:8000/${
                        user.photos.find((photo) => photo.main).path
                      }`
                    : null
                }
                alt=""
              />
            </div>
            <Tooltip title="Username">
              <div className="name">{user.username}</div>
            </Tooltip>
            <div className="limiter" />
            <Tooltip title="age">
              <div className="info">
                <p>{user.age}y</p>
              </div>
            </Tooltip>
            <div className="limiter" />
            <div className="info">
              <Tooltip title="Fame rating">
                <div className="icon">
                  <Fire />
                  <p> {user.fame_rate} </p>
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="rightContent">
            {!selector && (
              <div className="actions">
                {me.matches.find(
                  (match) =>
                    match.user_A_id == user.id || match.user_B_id == user.id
                ) != undefined && (
                  <Tooltip title="Chat">
                    <div
                      className="chat"
                      onClick={() => {
                        navigate(`/chat/${user.id}`);
                      }}
                    >
                      <ChatIcon />
                    </div>
                  </Tooltip>
                )}
                <Tooltip
                  title={
                    isLiked() ? "Un-like" : isMatched() ? "Un-match" : "Like"
                  }
                >
                  <div
                    className={
                      isLiked() ? "like" : isMatched() ? "unMatch" : "unLike"
                    }
                    onClick={() => onLikeUser(user.id)}
                  >
                    <HeartIcon />
                  </div>
                </Tooltip>
                {onBlockUser && (
                  <Tooltip title={"Block"}>
                    <div className="block" onClick={() => onBlockUser(user)}>
                      <NoSymbol />
                    </div>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div> null user</div>
      )}
    </div>
  );
};

export default UserCard;
