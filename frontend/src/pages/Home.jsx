import { useEffect, useState } from 'react';
import '../styles/home.scss'

import { getToken } from '../store/slices/authSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import printVarsHook from '../components/printVarsHook';
import { UserIcon, Age, MaleIcon, FemaleIcon, HeartIcon } from "../components/icons/Icons";
import GenderEnum from '../Enum/GenderEnum';
import { useSocket } from '../utils/PrivateRoutes';
import { initialiseUser, selectUser } from '../store/slices/userSlice';
import { Tooltip } from '@mui/material';
import UserCard from '../components/UserCard';

const Home = () => {

    const [allUsers, setAllUsers] = useState(Array())
    const me = useSelector(selectUser)
    const token = useSelector(getToken)
    const dispatch = useDispatch()


    const getAllUsers = () => {
        axios.get("http://localhost:8000/users/", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        }).then(({ data }) => {
            setAllUsers(data.filter(user => user.id != me.id))
        }).catch((error) => {
            console.log(error)
        })
    }


    const onLikeUser = (user_id) => {
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        axios.post(`http://localhost:8000/users/like/${user_id}`, {}, {
            headers: headers
        }).then(({ data }) => {
            dispatch(initialiseUser(data))
        })
    }




    useEffect(() => {
        getAllUsers()
    }, [])

    const socket = useSocket()

    const onUpdateStatus = ({ user_id, status }) => {
        if (user_id != me.id)
            getAllUsers()
    }

    useEffect(() => {
        if (socket)
            socket.on('update-status', onUpdateStatus);

        return () => {
            if (socket)
                socket.off('update-status', onUpdateStatus);
        };
    }, [socket]);

    printVarsHook(allUsers, 'allUsers')

    return (
        <div className="main">
            <div className="search-container">
                <div className="title">All Users</div>
                {allUsers.map((user, index) =>
                    <UserCard me={me} user={user} key={user.id} onLikeUser={onLikeUser}/>
                )}
            </div>

            <div className="search-container">
                <div className="title">My Notifs</div>

                {me != null && me.notifs.map(notif =>
                    <div className="notif-item">
                        <div className="icon"></div>
                        <div className="type">{notif.type}</div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Home;