import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import "../styles/chat.scss";
import {
  Age,
  FemaleIcon,
  MaleIcon,
  SearchIcon,
  SendIcon,
  UserIcon,
} from "../components/icons/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getActions } from "../utils/SnackBarsManager";
import { getToken } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import GenderEnum from "../Enum/GenderEnum";
import { useFormik } from "formik";
import MessageSchema from "../schemas/MessageSchema";
import { useSocket } from "../utils/PrivateRoutes";
import { ParseDate } from "../utils/ParseDate";
import { getAuthorizedInstance } from "../utils/Instance";
import Loader from "../components/utils/Loader";

const user_image_list = [
  "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvbWVufGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1679440415182-c362deb2fd40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHdvbWVufGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFufGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdvbWVufGVufDB8fDB8fHww",
];

const Chat = () => {
  const [disabled, setDisabled] = useState(false);
  const socket = useSocket();
  const me = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector(getToken);
  const instance = getAuthorizedInstance(token.access_token);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState(null);
  const [searchbarValue, setSearchbarValue] = useState("");

  const formik = useFormik({
    validationSchema: MessageSchema(),
    initialValues: {
      message: "",
    },
    onSubmit: () => sendMessage(),
  });

  const getUser = () => {
    instance
      .get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllMessages = () => {
    instance
      .get(`/messages/${id}`)
      .then(({ data }) => {
        setMessages(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllUsers = async () => {
    const result = await Promise.all(
      me.matches.map(async (match) => {
        const currentUserId =
          match.user_A_id === me.id ? match.user_B_id : match.user_A_id;
        const userToList = await instance.get(`/users/${currentUserId}`);
        return userToList.data;
      })
    );
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        console.log(usersData);
        setUserList(usersData);
        console.log(userList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [me]);

  useEffect(() => {
    const elem = document.getElementById("messageList");
    if (elem) elem.scrollTop = elem.scrollHeight;
  }, [messages]);

  const onUpdateStatus = ({ user_id, status }) => {
    if (user_id == id) getUser();
  };

  useEffect(() => {
    if (socket) socket.on("update-status", onUpdateStatus);

    return () => {
      if (socket) socket.off("update-status", onUpdateStatus);
    };
  }, [socket]);

  const onUpdateMessages = () => {
    getAllMessages();
  };

  useEffect(() => {
    if (socket) socket.on("update-messages", onUpdateMessages);

    return () => {
      if (socket) socket.off("update-messages", onUpdateMessages);
    };
  }, [socket]);

  useEffect(() => {
    if (token && id) getUser();
  }, [token, id]);

  useEffect(() => {
    if (token && id) getAllMessages();
  }, [token, id]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const sendMessage = () => {
    if (!disabled) {
      setDisabled(true);

      setTimeout(() => {
        setDisabled(false);
      }, [1000]);

      instance
        .post(`/messages/${id}`, { data: formik.values.message })
        .then((response) => {
          setMessages((prev) => [...prev, response.data]);
          formik.resetForm();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const onDeleteNewNotifMessage = ({ notif_id }) =>
    instance
      .post(`/users/del_notif/${notif_id}`)
      .then(({ data }) => dispatch(initialiseUser({ ...data })));

  useEffect(() => {
    console.log("socket", socket);
    if (socket) {
      socket.on("add-message-notification", onDeleteNewNotifMessage);
      return () =>
        socket.off("add-message-notification", onDeleteNewNotifMessage);
    }
  }, [socket]);

  function searchBarInput(e) {
    setSearchbarValue(e.target.value);
  }

  // useEffect(() => {
  //   if (userList) {
  //     setUserList(
  //       userList.filter((user) =>
  //         user.username.toLowerCase().includes(searchbarValue.toLowerCase())
  //       )
  //     );
  //   }
  // }, [searchbarValue]);



  if (id == undefined)
    return (
      <div className="main">
        {userList && userList.length > 0 && (
          <div className="searchbar">
            <input type="text" placeholder="search" onChange={searchBarInput} />
            <div className="icon">
              <SearchIcon />
            </div>
          </div>
        )}
        {userList && userList.length <= 0 && (
          <div className="nothing">
            <h2> You don&apos;t have a match yet</h2>
            <button onClick={() => navigate("/")}>
              {" "}
              Find your soul mate ❤
            </button>
          </div>
        )}
        {!userList && (
          <div className="loaderChat">
            <Loader />
          </div>
        )}
        {userList && userList.length > 0 && (
          <div className="userListContainer">
            {userList.map((user) => (
              <UserCard
                key={user.id}
                selector
                me={me}
                user={user}
                onLikeUser={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    );
  if (
    me.matches.find(
      (match) => match.user_A_id == id || match.user_B_id == id
    ) == undefined
  ) {
    enqueueSnackbar("Can't chat with this person", {
      variant: "error",
      action: getActions(""),
    });
    navigate("/chat");
  } else {
    return (
      <div className="main">
        {user && (
          <div
            className="userInfo"
            onClick={() => {
              navigate("/profil/see", { state: user });
            }}
          >
            <img
              src={user_image_list[user.id % user_image_list.length]}
              className="background"
              alt=""
            />
            <div className="userInfo-content">
              <div className="image">
                <img
                  src={
                    user.photos.find((photo) => photo.main)
                      ? `http://localhost:8000/${
                          user.photos.find((photo) => photo.main).path
                        }`
                      : null
                  }
                  alt=""
                />
              </div>
              <div className="name">{user.username}</div>
              <div className="limiter" />
              <div className="info">
                <div className="text">{user.firstName}</div>
                <div className="text">{user.lastName}</div>
              </div>
              <div className="limiter" />
              <div className="info">
                <div className="icon">
                  <Age />
                </div>
                <div className="text">{user.age}</div>
              </div>
              <div className="limiter" />
              <div className="info">
                <div className="icon">
                  {user.gender == GenderEnum.MALE ? (
                    <MaleIcon />
                  ) : (
                    <FemaleIcon />
                  )}
                </div>
              </div>
              <div className="limiter" />
              <div className="info">
                <div className="text">{user.status}</div>
              </div>
            </div>
          </div>
        )}

        <div className="messageList" id="messageList">
          {messages.map((message) => (
            <div
              className={`message ${
                message.user_A_id == me.id ? "mine" : "target"
              }`}
            >
              <div className="text">{message.data}</div>
              <div className="date">{ParseDate(message.date)}</div>
            </div>
          ))}
        </div>

        <form className="inputbar" onSubmit={formik.handleSubmit}>
          <input
            id="message-input"
            type="text"
            placeholder="type here"
            autoComplete="off"
            autoFocus
            name="message"
            value={formik.values.message}
            maxLength={128}
            onChange={formik.handleChange}
          />
          <button className="icon" disabled={disabled} type="submit">
            <SendIcon />
          </button>
        </form>
      </div>
    );
  }
};

export default Chat;
