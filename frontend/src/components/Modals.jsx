import { useDispatch, useSelector } from "react-redux";
import "../styles/modal.scss";
import {
  editBlockUser,
  editBlockedList,
  editDeleteMainPic,
  editLikedUser,
  editMatch,
  editViewUser,
  resetAllModals,
  selectAllModals,
} from "../store/slices/modalSlice";
import {
  deleteUserNotif,
  deleteUserPhoto,
  selectUser,
} from "../store/slices/userSlice";
import axios from "axios";
import { getToken } from "../store/slices/authSlice";
import { useEffect } from "react";
import { Trash } from "./icons/Icons";
import { useNavigate } from "react-router-dom";
import { getAuthorizedInstance } from "../utils/Instance";
import ModalConfirm from "./ModalConfirm";
import ListUserModal from "./profil/ListUserModal";

const Modals = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(getToken);
  const allModals = useSelector(selectAllModals);
  const navigate = useNavigate();
  const instance = getAuthorizedInstance(token.access_token);

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
      await instance.delete("/users/del_notif/" + id);
      dispatch(deleteUserNotif(id));
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
        </div>
      )}
      {allModals.likedUser && (
        <div className="modal">
          <main className="overlayModal">
            {user.liked_by.length > 0 ? (
              <section className="listModal">
                <h3> These users liked your profile </h3>
                <div className="listContainer">
                  {user.liked_by.map((userLiked, index) => {
                    return <ListUserModal user={userLiked.user} key={index} />;
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editLikedUser(allModals.likedUser))}
                  >
                    Close
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
                    Close
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editLikedUser(allModals.likedUser))}
            ></div>
          </main>
        </div>
      )}
      {allModals.viewUser && (
        <div className="modal">
          <main className="overlayModal">
            {user.profile_seen_by.length > 0 ? (
              <section className="listModal">
                <h3> These users have seen your profile </h3>
                <div className="listContainer">
                  {user.profile_seen_by.map((userSee, index) => {
                    return <ListUserModal user={userSee.user} key={index} />;
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editViewUser(allModals.viewUser))}
                  >
                    Close
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
                    Close
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editViewUser(allModals.viewUser))}
            ></div>
          </main>
        </div>
      )}
      {allModals.notif && (
        <div className="modal">
          <main className="overlayModal">
            {user.notifs.length > 0 ? (
              <section className="listModal">
                <h3> My notifications </h3>
                <div className="listContainer">
                  {user.notifs.map((notif, index) => {
                    return (
                      <div className="notification" key={index}>
                        <div className="leftContent">
                          <div className="profilPic">
                            {mainPic(notif.data_user) && (
                              <img
                                src={`http://localhost:8000/${mainPic(
                                  notif.data_user
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
                {/* <div className="listContainer">
                  {user.notifs.map((notif, index) => {
                    return <ListUserModal user={notif.data_user} key={index} />;
                  })}
                </div> */}
                <div className="btnClose">
                  <button
                    onClick={() => dispatch(editViewUser(allModals.notif))}
                  >
                    Close
                  </button>
                </div>
              </section>
            ) : (
              <section className="notNotif">
                No pending notifications...
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
            <div
              className="modalRest"
              onClick={() => dispatch(editBlockUser(allModals.blockUser))}
            ></div>
          </main>
        </div>
      )}
      {allModals.match && (
        <div className="modal">
          <main className="overlayModal">
            {user.matches.length > 0 ? (
              <section className="listModal">
                <h3> Your matches </h3>
                <div className="listContainer">
                  {user.matches.map((userMatched, index) => {
                    return (
                      <ListUserModal
                        user={
                          userMatched.user_A_id === user.id
                            ? userMatched.user_B
                            : userMatched.user_A
                        }
                        type={"modal"}
                        key={index}
                      />
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button onClick={() => dispatch(editMatch(allModals.match))}>
                    Close
                  </button>
                </div>
              </section>
            ) : (
              <section>
                <h3> Nobody has a match with you yet</h3>
                <div className="btnClose">
                  <button onClick={() => dispatch(editMatch(allModals.match))}>
                    Close
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
      {allModals.blockedList && (
        <div className="modal">
          <main className="overlayModal">
            {user.blocked.length > 0 ? (
              <section className="listModal">
                <h3> Blocked users </h3>
                <div className="listContainer">
                  {user.blocked.map((blocked, index) => {
                    return (
                      <ListUserModal
                        user={blocked.user_target}
                        type={"block"}
                        key={index}
                      />
                    );
                  })}
                </div>
                <div className="btnClose">
                  <button
                    onClick={() =>
                      dispatch(editBlockedList(allModals.blockedList))
                    }
                  >
                    Close
                  </button>
                </div>
              </section>
            ) : (
              <section>
                <h3> You haven&apos;t blocked any users. </h3>
                <div className="btnClose">
                  <button
                    onClick={() =>
                      dispatch(editBlockedList(allModals.blockedList))
                    }
                  >
                    Close
                  </button>
                </div>
              </section>
            )}
            <div
              className="modalRest"
              onClick={() => dispatch(editBlockedList(allModals.blockedList))}
            ></div>
          </main>
        </div>
      )}
      <div className="App">{children}</div>
    </div>
  );
};

export default Modals;
