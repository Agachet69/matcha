import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAuth, selectAuth } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  function tryLog() {
    console.log(auth);
    dispatch(isAuth(true));
    console.log(auth);

    console.log(name);
    console.log(password);
    navigate("/profil");
  }

  return (
    <div className="loginContainer">
      <header>
        <h2>Matcha ❤</h2>
      </header>
      <main>
        <h3> Welcome to login! </h3>
        <p> Please enter your details </p>
        <form>
          <div className="loginInput">
            <label> username </label>
            <input
              type="text"
              onChange={(e) => setUsername(e.currentTarget.value)}
              value={username}
            />
            <img src="/icons/key.svg" alt="icône d'utilisateur" />
          </div>
          <div className="loginInput">
            <label> Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
            />
            <img src="/icons/user.svg" alt="icône d'utilisateur" />
          </div>
          <button onClick={tryLog}> Log in </button>
          <p> Forgot your password? </p>
          <p> or </p>
          <p>
            {" "}
            Need an account? <span>sign-up here</span>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
