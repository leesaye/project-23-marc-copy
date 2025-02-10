import './Login.css';
import { useState } from "react";
import { Link } from 'react-router-dom'
// import { login } from "../endpoints/api";

import { useAuth } from "../contexts/useAuth";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false); 
    const { login_user } = useAuth();

  const handleLogin = async () => {
    try {
      // Clears Errors
      setError(false);
      // Login Attempt
      await login_user(username, password);
    } catch (err) {
      // Sets Errors
      setError(true);
    }
  };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="border bg-white shadow landing-box-area">
        <div className="title">Personal CRM</div>
        <div className="mb-4 subtitle">Welcome back!</div>
        <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Username</label>
            <input type="email" className={error?"form-control error-label": "form-control"} id="emailInput" name="email" value={username} required onChange={event=>setUsername(event.target.value)} />
        </div>
        <div className="mb-4">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input type="password" className={error?"form-control error-label": "form-control"} id="passwordInput" name="password" value={password} required onChange={event=>setPassword(event.target.value)}/>
        </div>
        <div className="input-group mb-3">
            <button className="btn btn-primary w-100 fs-6" onClick={()=>handleLogin()}>
                Login
            </button>
        </div>
        {error ? <p className='redlink'>Username/Password not found</p> : <></>}
        <small>Don't have an account?  
            <Link to="/register" className="redlink"> Sign Up</Link>
        </small>
        </div>
        </div>
    )
}

export default Login;
