import { useDispatch, useSelector } from "react-redux";
import "../styles/modal.scss";
import { ArrowUturnLeft, NoSymbol } from "./icons/Icons";
import {
  editBlockUser,
  editConcernUser,
  selectAllModals,
} from "../store/slices/modalSlice";
import { getAuthorizedInstance } from "../utils/Instance";
import { getToken } from "../store/slices/authSlice";
import { initialiseUser } from "../store/slices/userSlice";

const ModalConfirm = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const modalSlice = useSelector(selectAllModals);
  const instance = getAuthorizedInstance(token.access_token);

  const onBlockUser = async () => {
    dispatch(editBlockUser(modalSlice.blockUser));
    dispatch(editConcernUser(modalSlice.user));
    const res = await instance.post(`/users/block/${modalSlice.user.id}`);
    dispatch(initialiseUser(res.data));
    // .then(({ data }) => {
    //   dispatch(initialiseUser(data));
    //   onSearch(searchFormik.values);
    // });
    dispatch(editBlockUser(modalSlice.blockUser));
  };

  return (
    <section className="blockModalContainer">
      <h3>
        {" "}
        Do you want to block <b>{modalSlice.user.username}</b> ?
      </h3>
      <div className="choices">
        <button
          className="cancel"
          onClick={() => dispatch(editBlockUser(modalSlice.blockUser))}
        >
          {" "}
          Cancel <ArrowUturnLeft />{" "}
        </button>
        <button className="block" onClick={() => onBlockUser()}>
          {" "}
          Block <NoSymbol />{" "}
        </button>
      </div>
    </section>
  );
};

export default ModalConfirm;
