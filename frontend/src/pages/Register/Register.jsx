import { useFormik } from 'formik';
import GenderEnum from '../../Enum/GenderEnum';
import SexualityEnum from '../../Enum/SexualityEnum';
import printVarsHook from '../../components/printVarsHook';
import RegisterSchema from './RegisterSchema';
import { useNavigate } from "react-router-dom";
import "../../styles/register.scss";
import { useEffect, useRef, useState } from 'react';
import axios from "axios"
import Carousel from '../../components/Carousel';
import { KeyIcon } from '../../components/icons/Icons';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/authSlice';



const Register = () => {

  const [onRegisterErrorMessage, setOnRegisterErrorMessage] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const onRegister = (values) => {
    axios.post('http://localhost:8000/users/register', values)
      .then(({data}) => {
        dispatch(setToken(data))
        navigate('/profil')
      })
      .catch((error) => {
        console.log(error.response.data.detail)
        setOnRegisterErrorMessage(error.response.data.detail)
      });
    }


  useEffect(() => window.scrollTo(0, 0), [])

  const formik = useFormik({
    validationSchema: RegisterSchema(),
    initialValues: {
      username: '',
      lastName: '',
      firstName: '',
      gender: null,
      sexuality: null,
      bio: '',
      position: '',
      email: '',
      password: '',
      age: null,
    },
    onSubmit: (values) => { onRegister(values) },
  });

  const fileInputRef = useRef(null);

  printVarsHook(formik.errors, "errors")
  printVarsHook(formik.touched, "touched")
  printVarsHook(formik.values, "values")
  printVarsHook(formik.isSubmitting, "isSubmitting")

  return (
    <div className="loginContainer">
      <main>
        <h3> Register </h3>
        <p> Please enter your details </p>
        <section>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <div className="loginInput">
                <input
                  type="text"
                  placeholder=" "
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Username</label>
              </div>
              {!!formik.errors.username && formik.touched.username && <div className='error'>{formik.errors.username}</div>}
            </div>
            <div>
              <div className="loginInput">
                <input
                  type="number"
                  placeholder=" "
                  min={0}
                  step={1}
                  name="age"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Age</label>
              </div>
              {!!formik.errors.age && formik.touched.age && <div className='error'>{formik.errors.age}</div>}
            </div>
            <div className='dosLoginInput'>
              <div className='dosInput'>
                <div className="loginInput">
                  <input
                    type="text"
                    placeholder=" "
                    name="firstName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label>First Name</label>
                </div>
                {!!formik.errors.firstName && formik.touched.firstName && <div className='error'>{formik.errors.firstName}</div>}
              </div>
              <div className='dosInput'>
                <div className="loginInput">
                  <input
                    type="text"
                    placeholder=" "
                    name="lastName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label>Last Name</label>
                </div>
                {!!formik.errors.lastName && formik.touched.lastName && <div className='error'>{formik.errors.lastName}</div>}
              </div>
            </div>

            <div className="selector">
              <label>Gender</label>
              {Object.keys(GenderEnum).map(value => (
                <div key={value} className={"selectorItem " + (value == formik.values.gender ? "selected" : "")} onClick={() => formik.setFieldValue("gender", value)}>
                  {value}
                </div>
              ))}
            </div>
            {!!formik.errors.gender && formik.touched.gender && <div className='error'>{formik.errors.gender}</div>}

            <div className="selector">
              <label>Sexuality</label>
              {Object.keys(SexualityEnum).map(value => (
                <div key={value} className={"selectorItem " + (value == formik.values.sexuality ? "selected" : "")} onClick={() => formik.setFieldValue("sexuality", value)}>
                  {value}
                </div>
              ))}
            </div>
            {!!formik.errors.sexuality && formik.touched.sexuality && <div className='error'>{formik.errors.sexuality}</div>}

            <div>
              <div className="loginInput">
                <textarea cols="2" rows="10" id="rules" placeholder=' '></textarea>
                <label>Biography</label>
              </div>
              {!!formik.errors.bio && formik.touched.bio && <div className='error'>{formik.errors.bio}</div>}
            </div>

            <div>
              <div className="loginInput">
                <input
                  type="email"
                  placeholder=" "
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Email</label>
              </div>
              {!!formik.errors.email && formik.touched.email && <div className='error'>{formik.errors.email}</div>}
            </div>

            <div>
              <div className="loginInput">
                <input
                  type="password"
                  placeholder=" "
                  name="password"
                  onChange={formik.handleChange}
                />
                <label>Password</label>
                <div className="icon">
                  <KeyIcon />
                </div>
              </div>
              {!!formik.errors.password && formik.touched.password && <div className='error'>{formik.errors.password}</div>}
            </div>
            <button className="loginButton" type='submit'> Log in </button>
            {!!onRegisterErrorMessage && <div className='error'>{onRegisterErrorMessage}</div>}
          </form>
          <div className="bottomForm">
            {/* <p> Forgot password? </p> */}
            <p onClick={() => navigate('/login')}> Already have an account ? </p>
          </div>
        </section>
      </main>
    </div>
    // <form onSubmit={formik.handleSubmit} className='container'>
    //   <h1>Register</h1>
    //   <input type="text" name='username' value={formik.values.username} onChange={formik.handleChange} placeholder='Pseudo'/>
    //   <p>username</p>
    //   <p>mdp</p>
    //   <p>nom</p>
    //   <p>prénom</p>
    //   <p>genre</p>
    //   <p>sexualité</p>
    //   <p>description</p>
    //   <p>position</p>
    //   <p>age</p>
    //   <p>email</p>
    //   <p>photos</p>
    //   <button type='submit'>submit</button>
    // </form>
  )
}

export default Register