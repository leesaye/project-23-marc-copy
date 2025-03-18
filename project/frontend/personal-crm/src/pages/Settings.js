import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import axiosInstance from "../endpoints/api";
import "./Calendar.css";

const BASE_URL = "http://127.0.0.1:8000/";

function AccountSettings() {
    const [user, setUser] = useState({ username: "", email: "", new_password: "" });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Autofills User textfills with info
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get("/user/profile/");
                setUser({ ...user, username: response.data.username, email: response.data.email });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Checks if Username entered is already taken
    const checkUsername = async (e) => {
        const newUsername = e.target.value;
        setUser({ ...user, username: newUsername });

        try {
            const response = await axiosInstance.get(`/user/check-username/?username=${newUsername}`);
            if (response.data.available) {
                setUsernameError("");
            } else {
                setUsernameError("Username is already taken.");
            }
        } catch (error) {
            console.error("Error checking username:", error);
        }
    };

    // Updates Account Info on Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.put("/user/profile/", user);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Failed to update profile.");
        }
    };

    // Deletes Account and Logs out User
    const handleDeleteAccount = async () => {
        try {
            await axiosInstance.delete("/user/profile/");
            alert("Account deleted successfully.");
            window.location.href = "/login"; 
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account.");
        }
    };

    return (
        <Layout>
            <div className="container-fluid bg-primary-subtle rounded p-4 min-vh-100">
                <h2 className="fw-bold text-center"> Settings</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <form className="mt-4" onSubmit={handleSubmit}>
                        {message && <p className="text-center text-success">{message}</p>}

                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold" style={{ marginBottom: "5px" }}>Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                value={user.username} 
                                onChange={checkUsername} 
                                className="form-control" 
                                required
                            />
                            {usernameError && <p className="text-danger">{usernameError}</p>}
                        </div>

                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold" style={{ marginBottom: "5px" }}>Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={user.email} 
                                onChange={handleChange} 
                                className="form-control" 
                                required
                            />
                        </div>

                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold" style={{ marginBottom: "5px" }}>New Password</label>
                            <input 
                                type="password" 
                                name="new_password" 
                                value={user.new_password} 
                                onChange={handleChange} 
                                className="form-control" 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-25 mx-auto d-block">Save Changes</button>
                        <button type="button" className="btn btn-danger w-25 mx-auto d-block mt-3" onClick={() => setShowModal(true)}>Delete Account</button>
                    </form>
                )}
            </div>
            
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Are you sure you want to delete your account? </h4>
                        <div className="modal-buttons">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default AccountSettings;
