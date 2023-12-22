import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../store/slices/authSlice";
import { addUserPhoto, deleteUserPhoto, selectUser } from "../store/slices/userSlice";
import "../styles/profil.scss";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Cancel,
  Confirm,
  Edit,
  Identity,
  Letter,
  Trash,
  UserIcon,
} from "../components/icons/Icons";
import axios from "axios";
import { MainPic } from "../components/MainPic";

const Profil = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  const [formUser, setFormUser] = useState(user);
  const [edit, setEdit] = useState(false);
  const [translateXValue, setTranslateXValue] = useState(0);
  const [pic, setPic] = useState(null);
  const [myImgs, setMyImgs] = useState(null);

  const dispatch = useDispatch();
  const backPicRef = useRef();

  useEffect(() => {
    backPicRef.current.style.transform = `translateX(${translateXValue}%)`;
  }, [translateXValue]);

  useEffect(() => {
    console.log((user));
  }, [user])

  useEffect(() => {
    console.log(user);
    if (!pic) return;
    const myImageList = [...pic];
    setMyImgs(myImageList);
  }, [pic]);

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
    if (myImgs.length + user.photos.length > 5) {
      console.log("trop de photos");
      return;
    }

    myImgs.forEach((image) => {
      formData.append(`images`, image);
    });
    try {
      const res = await axios.post("http://localhost:8000/photo", formData, {
        headers: {
          Authorization: "Bearer " + (token ? token.access_token : ""),
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(addUserPhoto(res.data[0]))
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
    dispatch(deleteUserPhoto(res.data.id))
    setTranslateXValue(0);
  }

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   const maxSize = 1024 * 1024; // 1 MB

  //   if (file && file.size > maxSize) {
  //     alert('Fichier trop volumineux. La taille maximale autorisée est 1 Mo.');
  //   } else {
  //     setSelectedFile(file);
  //   }
  // };

  return (
    <div className="ProfilContainer">
      <div className="topContainer">
        <div className="topContent">
          <div className="backPic" ref={backPicRef}>
            {user.photos
              .filter((photo) => photo.main === false)
              .map((photo, index, photosTab) => {
                return (
                  <div className="oneBackPic" key={photo.id}>
                    <img src={`http://localhost:8000/${photo.path}`} />
                    {index !== 0 && (
                      <div className="leftArrow" onClick={prevPhoto}>
                        <ArrowLeft />
                      </div>
                    )}
                    {index + 1 !== photosTab.length && (
                      <div className="rightArrow" onClick={nextPhoto}>
                        <ArrowRight />
                      </div>
                    )}
                    <div className="buttonsImg">
                      <button onClick={() => deleteImg(photo.id)}>
                        <Trash />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <section>
          <MainPic />
          <h3>
            {" "}
            {user.firstName} {user.lastName}
          </h3>
          <p> Fame Rating</p>
        </section>
        {user.photos.length < 5 && (
          <div className="addBackPhoto">
            <label htmlFor="pict">
              {/* <AddImage /> */}
              Ajouter une photo
            </label>
            <input
              type="file"
              multiple
              id="pict"
              accept="image/*"
              onChange={(event) => {
                setPic(event.target.files);
              }}
            />
            <p className="photoCompteur"> {user.photos.length - 1} / 4 </p>
          </div>
        )}
      </div>

      {pic /*.length > 0*/ && (
        <button onClick={sendImages}> send images </button>
      )}

      {!user && <div> Loader </div>}
      {user && (
        <form>
          <div className="inputContainer">
            <label> Username</label>
            <div className={edit ? "myTextInput" : "myTextInput inactive"}>
              <input
                type="text"
                onChange={(e) => formUserChange(e, "username")}
                defaultValue={formUser.username}
                disabled={!edit}
              />
              <UserIcon />
            </div>
          </div>
          <div className="inputContainer">
            <label> Lastname </label>
            <div className={edit ? "myTextInput" : "myTextInput inactive"}>
              <input
                type="text"
                onChange={(e) => formUserChange(e, "lastname")}
                defaultValue={formUser.lastName}
                disabled={!edit}
              />
              <Identity />
            </div>
          </div>
          <div className="inputContainer">
            <label> Firstname </label>
            <div className={edit ? "myTextInput" : "myTextInput inactive"}>
              <input
                type="text"
                onChange={(e) => formUserChange(e, "firstname")}
                defaultValue={formUser.firstName}
                disabled={!edit}
              />
              <Identity />
            </div>
          </div>
          <div className="inputContainer">
            <label> Email </label>
            <div className={edit ? "myTextInput" : "myTextInput inactive"}>
              <input
                type="text"
                onChange={(e) => formUserChange(e, "email")}
                defaultValue={formUser.email}
                disabled={!edit}
              />
              <Letter />
            </div>
          </div>
          <div className="inputContainer">
            <label> Genre </label>
            <div className="myRadioInput">
              <input
                type="radio"
                name="Genre"
                id="homme"
                value="MALE"
                checked={formUser.gender === "MALE"}
                onChange={(e) => formUserChange(e, "gender")}
                disabled={!edit}
              />
              <label htmlFor="homme"> Homme </label>
              <input
                type="radio"
                name="Genre"
                id="femme"
                value="FEMALE"
                checked={formUser.gender === "FEMALE"}
                onChange={(e) => formUserChange(e, "gender")}
                disabled={!edit}
              />
              <label htmlFor="femme"> Femme </label>
            </div>
          </div>
          <div className="inputContainer">
            <label> Orientation </label>
            <div className="myRadioInput">
              <input
                type="radio"
                name="prefers"
                id="hetero"
                value="HETEROSEXUAL"
                checked={formUser.sexuality === "HETEROSEXUAL"}
                onChange={(e) => formUserChange(e, "orientation")}
                disabled={!edit}
              />
              <label htmlFor="hetero"> Hétérosexuel </label>
              <input
                type="radio"
                name="prefers"
                id="homo"
                value="HOMOSEXUAL"
                checked={formUser.sexuality === "HOMOSEXUAL"}
                onChange={(e) => formUserChange(e, "orientation")}
                disabled={!edit}
              />
              <label htmlFor="homo"> Homosexuel </label>
              <input
                type="radio"
                name="prefers"
                id="bi"
                value="BISEXUAL"
                checked={formUser.sexuality === "BISEXUAL"}
                onChange={(e) => formUserChange(e, "orientation")}
                disabled={!edit}
              />
              <label htmlFor="bi"> Bisexuel </label>
            </div>
          </div>

          <div className="inputContainer">
            <label> Intérêts </label>
            <div className="myRadioInput">
              <input type="radio" id="musique" />
              <label htmlFor="musique"> Musique</label>

              <input type="radio" id="sport" />
              <label htmlFor="sport"> Sport</label>

              <input type="radio" id="jeuxVideos" />
              <label htmlFor="jeuxVideos"> Jeux vidéos </label>

              <input type="radio" id="voyage" />
              <label htmlFor="voyage"> Voyages </label>

              <input type="radio" id="cinema" />
              <label htmlFor="cinema"> Cinéma </label>
            </div>
          </div>

          <div className="inputContainer">
            <label> Biographie </label>
            <textarea
              value={formUser.bio}
              onChange={(e) => formUserChange(e, "bio")}
              disabled={!edit}
            >
              {" "}
            </textarea>
          </div>
        </form>
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

      <p>
        {" "}
        A list of interests with tags (e.g. #vegan, #geek, #piercing, etc.),
        which mustbe reusable{" "}
      </p>

      <p> Qui à vue ton profil </p>
      <p> Qui à like ton profil </p>

      <p> tout est modifiable</p>
    </div>
  );
};

export default Profil;
