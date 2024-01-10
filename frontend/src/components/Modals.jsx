import { useDispatch, useSelector } from "react-redux";
import "../styles/modal.scss";
import { editDeleteMainPic } from "../store/slices/modalSlice";
import { deleteUserPhoto, selectUser } from "../store/slices/userSlice";
import axios from "axios";
import { getToken } from "../store/slices/authSlice";

export const DeleteMainPicModal = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(getToken);

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

  return (
    <div className="modal">
      <main className="deleteMainPicModal">
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
      </main>
    </div>
  );
};
