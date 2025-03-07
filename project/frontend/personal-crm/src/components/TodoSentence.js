import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "../endpoints/api";
import { Context } from "../contexts/AIContext";

//const BASE_URL = "http://127.0.0.1:8000/api/";
const BASE_URL = `https://project-23-marc.onrender.com/api/`;
const EVENT_URL = `${BASE_URL}events/`;
const TASK_URL = `${BASE_URL}tasks/`;

function TodoSentence() {
    const [eventsJSON, setEventsJSON] = useState("");
    const [tasksJSON, setTasksJSON] = useState("");
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    // const promptStart = "Order these Events and Tasks in terms of priority on when I should complete them (ONLY ITEMS THAT HAPPEN TODAY OR ON UPCOMING DAYS NOT THINGS THAT HAPPENED BEFORE TODAY). Make them into 1 simple sentence that makes it very clear on the best order to complete the top 6 highest prioirty tasks/events. Do not include any other task/events after the top 6. Do not use any special formatting except for new line characters. Start off with a nice uplifting greeting message prepping me on the tasks I have to complete. Also say something along the lines of, here is the best way to complete your upcoming tasks. Something along those lines but on exactly. Mix it up! Add some /\n/ between the message and the plans. Avoid trying to do items at the same time. Don't make the intro too long. If there are no tasks and events given then just say that there is nothing today and I should consider adding contacts or looking for events going on in the feed page to build stronger relationships (in a nice and concise way). If I give you more than 8 tasks and events combined just make a sentience with the to 6 highest priority tasks/events to do. If there are ties just include both of them. Include contacts (just the name no ID or anything else) for the events/tasks if they include them"

    const promptStart = "Hello! Here's a quick look at your upcoming tasks and events. Let’s tackle them in the best order for today and the next few days. Below is a simple sentence outlining the top 6 highest priority tasks/events you should focus on first. Avoid trying to complete multiple tasks at once. Start with these top priorities, and only include those happening today or in the upcoming days. If there are ties in priority, make sure both tasks/events are included. Please only show the top 6 tasks/events, with no extra formatting beyond line breaks but also put it in an easy to read sentence. If no tasks or events are scheduled, simply say there’s nothing to do today, and suggest considering adding contacts or browsing the feed page for potential events to help build stronger relationships. If more than 6 tasks and events are provided, only return the top 6 highest priorities. If tasks include contacts, just list the contact names (no IDs). Do not use any special formatting except for new line characters. Start off with a nice uplifting greeting message prepping me on the tasks I have to complete. Also say something along the lines of, here is the best way to complete your upcoming tasks. Something along those lines but on exactly. Mix it up! Add some /\n/ between the message and the plans. Include date and contacts (Names not IDs)"
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;


    // Function to generate the sentence
    const generateSentence = async () => {
        try {
            const eventsResponse = await axiosInstance.get(EVENT_URL);
            const tasksResponse = await axiosInstance.get(TASK_URL);

            const eventsData = JSON.stringify(eventsResponse.data);
            const tasksData = JSON.stringify(tasksResponse.data);

            setEventsJSON(eventsData);
            setTasksJSON(tasksData);

            const combinedInput = `${promptStart} Events: ${eventsData} Tasks: ${tasksData}`;
            // setInput(combinedInput);
            onSent(combinedInput);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Automatically call generateSentence when the component mounts
    useEffect(() => {
        generateSentence();
    }, []); // Empty dependency array means this effect runs only once on mount

    // Split the resultData by "/ /" and map each part to a new line
    const splitResultData = resultData.split("/").map((line, index) => {
        // Check if the line is empty, and skip rendering it
        if (line.trim() === "") return null;
        return <p key={index}>{line.trim()}</p>;
    });

    return (
        <div>
            {
                showResult ? (
                    <>
                    {loading ? <h1>Loading...</h1> : (
                        <div className="card" style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '15px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                                AI Task Prioritization Summary
                                </h5>

                                {splitResultData}
                            </div>
                        </div>
                    )}
                </>
                ) : (
                    <h1></h1>
                )
            }
        </div>
    );
}

export default TodoSentence;
