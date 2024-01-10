import { useSelector } from "react-redux"
import UserCard from "../components/UserCard"
import { selectUser } from "../store/slices/userSlice"
import '../styles/chat.scss'
import { Age, FemaleIcon, MaleIcon, SearchIcon, SendIcon, UserIcon } from "../components/icons/Icons"
import { useNavigate, useParams } from "react-router-dom"
import { enqueueSnackbar } from "notistack"
import { getActions } from "../utils/SnackBarsManager"
import { getToken } from '../store/slices/authSlice';
import { useEffect, useState } from "react"
import axios from "axios"
import GenderEnum from "../Enum/GenderEnum"
import { useFormik } from "formik"
import MessageSchema from "../schemas/MessageSchema"
import printVarsHook from "../components/printVarsHook"
import { useSocket } from "../utils/PrivateRoutes"
import { ParseDate } from "../utils/ParseDate"


const user_image_list = [
	"https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvbWVufGVufDB8fDB8fHww",
	"https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
	"https://plus.unsplash.com/premium_photo-1679440415182-c362deb2fd40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvbWVufGVufDB8fDB8fHww",
	"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww",
	"https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdvbWVufGVufDB8fDB8fHww",
]

const Chat = () => {
    const [disabled, setDisabled] = useState(false)

    const socket = useSocket()
    const me = useSelector(selectUser)

    const navigate = useNavigate()

    const { id } = useParams()

    const token = useSelector(getToken)

    const [user, setUser] = useState(null)
    const [messages, setMessages] = useState([])

    const formik = useFormik({
        validationSchema: MessageSchema(),
        initialValues: {
            message: '',
        },
        onSubmit: () => sendMessage(),
    });

    const getUser = () => {
        axios.get(`http://localhost:8000/users/${id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        }).then(({ data }) => {
            setUser(data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const getAllMessages = () => {
        axios.get(`http://localhost:8000/messages/${id}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.access_token}` }
        }).then(({ data }) => {
            setMessages(data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        const elem = document.getElementById("messageList")
        if (elem)
            elem.scrollTop = elem.scrollHeight
    }, [messages])

    const onUpdateStatus = ({ user_id, status }) => {
        if (user_id == id)
            getUser()
    }

    useEffect(() => {
        if (socket)
            socket.on('update-status', onUpdateStatus);

        return () => {
            if (socket)
                socket.off('update-status', onUpdateStatus);
        };
    }, [socket]);


    const onUpdateMessages = () => {
        getAllMessages()
    }

    useEffect(() => {
        if (socket)
            socket.on('update-messages', onUpdateMessages);

        return () => {
            if (socket)
                socket.off('update-messages', onUpdateMessages);
        };
    }, [socket]);

        useEffect(() => {
            if (token && id)
                getUser()
        }, [token, id])

        useEffect(() => {
            if (token && id)
                getAllMessages()
        }, [token, id])

        useEffect(() => {
        console.log(user)

        }, [user])

        const sendMessage = () => {
            if (!disabled){
            setDisabled(true)

            setTimeout(() => {
                setDisabled(false)
            }, [1000]);
                
            axios.post(`http://localhost:8000/messages/${id}`, { data: formik.values.message }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.access_token}`
                }
            })
            .then(response => {
                setMessages(prev => [...prev, response.data])
                formik.resetForm()
            })
            .catch(error => {
                console.error(error);
            });}
        }

        const onDeleteNewNotifMessage = ({notif_id}) => axios.post(`http://localhost:8000/users/del_notif/${notif_id}`, {}, {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })


        useEffect(() => {
            console.log('socket', socket)
            if (socket) {
                socket.on('add-message-notification', onDeleteNewNotifMessage)
                return () => socket.off('add-message-notification', onDeleteNewNotifMessage)
            }

        }, [socket])

if (id == undefined)
    return (
        <div className="main">
            <div className="searchbar">
        <div className="icon">
            <SearchIcon/>
        </div>

                <input type="text" placeholder="search"/>
            </div>
            <div className="userList">
            {me.matches.map(match => <UserCard key={match.id} selector me={me} onClick={(id) => {navigate(`/chat/${id}`)}} user={match.user_A_id == me.id ? match.user_B : match.user_A} onLikeUser={() => {}}/> )}

            </div>
        </div>
    )
    if (
        me.matches.find(match => match.user_A_id == id || match.user_B_id == id) == undefined
    ) {
        enqueueSnackbar("Can't chat with this person", {variant: 'error', action: getActions('')})
        navigate("/chat")
    } else  {
    return (
        <div className="main">

        {user && <div className="userInfo" onClick={() => {alert('go to profile')}}>
            <img src={user_image_list[user.id % user_image_list.length]} className='background' alt="" />
            <div className="userInfo-content">
                <div className="image">
                    <img src={user_image_list[user.id % user_image_list.length]} alt="" />
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
            </div>
        </div>}

        <div className="messageList" id="messageList">
        {messages.map((message) => (
            <div className={`message ${message.user_A_id == me.id ? 'mine' : 'target'}`}>
                <div className="text">
                {message.data}
                </div>
                <div className="date">
                    {ParseDate(message.date)}
                </div>
                </div>
        ))}
        </div>

        <form className="inputbar" onSubmit={formik.handleSubmit}>
            <input id="message-input" type="text" placeholder="type here" autoComplete="off" autoFocus name="message" value={formik.values.message} maxLength={128} onChange={formik.handleChange}/>
            <button className="icon" disabled={disabled} type="submit">
            
                <SendIcon/>
            </button>
        </form>

        </div>
    )
    }
}

export default Chat
