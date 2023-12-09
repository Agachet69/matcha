import { useSelector } from "react-redux";
import { getToken } from "../store/slices/authSlice";
import { selectUser } from "../store/slices/userSlice";
import "../styles/profil.scss";
import { useEffect, useState } from "react";

const Profil = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  const [formUser, setFormUser] = useState(user);
  const [edit, setEdit] = useState(false);

  function formUserChange(event, inputName) {

    switch (inputName) {
      case "username":
        setFormUser(prevState => ({
          ...prevState,
          username: event.target.value,
        }))
        break

      case "lastname":
        setFormUser(prevState => ({
          ...prevState,
          lastName: event.target.value,
        }))
        break
      case "firstname":
        setFormUser(prevState => ({
          ...prevState,
          firstName: event.target.value,
        }))
        break
      case "email":
        setFormUser(prevState => ({
          ...prevState,
          email: event.target.value,
        }))
        break
      case "gender":
        setFormUser((prevState) => ({
          ...prevState,
          gender: event.target.value,
        }));
        break
      case "orientation":
        setFormUser((prevState) => ({
          ...prevState,
          sexuality: event.target.value,
        }));
        break
      case "bio":
        setFormUser((prevState) => ({
          ...prevState,
          bio: event.target.value,
        }));
        break


      default:
        console.log('bad name');
    }
  }

  useEffect(() => {
    console.log(formUser);
  }, [formUser]);

  return (
    <div className="ProfilContainer">
      <h1>Profil</h1>

      {!user && <div> Loader </div>}
      {user && (
        <form>
          <h4> Username</h4>
          <input type="text" onChange={(e) => formUserChange(e, "username")} defaultValue={formUser.username} disabled={!edit} />
          <h4> Lastname </h4>
          <input type="text" onChange={(e) => formUserChange(e, "lastname")} defaultValue={formUser.lastName} disabled={!edit} />
          <h4> Firstname </h4>
          <input type="text" onChange={(e) => formUserChange(e, "firstname")} defaultValue={formUser.firstName} disabled={!edit} />
          <h4> Email </h4>
          <input type="text" onChange={(e) => formUserChange(e, "email")} defaultValue={formUser.email} disabled={!edit} />
          <h4> Genre </h4>
          <label htmlFor="homme"> Homme </label>
          <input
            type="radio"
            name="Genre"
            id="homme"
            value="MALE"
            checked={formUser.gender === "MALE"}
            onChange={(e) => formUserChange(e, "gender")}
            disabled={!edit}
          />
          <label htmlFor="femme"> Femme </label>
          <input
            type="radio"
            name="Genre"
            id="femme"
            value="FEMALE"
            checked={formUser.gender === "FEMALE"}
            onChange={(e) => formUserChange(e, "gender")}
            disabled={!edit}
          />

          <h4> Orientation </h4>
          <label htmlFor="hetero"> Hétérosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="hetero"
            value="HETEROSEXUAL"
            checked={formUser.sexuality === "HETEROSEXUAL"}
            onChange={(e) => formUserChange(e, "orientation")}
            disabled={!edit}
          />
          <label htmlFor="homo"> Homosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="homo"
            value="HOMOSEXUAL"
            checked={formUser.sexuality === "HOMOSEXUAL"}
            onChange={(e) => formUserChange(e, "orientation")}
            disabled={!edit}
          />
          <label htmlFor="bi"> Bisexuel </label>
          <input
            type="radio"
            name="prefers"
            id="bi"
            value="BISEXUAL"
            checked={formUser.sexuality === "BISEXUAL"}
            onChange={(e) => formUserChange(e, "orientation")}
            disabled={!edit}
          />


          <h4> Intérêts </h4>
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

          <h4> Biographie </h4>
          <textarea value={formUser.bio} onChange={(e) => formUserChange(e, "bio")} disabled={!edit}> </textarea>
        </form>
      )}
      {
        !edit &&
        <button onClick={() => setEdit(true)}> Modifier le Profil</button>
      }
      {
        edit &&
        <div>
          <button> Mettre à jour </button>
          <button onClick={() => setEdit(false)}> Annuler </button>
        </div>
      }
      <p> pictures + Photo de profil </p>
      <p>
        {" "}
        A list of interests with tags (e.g. #vegan, #geek, #piercing, etc.),
        which mustbe reusable{" "}
      </p>

      <p> Qui à vue ton profil </p>
      <p> Qui à like ton profil </p>
      <p> fame rating </p>

      <p> tout est modifiable</p>
    </div>
  );
};

export default Profil;
