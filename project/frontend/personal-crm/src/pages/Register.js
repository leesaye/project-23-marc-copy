import { useState } from "react";
import { Link } from 'react-router-dom'
// import { login } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false); 
    const { register_user } = useAuth();

    const handleRegister = () => {
        register_user(username, email, password, confirmPassword)
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="border bg-white shadow landing-box-area">
        <div className="title">Personal CRM</div>
        <div className="mb-4 subtitle">Welcome back!</div>
        <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">Username</label>
            <input type="username" className={error?"form-control error-label": "form-control"} id="emailInput" name="email" value={username} required onChange={event=>setUsername(event.target.value)} />
        </div>
        <div className="mb-4">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input type="email" className={error?"form-control error-label": "form-control"} id="emailInput" name="email" value={email} required onChange={event=>setEmail(event.target.value)}/>
        </div>
        <div className="mb-4">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input type="password" className={error?"form-control error-label": "form-control"} id="passwordInput" name="password" value={password} required onChange={event=>setPassword(event.target.value)}/>
        </div>
        <div className="mb-4">
            <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
            <input type="confirmPassword" className={error?"form-control error-label": "form-control"} id="confirmPasswordInput" name="confirmPassword" value={confirmPassword} required onChange={event=>setConfirmPassword(event.target.value)}/>
        </div>
        <div className="input-group mb-3">
            <button className="btn btn-primary w-100 fs-6" onClick={()=>handleRegister()}>
                Register
            </button>
        </div>
        {error ? <p className='redlink'>Username/Password not found</p> : <></>}
        <small>Don't have an account?  
            <Link to="/login" className="redlink"> Sign Up</Link>
        </small>
        </div>
        </div>
    )
}

export default Register;