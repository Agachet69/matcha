import { useFormik } from "formik";
import GenderEnum from "../Enum/GenderEnum";
import SexualityEnum from "../Enum/SexualityEnum";
import printVarsHook from "../components/printVarsHook";
import RegisterSchema from "../schemas/RegisterSchema";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Carousel from "../components/Carousel";
import { KeyIcon } from "../components/icons/Icons";
import { useDispatch } from "react-redux";
import { setToken } from "../store/slices/authSlice";

const Register = () => {
  const [onRegisterErrorMessage, setOnRegisterErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [pos, setPos] = useState({
    latitude: 0,
    longitude: 0,
  });
  const formik = useFormik({
    validationSchema: RegisterSchema(),
    initialValues: {
      username: "",
      lastName: "",
      firstName: "",
      gender: null,
      sexuality: null,
      bio: "",
      position: "",
      email: "",
      password: "",
      age: null,
    },
    onSubmit: (values) => {
      onRegister(values);
    },
  });

  const onRegister = (values) => {
    axios
      .post("http://localhost:8000/users/register", { ...values, ...pos })
      .then(({ data }) => {
        dispatch(setToken(data));
        navigate("/profil");
      })
      .catch((error) => {
        console.log(error);
        setOnRegisterErrorMessage(
          /*JSON.stringify(*/ error.response.data.detail /*)*/
        );
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPos({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          axios.get("https://ipapi.co/json/").then(({ data }) => {
            setPos({
              latitude: data.latitude,
              longitude: data.longitude,
            });
          });
        }
      );
    } else {
      axios.get("https://ipapi.co/json/").then(({ data }) => {
        setPos({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });
    }
  }, []);

  useEffect(() => window.scrollTo(0, 0), []);
  printVarsHook(formik.errors, "errors");
  printVarsHook(formik.touched, "touched");
  printVarsHook(formik.values, "values");
  printVarsHook(formik.isSubmitting, "isSubmitting");

  return (
    <div className="loginContainer">
      <main>
        <h3> Register </h3>
        <p> Please enter your details </p>
        <section>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="registerInput">
                <input
                  type="text"
                  placeholder=" "
                  name="username"
                  id="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="username">Username</label>
              </div>
              {!!formik.errors.username && formik.touched.username && (
                <div className="error">{formik.errors.username}</div>
              )}
            </div>
            <div>
              <div className="registerInput">
                <input
                  type="number"
                  placeholder=" "
                  min={0}
                  step={1}
                  name="age"
                  id="age"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="age">Age</label>
              </div>
              {!!formik.errors.age && formik.touched.age && (
                <div className="error">{formik.errors.age}</div>
              )}
            </div>
            <div className="dosLoginInput">
              <div className="dosInput">
                <div className="registerInput">
                  <input
                    type="text"
                    placeholder=" "
                    name="firstName"
                    id="firstname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="firstname">First Name</label>
                </div>
                {!!formik.errors.firstName && formik.touched.firstName && (
                  <div className="error">{formik.errors.firstName}</div>
                )}
              </div>
              <div className="dosInput">
                <div className="registerInput">
                  <input
                    type="text"
                    placeholder=" "
                    name="lastName"
                    id="lastname"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="lastname">Last Name</label>
                </div>
                {!!formik.errors.lastName && formik.touched.lastName && (
                  <div className="error">{formik.errors.lastName}</div>
                )}
              </div>
            </div>
            <div className="selector">
              <label>Gender</label>
              <div className="allButtons">
                {Object.keys(GenderEnum).map((value) => (
                  <button
                    key={value}
                    className={
                      "selectorItem " +
                      (value == formik.values.gender ? "selected" : "")
                    }
                    onClick={() => formik.setFieldValue("gender", value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {!!formik.errors.gender && formik.touched.gender && (
                <div className="error">{formik.errors.gender}</div>
              )}
            </div>
            <div className="selector">
              <label>Sexuality</label>
              <div className="allButtons">
                {Object.keys(SexualityEnum).map((value) => (
                  <button
                    key={value}
                    className={
                      "selectorItem " +
                      (value == formik.values.sexuality ? "selected" : "")
                    }
                    onClick={() => formik.setFieldValue("sexuality", value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            {!!formik.errors.sexuality && formik.touched.sexuality && (
              <div className="error">{formik.errors.sexuality}</div>
            )}

            <div>
              <div className="registerTextarea">
                <textarea
                  cols="2"
                  rows="10"
                  id="rules"
                  placeholder=" "
                ></textarea>
                <label htmlFor="rules">Biography</label>
              </div>
              {!!formik.errors.bio && formik.touched.bio && (
                <div className="error">{formik.errors.bio}</div>
              )}
            </div>

            <div>
              <div className="registerInput">
                <input
                  type="email"
                  placeholder=" "
                  name="email"
                  id="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="email">Email</label>
              </div>
              {!!formik.errors.email && formik.touched.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <div className="registerInput">
                <input
                  type="password"
                  placeholder=" "
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                />
                <label htmlFor="password">Password</label>
                <div className="icon">
                  <KeyIcon />
                </div>
              </div>
              {!!formik.errors.password && formik.touched.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
            <div>
              <button className="loginButton" type="submit">
                {" "}
                Register{" "}
              </button>
              {!!onRegisterErrorMessage && (
                <div className="error">{onRegisterErrorMessage}</div>
              )}
            </div>
          </form>
          <div className="bottomForm">
            {/* <p> Forgot password? </p> */}
            <p onClick={() => navigate("/login")}>
              {" "}
              Already have an account ?{" "}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
