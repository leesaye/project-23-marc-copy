import React, { useContext, useState } from "react";
import { TaskAIContext } from "../contexts/TaskAI";

const TaskMessage = ({ task }) => {
    const { generateMessage, taskResult, taskLoading, showTaskResult, recentTaskPrompt } = useContext(TaskAIContext);
    const [editedMessage, setEditedMessage] = useState(""); 

    const handleGenerateMessage = () => {
        generateMessage(task.title);
    };

    React.useEffect(() => {
        if (taskResult) {
            setEditedMessage(taskResult);
        }
    }, [taskResult]);

    const sendEmail = () => {
        const body = encodeURIComponent(editedMessage);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=&body=${body}`, "_blank");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(editedMessage);
        alert("Message copied! You can paste it anywhere.");
    };

    const sendLinkedInMessage = () => {
        const encodedMessage = encodeURIComponent(editedMessage);
        window.open(`https://www.linkedin.com/messaging/compose/?body=${encodedMessage}`, "_blank");
    };

    return (
        <div className="mt-3">
            <button onClick={handleGenerateMessage} className="btn btn-primary mb-2">
                {taskLoading ? "Generating..." : "Generate AI Message"}
            </button>

            {showTaskResult && recentTaskPrompt === task.title && (
                <>
                    <textarea
                        className="form-control mt-2"
                        rows="3"
                        value={editedMessage} 
                        onChange={(e) => setEditedMessage(e.target.value)} 
                    />

                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-secondary" onClick={sendLinkedInMessage}>
                            💼 LinkedIn
                        </button>
                        <button className="btn btn-secondary" onClick={sendEmail}>
                            ✉️ Gmail
                        </button>
                        <button className="btn btn-secondary" onClick={copyToClipboard}>
                            📋 Copy
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskMessage;
