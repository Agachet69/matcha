import { useState } from "react"

const Login = () => {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  function tryLog() {
    console.log(name);
    console.log(password);
  }

    return (
        <div>
          <p>Login</p>
            <input type="text" placeholder='name' onChange={e => setName(e.currentTarget.value)} value={name} />
            <input type="password" placeholder='password' onChange={e => setPassword(e.currentTarget.value)} value={password} />
            <button onClick={tryLog}> Connexion </button>
            {name}
        </div>
    )
}

export default Login