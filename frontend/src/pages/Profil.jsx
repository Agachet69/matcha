import { useSelector } from "react-redux"
import { getToken } from "../store/slices/authSlice"
import { selectUser } from "../store/slices/userSlice"

const Profil = () => {

    const token = useSelector(getToken)
    const user = useSelector(selectUser);

    return (
        <div>
            <button onClick={() => {
                console.log(token)
            }}>Get Me</button>
            
            <button onClick={() => console.log(user)}> getUser </button>
            Profil
        </div>
    )
}

export default Profil