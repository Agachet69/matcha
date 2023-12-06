import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAuth, selectAuth } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { KeyIcon, UserIcon } from "../components/icons/Icons";

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
                <section>
                <form>
                    <div className="loginInput">
                        <input
                            type="text"
                            placeholder=" "
                            onChange={(e) => setUsername(e.currentTarget.value)}
                            value={username}
                            />
                        <label> Username </label>
                        <UserIcon />
                    </div>
                    <div className="loginInput">
                        <input
                            type="password"
                            placeholder=" "
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            value={password}
                            />
                            <label> Password</label>
                            <KeyIcon />
                    </div>
                </form>
                <div className="bottomForm">
                    <p> Forgot password? </p>
                    <p onClick={() => navigate('/register')}> Sign-up </p>
                </div>
                </section>
                <button className="loginButton" onClick={tryLog}> Log in </button>
            </main>
        </div>
    );
};

export default Login;