import { useSelector } from "react-redux";
import { getToken } from "../store/slices/authSlice";
import { selectUser } from "../store/slices/userSlice";
import "../styles/profil.scss";
import { useEffect, useState } from "react";

const Profil = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  const [formUser, setFormUser] = useState(user);

  function genderChange(event) {
    setFormUser((prevState) => ({
      ...prevState,
      gender: event.target.value,
    }));
  }

  function prefersChange(event) {
    setFormUser((prevState) => ({
      ...prevState,
      sexuality: event.target.value,
    }));
  }

  useEffect(() => {
    console.log(formUser);
  }, [formUser]);

  return (
    <div className="ProfilContainer">
      {/* <button onClick={() => {
                console.log(token)
            }}>Get Me</button>
            
            <button onClick={() => console.log(user)}> getUser </button> */}

      {!user && <div> Loader </div>}
      {user && (
        <form>
          <h4> Genre </h4>
          <label htmlFor="homme"> Homme </label>
          <input
            type="radio"
            name="Genre"
            id="homme"
            value="MALE"
            checked={formUser.gender === "MALE"}
            onChange={genderChange}
          />
          <label htmlFor="femme"> Femme </label>
          <input
            type="radio"
            name="Genre"
            id="femme"
            value="FEMALE"
            checked={formUser.gender === "FEMALE"}
            onChange={genderChange}
          />

          <h4> Préférences </h4>
          <label htmlFor="hetero"> Hétérosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="hetero"
            value="HETEROSEXUAL"
            checked={formUser.sexuality === "HETEROSEXUAL"}
            onChange={prefersChange}
          />
          <label htmlFor="homo"> Homosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="homo"
            value="HOMOSEXUAL"
            checked={formUser.sexuality === "HOMOSEXUAL"}
            onChange={prefersChange}
          />
          <label htmlFor="bi"> Bisexuel </label>
          <input
            type="radio"
            name="prefers"
            id="bi"
            value="BISEXUAL"
            checked={formUser.sexuality === "BISEXUAL"}
            onChange={prefersChange}
          />
        </form>
      )}

      <h1>Profil</h1>
      <p> Genre </p>
      <p> pictures + Photo de profil </p>
      <p>
        {" "}
        A list of interests with tags (e.g. #vegan, #geek, #piercing, etc.),
        which mustbe reusable{" "}
      </p>
      <p> Sexual preferences </p>
      <p> A biography </p>
      <p> Qui à vue ton profil </p>
      <p> Qui à like ton profil </p>
      <p> fame rating </p>

      <p> tout est modifiable</p>
    </div>
  );
};

export default Profil;
