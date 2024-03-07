import { useDispatch, useSelector } from "react-redux";
import "../styles/verify_email.scss";
import { getToken } from "../store/slices/authSlice";
import { getAuthorizedInstance } from "../utils/Instance";
import { SendIcon } from "../components/icons/Icons";
import { useFormik } from "formik";
import VerifEmailSchema from "../schemas/VerifEmailSchema";
import { useEffect, useState } from "react";
import { initialiseUser } from "../store/slices/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/utils/Loader";

const VerifyEmail = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [searchParams] = useSearchParams();
  const token = useSelector(getToken);
  const instance = token ? getAuthorizedInstance(token.access_token) : null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(searchParams.get('code'))

  useEffect(() => {
    if (searchParams.get('code')) {
      console.log('oui')
      formik.setFieldValue('code', searchParams.get('code'))
    }
  }, [])

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const onResendCode = () => {
    if (!disabled) {
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
      }, [2000]);
      instance.post("/users/resend_code");
    }
  };

  const onSendCode = (values) => {
    instance.post('/users/verif_email', values).then(({ data }) => {
      dispatch(initialiseUser(data))
      navigate('/home')
  })
      .catch((error) => {
        setErrorMsg(error.response.data.detail);
      });
  };

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
            id="code"
            onChange={formik.handleChange}
            value={formik.values.code}
          />
          <label htmlFor="code">Code</label>
          <button className="iconSend" type="submit">
            {disabled ? <Loader /> : <SendIcon />}
          </button>
        </div>
      </div>
      {!!formik.errors.code && formik.touched.code && (
        <div className="error">{formik.errors.code}</div>
      )}
      {!!errorMsg && <div className="error">{errorMsg}</div>}
      <button className="reSendCode" disabled={disabled} onClick={onResendCode}>
        Re-send code
      </button>
    </form>
  );
};

export default VerifyEmail;
