import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { initialiseUser, selectUser } from "../store/slices/userSlice";
import "../styles/chat.scss";
import { SendIcon } from "../components/icons/Icons";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getActions } from "../utils/SnackBarsManager";
import { getToken } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import MessageSchema from "../schemas/MessageSchema";
import { useSocket } from "../utils/PrivateRoutes";
import { ParseDate } from "../utils/ParseDate";
import { getAuthorizedInstance } from "../utils/Instance";
import Loader from "../components/utils/Loader";

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

  const onUpdateStatus = ({ user_id }) => {
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

  if (id == undefined)
    return (
      <div className="main">
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
            className={
              user.gender == "MALE" ? "userInfo male" : "userInfo female"
            }
            onClick={() => {
              navigate("/profil/see", { state: user });
            }}
          >
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
            </div>
            <div className="limiter" />
            <div className="info">
              <div className="text">{user.status}</div>
            </div>
          </div>
        )}

        <div className="messageList" id="messageList">
          {messages.map((message, index) => (
            <div
              key={index}
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
