import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../contexts/AIContext";

function SampleAIChat() {
    const [todo, setTodo] = useState("Loading...");
    // const API_KEY = "AIzaSyCvRfJGtuK4ms8qPSV4fzTmEGYwUYrBWU0";

    // useEffect(() => {
    //     async function fetchTodo() {
    //         try {
    //             const response = await axios.post(
    //                 `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`,
    //                 {
    //                     prompt: { text: "What should I do today?" }
    //                 }
    //             );
    //             setTodo(response.data.candidates[0].output);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //             setTodo("Failed to load tasks.");
    //         }
    //     }

    //     fetchTodo();
    // }, []);

    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context)


    return (
        <div>
            <h1>What to do for today</h1>
            <p>{todo}</p>
            {/* <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt'/> */}
            <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder="Enter a prompt here"></input>
            <button onClick={()=>onSent()}>Generate a Plan</button>
            {
                !showResult ? (
                    <>
                        <h1>do not show result</h1>
                    </>
                ) : (
                    <>
                        <h1>Show result</h1>
                        <p>prompt:{recentPrompt}</p>
                        {loading ? 
                        <h1>Loading...</h1>
                        :
                        <p dangerouslySetInnerHTML={{__html:resultData}}></p> /*to hide tags put dangerouslySetInnerhtml*/}

                    </>
                )
            }
        </div>
    );
}

export default SampleAIChat;
