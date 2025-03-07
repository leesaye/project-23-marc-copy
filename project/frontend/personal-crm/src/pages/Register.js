import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const [usernameError, setUsernameError] = useState(false);
  const navigate = useNavigate();
  const { login_user } = useAuth();
  // const BASE_URL = 'https://project-23-marc-backend-deployment.onrender.com/api/';
  const BASE_URL = `https://project-23-marc.onrender.com/`;
  const REGISTER_URL = `${BASE_URL}register/`

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Calculate Strength of Password
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  // Determine strength label based on score
  const strengthScore = calculatePasswordStrength(password);
  const strengthLabel = password
    ? strengthScore < 2
      ? "Weak"
      : strengthScore < 4
      ? "Medium"
      : "Strong"
    : "";

  const handleRegister = async () => {
    const errorMessages = [];

    // Validate email
    if (!validateEmail(email)) {
      errorMessages.push("Invalid email address");
    }

    // Check for blank password fields or mismatched passwords
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
    setUsernameError(false);

    try {
      // First, register the user
      await axios.post(REGISTER_URL, {
        username,
        email,
        password,
        confirmPassword,
      });

      // After successful registration, log the user in
      await login_user(username, password);
    } catch (err) {
      console.error("Error:", err);

      if (err.response && err.response.data) {
        let backendErrors = [];

        // Check for duplicate username error
        if (err.response.data.username) {
          backendErrors.push(err.response.data.username[0]);
          setUsernameError(true);
        }

        // Check for email errors
        if (err.response.data.email) {
          backendErrors.push(err.response.data.email[0]);
        }

        // Add any other errors if available
        if (err.response.data.password) {
          backendErrors.push(err.response.data.password[0]);
        }

        // If no specific error messages, add a generic error message
        if (backendErrors.length === 0) {
          backendErrors.push("Registration failed. Please try again.");
        }

        setError(backendErrors);
      } else {
        // Fallback error message if no response is available
        setError(["Network error. Please try again."]);
      }
    }
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
            className={`form-control ${usernameError ? "error-label" : ""}`}
            id="usernameInput"
            name="username"
            value={username}
            required
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value);
              setUsernameError(false);
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="emailInput" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${error.some((e) => e === "Invalid email address") ? "error-label" : ""}`}
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
            className={`form-control ${error.some((e) => e.includes("Password")) ? "error-label" : ""}`}
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
          {password && (
            <div className={`password-strength ${strengthLabel.toLowerCase()}`}>
              Password Strength: {strengthLabel}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPasswordInput" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${error.some((e) => e.includes("Password")) ? "error-label" : ""}`}
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
