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

const user_image_list = [
    "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvbWVufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1679440415182-c362deb2fd40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvbWVufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdvbWVufGVufDB8fDB8fHww",
]

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







    useEffect(() => {
        getAllUsers()
    }, [])

    const socket = useSocket()

    const onLikeUser = (user_id) => {
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        axios.post(`http://localhost:8000/users/like/${user_id}`, {}, {
            headers: headers
        }).then(({ data }) => {
            dispatch(initialiseUser(data))
        })
    }

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
                    <div className="item" key={user.username} onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }}>
                        <img src={user_image_list[index % user_image_list.length]} className='background' alt="" />
                        <div className="item-content">
                            <div className="image">
                                <img src={user_image_list[index % user_image_list.length]} alt="" />
                            </div>
                            <div className="name">{user.username}</div>
                            <div className="limiter" />
                            <div className="info">
                                <div className="icon">
                                    <UserIcon />
                                </div>
                                <div className="text">
                                    {user.firstName}
                                </div>
                                <div className="text">
                                    {user.lastName}
                                </div>
                            </div>
                            <div className="limiter" />
                            <div className="info">
                                <div className="icon">
                                    <Age />
                                </div>
                                <div className="text">
                                    {user.age}
                                </div>
                            </div>
                            <div className="limiter" />
                            <div className="info">
                                <div className="icon">
                                    {user.gender == GenderEnum.MALE ? <MaleIcon /> : <FemaleIcon />}
                                </div>
                            </div>
                            <div className="limiter" />
                            <div className="info">
                                <div className="text">
                                    {user.status}
                                </div>
                            </div>
                            <Tooltip title={me.likes.find(like => like.user_target_id == user.id) ? "Un-like" : "Like"}>
                            <div className="actions">
                                <div className="like" onClick={() => onLikeUser(user.id)}>
                                    <HeartIcon />
                                </div>
                            </div>
                            </Tooltip>
                        </div>
                    </div>
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