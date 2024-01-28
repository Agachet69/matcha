import "../../styles/profil/editUser.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import { useState } from "react";
import { ArrowRight } from "../icons/Icons";
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

  return (
    <div className="editUserContainer">
      <h3> Profile information </h3>
      <form onSubmit={formik.handleSubmit}>
        <div
          className={
            editStatus.username ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                username: !editStatus.username,
              }))
            }
          >
            <label className="labelContainer"> Username </label>
            <div className="currentValue">
              <p>{formUser.username}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <input type="text" {...formik.getFieldProps("username")} />
            </div>
            {!!formik.errors.username && formik.touched.username && (
              <div className="errorEdit">{formik.errors.username}</div>
            )}
          </div>
        </div>
        <div
          className={
            editStatus.firstName ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                firstName: !editStatus.firstName,
              }))
            }
          >
            <label className="labelContainer"> FirstName </label>
            <div className="currentValue">
              <p>{formUser.firstName}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <input type="text" {...formik.getFieldProps("firstName")} />
            </div>
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="errorEdit">{formik.errors.firstName}</div>
            ) : null}
          </div>
        </div>
        <div
          className={
            editStatus.lastName ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                lastName: !editStatus.lastName,
              }))
            }
          >
            <label className="labelContainer"> LastName </label>
            <div className="currentValue">
              <p>{formUser.lastName}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <input type="text" {...formik.getFieldProps("lastName")} />
            </div>
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="errorEdit">{formik.errors.lastName}</div>
            ) : null}
          </div>
        </div>
        <div
          className={
            editStatus.email ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                email: !editStatus.email,
              }))
            }
          >
            <label className="labelContainer"> Email </label>
            <div className="currentValue">
              <p>{formUser.email}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <input type="text" {...formik.getFieldProps("email")} />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="errorEdit">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>
        <div
          className={
            editStatus.age ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                age: !editStatus.age,
              }))
            }
          >
            <label className="labelContainer"> Age </label>
            <div className="currentValue">
              <p>{formUser.age}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <input type="number" {...formik.getFieldProps("age")} step={1} />
            </div>
            {formik.touched.age && formik.errors.age ? (
              <div className="errorEdit"> {formik.errors.age} </div>
            ) : null}
          </div>
        </div>
        <div
          className={
            editStatus.gender ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                gender: !editStatus.gender,
              }))
            }
          >
            <label className="labelContainer"> Gender </label>
            <div className="currentValue">
              <p>{formUser.gender.toLowerCase()}</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
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
        <div
          className={
            editStatus.sexuality ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                sexuality: !editStatus.sexuality,
              }))
            }
          >
            <label className="labelContainer"> Orientation </label>
            <div className="currentValue">
              <p>{formUser.sexuality.toLowerCase()}</p>
              <ArrowRight />
            </div>
          </div>

          <div className="myTextInput">
            <div className="myRadioInput">
              <input
                type="radio"
                name="sexuality"
                id="hetero"
                value="HETEROSEXUAL"
                checked={formik.values.sexuality === "HETEROSEXUAL"}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <label htmlFor="bi"> Bisexuel </label>
            </div>
          </div>
        </div>
        <div
          className={
            editStatus.tags ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                tags: !editStatus.tags,
              }))
            }
          >
            <label className="labelContainer"> Interests </label>
            <div className="currentValue">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <p key={index} className="tagName">
                    {" "}
                    {tag.tag.toLowerCase()}{" "}
                  </p>
                ))
              ) : (
                <p> Add </p>
              )}
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
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
          </div>
          {tags.length > 5 && <p className="errorEdit"> 5 tags maximum. </p>}
        </div>
        <div
          className={
            editStatus.bio ? "inputContainer active" : "inputContainer"
          }
        >
          <div
            className="titleInput"
            onClick={() =>
              setEditStatus((prevState) => ({
                ...prevState,
                bio: !editStatus.bio,
              }))
            }
          >
            <label className="labelContainer"> Biography </label>
            <div className="currentValue">
              <p>Edit...</p>
              <ArrowRight />
            </div>
          </div>
          <div className="myTextInput">
            <div className="DisplayInputContainer">
              <textarea
                value={formik.values.bio}
                {...formik.getFieldProps("bio")}
              ></textarea>
            </div>
            {formik.touched.bio && formik.errors.bio ? (
              <div className="errorEdit"> {formik.errors.bio} </div>
            ) : null}
          </div>
        </div>
        <div className="sendButton">
          <button type="submit">Submit changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
