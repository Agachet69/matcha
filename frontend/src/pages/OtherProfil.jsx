import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../store/slices/authSlice";
import {
  addUserPhoto,
  deleteUserPhoto,
  selectUser,
} from "../store/slices/userSlice";
import "../styles/profil.scss";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Trash,
  Pic,
  Send,
  Stonks,
  Fire,
  Eye,
  Sparkless,
  UserIcon,
  AddImage,
  EmptyImgIcon,
  BoltIcon,
  UnBoltIcon,
  EllipsisVerticalIcon,
  FemaleIcon,
  MaleIcon,
} from "../components/icons/Icons";
import axios from "axios";
import { MainPic } from "../components/MainPic";
import { ValidImg } from "../utils/ValidImg";
import {
  editDeletePic,
  selectModalMainPic,
  selectModalPic,
} from "../store/slices/modalSlice";
import { DeleteMainPicModal } from "../components/Modals";
import EditUser from "../components/profil/EditUser";
import Relation from "../components/otherProfil/Relation";

const OtherProfil = () => {
  const location = useLocation();

  const token = useSelector(getToken);
  const [userSeen, setUserSeen] = useState(location.state);
  // const mainModal = useSelector(selectModalMainPic);
  // const deleteBack = useSelector(selectModalPic);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [mainSeen, setMainSeen] = useState(null);
  // const [previewImg, setPreviewImg] = useState(null);
  const backPicRef = useRef();
  // const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
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
        {mainSeen && (
          <div className="iconCrush">
            <BoltIcon />
            {/* <UnBoltIcon/> */}
          </div>
        )}
        <div className="otherProfilMore">
          <EllipsisVerticalIcon />
          <p> Report as fake account</p>
          <p> Block this user</p>
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
          <div className="socialTitleSvg">
            <h4 className="pink"> 13 </h4>
            <Sparkless />
          </div>
          <p>crush</p>
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
                  <p>{userSeen.sexuality.toLowerCase()}</p>
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
      <Relation userSeen={userSeen}/>
    </div>
  );
};

export default OtherProfil;
