import { useDispatch, useSelector } from "react-redux";
import "../styles/modal.scss";
import {
  editDeleteMainPic,
  editLikedUser,
  editMatch,
  editViewUser,
  resetAllModals,
  selectAllModals,
} from "../store/slices/modalSlice";
import { deleteUserNotif, deleteUserPhoto, selectUser } from "../store/slices/userSlice";
import axios from "axios";
import { getToken } from "../store/slices/authSlice";
import { useCallback, useEffect, useState } from "react";
import { FemaleIcon, MaleIcon, Trash } from "./icons/Icons";
import { useNavigate } from "react-router-dom";
import { getAuthorizedInstance } from "../utils/Instance";
import ModalConfirm from "./ModalConfirm";

const Modals = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(getToken);
  const allModals = useSelector(selectAllModals);
  const navigate = useNavigate();
  const instance = getAuthorizedInstance(token.access_token);
  const [allUsers, setAllUsers] = useState([]);

  async function deletePic() {
    try {
      const delPic = user.photos.filter((photo) => photo.main === true)[0];
      const res = await axios.delete(
        "http://localhost:8000/photo/" + delPic.id,
        {
          headers: {
            Authorization: "Bearer " + (token ? token.access_token : ""),
          },
        }
      );
      dispatch(deleteUserPhoto(res.data.id));
      dispatch(editDeleteMainPic(allModals.deleteMainPic));
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteNotif(id) {
    try {
      const res = await instance.delete("/users/del_notif/" + id);
      dispatch(deleteUserNotif(id))
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }

  const mainPic = (currentUser) => {
    if (currentUser) {
      const res = currentUser.photos.find((photo) => photo.main === true);
      if (res) return res.path;
      return null;
    }
    return null;
  };

  const getLikedUsers = useCallback(() => {
    setAllUsers([]);
    user.liked_by.map((liked) => {
      instance
        .get("/users/" + liked.user_id)
        .then((res) => setAllUsers((prevState) => [...prevState, res.data]));
    });
  }, [user.liked_by]);

  const getNotifUsers = useCallback(() => {
    setAllUsers([]);
    user.notifs.map((notif) => {
      instance
        .get("/users/" + notif.data_user_id)
        .then((res) => setAllUsers((prevState) => [...prevState, res.data]));
    });
  }, [user.notifs, setAllUsers]);

  const getMatches = useCallback(() => {
    setAllUsers([]);
    user.matches.map((match) => {
      const matchId =
        match.user_A_id === user.id ? match.user_B_id : match.user_A_id;
      instance.get("/users/" + matchId).then((res) => {
        setAllUsers((prevState) => [...prevState, res.data]);
      });
    });
  }, [user.matches]);

  useEffect(() => {
    if (allModals.likedUser) getLikedUsers();
    else if (allModals.notif) getNotifUsers();
    else if (allModals.match) getMatches();

    return () => {
      setAllUsers([]);
    };
  }, [allModals, getLikedUsers, getNotifUsers, getMatches]);

  useEffect(() => {
    const cleanup = () => {
      dispatch(resetAllModals());
    };
    return cleanup;
  }, [navigate, dispatch]);

  return (
    <div className="containerApp">
      {allModals.deleteMainPic && (
        <div className="modal">
          <main className="overlayModal">
            <section>
              <h3> Delete profile picture?</h3>
              <div className="choices">
                <button className="del" onClick={deletePic}>
                  {" "}
                  Delete{" "}
                </button>
                <button
                  className="cancel"
                  onClick={() =>
                    dispatch(editDeleteMainPic(allModals.deleteMainPic))
                  }
                >
                  Cancel
                </button>
              </div>
            </section>
            <div
              className="modalRest"
              onClick={() =>
                dispatch(editDeleteMainPic(allModals.deleteMainPic))
              }
            ></div>
          </main>
          <div className="App">{children}</div>
        </div>
      )}
      {allModals.likedUser && (
        <div className="modal">
          <main className="overlayModal">
            {allUsers.length > 0 ? (
              <section className="listModal">
                <h3> Ces utilisateurs ont aimé ton profil </h3>
                <div className="listContainer">
                  {allUsers.map((userSeen, index) => {
                    return (
                      <div
                        className="userLiked"
                        key={index}
                        onClick={() =>
                          navigate("/profil/see", {
                            state: userSeen,
                          })
                        }
                      >
                        <div className="leftContent">
                          <div className="profilPic">
                            {mainPic(userSeen) && (
                              <img
                                src={`http://localhost:8000/${mainPic(
                                  userSeen
                                )}`}
                                alt="photo de profil"
                              />
                            )}
                          </div>
                          <p>{userSeen.firstName}</p>
                          <p>{userSeen.lastName}</p>
                          <p>{userSeen.age}y</p>
                        </div>
                        <div className="rightContent">
                          {userSeen.gender === "FEMALE" ? (
                            <FemaleIcon />
                          ) : (
                            <MaleIcon />
                          )}
                          {userSeen.status === "ONLINE" ? (
                            <span> online</span>
                          ) : (
                            <span> offline </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editLikedUser(allModals.likedUser))}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            ) : (
              <section>
                <h3> No one has a crush on you yet.</h3>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editLikedUser(allModals.likedUser))}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editLikedUser(allModals.likedUser))}
            ></div>
          </main>

          <div className="App">{children}</div>
        </div>
      )}
      {allModals.viewUser && (
        <div className="modal">
          <main className="overlayModal">
            {allUsers.length > 0 ? (
              <section className="listModal">
                <h3> Ces utilisateurs ont vue ton profil </h3>
                <div className="listContainer">
                  {allUsers.map((userSeen, index) => {
                    return (
                      <div
                        className="userLiked"
                        key={index}
                        onClick={() =>
                          navigate("/profil/see", {
                            state: userSeen,
                          })
                        }
                      >
                        <div className="leftContent">
                          <div className="profilPic">
                            {mainPic(userSeen) && (
                              <img
                                src={`http://localhost:8000/${mainPic(
                                  userSeen
                                )}`}
                                alt="photo de profil"
                              />
                            )}
                          </div>
                          <p>{userSeen.firstName}</p>
                          <p>{userSeen.lastName}</p>
                          <p>{userSeen.age}y</p>
                        </div>
                        <div className="rightContent">
                          {userSeen.gender === "FEMALE" ? (
                            <FemaleIcon />
                          ) : (
                            <MaleIcon />
                          )}
                          {userSeen.status === "ONLINE" ? (
                            <span> online</span>
                          ) : (
                            <span> offline </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editViewUser(allModals.viewUser))}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            ) : (
              <section>
                <h3> No one has seen your profile yet.</h3>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editLikedUser(allModals.viewUser))}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editViewUser(allModals.viewUser))}
            ></div>
          </main>

          <div className="App">{children}</div>
        </div>
      )}
      {allModals.notif && (
        <div className="modal">
          <main className="overlayModal">
            {user.notifs.length > 0 ? (
              <section className="listModal">
                <h3> Mes notifications </h3>
                <div className="listContainer">
                  {user.notifs.map((notif, index) => {
                    return (
                      <div className="notification" key={index}>
                        <div className="leftContent">
                          <div className="profilPic">
                            {mainPic(allUsers[index]) && (
                              <img
                                src={`http://localhost:8000/${mainPic(
                                  allUsers[index]
                                )}`}
                                alt="photo de profil"
                              />
                            )}
                          </div>
                          <p>{notif.data}</p>
                        </div>
                        <div
                          className="rightContent"
                          onClick={() => deleteNotif(notif.id)}
                        >
                          <Trash />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editViewUser(allModals.notif))}
                  >
                    Fermer
                  </button>
                </div>
              </section>
            ) : (
              <section className="notNotif">
                Pas de notifications en attente...
              </section>
            )}

            <div
              className="modalRest"
              onClick={() => dispatch(editViewUser(allModals.notif))}
            ></div>
          </main>
        </div>
      )}
      {allModals.blockUser && (
        <div className="modal">
          <main className="overlayModal">
            <ModalConfirm />
          </main>
        </div>
      )}
      {allModals.match && (
        <div className="modal">
          <main className="overlayModal">
            {allUsers.length > 0 ? (
              <section className="listModal">
                <h3> Your matches </h3>
                <div className="listContainer">
                  {allUsers.map((userSeen, index) => {
                    return (
                      <div
                        className="userLiked"
                        key={index}
                        onClick={() =>
                          navigate("/profil/see", {
                            state: userSeen,
                          })
                        }
                      >
                        <div className="leftContent">
                          <div className="profilPic">
                            {mainPic(userSeen) && (
                              <img
                                src={`http://localhost:8000/${mainPic(
                                  userSeen
                                )}`}
                                alt="photo de profil"
                              />
                            )}
                          </div>
                          <p>{userSeen.firstName}</p>
                          <p>{userSeen.lastName}</p>
                          <p>{userSeen.age}y</p>
                        </div>
                        <div className="rightContent">
                          {userSeen.gender === "FEMALE" ? (
                            <FemaleIcon />
                          ) : (
                            <MaleIcon />
                          )}
                          {userSeen.status === "ONLINE" ? (
                            <span> online</span>
                          ) : (
                            <span> offline </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button onClick={() => dispatch(editMatch(allModals.match))}>
                    Fermer
                  </button>
                </div>
              </section>
            ) : (
              <section className="listModal">
                <h3> Nobody has a match with you yet</h3>
                <div className="btnClose">
                  <button onClick={() => dispatch(editMatch(allModals.match))}>
                    Fermer
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editMatch(allModals.match))}
            ></div>
          </main>
        </div>
      )}
      <div className="App">{children}</div>
    </div>
  );
};

export default Modals;
