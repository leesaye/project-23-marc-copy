import { useState, createContext } from "react";
import run from "../endpoints/gemini";

export const TaskAIContext = createContext();

const TaskAIProvider = (props) => {
    const [taskLoading, setTaskLoading] = useState(false);
    const [taskResult, setTaskResult] = useState(""); 
    const [showTaskResult, setShowTaskResult] = useState(false);
    const [recentTaskPrompt, setRecentTaskPrompt] = useState("");

    const generateMessage = async (taskTitle) => {
        setTaskResult(""); 
        setTaskLoading(true);
        setShowTaskResult(true);
        setRecentTaskPrompt(taskTitle);

        try {
            const response = await run(`
                Generate a short, casual message for this task: "${taskTitle}". 
                Keep them under 15 words each. Use natural, friendly wording. Please don't give multiple options.
            `);

            let formattedResponse = response.split("\n").slice(0, 3).join("\n");

            setTaskResult(formattedResponse);
        } catch (error) {
            console.error("Error generating AI message:", error);
            setTaskResult("Failed to generate a message.");
        }

        setTaskLoading(false);
    };

    const contextValue = {
        generateMessage,
        taskResult,
        taskLoading,
        showTaskResult,
        recentTaskPrompt,
    };

    return (
        <TaskAIContext.Provider value={contextValue}>
            {props.children}
        </TaskAIContext.Provider>
    );
};

export default TaskAIProvider;
