import { useSelector } from "react-redux"
import { getToken } from "../store/slices/authSlice"

const Profil = () => {

    const token = useSelector(getToken)

    return (
        <div>
            <button onClick={() => {
                console.log(token)
            }}>Get Me</button>
            Profil
        </div>
    )
}

export default Profil