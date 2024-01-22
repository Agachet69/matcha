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
  Fire,
  Eye,
  Sparkless,
  CheckBadgeIcon,
} from "../components/icons/Icons";
import axios from "axios";
import { MainPic } from "../components/MainPic";
import { ValidImg } from "../utils/ValidImg";
import {
  editDeletePic,
  editLikedUser,
  editMatch,
  editViewUser,
  selectAllModals,
  // selectModalMainPic,
  // selectModalPic,
} from "../store/slices/modalSlice";
// import Modals from "../components/Modals";
import EditUser from "../components/profil/EditUser";

const Profil = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  // const mainModal = useSelector(selectModalMainPic);
  const deleteBack = useSelector(selectAllModals);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [myImgs, setMyImgs] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const backPicRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user);
  }, []);

  useEffect(() => {
    backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  async function nextPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX - 100);
  }

  function prevPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX + 100);
  }

  async function sendImages() {
    const formData = new FormData();
    if (1 + user.photos.length > 5) {
      console.log("trop de photos");
      return;
    }

    if (!ValidImg(myImgs)) return;

    formData.append(`image`, myImgs);
    try {
      const res = await axios.post("http://localhost:8000/photo", formData, {
        headers: {
          Authorization: "Bearer " + (token ? token.access_token : ""),
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(addUserPhoto(res.data));
      setMyImgs(null);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteImg(id) {
    const res = await axios.delete("http://localhost:8000/photo/" + id, {
      headers: {
        Authorization: "Bearer " + (token ? token.access_token : ""),
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(deleteUserPhoto(res.data.id));
    dispatch(editDeletePic(deleteBack.deletePic));
    setTranslateXValue(0);
  }

  function myAddingImg(e) {
    e.preventDefault();
    if (!ValidImg(e.target.files[0])) return;
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setMyImgs(file);
      setPreviewImg(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const nbBackPhotos = () => {
    return user.photos.filter((photo) => photo.main === false).length;
  };

  return (
    <div className="ProfilContainer">
      <div className="topContainer">
        <div className="topContent">
          <div className="backPic" ref={backPicRef}>
            {user.photos
              .filter((photo) => photo.main === false)
              .map((photo, index) => {
                return (
                  <div className="oneBackPic" key={photo.id}>
                    <img src={`http://localhost:8000/${photo.path}`} />
                    {index !== 0 && !deleteBack.deletePic && (
                      <div className="leftArrow" onClick={prevPhoto}>
                        <ArrowLeft />
                      </div>
                    )}
                    {index + 1 !== 4 && !deleteBack.deletePic && (
                      <div className="rightArrow" onClick={nextPhoto}>
                        <ArrowRight />
                      </div>
                    )}
                    {!deleteBack.deletePic && (
                      <div className="buttonsImg">
                        <button
                          onClick={() =>
                            dispatch(editDeletePic(deleteBack.deletePic))
                          }
                        >
                          <Trash />
                        </button>
                      </div>
                    )}
                    {deleteBack.deletePic && (
                      <div className="deleteBackPhoto">
                        <h3> Delete this photo?</h3>
                        <div className="choices">
                          <button
                            className="del"
                            onClick={() => deleteImg(photo.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="cancel"
                            onClick={() =>
                              dispatch(editDeletePic(deleteBack.deletePic))
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {nbBackPhotos() < 4 && (
              <div className="oneBackPic">
                {!myImgs && (
                  <div className="addImg">
                    <label htmlFor="pict" className="iconAddImg">
                      <Pic />
                    </label>
                    <input
                      type="file"
                      id="pict"
                      accept="image/*"
                      onChange={myAddingImg}
                    />
                    <label htmlFor="pict" className="addImgTxt">
                      <p> Add a photo </p>
                      <p className="numberImg">{nbBackPhotos()} / 4</p>
                    </label>
                  </div>
                )}
                {myImgs && (
                  <div className="previewPic">
                    <img src={previewImg} alt="preview de l'image" />
                    <button onClick={sendImages}>
                      Envoyer
                      <Send />
                    </button>
                  </div>
                )}
                {nbBackPhotos() !== 0 && (
                  <div className="leftArrow" onClick={prevPhoto}>
                    <ArrowLeft />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <section>
          <MainPic />
        </section>
      </div>
      <h3 className="titleProfil">
        {" "}
        {user.firstName} {user.lastName}{" "}
      </h3>
      <p> Qui à vue ton profil </p>
      {/* <Fire /> */}
      <p>Fame-rate {user.fame_rate} </p>
      <p> Modifier sa position </p>
      <div className="socialInfosContainer">
        <div
          className="socialInfos borderR"
          onClick={() => dispatch(editMatch(deleteBack.match))}
        >
          <div className="socialTitleSvg">
            <h4> {user.matches.length} </h4>
            <CheckBadgeIcon />
          </div>
          <p>match</p>
        </div>
        <div
          className="socialInfos borderR"
          onClick={() => dispatch(editLikedUser(deleteBack.likedUser))}
        >
          <div className="socialTitleSvg">
            <h4 className="pink"> {user.liked_by.length} </h4>
            <Sparkless />
          </div>
          <p>crush</p>
        </div>
        <div
          className="socialInfos"
          onClick={() => dispatch(editViewUser(deleteBack.viewUser))}
        >
          <div className="socialTitleSvg">
            <h4> 13 </h4>
            <Eye />
          </div>
          <p>views</p>
        </div>
      </div>
      {!user && <div> Loader </div>}
      {user && <EditUser />}
    </div>
  );
};

export default Profil;
