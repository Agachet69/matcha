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
  Cancel,
  Confirm,
  Edit,
  Trash,
  Pic,
  Send,
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
  const [formUser, setFormUser] = useState(user);
  const [edit, setEdit] = useState(false);
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

  useEffect(() => {
    // console.log(user);
    // if (!pic) return;
    // const myImageList = [...pic];
    // setMyImgs(myImageList);
    console.log(myImgs);
  }, [myImgs]);

  async function nextPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX - 100);
  }

  function prevPhoto() {
    setTranslateXValue((prevTranslateX) => prevTranslateX + 100);
  }

  function formUserChange(event, inputName) {
    switch (inputName) {
      case "username":
        setFormUser((prevState) => ({
          ...prevState,
          username: event.target.value,
        }));
        break;

      case "lastname":
        setFormUser((prevState) => ({
          ...prevState,
          lastName: event.target.value,
        }));
        break;
      case "firstname":
        setFormUser((prevState) => ({
          ...prevState,
          firstName: event.target.value,
        }));
        break;
      case "email":
        setFormUser((prevState) => ({
          ...prevState,
          email: event.target.value,
        }));
        break;
      case "gender":
        setFormUser((prevState) => ({
          ...prevState,
          gender: event.target.value,
        }));
        break;
      case "orientation":
        setFormUser((prevState) => ({
          ...prevState,
          sexuality: event.target.value,
        }));
        break;
      case "bio":
        setFormUser((prevState) => ({
          ...prevState,
          bio: event.target.value,
        }));
        break;

      default:
        console.log("bad name");
    }
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
          <h3> {/* {user.firstName} {user.lastName} */}</h3>
        </section>
        {/* <p> Fame Rating</p> */}
      </div>
      <h3 className="titleProfil">
        {" "}
        {user.firstName} {user.lastName}{" "}
      </h3>
      <div className="socialInfosContainer">
        <div className="socialInfos borderR">
          <h4> 13 </h4>
          <p>fame</p>
        </div>
        <div className="socialInfos borderR">
          <h4 className="pink"> 13 </h4>
          <p>totolo</p>
        </div>
        <div className="socialInfos">
          <h4> 13 </h4>
          <p>vues</p>
        </div>
      </div>
      {!user && <div> Loader </div>}
      {user && (
        // <div className="mainInfoContainer">
        //   <h3> Information de profil</h3>
        //   <form>
        //     <div className="inputContainer">
        //       <label> Username</label>
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         {/* <input
        //           type="text"
        //           onChange={(e) => formUserChange(e, "username")}
        //           defaultValue={formUser.username}
        //           disabled={!edit}
        //         /> */}
        //         <p>{formUser.username}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //     <div className="inputContainer">
        //       <label> Lastname </label>
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         {/* <input
        //           type="text"
        //           onChange={(e) => formUserChange(e, "lastname")}
        //           defaultValue={formUser.lastName}
        //           disabled={!edit}
        //         />
        //         */}
        //         <p>{formUser.lastName}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //     <div className="inputContainer">
        //       <label> Firstname </label>
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         {/* <input
        //           type="text"
        //           onChange={(e) => formUserChange(e, "firstname")}
        //           defaultValue={formUser.firstName}
        //           disabled={!edit}
        //         /> */}
        //         <p>{formUser.firstName}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //     <div className="inputContainer">
        //       <label> Email </label>
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         {/* <input
        //           type="text"
        //           onChange={(e) => formUserChange(e, "email")}
        //           defaultValue={formUser.email}
        //           disabled={!edit}
        //         /> */}
        //         <p>{formUser.email}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //     <div className="inputContainer">
        //       <label> Genre </label>
        //       {/* <div className="myRadioInput"> */}
        //       {/* <input
        //           type="radio"
        //           name="Genre"
        //           id="homme"
        //           value="MALE"
        //           checked={formUser.gender === "MALE"}
        //           onChange={(e) => formUserChange(e, "gender")}
        //           disabled={!edit}
        //         />
        //         <label htmlFor="homme"> Homme </label>
        //         <input
        //           type="radio"
        //           name="Genre"
        //           id="femme"
        //           value="FEMALE"
        //           checked={formUser.gender === "FEMALE"}
        //           onChange={(e) => formUserChange(e, "gender")}
        //           disabled={!edit}
        //         />
        //         <label htmlFor="femme"> Femme </label> */}
        //       {/* </div> */}
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         <p>{formUser.gender.toLowerCase()}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //     <div className="inputContainer">
        //       <label> Orientation </label>
        //       {/* <div className="myRadioInput">
        //         <input
        //           type="radio"
        //           name="prefers"
        //           id="hetero"
        //           value="HETEROSEXUAL"
        //           checked={formUser.sexuality === "HETEROSEXUAL"}
        //           onChange={(e) => formUserChange(e, "orientation")}
        //           disabled={!edit}
        //         />
        //         <label htmlFor="hetero"> Hétérosexuel </label>
        //         <input
        //           type="radio"
        //           name="prefers"
        //           id="homo"
        //           value="HOMOSEXUAL"
        //           checked={formUser.sexuality === "HOMOSEXUAL"}
        //           onChange={(e) => formUserChange(e, "orientation")}
        //           disabled={!edit}
        //         />
        //         <label htmlFor="homo"> Homosexuel </label>
        //         <input
        //           type="radio"
        //           name="prefers"
        //           id="bi"
        //           value="BISEXUAL"
        //           checked={formUser.sexuality === "BISEXUAL"}
        //           onChange={(e) => formUserChange(e, "orientation")}
        //           disabled={!edit}
        //         />
        //         <label htmlFor="bi"> Bisexuel </label>
        //       </div> */}
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         <p>{formUser.sexuality.toLowerCase()}</p>
        //         <ArrowRight />
        //       </div>
        //     </div>

        //     <div className="inputContainer">
        //       <label> Intérêts </label>
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         <p>liste d&apos; intêret </p>
        //         <ArrowRight />
        //       </div>
        //       {/* <div className="myRadioInput">
        //         <input type="checkbox" id="musique" />
        //         <label htmlFor="musique"> Musique</label>

        //         <input type="checkbox" id="sport" />
        //         <label htmlFor="sport"> Sport</label>

        //         <input type="checkbox" id="jeuxVideos" />
        //         <label htmlFor="jeuxVideos"> Jeux vidéos </label>

        //         <input type="checkbox" id="voyage" />
        //         <label htmlFor="voyage"> Voyages </label>

        //         <input type="checkbox" id="cinema" />
        //         <label htmlFor="cinema"> Cinéma </label>
        //       </div> */}
        //     </div>

        //     <div className="inputContainer">
        //       <label> Biographie </label>
        //       {/* <textarea
        //         value={formUser.bio}
        //         onChange={(e) => formUserChange(e, "bio")}
        //         disabled={!edit}
        //       >
        //         {" "}
        //       </textarea> */}
        //       <div className={edit ? "myTextInput" : "myTextInput inactive"}>
        //         {/* <p>{formUser.bio}</p> */}
        //         <p> modifier</p>
        //         <ArrowRight />
        //       </div>
        //     </div>
        //   </form>
        // </div>
        <EditUser />
      )}
      {!edit && (
        <div onClick={() => setEdit(true)} className="editIcon">
          <Edit />
        </div>
      )}
      {edit && (
        <div className="editContainer">
          <div className="confirmIcon">
            <Confirm />
          </div>
          <div className="cancelIcon" onClick={() => setEdit(false)}>
            <Cancel />
          </div>
        </div>
      )}

      <p> Qui à vue ton profil </p>
      <p> Qui à like ton profil </p>

      {mainModal && <DeleteMainPicModal />}
    </div>
  );
};

export default Profil;
