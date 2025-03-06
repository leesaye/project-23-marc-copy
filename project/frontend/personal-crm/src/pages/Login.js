import './Login.css';
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../contexts/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { login_user } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);

  useEffect(() => {
    const storedIsLocked = localStorage.getItem("isLocked") === "true";
    const storedTime = parseInt(localStorage.getItem("remainingTime"), 10) || 30; 
    setRemainingTime(storedTime || 30);
  
    if (storedIsLocked) {
      setIsLocked(true);
      setRemainingTime(storedTime);
    }
  }, []);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            setIsLocked(false);
            setAttempts(0);
            setError("");
            localStorage.removeItem("isLocked");
            localStorage.removeItem("remainingTime");
          }
          localStorage.setItem("remainingTime", newTime);
          return newTime;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [isLocked]);
  
  useEffect(() => {
    if (isLocked) {
      setError(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
    }
  }, [remainingTime, isLocked]);
  


  const handleLogin = async () => {
    if (isLocked) {
      setError(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
      return; 
    }

    try {
      setError("");  // Clear any previous error
      // Make the login request
      // await axios.post("http://127.0.0.1:8000/api/token/", { username, password });
      // navigate("/");
      await login_user(username, password);
      setAttempts(0); 

    } catch (err) {

      setAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
  
        if (newAttempts >= 5) {
          setIsLocked(true);
          setRemainingTime(30);
          setError(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
          localStorage.setItem("isLocked", "true");
          localStorage.setItem("remainingTime", "30");
        }
  
        return newAttempts;
      });
  
    // Show regular error messages if not locked out
    if (!isLocked && err.response) {
      if (err.response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else if (err.response.status === 400) {
        setError("Fields cannot be blank.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } else if (!err.response) {
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
        <button className="btn btn-primary w-100 fs-6" onClick={handleLogin} disabled={isLocked}>
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
