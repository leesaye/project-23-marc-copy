import './Login.css';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");  // Clear any previous error

      // Make the login request
      const response = await axios.post("http://127.0.0.1:8000/api/token/", { username, password });
      
      if (response.data.access && response.data.refresh) {
        console.log("Login successful", response.data);
     
        navigate("/", { replace: true });
      } else {
        setError("Invalid login response. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password. Please try again.");
        } else if (err.response.status === 400) {
          setError("Bad request. Please ensure all fields are filled correctly.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
      console.error(err.message);
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
            type="text"
            className={`form-control ${error ? "error-label" : ""}`} 
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
            className={`form-control ${error ? "error-label" : ""}`} 
            id="passwordInput"            
            name="password" 
            value={password} 
            required 
            placeholder="Password"  
            onChange={event => {
              setPassword(event.target.value);
              setError(""); // Clear error when typing
            }} 
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <div className="input-group mb-3">
          <button className="btn btn-primary w-100 fs-6" onClick={handleLogin}>
            Login
          </button>
        </div>

        <small>
          Don't have an account?  
          <Link to="/register" className="bluelink"> Sign Up</Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
