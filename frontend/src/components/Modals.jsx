import { useDispatch, useSelector } from "react-redux";
import "../styles/modal.scss";
import {
  editDeleteMainPic,
  editLikedUser,
  editViewUser,
  resetAllModals,
  selectAllModals,
} from "../store/slices/modalSlice";
import { deleteUserPhoto, selectUser } from "../store/slices/userSlice";
import axios from "axios";
import { getToken } from "../store/slices/authSlice";
import { useEffect, useState } from "react";
import { FemaleIcon, MaleIcon } from "./icons/Icons";
import { useNavigate } from "react-router-dom";
import { getAuthorizedInstance } from "../utils/Instance";

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
      dispatch(editDeleteMainPic());
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (allModals.likedUser) getLikedUsers();
  }, [allModals]);

  useEffect(() => {
    const cleanup = () => {
      dispatch(resetAllModals());
    };
    return cleanup;
  }, [navigate, dispatch]);

  function getLikedUsers() {
    setAllUsers([]);
    user.liked_by.map((liked) => {
      instance
        .get("/users/" + liked.user_id)
        .then((res) => setAllUsers((prevState) => [...prevState, res.data]));
    });
  }

  if (allModals.deleteMainPic)
    return (
      <div className="modal">
        <main className="overlayModal">
          <section>
            <h3> Supprimer la photo de profil ?</h3>
            <div className="choices">
              <button className="del" onClick={deletePic}>
                {" "}
                Supprimer{" "}
              </button>
              <button
                className="cancel"
                onClick={() => dispatch(editDeleteMainPic())}
              >
                Annuler
              </button>
            </div>
          </section>
          <div
            className="modalRest"
            onClick={() => dispatch(editDeleteMainPic())}
          ></div>
        </main>
        <div className="App">{children}</div>
      </div>
    );
  else if (allModals.likedUser) {
    const mainPic = (user) => {
      const res = user.photos.find((photo) => photo.main === true);
      if (res) return res.path;
      return null;
    };
    return (
      <div className="modal">
        <main className="overlayModal">
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
                            src={`http://localhost:8000/${mainPic(userSeen)}`}
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
              <button onClick={() => dispatch(editLikedUser())}>Fermer</button>
            </div>
          </section>
          <div
            className="modalRest"
            onClick={() => dispatch(editLikedUser())}
          ></div>
        </main>

        <div className="App">{children}</div>
      </div>
    );
  } else if (allModals.viewUser) {
    const mainPic = (user) => {
      const res = user.photos.find((photo) => photo.main === true);
      if (res) return res.path;
      return null;
    };
    return (
      <div className="modal">
        <main className="overlayModal">
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
                            src={`http://localhost:8000/${mainPic(userSeen)}`}
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
              <button onClick={() => dispatch(editViewUser())}>Fermer</button>
            </div>
          </section>
          <div
            className="modalRest"
            onClick={() => dispatch(editViewUser())}
          ></div>
        </main>

        <div className="App">{children}</div>
      </div>
    );
  } else return <div className="App">{children}</div>;
};

export default Modals;
