import Layout from "../components/Layout";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../contexts/AIContext";

function InteractiveFeed() {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const promptStart = "Give me a mock event that is happening with some random contact that I may have that I could join. Only give json of format { title: \"Event 1\", description: \"This is the first event\", date: \"2025-03-10\", contact: \"Contact Name\"} in plain text no code block";
    const [eventData, setEventData] = useState("");
    const generateEvent = async () => {
        try {
            onSent(promptStart);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

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
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="card shadow-sm rounded" style={{ backgroundColor: 'white', width: '50%', minWidth: "300px"}}>
                    <div className="card-body">
                        {eventData ? (
                            <div className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                                <div className = "mb-5">
                                    <h1 className="card-title">{eventData.title}</h1>
                                    <p className="card-text">{eventData.description}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div>{eventData.contact}</div>
                                    <div>{eventData.date}</div>
                                </div>
                            </div>
                        ) : (
                            <h1>Loading...</h1>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default InteractiveFeed;
