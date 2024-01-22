import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { useEffect, useState } from "react";
import { ArrowRight, Send } from "../icons/Icons";
import "../../styles/profil/editUser.scss";
import { getAuthorizedInstance } from "../../utils/Instance";
import { getToken } from "../../store/slices/authSlice";
import { useFormik } from "formik";
import EditUserSchema from "../../schemas/EditUserSchema";

const EditUser = () => {
  const user = useSelector(selectUser);
  const token = useSelector(getToken);
  const instance = getAuthorizedInstance(token.access_token);
  const [formUser, setFormUser] = useState(user);
  const [tags, setTags] = useState(user.tags);
  const initialStatusState = {
    username: false,
    lastName: false,
    firstName: false,
    email: false,
    age: false,
    gender: false,
    sexuality: false,
    tags: false,
    bio: false,
  };
  const [editStatus, setEditStatus] = useState(initialStatusState);

  const formik = useFormik({
    validationSchema: EditUserSchema(),
    initialValues: formUser,
    onSubmit: (values) => {
      sendUserUpdated(values);
    },
  });

  async function sendUserUpdated(value) {
    try {
      await instance.put("/users/tags", tags);
      const res = await instance.put("/users", value);
      setFormUser(res.data);
      setEditStatus(initialStatusState);
    } catch (err) {
      console.log(err);
    }
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

  // async function sendTagUpdate() {
  //   const res = await instance.put("/users/tags", tags);
  //   console.log("oho");
  //   setEditStatus((prevState) => ({
  //     ...prevState,
  //     tags: !editStatus.tags,
  //   }));
  // }

  return (
    <div className="editUserContainer">
      <h3> Profile information </h3>
      <form onSubmit={formik.handleSubmit}>
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
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     username: e.target.value,
                //   }))
                // }
                // defaultValue={formUser.username}
                // name="username"
                // id="username"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // defaultValue={formik.initialValues.username}
                // disabled={!editStatus.username}
                {...formik.getFieldProps("username")}
              />
            </div>
            {!!formik.errors.username && formik.touched.username && (
              <div className="error">{formik.errors.username}</div>
            )}
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
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     firstName: e.target.value,
                //   }))
                // }
                // id="firstName"
                // name="firstName"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // defaultValue={formik.initialValues.firstName}
                // disabled={!editStatus.firstName}
                {...formik.getFieldProps("firstName")}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error">{formik.errors.firstName}</div>
            ) : null}
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
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     lastName: e.target.value,
                //   }))
                // }
                // defaultValue={formUser.lastName}
                // disabled={!editStatus.lastName}
                // id="lastName"
                // name="lastName"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // defaultValue={formik.initialValues.lastName}
                // disabled={!editStatus.lastName}
                {...formik.getFieldProps("lastName")}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error">{formik.errors.lastName}</div>
            ) : null}
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
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     email: e.target.value,
                //   }))
                // }
                // id="email"
                // name="email"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // defaultValue={formik.initialValues.email}
                // disabled={!editStatus.email}
                {...formik.getFieldProps("email")}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Age </label>
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
              {/* <p>{formik.value.age}</p> */}
              <p>{formUser.age}</p>
              <ArrowRight />
            </div>
            <div className="DisplayInputContainer">
              <input
                type="number"
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     age: e.target.value,
                //   }))
                // }
                // id="age"
                // name="age"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                // defaultValue={formUser.age}
                // disabled={!editStatus.age}
                {...formik.getFieldProps("age")}
              />
            </div>
            {formik.touched.age && formik.errors.age ? (
              <div className="error"> {formik.errors.age} </div>
            ) : null}
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Gender </label>
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
                name="gender"
                id="homme"
                value="MALE"
                checked={formik.values.gender === "MALE"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="homme"> Homme </label>
              <input
                type="radio"
                name="gender"
                id="femme"
                value="FEMALE"
                checked={formik.values.gender === "FEMALE"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                name="sexuality"
                id="hetero"
                value="HETEROSEXUAL"
                checked={formik.values.sexuality === "HETEROSEXUAL"}
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     sexuality: e.target.value,
                //   }))
                // }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="hetero"> Hétérosexuel </label>
              <input
                type="radio"
                name="sexuality"
                id="homo"
                value="HOMOSEXUAL"
                checked={formik.values.sexuality === "HOMOSEXUAL"}
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     sexuality: e.target.value,
                //   }))
                // }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="homo"> Homosexuel </label>
              <input
                type="radio"
                name="sexuality"
                id="bi"
                value="BISEXUAL"
                checked={formik.values.sexuality === "BISEXUAL"}
                // onChange={(e) =>
                //   setFormUser((prevstate) => ({
                //     ...prevstate,
                //     sexuality: e.target.value,
                //   }))
                // }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="bi"> Bisexuel </label>
            </div>
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Interests </label>
          <div
            className={
              editStatus.tags ? "myTextInput activeBioTags" : "myTextInput"
            }
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
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <p key={index} className="tagName">
                    {" "}
                    {tag.tag.toLowerCase()}{" "}
                  </p>
                ))
              ) : (
                <p> Ajouter </p>
              )}
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
                checked={tags.some(
                  (tagObject) => tagObject.tag === "JEUX_VIDEOS"
                )}
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
            {tags.length > 5 && <p className="error"> 5 tags maximum. </p>}
          </div>
        </div>
        <div className="inputContainer">
          <label className="labelContainer"> Biography </label>
          <div
            className={
              editStatus.bio ? "myTextInput activeBioTags" : "myTextInput"
            }
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
              value={formik.values.bio}
              // onChange={(e) =>
              //   setFormUser((prevstate) => ({
              //     ...prevstate,
              //     bio: e.target.value,
              //   }))
              // }
              {...formik.getFieldProps("bio")}
            ></textarea>
            {formik.touched.bio && formik.errors.bio ? (
              <div className="error"> {formik.errors.bio} </div>
            ) : null}
          </div>
        </div>
        <div className="sendButton">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
