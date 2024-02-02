import { useDispatch, useSelector } from "react-redux";
import "../styles/verify_email.scss";
import { getToken } from "../store/slices/authSlice";
import { getAuthorizedInstance } from "../utils/Instance";
import { KeyIcon, SendIcon } from "../components/icons/Icons";
import { useFormik } from "formik";
import VerifEmailSchema from "../schemas/VerifEmailSchema";
import { useState } from "react";
import { initialiseUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";


const VerifyEmail = () => {

  const [errorMsg, setErrorMsg] = useState('')
  const token = useSelector(getToken);
  const instance = getAuthorizedInstance(token.access_token);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onResendCode = () => {
    instance.post('/users/resend_code')
  }

  const onSendCode = (values) => {
    instance.post('/users/verif_email', values).then(({ data }) => {
      dispatch(initialiseUser(data))
      navigate('/home')
    })
      .catch((error) => {
        setErrorMsg(error.response.data.detail);
      });
  }

  const formik = useFormik({
    validationSchema: VerifEmailSchema(),
    initialValues: {
      code: "",
    },
    onSubmit: (values) => onSendCode(values),
  });

  return (
    <form className="container" onSubmit={formik.handleSubmit}>
      <h3 className="title">Verify your email</h3>
      <div className="inputContainer">
        <div className="loginInput">
          <input
            type="code"
            placeholder=" "
            name="code"
            onChange={formik.handleChange}
          />
          <label>Code</label>
          <div className="icon">
            <KeyIcon />
          </div>
        </div>
        <button className="icon" type="submit" >

          <SendIcon />
        </button>
      </div>
      {!!formik.errors.code && formik.touched.code && (
        <div className="error">{formik.errors.code}</div>
      )}
      {!!errorMsg &&
        <div className="error">{errorMsg}</div>}
      <p onClick={onResendCode}>Re-send code</p>
    </form>
  );
};

export default VerifyEmail;
