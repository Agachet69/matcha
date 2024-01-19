import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { KeyIcon, UserIcon } from "../components/icons/Icons";
import { useFormik } from "formik";
import LoginSchema from "../schemas/LoginSchema";
import axios from "axios";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pos, setPos] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [onLoginErrorMessage, setOnLoginErrorMessage] = useState("");

  const formik = useFormik({
    validationSchema: LoginSchema(),
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => onLogin(values),
  });

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

  const onLogin = (values) => {
    axios
      .post("http://localhost:8000/users/login", { ...values, ...pos })
      .then(({ data }) => {
        dispatch(setToken(data));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data.detail);
        setOnLoginErrorMessage(error.response.data.detail);
      });
  };

  return (
    <div className="loginContainer">
      <main>
        <h3> Welcome to login! </h3>
        <p> Please enter your details </p>
        <section>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="loginInput">
                <input
                  type="username"
                  placeholder=" "
                  name="username"
                  onChange={formik.handleChange}
                />
                <label>Username</label>
                <div className="icon">
                  <UserIcon />
                </div>
              </div>
              {!!formik.errors.username && formik.touched.username && (
                <div className="error">{formik.errors.username}</div>
              )}
            </div>
            <div>
              <div className="loginInput">
                <input
                  type="password"
                  placeholder=" "
                  name="password"
                  onChange={formik.handleChange}
                />
                <label>Password</label>
                <div className="icon">
                  <KeyIcon />
                </div>
              </div>
              {!!formik.errors.password && formik.touched.password && (
                <div className="error">{formik.errors.password}</div>
              )}
            </div>
            <div>
              <button type="submit" className="loginButton">
                {" "}
                Log in{" "}
              </button>
              {!!onLoginErrorMessage && (
                <div className="error">{onLoginErrorMessage}</div>
              )}
            </div>
          </form>
          <div className="bottomForm">
            <p> Forgot password? </p>
            <p onClick={() => navigate("/register")}> Sign-up </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
