import { useDispatch } from "react-redux";
import "../styles/header.scss"
import { Logout, UserIcon } from "./icons/Icons";
import { setToken } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Header = ({children, connected = true}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()



    return (
        <div className="container">
            <div className="header">
                <div className="logo" onClick={() => navigate('/')}>Matcha ❤</div>
                
                {connected && <div className="other">

                    <div className="me" onClick={() => navigate('/profil')}>
                        <div className="image">
                            <UserIcon/>
                        </div>
                        <div className="name">
                            My name here
                        </div>

                    </div>

                    <div className="limiter"/>
                    <div className="logout" onClick={() => {
                        dispatch(setToken(null))
                        navigate('/login')
                    }}><Logout/></div>
                </div>}
            </div>
            <div className="content">
            {children}
            </div>
            <div className="wave-container">
                <div className="sticky">

                <div className="wave"/>
                <div className="wave"/>
            <div className="wave"/>
            </div>
            </div>
            {/* <BlobAnimation/> */}
        </div>
    )
}

export default Header;