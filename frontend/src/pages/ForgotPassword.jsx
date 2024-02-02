import { useDispatch, useSelector } from "react-redux";
import "../styles/login.css";
import { getToken } from "../store/slices/authSlice";
import { getAuthorizedInstance } from "../utils/Instance";
import { KeyIcon, SendIcon } from "../components/icons/Icons";
import { useFormik } from "formik";
import VerifEmailSchema from "../schemas/VerifEmailSchema";
import { useState } from "react";
import { initialiseUser } from "../store/slices/userSlice";
import { useNavigate, useNavigation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import ForgotPasswordSchema from "../schemas/ForgotPasswordSchema";
import axios from "axios";
import { useSearchParams } from 'react-router-dom'


const ForgotPassword = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [searchParams] = useSearchParams();
  const navigate = useNavigation()
  console.log(searchParams.get('code'))
  console.log()
  const onChangePassword = (values) => {
    console.log('oui')
    axios.post('http://localhost:8000/users/forgot_password', { ...values, code: searchParams.get('code'), username: searchParams.get('username') }).then(({ data }) => {
      navigate('/login')
    })
      .catch((error) => {
        setErrorMsg(error.response.data.detail);
      });
  }

  const formik = useFormik({
    validationSchema: ForgotPasswordSchema(),
    initialValues: {
      password: "",
    },
    onSubmit: (values) => onChangePassword(values),
  });

  return (
    <form className="container" onSubmit={formik.handleSubmit}>
      <h3 className="title">New Password</h3>
      <div className="inputContainer">
          <input
            // type="password"
            placeholder=" "
            name="password"
            onChange={formik.handleChange}
          />
        <button type="submit" className="icon">
          <SendIcon />
        </button>
      </div>
      {!!formik.errors.password && formik.touched.password && (
        <div className="error">{formik.errors.password}</div>
      )}
      {!!errorMsg &&
        <div className="error">{errorMsg}</div>}
      {/* <p onClick={onResendCode}>Re-send code</p> */}
    </form>
  );
};

export default ForgotPassword;
