import React, { useContext } from "react";
import { Context } from "../contexts/AIContext";

function SampleAIChat() {
    const {onSent, recentPrompt, showResult, loading, resultData, setInput, input} = useContext(Context)

    return (
        <div>
            <h1>What to do for today</h1>
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
