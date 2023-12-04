import axios from 'axios'
import { useState } from 'react'
import './App.css'
import { router } from './utils/Router'
import {
  RouterProvider,
} from "react-router-dom";


function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [id, setId] = useState(0)

  const [error, setError] = useState(false)

  return (
    // <RouterProvider router={router}/>
      <div> aha </div>
    // <>
    //   <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>


    //     <div style={{ display: "flex", justifyContent: "space-around" }}>

    //       <div style={{ maxWidth: "250px", overflow: 'scroll' }}>
    //         <div>TOKEN</div>
    //         {token ? <ul>
    //           <li>{token.token_type}</li>
    //           <li>{token.access_token}</li>
    //         </ul> : null}
    //       </div>

    //       <div style={{ overflow: 'scroll' }}>
    //         <div>LAST USER GET</div>
    //         {user ? <ul>
    //           <li>{user.id}</li>
    //           <li>{user.username}</li>
    //         </ul> : null}
    //       </div>

    //     </div>
    //     {error && <div style={{ fontFamily: "monospace", color: "red" }}>ERROR</div>}


    //     {/* <button>EDIT</button>
    //   <button>GET</button>
    //   <button>DELETE</button> */}


    //     <input type="text" placeholder='name' onChange={e => setName(e.currentTarget.value)} value={name} />
    //     <input type="text" placeholder='password' onChange={e => setPassword(e.currentTarget.value)} value={password} />

    //     <div style={{ display: "flex", justifyContent: "space-around" }}>

    //       <button onClick={() => {
    //         axios.post('http://localhost:8000/users/sign_up', {
    //           ...{
    //             username: name,
    //             password: password
    //           }
    //         })
    //           .then(({ data }) => {
    //             setToken(data)
    //           }).catch(({ response }) => {
    //             setError(true)
    //             setTimeout(() => {
    //               setError(false)
    //             }, 2000)
    //           })
    //       }}>Sign up</button>
    //       <button onClick={() => {
    //         axios.post('http://localhost:8000/users/sign_in', {
    //           ...{
    //             username: name,
    //             password: password
    //           }
    //         })
    //           .then(({ data }) => {
    //             setToken(data)
    //           }).catch(({ response }) => {
    //             setError(true)
    //             setTimeout(() => {
    //               setError(false)
    //             }, 2000)
    //           })
    //       }}>Sign in</button>

    //       <button onClick={() => {
    //         setToken(null)
    //       }}>Logout</button>

    //     </div>
    //     <button onClick={() => {
    //       axios.get(`http://localhost:8000/users/me`, {
    //         headers: {
    //           'Authorization': "Bearer " + (token ? token.access_token : "")
    //         }
    //       })
    //         .then(({ data }) => {
    //           setUser(data)
    //         }).catch(({ response }) => {
    //           setError(true)
    //           setTimeout(() => {
    //             setError(false)
    //           }, 2000)
    //         })
    //     }}>Get ME</button>
    //     <div style={{ display: "flex", justifyContent: "space-around" }}>
    //       <button onClick={() => {
    //         axios.get(`http://localhost:8000/users/add_notif`, {
    //           headers: {
    //             'Authorization': "Bearer " + (token ? token.access_token : "")
    //           }
    //         })
    //           .then(({ data }) => {
    //             setUser(data)
    //           }).catch(({ response }) => {
    //             setError(true)
    //             setTimeout(() => {
    //               setError(false)
    //             }, 2000)
    //           })
    //       }}>Get One</button>
    //     <input type="number" placeholder='id' onChange={e => setId(e.currentTarget.value)} value={id} />
    //     </div>
    //   </div>
    // </>
  )
}

export default App
