import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/userSlice";
import axios from "axios";
import { getToken } from "../store/slices/authSlice";
import { Cancel, Confirm, Pic, UserIcon } from "./icons/Icons";

export const MainPic = () => {
  const token = useSelector(getToken);
  const user = useSelector(selectUser);
  const [mainPic, setMainPic] = useState({
    displayPic: null,
    updatePic: null,
    actualPic: null,
  });

  async function patchPic() {
    const formData = new FormData();
    formData.append(`image`, mainPic.updatePic);

    try {
      const res = await axios.patch(
        "http://localhost:8000/photo/main",
        formData,
        {
          headers: {
            Authorization: "Bearer " + (token ? token.access_token : ""),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      setMainPic({
        actualPic: res.data,
        updatePic: null,
        displayPic: null,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setMainPicInput(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setMainPic((prevState) => ({
        ...prevState,
        displayPic: reader.result,
        updatePic: file,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    if (user) {
      setMainPic((prevState) => ({
        ...prevState,
        actualPic: user.photos.filter((photo) => photo.main === true)[0],
      }));
    }
  }, [user]);

  if (mainPic.displayPic)
    return (
      <div className="displayPic">
        <img src={mainPic.displayPic} alt="Photo de profil" />
        <div className="confirmChoice" onClick={patchPic}>
          <Confirm />
        </div>
        <div
          className="cancelChoice"
          onClick={() =>
            setMainPic((prevState) => ({
              ...prevState,
              updatePic: null,
              displayPic: null,
            }))
          }
        >
          <Cancel />
        </div>
      </div>
    );
  else if (mainPic.actualPic)
    return (
      <div className="actualPic">
        <img src={`http://localhost:8000/${mainPic.actualPic.path}`} />
        <label htmlFor="pic" className="picIconCtn">
          <Pic />
        </label>
        <input
          type="file"
          id="pic"
          accept="image/*"
          onChange={setMainPicInput}
        />
      </div>
    );
  else
    return (
      <div className="defaultPic">
        <UserIcon className="userIcon" />
        <label htmlFor="pic" className="picIconCtn">
          <Pic />
        </label>
        <input
          type="file"
          id="pic"
          accept="image/*"
          onChange={setMainPicInput}
        />
      </div>
    );
};
