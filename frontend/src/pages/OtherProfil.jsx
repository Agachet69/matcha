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
} from "../components/icons/Icons";
import Relation from "../components/otherProfil/Relation";
import { useDispatch, useSelector } from "react-redux";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import Profil from "./Profil";
import { getAuthorizedInstance } from "../utils/Instance";

const OtherProfil = () => {
  const location = useLocation();
  const myUser = useSelector(selectUser);
  const navigate = useNavigate();
  const token = useSelector(getToken);
  const userSeen = location.state;
  const [seenMenuEllips, setSeenMenuEllips] = useState(false);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [mainSeen, setMainSeen] = useState(null);
  const backPicRef = useRef();
  const dispatch = useDispatch();
  const instance = getAuthorizedInstance(token.access_token)

  useEffect(() => {
    if (backPicRef.current)
      backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  useEffect(() => {
    if (userSeen)
      setMainSeen(
        userSeen.photos.filter((photo) => photo.main === true)[0]?.path
      );
    // else navigate("/");

    console.log(userSeen);
  }, [userSeen, navigate]);

  const onBlockUser = () => {
    instance
      .post(
        `/users/block/${userSeen.id}`,
      )
      .then(({ data }) => {
        dispatch(initialiseUser(data));
        console.log('bloqué');
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
    const display = `${res[0]}${res[1]} ${getMonth(res[3] + res[4])} à ${
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

  if (!userSeen) return <div> Compte inconnu </div>;
  if (userSeen.id === myUser.id)
    return (
      <div>
        <Profil />
      </div>
    );
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
                      <p> Cet utilisateur n&apos;a pas encore de photos </p>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <section>
            {mainSeen ? (
              <div className="actualPic">
                <img src={`http://localhost:8000/${mainSeen}`} />
                {userSeen.status === "OFFLINE" ? (
                  <div className="statusUser offline"></div>
                ) : (
                  <div className="statusUser online"></div>
                )}
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
              <div onClick={() => setSeenMenuEllips((prevState) => !prevState)}>
                <EllipsisVerticalIcon />
              </div>
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
          {/* <p> Crushed on...</p> */}
        </div>
        <p className="otherProfilBio"> {userSeen.bio} </p>
        <div className="socialInfosContainer">
          <div className="socialInfos borderR">
            <div className="socialTitleSvg">
              <h4> 13 </h4>
              <Fire />
            </div>
            <p>fame rating</p>
          </div>
          <div className="socialInfos borderR">
            {mainSeen ? (
              <Relation userSeen={userSeen} />
            ) : (
              <p> Cet utilisateur n&apos;a pas de photo de profil</p>
            )}
          </div>
          <div className="socialInfos">
            <div className="socialTitleSvg">
              <h4> 13 </h4>
              <Eye />
            </div>
            <p>vues</p>
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
              <div className="inputContainer">
                {userSeen.tags.length > 0 ? (
                  userSeen.tags.map((tag, index) => (
                    <p key={index} className="tagName">
                      {" "}
                      {tag.tag.toLowerCase()}{" "}
                    </p>
                  ))
                ) : (
                  <p> Pas d&apos;interêts enregistré.</p>
                )}
              </div>
              {userSeen.status === "OFFLINE" ? (
                <p> Dernière connexion le {lastConnexion()}.</p>
              ) : (
                <p>En ligne.</p>
              )}
            </form>
          </div>
        )}
      </div>
    );
};

export default OtherProfil;
