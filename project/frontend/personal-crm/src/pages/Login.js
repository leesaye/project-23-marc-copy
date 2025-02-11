import './Login.css';
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../contexts/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const { login_user } = useAuth();

  const handleLogin = async () => {
    try {
      setError(""); 
      await login_user(username, password);
    } catch (err) {
      console.error("Login Error:", err);
      if (err.message.includes("Login failed")) {
        setError("Incorrect username or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="border bg-white shadow landing-box-area">
        <div className="title">Personal CRM</div>
        <div className="mb-4 subtitle">Welcome back!</div>
        
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">Username</label>
          <input 
            type="email" 
            className={error ? "form-control error-label" : "form-control"} 
            id="emailInput" 
            name="email" 
            value={username} 
            required 
            placeholder="Username"  
            onChange={event => setUsername(event.target.value)} 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input 
            type="password" 
            className={error ? "form-control error-label" : "form-control"} 
            id="passwordInput"            
            name="password" 
            value={password} 
            required 
            placeholder="Password"  
            onChange={event => {
              setPassword(event.target.value);
              setError(""); 
            }} 
          />
          {error && <p className='bluelink'>{error}</p>}
        </div>
        
        <div className="input-group mb-3">
          <button className="btn btn-primary w-100 fs-6" onClick={handleLogin}>
            Login
          </button>
          
        </div>
        {error ? <p className='bluelink'>Username/Password not found</p> : <></>}
        <small>
          Don't have an account?  
          <Link to="/register" className="bluelink"> Sign Up</Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
