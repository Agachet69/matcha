import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { isAuth, selectAuth } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import '../styles/login.css'

const Login = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(selectAuth);

    function tryLog() {
        console.log(auth);
        dispatch(isAuth(true))
        console.log(auth);

        console.log(name);
        console.log(password);
        navigate('/profil')
    }

    return (
        <div className="loginContainer">
            <h2>Matcha ❤</h2>
            <h3> Welcome ! </h3>
            <p> Please enter yout details </p>
            <p>Login</p>
            <form>
                <label> pseudo/email</label>
                <input type="text" placeholder='name' onChange={e => setName(e.currentTarget.value)} value={name} />
                <label> Password</label>
                <input type="password" placeholder='password' onChange={e => setPassword(e.currentTarget.value)} value={password} />
                <button onClick={tryLog}> Log in </button>
                <p> Forgot your password? </p>
                <p> or </p>
                <p> Need an account? <span>sign-up here</span></p>
            </form>
        </div>
    )
}

export default Login