import Layout from "../components/Layout";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../contexts/AIContext";
import { LinearProgress } from "@mui/material";
import axiosInstance from "../endpoints/api"; 

function InteractiveFeed() {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const promptStart = "Give me a mock event that is happening with some random contact that I may have that I could join. Only give json of format { title: \"Event 1\", description: \"This is the first event\", date: \"2025-03-10\", contact: \"Contact Name\"} in plain text no code block. Must start and stop with {}";
    const [eventData, setEventData] = useState("");
    const BASE_URL = 'http://127.0.0.1:8000/';
    const [currentDailyCount, setCurrentDailyCount] = useState();
    const [dailyGoal, setDailyGoal] = useState();
    const [streak, setStreak] = useState();

    
    const generateEvent = async () => {
        try {
            onSent(promptStart);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const placeholderFunction = () => {
        console.log("Placeholder function called");
    };

    useEffect(() => {
        axiosInstance.get(`${BASE_URL}feed/user-stats/`)
            .then((response) => {
                if (response.data) {
                    const userStats = response.data[0]
                    console.log(userStats)
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
            <div className="d-flex flex-column justify-content-center" style={{ padding:'10%', height: '100%', backgroundColor: 'lightblue'}}>
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
                    {/* Buttons section */}
                    {eventData ? (
                        <div>
                            <div className="mt-4 d-flex justify-content-between align-items-center" style={{ width: '50%', minWidth: "300px" }}>
                                <button className="btn btn-primary" onClick={generateEvent}>Next</button>
                                <div class="progress"  style={{width:'50%'}}>
                                    <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style={{width: (currentDailyCount / dailyGoal) * 100 + '%', ariaValuenow:currentDailyCount/dailyGoal * 100, ariaValuemin:'0', ariaValuemax:dailyGoal}}></div>
                                </div>
                                <button className="btn btn-secondary" onClick={placeholderFunction}>Add</button>
                            </div>
                            <div className="d-flex justify-content-center align-items-center" style={{width:'100%'}}>{currentDailyCount} / {dailyGoal}</div>
                        </div>
                    ): (
                        <h1></h1>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default InteractiveFeed;
