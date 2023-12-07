import { useFormik } from 'formik';
import GenderEnum from '../../Enum/GenderEnum';
import SexualityEnum from '../../Enum/SexualityEnum';
import printVarsHook from '../../components/printVarsHook';
import RegisterSchema from './RegisterSchema';
import { useNavigate } from "react-router-dom";
import "../../styles/register.scss";
import { useEffect, useRef } from 'react';
import Carousel from '../../components/Carousel';



const Register = () => {
  const navigate = useNavigate();


  useEffect(() => window.scrollTo(0, 0), [

  ])

  const formik = useFormik({
    validationSchema: RegisterSchema(),
    initialValues: {
      pseudo: '',
      lastName: '',
      firstName: '',
      gender: null,
      sexuality: null,
      bio: '',
      position: '',
      email: '',
      photos: [],
      password: '',
    },
    onSubmit: values => {
      console.log("submit", values)
    },
  });

  const fileInputRef = useRef(null);

  printVarsHook(formik.errors, "errors")
  printVarsHook(formik.touched, "touched")
  printVarsHook(formik.values, "values")
  printVarsHook(formik.isSubmitting, "isSubmitting")

  return (
    <div className="loginContainer">
      <header>
        <h2>Matcha ❤</h2>
      </header>
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
                  name="pseudo"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label>Username</label>
              </div>
              {!!formik.errors.pseudo && formik.touched.pseudo && <div className='error'>{formik.errors.pseudo}</div>}
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
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files[0])
                    formik.setFieldValue("photos", [...formik.values.photos, e.target.files[0]])
                  }}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <label>Photos</label>
                <div className='photoContainer' onClick={() => fileInputRef.current.click()}>
                  <Carousel
                    images={formik.values.photos.map(photo => URL.createObjectURL(photo))}
                    onDeleteImage={indexToDelete => formik.setFieldValue("photos",  formik.values.photos.filter((_, index) => index != indexToDelete))}
                  />

                </div>

                {/* <KeyIcon /> */}
              </div>
              {!!formik.errors.password && formik.touched.password && <div className='error'>{formik.errors.password}</div>}
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
                {/* <KeyIcon /> */}
              </div>
              {!!formik.errors.password && formik.touched.password && <div className='error'>{formik.errors.password}</div>}
            </div>
            <button className="loginButton" type='submit'> Log in </button>
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
    //   <input type="text" name='pseudo' value={formik.values.pseudo} onChange={formik.handleChange} placeholder='Pseudo'/>
    //   <p>pseudo</p>
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