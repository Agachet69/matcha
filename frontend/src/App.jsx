import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import io from 'socket.io-client';
import { router } from './utils/Router'
import {
  RouterProvider,
} from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectAuth } from './store/slices/authSlice';
import { selectUser } from './store/slices/userSlice';


function App() {
  const [token, setToken] = useState(null)
  // const [user, setUser] = useState(null)
  const [allUsers, setAllUsers] = useState(null)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [id, setId] = useState(0)

  const [error, setError] = useState(false)

  const [socket, setSocket] = useState(null)

  useEffect(() => setSocket(io("http://localhost:8000", { path: "/ws/socket.io/", transports: ['websocket', 'polling'] })), [])
  

  // socket.on("connect", () => { console.log("Connected", socket.id) }); 
  // return (
  //   <div style={{ display: 'flex', justifyContent: "space-around", width: "100vw" }}>
  //     <button onClick={() => {
  //       socket.emit('hello', "world")
  //     }}>Socket emit</button>
  //     <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "50vh", overflow: "scroll" }}>
  //       <div>My notifs</div>
  //       {user && user.notifs.map((notif, index) => (
  //         <div style={{ padding: "0.5rem 0.25rem" }}>
  //           <ul key={index}>
  //             <li>{notif.type}</li>
  //             <li>{notif.data}</li>
  //           </ul>
  //         </div>
  //       ))}
  //     </div>
  //     <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>


  //       <div style={{ display: "flex", justifyContent: "space-around" }}>

  //         <div style={{ maxWidth: "250px", overflow: 'scroll' }}>
  //           <div>TOKEN</div>
  //           {token ? <ul>
  //             <li>{token.token_type}</li>
  //             <li>{token.access_token}</li>
  //           </ul> : null}
  //         </div>

  //         <div style={{ overflow: 'scroll' }}>
  //           <div>LAST USER GET</div>
  //           {user ? <ul>
  //             <li>{user.id}</li>
  //             <li>{user.username}</li>
  //           </ul> : null}
  //         </div>

  //       </div>
  //       {error && <div style={{ fontFamily: "monospace", color: "red" }}>ERROR</div>}


  //       {/* <button>EDIT</button>
  //     <button>GET</button>
  //     <button>DELETE</button> */}


  //       <input type="text" placeholder='name' onChange={e => setName(e.currentTarget.value)} value={name} />
  //       <input type="text" placeholder='password' onChange={e => setPassword(e.currentTarget.value)} value={password} />

  //       <div style={{ display: "flex", justifyContent: "space-around" }}>

  //         <button onClick={() => {
  //           axios.post('http://localhost:8000/users/sign_up', {
  //             ...{
  //               username: name,
  //               password: password
  //             }
  //           })
  //             .then(({ data }) => {
  //               setToken(data)
  //             }).catch(({ response }) => {
  //               setError(true)
  //               setTimeout(() => {
  //                 setError(false)
  //               }, 2000)
  //             })
  //         }}>Sign up</button>
  //         <button onClick={() => {
  //           axios.post('http://localhost:8000/users/sign_in', {
  //             ...{
  //               username: name,
  //               password: password
  //             }
  //           })
  //             .then(({ data }) => {
  //               setToken(data)
  //             }).catch(({ response }) => {
  //               setError(true)
  //               setTimeout(() => {
  //                 setError(false)
  //               }, 2000)
  //             })
  //         }}>Sign in</button>

  //         <button onClick={() => {
  //           setToken(null)
  //         }}>Logout</button>

  //       </div>
  //       <button onClick={() => {
  //         axios.get(`http://localhost:8000/users/me`, {
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
  //       }}>Get ME</button>
  //       <div style={{ display: "flex", justifyContent: "space-around" }}>
  //         <button onClick={() => {
  //           axios.get(`http://localhost:8000/users/`, {
  //             headers: {
  //               'Authorization': "Bearer " + (token ? token.access_token : "")
  //             }
  //           })
  //             .then(({ data }) => {
  //               setAllUsers(data)
  //             }).catch(({ response }) => {
  //               setError(true)
  //               setTimeout(() => {
  //                 setError(false)
  //               }, 2000)
  //             })
  //         }}>Get All</button>
  //       </div>
  //     </div>
  //     <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "50vh", overflow: "scroll" }}>
  //       <div>All Users</div>
  //       {allUsers && allUsers.map((user, index) => (
  //         <div style={{ padding: "0.5rem 0.25rem" }}>
  //           <ul key={index}>
  //             <li>{user.id}</li>
  //             <li>{user.username}</li>
  //           </ul>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  const auth = useSelector(selectAuth);



  return (
    // <RouterProvider router={router}/>
    auth &&
      <div className='mainContainer'> aha </div>
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
