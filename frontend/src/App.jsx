import axios from 'axios'
import { useState } from 'react'
import './App.css'
function App() {
  const [item, setItem] = useState(null)
  const [name, setName] = useState("null")

  return (
    <>
      {item && <ul>
        <li>{item.id}</li>
        <li>{item.name}</li>
      </ul>}
      <button onClick={() => {
        if (name)
        axios.post('http://localhost:8000/users/create', {
          ...{
            username: name
          }
        })
        .then(function (response) {
          console.log(response);
        })
      }}>CREATE</button>
      <button>EDIT</button>
      <button>GET</button>
      <button>DELETE</button>

      <input type="text" placeholder='name' />
    </>
  )
}

export default App
