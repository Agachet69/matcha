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

const Profil = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  const mainModal = useSelector(selectModalMainPic);
  const deleteBack = useSelector(selectModalPic);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [myImgs, setMyImgs] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const backPicRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  useEffect(() => {
    console.log(user);
  }, [user]);

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
    dispatch(editDeletePic());
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
                    {index !== 0 && !deleteBack && (
                      <div className="leftArrow" onClick={prevPhoto}>
                        <ArrowLeft />
                      </div>
                    )}
                    {index + 1 !== 4 && !deleteBack && (
                      <div className="rightArrow" onClick={nextPhoto}>
                        <ArrowRight />
                      </div>
                    )}
                    {!deleteBack && (
                      <div className="buttonsImg">
                        <button onClick={() => dispatch(editDeletePic())}>
                          <Trash />
                        </button>
                      </div>
                    )}
                    {deleteBack && (
                      <div className="deleteBackPhoto">
                        <h3> Supprimer cette photo ?</h3>
                        <div className="choices">
                          <button
                            className="del"
                            onClick={() => deleteImg(photo.id)}
                          >
                            Supprimer
                          </button>
                          <button
                            className="cancel"
                            onClick={() => dispatch(editDeletePic())}
                          >
                            Annuler
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
                      <p> Ajouter une photo </p>
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
      <p> Qui à like ton profil </p>
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
          <p>totolo</p>
        </div>
        <div className="socialInfos">
        <div className="socialTitleSvg">
            <h4> 13 </h4>
            <Eye />
          </div>
          <p>vues</p>
        </div>
      </div>
      {!user && <div> Loader </div>}
      {user && <EditUser />}
      {mainModal && <DeleteMainPicModal />}
    </div>
  );
};

export default Profil;
