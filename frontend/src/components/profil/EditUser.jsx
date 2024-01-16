import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { useEffect, useState } from "react";
import { ArrowRight, Send } from "../icons/Icons";
import "../../styles/profil/editUser.scss";
import { getAuthorizedInstance } from "../../utils/Instance";
import { getToken } from "../../store/slices/authSlice";

const EditUser = () => {
  const user = useSelector(selectUser);
  const token = useSelector(getToken);
  const instance = getAuthorizedInstance(token.access_token);
  const [formUser, setFormUser] = useState(user);
  const [tags, setTags] = useState(user.tags);

  const [editStatus, setEditStatus] = useState({
    username: false,
    lastName: false,
    firstName: false,
    email: false,
    age: false,
    gender: false,
    sexuality: false,
    tags: false,
    bio: false,
  });

  async function sendUserUpdated() {
    const res = await instance.put("/users", formUser);
    console.log(res.data);
  }

  function EditTag(e) {
    const inputTag = { tag: e.target.value };

    if (
      e.target.checked &&
      !tags.some((tagObject) => tagObject.tag === inputTag.tag)
    ) {
      setTags((prevState) => [...prevState, inputTag]);
    } else if (
      !e.target.checked &&
      tags.some((tagObject) => tagObject.tag === inputTag.tag)
    )
      setTags((prevState) =>
        prevState.filter((delTag) => delTag.tag !== inputTag.tag)
      );
  }

  async function sendTagUpdate() {
    const res = await instance.put("/users/tags", tags);
    console.log(res);
  }

  return (
    <div className="editUserContainer">
      <h3> Information de profil</h3>
      <form>
        <div className="inputContainer">
          <label className="labelContainer"> Username</label>
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
            <div className="DisplayInputContainer">
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
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Firstname </label>
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
            <div className="DisplayInputContainer">
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
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Lastname </label>
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
            <div className="DisplayInputContainer">
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
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Email </label>
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
            <div className="DisplayInputContainer">
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
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Age </label>
          {formUser.age < 18 && <p className="errorMsg"> Minimum age 18. </p>}
          <div
            className={editStatus.age ? "myTextInput active" : "myTextInput"}
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  age: !editStatus.age,
                }))
              }
            >
              <p>{formUser.age}</p>
              <ArrowRight />
            </div>
            <div className="DisplayInputContainer">
              <input
                type="number"
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    age: e.target.value,
                  }))
                }
                defaultValue={formUser.age}
                disabled={!editStatus.age}
              />
            </div>
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Genre </label>
          <div
            className={editStatus.gender ? "myTextInput active" : "myTextInput"}
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  gender: !editStatus.gender,
                }))
              }
            >
              <p>{formUser.gender.toLowerCase()}</p>
              <ArrowRight />
            </div>
            <div className="myRadioInput">
              {" "}
              <input
                type="radio"
                name="Genre"
                id="homme"
                value="MALE"
                checked={formUser.gender === "MALE"}
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    gender: e.target.value,
                  }))
                }
              />
              <label htmlFor="homme"> Homme </label>
              <input
                type="radio"
                name="Genre"
                id="femme"
                value="FEMALE"
                checked={formUser.gender === "FEMALE"}
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    gender: e.target.value,
                  }))
                }
              />
              <label htmlFor="femme"> Femme </label>
            </div>
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Orientation </label>
          <div
            className={
              editStatus.sexuality ? "myTextInput active" : "myTextInput"
            }
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  sexuality: !editStatus.sexuality,
                }))
              }
            >
              <p>{formUser.sexuality.toLowerCase()}</p>
              <ArrowRight />
            </div>
            <div className="myRadioInput">
              <input
                type="radio"
                name="prefers"
                id="hetero"
                value="HETEROSEXUAL"
                checked={formUser.sexuality === "HETEROSEXUAL"}
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    sexuality: e.target.value,
                  }))
                }
              />
              <label htmlFor="hetero"> Hétérosexuel </label>
              <input
                type="radio"
                name="prefers"
                id="homo"
                value="HOMOSEXUAL"
                checked={formUser.sexuality === "HOMOSEXUAL"}
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    sexuality: e.target.value,
                  }))
                }
              />
              <label htmlFor="homo"> Homosexuel </label>
              <input
                type="radio"
                name="prefers"
                id="bi"
                value="BISEXUAL"
                checked={formUser.sexuality === "BISEXUAL"}
                onChange={(e) =>
                  setFormUser((prevstate) => ({
                    ...prevstate,
                    sexuality: e.target.value,
                  }))
                }
              />
              <label htmlFor="bi"> Bisexuel </label>
            </div>
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Intérêts </label>
          {tags.length > 5 && <p className="errorMsg"> 5 tags maximum. </p>}
          <div
            className={editStatus.tags ? "myTextInput activeBioTags" : "myTextInput"}
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  tags: !editStatus.tags,
                }))
              }
            >
              {tags.length > 0 ? tags.map((tag, index) => (
                <p key={index} className="tagName"> {tag.tag.toLowerCase()} </p>
              )) : <p> Ajouter </p>}
              <ArrowRight />
            </div>
            <div className="myRadioInput">
              <input
                type="checkbox"
                id="musique"
                value={"MUSIQUE"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "MUSIQUE")}
              />
              <label htmlFor="musique"> Musique</label>

              <input
                type="checkbox"
                id="sport"
                value={"SPORT"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "SPORT")}
              />
              <label htmlFor="sport"> Sport</label>

              <input
                type="checkbox"
                id="jeuxVideos"
                value={"JEUX_VIDEOS"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "JEUX_VIDEOS")}
              />
              <label htmlFor="jeuxVideos"> Jeux vidéos </label>

              <input
                type="checkbox"
                id="voyage"
                value={"VOYAGES"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "VOYAGES")}
              />
              <label htmlFor="voyage"> Voyages </label>

              <input
                type="checkbox"
                id="cinema"
                value={"CINEMA"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "CINEMA")}
              />
              <label htmlFor="cinema"> Cinéma </label>

              <input
                type="checkbox"
                id="vegan"
                value={"VEGAN"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "VEGAN")}
              />
              <label htmlFor="vegan"> Vegan </label>

              <input
                type="checkbox"
                id="piercing"
                value={"PIERCING"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "PIERCING")}
              />
              <label htmlFor="piercing"> Piercing </label>

              <input
                type="checkbox"
                id="tatoo"
                value={"TATOO"}
                onChange={EditTag}
                checked={tags.some((tagObject) => tagObject.tag === "TATOO")}
              />
              <label htmlFor="tatoo"> Tatoo </label>
            </div>
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Biographie </label>
          <div
            className={editStatus.bio ? "myTextInput activeBioTags" : "myTextInput"}
          >
            <div
              className="currentValue"
              onClick={() =>
                setEditStatus((prevState) => ({
                  ...prevState,
                  bio: !editStatus.bio,
                }))
              }
            >
              <p>Modifier</p>
              <ArrowRight />
            </div>
            <textarea
              value={formUser.bio}
              onChange={(e) =>
                setFormUser((prevstate) => ({
                  ...prevstate,
                  bio: e.target.value,
                }))
              }
            ></textarea>
          </div>
        </div>
      </form>
      <div className="sendButton">
        <button onClick={sendUserUpdated}>
          {" "}
          Envoyer <Send />{" "}
        </button>
        <button
          disabled={tags.length > 5}
          onClick={sendTagUpdate}
          className={tags.length > 5 ? "disabledBtn" : ""}
        >
          {" "}
          Send Tag
        </button>
      </div>
    </div>
  );
};

export default EditUser;
