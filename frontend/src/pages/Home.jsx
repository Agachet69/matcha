import { useEffect, useState } from 'react';
import '../styles/home.scss'

import { getToken } from '../store/slices/authSlice';
import axios from 'axios';
import { useSelector } from 'react-redux';
import printVarsHook from '../components/printVarsHook';
import { UserIcon, Age, MaleIcon, FemaleIcon, HeartIcon } from "../components/icons/Icons";
import GenderEnum from '../Enum/GenderEnum';
import updateStatus from '../components/updateStatus';

const user_image_list = [
    "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvbWVufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1679440415182-c362deb2fd40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvbWVufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdvbWVufGVufDB8fDB8fHww",
]

const Home = () => {

    const [allUsers, setAllUsers] = useState(Array())
    const [me, setMe] = useState(null)
    const token = useSelector(getToken)

    useEffect(() => {

        axios.get("http://localhost:8000/users/me", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        }).then(({ data }) => {
            const my_user = data
            setMe(data)
            axios.get("http://localhost:8000/users/", {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
            }).then(({ data }) => {
                setAllUsers(data.filter(user => user.id != my_user.id))
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })




    }, [])



    const onLikeUser = (user_id) => {
        const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        axios.post(`http://localhost:8000/users/like/${user_id}`, {}, {
            headers: headers
        }).then(({ data }) => {
            console.log(data)
        })
    }

    updateStatus(({user_id, status}) => {
        if (allUsers) {
            const index = allUsers.findIndex(user => user.id == user_id)
            if (index >= 0) {

                const temp = [...allUsers]
                
                temp[index].status = status

                setAllUsers(temp)
            }

        }

    })

    return (
        <div className="main">
            <div className="search-container">
                <div className="title">All Users</div>
                {allUsers.map((user, index) =>
                    <div className="item" key={user.username} onWheel={e => {e.currentTarget.scrollLeft += e.deltaY}}>
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
                            <div className="actions">
                                <div className="like" onClick={() => onLikeUser(user.id)}>
                                    <HeartIcon />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="search-container">
                <div className="title">My Notifs</div>

                {me!=null && me.notifs.map(notif => 
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