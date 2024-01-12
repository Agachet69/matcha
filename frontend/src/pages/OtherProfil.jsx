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
  BoltIcon,
  EllipsisVerticalIcon,
  FemaleIcon,
  MaleIcon,
  ChatIcon,
} from "../components/icons/Icons";
import Relation from "../components/otherProfil/Relation";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/userSlice";
import Profil from "./Profil";

const OtherProfil = () => {
  const location = useLocation();
  const myUser = useSelector(selectUser);
  const navigate = useNavigate();
  const token = useSelector(getToken);
  const userSeen = location.state;
  // const mainModal = useSelector(selectModalMainPic);
  // const deleteBack = useSelector(selectModalPic);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [mainSeen, setMainSeen] = useState(null);
  // const [previewImg, setPreviewImg] = useState(null);
  const backPicRef = useRef();
  // const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (backPicRef.current)
      backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  useEffect(() => {
    setMainSeen(
      userSeen.photos.filter((photo) => photo.main === true)[0]?.path
    );
    console.log(userSeen);
  }, [userSeen]);

  async function nextPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX - 100);
  }

  function prevPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX + 100);
  }

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
                .map((photo, index) => {
                  return (
                    <div className="oneBackPic" key={photo.id}>
                      <img src={`http://localhost:8000/${photo.path}`} />
                      {index !== 0 && (
                        <div className="leftArrow" onClick={prevPhoto}>
                          <ArrowLeft />
                        </div>
                      )}
                      {index + 1 !== 4 && (
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
              <EllipsisVerticalIcon />
              <div className="ellipsMenuContent">
                <p> Report as fake account</p>
                <p> Block this user</p>
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
            {/* <div className="socialTitleSvg">
            <h4 className="pink"> 13 </h4>
            <Sparkless />
          </div> */}
            {/* <p>crush</p> */}
            <Relation userSeen={userSeen} />
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
                <label className="labelContainer"> Username</label>
                <div className="myTextInput">
                  <div className="currentValue">
                    <p>{userSeen.username}</p>
                  </div>
                </div>
              </div>
              <div className="inputContainer">
                <label className="labelContainer"> Orientation </label>
                <div className="myTextInput">
                  <div className="currentValue">
                    {((userSeen.sexuality.toLowerCase() === "heterosexual" &&
                      userSeen.gender === "MALE") ||
                      (userSeen.sexuality.toLowerCase() === "homosexual" &&
                        userSeen.gender === "FEMALE")) && (
                      <p> attracted to womens. </p>
                    )}
                    {((userSeen.sexuality.toLowerCase() === "heterosexual" &&
                      userSeen.gender === "FEMALE") ||
                      (userSeen.sexuality.toLowerCase() === "homosexual" &&
                        userSeen.gender === "MALE")) && (
                      <p> attracted to mens. </p>
                    )}
                    {userSeen.sexuality.toLowerCase() === "bisexual" && (
                      <p> attracted to both men and women. </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="inputContainer">
                <label className="labelContainer"> Intérêts </label>
                <div className="myTextInput">
                  <div className="currentValue">
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
                </div>
              </div>
            </form>
            <p> Pas de crush si pas de photo de profil.</p>
          </div>
        )}
      </div>
    );
};

export default OtherProfil;
