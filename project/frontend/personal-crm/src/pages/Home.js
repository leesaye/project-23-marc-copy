import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getRandom } from "@divyanshu013/inspirational-quotes";
import TodoSentence from "../components/TodoSentence";
import AIContextProvider from "../contexts/AIContext";
import TaskAIContextProvider from "../contexts/TaskAI";
import axiosInstance from "../endpoints/api";
import TaskMessage from "../components/TaskMessages"; 

const BASE_URL = "http://127.0.0.1:8000/"
const TASK_URL =  `${BASE_URL}api/tasks/`;
const CONTACT_URL = `${BASE_URL}contacts/`;

function Home() {
    const [quote, setQuote] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        setQuote(getRandom());
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksResponse, contactsResponse] = await Promise.all([
                    axiosInstance.get(TASK_URL),
                    axiosInstance.get(CONTACT_URL)
                ]);

                const contactsMap = {};
                contactsResponse.data.forEach(contact => {
                    contactsMap[contact.id] = contact.name;
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0); 

                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);    

                let sortedTasks = tasksResponse.data
                    .map(task => ({
                        ...task,
                        completed: task.completed || false,
                        contactName: contactsMap[task.contact] || "Not specified"
                    }))
                    .filter(task => new Date(task.date) >= yesterday)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5);

                setContacts(contactsResponse.data);
                setTasks(sortedTasks);
            } catch (error) {
                console.error("Error fetching tasks or contacts:", error);
            }
        };
        fetchData();
    }, []);

    const handleTaskCompletion = async (task) => {
        try {
            const wasPreviouslyCompleted = task.completed;
            const updatedTask = { ...task, completed: !task.completed };
    
            await axiosInstance.patch(`${TASK_URL}${task.id}/`, {
                completed: updatedTask.completed,
            });
    
            const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
            setTasks(updatedTasks);
    
            if (!wasPreviouslyCompleted && updatedTask.completed && task.contact) {
                const contact = contacts.find(c => c.id === task.contact);

                if (contact && contact.relationship_rating < 100) {
                    const updatedRating = Math.min(contact.relationship_rating + 5, 100);
                    console.log(contact.relationship_rating);

                    const formData = new FormData();
                    formData.append("relationship_rating", updatedRating);
    
                    await axiosInstance.post(`${CONTACT_URL}${contact.id}`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                }
            }
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };
                
    const handleTaskClick = (taskId, event) => {
        if (event.target.closest(".task-message-container")) {
            return;
        }
        setSelectedTask(selectedTask === taskId ? null : taskId);
    };

    return (
        <Layout>
            <div className="container-fluid bg-primary-subtle rounded p-4 min-vh-100">
                {/* Quote Section */}
                <div className="text-center my-4">
                    {quote && (
                        <blockquote className="blockquote">
                            <h2 className="quote-text"><em>{quote.quote}</em></h2>
                            <p className="quote-author">— {quote.author}</p>
                        </blockquote>
                    )}
                </div>

                <div className="row mt-4">
                    {/*AI Summary & Total Contacts */}
                    <div className="col-md-6">
                        <AIContextProvider>
                            <TodoSentence />
                        </AIContextProvider>

                        {/* Total Contacts Section */}
                        <div className="card mt-4 p-3 shadow-sm border-0 rounded text-center">
                            <h5 className="fw-bold"> Total Contacts</h5>
                            <p className="display-6 fw-bold text-primary">{contacts.length}</p>
                            <p className="text-muted">Keep growing your network!</p>
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="col-md-6">
                    <div className="p-4 bg-white rounded shadow border" style={{ minHeight: '100%', marginLeft: '1rem' }}>
                        <h4 className="fw-bold mb-3">Upcoming Tasks</h4>

                        <div className="d-flex align-items-start bg-light rounded p-3 mb-4" style={{ gap: '10px' }}>
                        <div style={{ fontSize: '1.5rem', color: '#0d6efd' }}>💡</div>
                        <div style={{ fontWeight: '500', fontSize: '1rem' }}>
                            <span style={{ color: '#0d6efd', fontWeight: '600' }}>Tip:</span> Completing tasks boosts your relationship score and helps you build stronger connections!
                        </div>
                        </div>

                        <TaskAIContextProvider>
                        {tasks.length > 0 ? (
                            tasks.map((task) => {
                            const isCompleted = task.completed;

                            return (
                                <div
                                key={task.id}
                                className={`card shadow-sm border-0 rounded mb-3 ${isCompleted ? "completed-task" : ""}`}
                                style={{
                                    cursor: "pointer",
                                    transition: "0.3s ease",
                                    padding: "15px",
                                    backgroundColor: "#f8f9fa",
                                    opacity: isCompleted ? 0.7 : 1
                                }}
                                onClick={(event) => handleTaskClick(task.id, event)}
                                >
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5
                                        className="fw-bold mb-0"
                                        style={{
                                        color: isCompleted ? "#6c757d" : "#212529",
                                        textDecoration: isCompleted ? "line-through" : "none"
                                        }}
                                    >
                                        {task.title}
                                    </h5>
                                    {isCompleted && (
                                        <span className="badge bg-success" style={{ fontSize: "0.8rem" }}>
                                        Completed
                                        </span>
                                    )}
                                    </div>

                                    <p className="card-text mb-1">
                                    <strong>📆 Date:</strong> {task.date}
                                    </p>
                                    <p className="card-text mb-1">
                                    <strong>👤 Contact:</strong> {task.contactName}
                                    </p>

                                    <div className="form-check mt-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleTaskCompletion(task)}
                                        id={`complete-check-${task.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <label className="form-check-label" htmlFor={`complete-check-${task.id}`}>
                                        Mark completed
                                    </label>
                                    {!task.completed && task.contact && (
                                        <span className="ms-3 badge bg-primary-subtle text-primary fw-semibold">
                                        +5 Relationship Rating
                                        </span>
                                    )}
                                    </div>

                                    {selectedTask === task.id && (
                                    <div className="task-message-container mt-3">
                                        <TaskMessage task={task} />
                                    </div>
                                    )}
                                </div>
                                </div>
                            );
                            })
                        ) : (
                            <div className="text-muted">No tasks available.</div>
                        )}
                        </TaskAIContextProvider>
                    </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Home;
