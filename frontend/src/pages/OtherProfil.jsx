import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getToken } from "../store/slices/authSlice";
import "../styles/profil.scss";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Fire,
  Eye,
  UserIcon,
  EmptyImgIcon,
  EllipsisVerticalIcon,
  FemaleIcon,
  MaleIcon,
  ChatIcon,
  HeartIcon,
} from "../components/icons/Icons";
import Relation from "../components/otherProfil/Relation";
import { useDispatch, useSelector } from "react-redux";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import Profil from "./Profil";
import { getAuthorizedInstance } from "../utils/Instance";
import { useSocket } from "../utils/PrivateRoutes";

const OtherProfil = () => {
  const location = useLocation();
  const myUser = useSelector(selectUser);
  const navigate = useNavigate();
  const token = useSelector(getToken);
  const locationState = location.state;
  const [userSeen, setUserSeen] = useState(null);
  const [seenMenuEllips, setSeenMenuEllips] = useState(false);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [mainSeen, setMainSeen] = useState(null);
  const backPicRef = useRef();
  const instance = getAuthorizedInstance(token.access_token);
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    instance
      .get(`users/${locationState.id}`)
      .then(({ data }) => setUserSeen(data));
  }, []);

  const onUpdateStatus = ({ user_id, status }) => {
    if (user_id == userSeen.id)
      instance
        .get(`users/${locationState.id}`)
        .then(({ data }) => setUserSeen(data));
  };

  useEffect(() => {
    if (socket) socket.on("update-status", onUpdateStatus);

    return () => {
      if (socket) socket.off("update-status", onUpdateStatus);
    };
  }, [socket]);

  useEffect(() => {
    if (backPicRef.current)
      backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  useEffect(() => {
    instance.post(`/users/see/${locationState.id}`);
  }, []);

  useEffect(() => {
    if (userSeen)
      setMainSeen(
        userSeen.photos.filter((photo) => photo.main === true)[0]
      );
    console.log(userSeen);
  }, [userSeen, navigate]);

  const onBlockUser = () => {
    instance.post(`/users/block/${userSeen.id}`).then(({ data }) => {
      dispatch(initialiseUser(data));
      console.log("bloqué");
    });
  };

  function nextPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX - 100);
  }

  function prevPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX + 100);
  }

  function getMonth(number) {
    var date = new Date(2000, number - 1, 1);
    var nomMois = date.toLocaleString("fr-FR", { month: "long" });
    return nomMois;
  }

  const onLikePhoto = (id) => {
    instance
      .post(`/users/like_photo/${id}`)
      .then(({ data }) => dispatch(initialiseUser(data)));
  };

  const lastConnexion = () => {
    const date = new Date(userSeen.last_connection_date);
    const options = {
      // year: 'numeric',
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      // second: 'numeric',
      // timeZoneName: 'short'
    };
    const formatter = new Intl.DateTimeFormat("fr-FR", options);
    const res = formatter.format(date).split("");
    const display = `${res[0]}${res[1]} ${getMonth(res[3] + res[4])} at ${
      res[6]
    }${res[7]}h${res[9]}${res[10]}`;
    return display;
  };

  const isMatched = () => {
    if (
      myUser.matches.filter((match) => {
        if (
          (match.user_A_id === myUser.id || match.user_A_id === userSeen.id) &&
          (match.user_B_id === myUser.id || match.user_B_id === userSeen.id)
        )
          return match;
      }).length > 0
    )
      return true;
    return false;
  };

  if (!locationState) return <div> Compte inconnu </div>;
  if (!userSeen) return <></>;
  if (locationState.id === myUser.id)
    return (
      <div>
        <Profil />
      </div>
    );
  // return (<></>)
  else
    return (
      <div className="ProfilContainer">
        <div className="topContainer">
          <div className="topContent">
            <div className="backPic" ref={backPicRef}>
              {userSeen.photos
                .filter((photo) => photo.main === false)
                .map((photo, index, array) => {
                  return (
                    <div className="oneBackPic" key={photo.id}>
                      <img src={`http://localhost:8000/${photo.path}`} />
                      {index !== 0 && (
                        <div className="leftArrow" onClick={prevPhoto}>
                          <ArrowLeft />
                        </div>
                      )}
                      {index + 1 !== 4 && index + 1 < array.length && (
                        <div className="rightArrow" onClick={nextPhoto}>
                          <ArrowRight />
                        </div>
                      )}
                      <div
                        className={
                          "likePhoto " +
                          (myUser.like_photos.find(
                            (like) => like.photo_id == photo.id
                          )
                            ? "liked"
                            : "")
                        }
                        onClick={() => {
                          onLikePhoto(photo.id);
                        }}
                      >
                        <HeartIcon />
                      </div>
                    </div>
                  );
                })}
              {userSeen.photos.filter((photo) => photo.main === false).length <=
                0 && (
                <div className="oneBackPic">
                  <div className="addImg">
                    <label htmlFor="pict" className="iconAddImg">
                      <EmptyImgIcon />
                    </label>
                    <label htmlFor="pict" className="addImgTxt">
                      <p> This user has no photos yet </p>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <section>
            {mainSeen ? (
              <div className="actualPic">
                <img src={`http://localhost:8000/${mainSeen.path}`} />
                {userSeen.status === "OFFLINE" ? (
                  <div className="statusUser offline"></div>
                ) : (
                  <div className="statusUser online"></div>
                )}
                <div
                  className={
                    "likePhoto " +
                    (myUser.like_photos.find(
                      (like) => like.photo_id == mainSeen.id
                    )
                      ? "liked"
                      : "")
                  }
                  onClick={() => {
                    onLikePhoto(mainSeen.id);
                  }}
                >
                  <HeartIcon />
                </div>
              </div>
            ) : (
              <div className="defaultPic">
                <UserIcon className="userIcon" />
                {userSeen.status === "OFFLINE" ? (
                  <div className="statusUser offline"></div>
                ) : (
                  <div className="statusUser online"></div>
                )}
              </div>
            )}
          </section>
        </div>
        <div className="otherProfilTitlesInfos">
          {userSeen.gender === "FEMALE" ? <FemaleIcon /> : <MaleIcon />}{" "}
          <h3 className="titleProfil">
            {userSeen.firstName} {userSeen.lastName}, {userSeen.age}y
          </h3>
          {isMatched() && (
            <div
              className="iconChat"
              onClick={() => navigate(`/chat/${userSeen.id}`)}
            >
              <ChatIcon />
            </div>
          )}
          <div className="otherProfilMore">
            <div className="ellipsMenu">
              <button
                onClick={() => setSeenMenuEllips((prevState) => !prevState)}
              >
                <EllipsisVerticalIcon />
              </button>
              <div
                className={
                  seenMenuEllips
                    ? "ellipsMenuContent active"
                    : "ellipsMenuContent inactive"
                }
              >
                <p> Report as fake account</p>
                <p onClick={onBlockUser}> Block this user</p>
              </div>
            </div>
          </div>
        </div>
        <p className="otherProfilBio"> {userSeen.bio} </p>
        <div className="socialInfosContainer">
          <div className="socialInfos borderR">
            <div className="socialTitleSvg">
              <h4> {userSeen.fame_rate} </h4>
              <Fire />
            </div>
            <p>fame rating</p>
          </div>
          <div className="socialInfos borderR">
            {mainSeen ? (
              <Relation userSeen={userSeen} />
            ) : (
              <p> This user has no profile picture </p>
            )}
          </div>
          <div className="socialInfos">
            <div className="socialTitleSvg">
              <h4> {userSeen.profile_seen_by.length} </h4>
              <Eye />
            </div>
            <p>views</p>
          </div>
        </div>
        {!userSeen && <div> Loader </div>}
        {userSeen && (
          <div className="editUserContainer">
            <h3> Profil</h3>
            <form>
              <div className="inputContainer">
                <p>{userSeen.username}, </p>
              </div>
              <div className="inputContainer">
                {((userSeen.sexuality.toLowerCase() === "heterosexual" &&
                  userSeen.gender === "MALE") ||
                  (userSeen.sexuality.toLowerCase() === "homosexual" &&
                    userSeen.gender === "FEMALE")) && (
                  <p> attracted to womens. </p>
                )}
                {((userSeen.sexuality.toLowerCase() === "heterosexual" &&
                  userSeen.gender === "FEMALE") ||
                  (userSeen.sexuality.toLowerCase() === "homosexual" &&
                    userSeen.gender === "MALE")) && <p> attracted to mens. </p>}
                {userSeen.sexuality.toLowerCase() === "bisexual" && (
                  <p> attracted to both men and women. </p>
                )}
              </div>
              <div className="tagsListContainer">
                {userSeen.tags.length > 0 ? (
                  userSeen.tags.map((tag, index) => (
                    <p key={index} className="tagName">
                      {" "}
                      {tag.tag.toLowerCase()}{" "}
                    </p>
                  ))
                ) : (
                  <p> No registered interest.</p>
                )}
              </div>
              {userSeen.status === "OFFLINE" ? (
                <p> Last connection on {lastConnexion()}.</p>
              ) : (
                <p>Online.</p>
              )}
            </form>
          </div>
        )}
      </div>
    );
};

export default OtherProfil;
