import Layout from "../components/Layout";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../contexts/AIContext";
import { LinearProgress } from "@mui/material";
import axiosInstance from "../endpoints/api";
import moment from "moment";


function InteractiveFeed() {
    const { onSent, resultData } = useContext(Context);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const promptStart = "Give me a mock event that is happening with some random contact that I may have that I could join. Only give json of format { title: \"Event 1\", description: \"This is the first event\", date: \"2025-03-10\", contact: \"Contact Name\"} in plain text no code block. Ensure that the date given is 1 to 7 days after:" + today + ". Also make sure the JSON starts with { and ends with }";
    const [eventData, setEventData] = useState("");
    // const BASE_URL = 'http://127.0.0.1:8000/';
    const BASE_URL = `https://project-23-marc-backend-d4.onrender.com/`;
    const [currentDailyCount, setCurrentDailyCount] = useState();
    const [dailyGoal, setDailyGoal] = useState();
    const [streak, setStreak] = useState();
    // New
    const COLORS = ["#B5D22C", "#73AA2A", "#0995AE", "#04506A"];
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const [, setSelectedFeedEventId] = useState(null);



    const handleOpenEventModal = (event) => {
        if (!event || !event.title) {
            console.error("Invalid event data:", event);
            return;
        }

        setNewEvent({
            title: event.title,
            start: moment(event.date).set({ hour: 9, minute: 0 }).format("YYYY-MM-DDTHH:mm"),
            end: moment(event.date).set({ hour: 17, minute: 0 }).format("YYYY-MM-DDTHH:mm"),
        });

        setSelectedFeedEventId(event.id || Date.now());
        setShowEventForm(true);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${BASE_URL}api/events/`, {
                ...newEvent,
                color: selectedColor,
            });

            // Increment Current Daily Count only if it's below the Daily Goal
            if (currentDailyCount < dailyGoal) {
                setCurrentDailyCount((prevCount) => {
                    const updatedCount = (prevCount || 0) + 1;

                    axiosInstance.post(`${BASE_URL}feed/user-stats/increment_count/`)
                        .catch((error) => {
                            console.error("Error incrementing Daily Count:", error);
                        });

                    return updatedCount;
                });
            }

        } catch (error) {
            console.error("Error adding event:", error);
        }

        setShowEventForm(false);
        setNewEvent({ title: "", start: "", end: "" });
        setSelectedFeedEventId(null);
        setSelectedColor(COLORS[0]);
    };


    const handleCancel = () => {
        setShowEventForm(false);
        setNewEvent({ title: "", start: "", end: "" });
        setSelectedFeedEventId(null);
    };

    const generateEvent = async () => {
        try {
            onSent(promptStart);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}feed/user-stats/`)
            .then((response) => {
                if (response.data) {
                    const userStats = response.data[0]
                    setCurrentDailyCount(userStats.current_daily_count)
                    setDailyGoal(userStats.daily_goal)
                    setStreak(userStats.running_streak_count)
                } else {
                }
            }).catch((error) => {
                console.error('Error getting userstats', error);
            })
    }, []);


    useEffect(() => {
        generateEvent();
    }, []);

    useEffect(() => {
        try {
            const eventDataLocal = resultData ? JSON.parse(resultData) : null;
            setEventData(eventDataLocal);
        } catch (error) {
            //if the json response returned from the AI is not proper JSON just generating a response again until it does return valid json
            console.error("Error parsing resultData:", error);
            setEventData(null);
            generateEvent();
        }
    }, [resultData]);

    return (
        <Layout>
            <div className="d-flex flex-column justify-content-center container-fluid bg-primary-subtle rounded p-4 min-vh-100">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h1 className="d-flex justify-content-center" style={{fontSize: '1.25rem'}}>You are on a {streak} day streak</h1>
                    <div className="card shadow-sm rounded mt-5 mb-5" style={{ backgroundColor: 'white', width: '50%', minWidth: "300px" }}>
                        <div className="card-bod m-4">
                            {eventData ? (
                            <div className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                                    <div className="mb-5">
                                        <h1 className="card-title">{eventData.title}</h1>
                                        <p className="card-text">{eventData.description}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>{eventData.contact}</div>
                                        <div>{eventData.date}</div>
                                    </div>
                                </div>
                            ) : (
                                <LinearProgress/>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="mt-4 d-flex justify-content-between align-items-center" style={{ width: '50%', minWidth: "300px" }}>
                            <button className="btn btn-primary" onClick={generateEvent}>Next</button>
                            <div class="progress"  style={{width:'50%'}}>
                                <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style={{width: (currentDailyCount / dailyGoal) * 100 + '%', ariaValuenow:currentDailyCount/dailyGoal * 100, ariaValuemin:'0', ariaValuemax:dailyGoal}}></div>
                            </div>
                            <button className="btn btn-success" onClick={() => handleOpenEventModal(eventData)}>Add</button>
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{width:'100%'}}>{currentDailyCount} / {dailyGoal}</div>
                    </div>
                </div>
            </div>

            {showEventForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Event</h3>
                        <label htmlFor="eventTitle">Title:</label>
                        <input
                            type="text"
                            id="eventTitle"
                            name="title"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="start">Start Time:</label>
                        <input
                            type="datetime-local"
                            id="start"
                            name="start"
                            value={newEvent.start}
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="end">End Time:</label>
                        <input
                            type="datetime-local"
                            id="end"
                            name="end"
                            value={newEvent.end}
                            onChange={handleInputChange}
                            required
                        />

                        <div className="color-picker">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option ${selectedColor === color ? "selected" : ""}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                ></div>
                            ))}
                        </div>

                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="blue-button" onClick={handleAddEvent}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );

}

export default InteractiveFeed;
