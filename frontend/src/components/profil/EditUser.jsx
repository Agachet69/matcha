import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { useEffect, useState } from "react";
import { ArrowRight } from "../icons/Icons";
import "../../styles/profil/editUser.scss";

const EditUser = () => {
  const user = useSelector(selectUser);
  const [formUser, setFormUser] = useState(user);

  const [editStatus, setEditStatus] = useState({
    username: false,
    lastName: false,
    firstName: false,
    email: false,
    gender: false,
    sexuality: false,
    tags: false,
    bio: false,
  });

  useEffect(() => {
    console.log(formUser);
  }, [formUser]);

  return (
    <div className="editUserContainer">
      <h3> Information de profil</h3>
      <form>
        <div className="inputContainer">
          <label> Username</label>
          <div
            className={
              editStatus.username ? "myTextInput active" : "myTextInput"
            }
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  username: !editStatus.username,
                }))
              }
            >
              <p>{formUser.username}</p>
              <ArrowRight />
            </div>
            <input
              type="text"
              onChange={(e) =>
                setFormUser((prevstate) => ({
                  ...prevstate,
                  username: e.target.value,
                }))
              }
              defaultValue={formUser.username}
              disabled={!editStatus.username}
            />
          </div>
        </div>
        <div className="inputContainer">
          <label> Lastname </label>
          <div
            className={
              editStatus.lastName ? "myTextInput active" : "myTextInput"
            }
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  lastName: !editStatus.lastName,
                }))
              }
            >
              <p>{formUser.lastName}</p>
              <ArrowRight />
            </div>
            <input
              type="text"
              onChange={(e) =>
                setFormUser((prevstate) => ({
                  ...prevstate,
                  lastName: e.target.value,
                }))
              }
              defaultValue={formUser.lastName}
              disabled={!editStatus.lastName}
            />
          </div>
        </div>
        <div className="inputContainer">
          <label> Firstname </label>
          <div
            className={
              editStatus.firstName ? "myTextInput active" : "myTextInput"
            }
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  firstName: !editStatus.firstName,
                }))
              }
            >
              <p>{formUser.firstName}</p>
              <ArrowRight />
            </div>
            <input
              type="text"
              onChange={(e) =>
                setFormUser((prevstate) => ({
                  ...prevstate,
                  firstName: e.target.value,
                }))
              }
              defaultValue={formUser.firstName}
              disabled={!editStatus.firstName}
            />
          </div>
        </div>
        <div className="inputContainer">
          <label> Email </label>
          <div
            className={editStatus.email ? "myTextInput active" : "myTextInput"}
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  email: !editStatus.email,
                }))
              }
            >
              <p>{formUser.email}</p>
              <ArrowRight />
            </div>
            <input
              type="text"
              onChange={(e) =>
                setFormUser((prevstate) => ({
                  ...prevstate,
                  email: e.target.value,
                }))
              }
              defaultValue={formUser.email}
              disabled={!editStatus.email}
            />
          </div>
        </div>
        <div className="inputContainer">
          <label> Genre </label>
          {/* <div className="myRadioInput"> */}
          {/* <input
            type="radio"
            name="Genre"
            id="homme"
            value="MALE"
            checked={formUser.gender === "MALE"}
            onChange={(e) => userChange(e, "gender")}
            disabled={!edit}
          />
          <label htmlFor="homme"> Homme </label>
          <input
            type="radio"
            name="Genre"
            id="femme"
            value="FEMALE"
            checked={formUser.gender === "FEMALE"}
            onChange={(e) => userChange(e, "gender")}
            disabled={!edit}
          />
          <label htmlFor="femme"> Femme </label> */}
          {/* </div> */}
          <div
            className={editStatus.gender ? "myTextInput active" : "myTextInput"}
          >
            <p>{formUser.gender.toLowerCase()}</p>
            <ArrowRight />
          </div>
        </div>
        <div className="inputContainer">
          <label> Orientation </label>
          {/* <div className="myRadioInput">
          <input
            type="radio"
            name="prefers"
            id="hetero"
            value="HETEROSEXUAL"
            checked={formUser.sexuality === "HETEROSEXUAL"}
            onChange={(e) => userChange(e, "orientation")}
            disabled={!edit}
          />
          <label htmlFor="hetero"> Hétérosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="homo"
            value="HOMOSEXUAL"
            checked={formUser.sexuality === "HOMOSEXUAL"}
            onChange={(e) => userChange(e, "orientation")}
            disabled={!edit}
          />
          <label htmlFor="homo"> Homosexuel </label>
          <input
            type="radio"
            name="prefers"
            id="bi"
            value="BISEXUAL"
            checked={formUser.sexuality === "BISEXUAL"}
            onChange={(e) => userChange(e, "orientation")}
            disabled={!edit}
          />
          <label htmlFor="bi"> Bisexuel </label>
        </div> */}
          <div
            className={
              editStatus.sexuality ? "myTextInput active" : "myTextInput"
            }
          >
            <p>{formUser.sexuality.toLowerCase()}</p>
            <ArrowRight />
          </div>
        </div>
        <div className="inputContainer">
          <label> Intérêts </label>
          <div
            className={editStatus.tags ? "myTextInput active" : "myTextInput"}
          >
            <p>liste d&apos; intêret </p>
            <ArrowRight />
          </div>
          {/* <div className="myRadioInput">
          <input type="checkbox" id="musique" />
          <label htmlFor="musique"> Musique</label>

          <input type="checkbox" id="sport" />
          <label htmlFor="sport"> Sport</label>

          <input type="checkbox" id="jeuxVideos" />
          <label htmlFor="jeuxVideos"> Jeux vidéos </label>

          <input type="checkbox" id="voyage" />
          <label htmlFor="voyage"> Voyages </label>

          <input type="checkbox" id="cinema" />
          <label htmlFor="cinema"> Cinéma </label>
        </div> */}
        </div>
        <div className="inputContainer">
          <label> Biographie </label>
          {/* <textarea
          value={formUser.bio}
          onChange={(e) => userChange(e, "bio")}
          disabled={!edit}
        >
          {" "}
        </textarea> */}
          <div
            className={editStatus.bio ? "myTextInput active" : "myTextInput"}
          >
            {/* <p>{formUser.bio}</p> */}
            <p> modifier</p>
            <ArrowRight />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
