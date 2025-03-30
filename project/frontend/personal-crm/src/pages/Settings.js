import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import "./Calendar.css";
import axiosInstance from "../endpoints/api";

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = `https://project-23-marc-backend-d4.onrender.com`;

function AccountSettings() {
    const [user, setUser] = useState({ username: "", email: "", new_password: "" });
    const [dailyGoal, setDailyGoal] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/update/`, { credentials: "include" });
                const data = await response.json();
                setUser({ username: data.username, email: data.email, new_password: "" });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        const fetchDailyGoal = async () => {
            try {
                const response = await fetch(`${BASE_URL}/feed/user-stats/`, { credentials: "include" });

                if (!response.ok) {
                    throw new Error('Failed to fetch user stats');
                }

                const data = await response.json();
                setDailyGoal(data[0]?.daily_goal || "");

            } catch (error) {
                console.error("Error fetching daily goal:", error);
            }
        };

        fetchUserData();
        fetchDailyGoal();
    }, []);


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setMessage(""); // Reset success message when user starts typing
    };

    const handleDailyGoalChange = (e) => {
        setDailyGoal(e.target.value);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure dailyGoal is a valid positive integer
        const parsedDailyGoal = parseInt(dailyGoal, 10);

        if (parsedDailyGoal <= 0 || isNaN(parsedDailyGoal)) {
            setMessage({ text: "Invalid daily goal. It must be a positive integer.", isError: true });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/update/`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.new_password || undefined,
                }),
            });

            await axiosInstance.post(`${BASE_URL}/feed/user-stats/set_daily_goal/`, {
                daily_goal: parsedDailyGoal,
            });

            if (response.ok) {
                setMessage({ text: "Profile and daily goal updated successfully!", isError: false });
            } else {
                setMessage({ text: "Failed to update profile.", isError: true });
            }
        } catch (error) {
            console.error("Error updating profile or daily goal:", error);
            setMessage("Failed to update profile or daily goal.");
        }
    };




    const handleDeleteAccount = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/update/`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            setMessage("Account deleted successfully.");
            window.location.href = "/login";
        } else {
            setMessage({ text: "Failed to delete account.", isError: true });
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete account.");
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
                       {message && (
                        <p className={`text-center ${message.isError ? 'text-danger' : 'text-success'}`}>
                            {message.text}
                        </p>
                         )}
                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                            {usernameError && <p className="text-danger">{usernameError}</p>}
                        </div>

                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold">Email</label>
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
                            <label className="form-label fw-bold">New Password</label>
                            <input
                                type="password"
                                name="new_password"
                                value={user.new_password}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3 w-25 mx-auto">
                            <label className="form-label fw-bold"> Daily Goal</label>
                            <input
                                type="text"
                                value={dailyGoal}
                                onChange={handleDailyGoalChange}
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
                        <h4>Are you sure you want to delete your account?</h4>
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
