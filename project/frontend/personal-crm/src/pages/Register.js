import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState([]);
  const navigate = useNavigate(); 

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

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

    try {
      // First, register the user
      const registerResponse = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
        confirmPassword,
      });

      console.log("Registration successful:", registerResponse.data);

      // After successful registration, log the user in
      const loginResponse = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      console.log("Login successful:", loginResponse.data);

      // Delay the redirect by 1 second to allow the authentication state to update
      setTimeout(() => {
        // Redirect to home page (or any other page)
        navigate("/", { replace: true });
      }, 1000); // Delay for 1 second

    } catch (err) {
      console.error("Error:", err);

      if (err.response && err.response.data) {
        let backendErrors = [];

        // Check for duplicate username error
        if (err.response.data.username) {
          backendErrors.push(err.response.data.username[0]);
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
