import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]); 
  const { register_user } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = () => {
    const errorMessages = [];

    // Validate email
    if (!validateEmail(email)) {
      errorMessages.push("Invalid email address");
    }

    // Check for blank password fields
    if (password === "" && confirmPassword === "") {
      errorMessages.push("Passwords cannot be blank");
    } else if (password !== confirmPassword) {
      errorMessages.push("Passwords don't match");
    }

    if (errorMessages.length > 0) {
      setError(errorMessages);
      return;
    }

    // Clear any errors and proceed with registration
    setError([]);
    register_user(username, email, password, confirmPassword);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="border bg-white shadow landing-box-area">
        <div className="title">Personal CRM</div>

        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="usernameInput"
            name="username"
            value={username}
            required
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="mb-4">
            <label htmlFor="emailInput" className="form-label">
                Email
            </label>
            <input
                type="email"
                className={`form-control ${
                error.some((e) => e === "Invalid email address") ? "error-label" : ""
                }`}
                id="emailInput"
                name="email"
                value={email}
                required
                placeholder="Email"
                onChange={(event) => {
                setEmail(event.target.value);
                if (error.length > 0) setError([]); 
                }}
            />
            </div>

        <div className="mb-4">
          <label htmlFor="passwordInput" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${
              error.some((e) => e.includes("Password")) ? "error-label" : ""
            }`}
            id="passwordInput"
            name="password"
            value={password}
            required
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
              if (error.length > 0) setError([]);
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPasswordInput" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${
              error.some((e) => e.includes("Password")) ? "error-label" : ""
            }`}
            id="confirmPasswordInput"
            name="confirmPassword"
            value={confirmPassword}
            required
            placeholder="Confirm Password"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error.length > 0) setError([]);
            }}
          />
        </div>

        <div className="input-group mb-3">
          <button className="btn btn-primary w-100 fs-6" onClick={handleRegister}>
            Register
          </button>
        </div>

        {error.length > 0 && (
          <div className="redtext">
            {error.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        <small>
          Already have an account?{" "}
          <Link to="/login" className="bluelink">
            Log in
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Register;
