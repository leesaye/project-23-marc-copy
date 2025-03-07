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

                let sortedTasks = tasksResponse.data
                    .map(task => ({
                        ...task,
                        contactName: contactsMap[task.contact] || "Not specified"
                    }))
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
                        <h4 className="fw-bold ms-3">Upcoming Tasks</h4>
                        <TaskAIContextProvider>
                            <div className="d-flex flex-column gap-3">
                                {tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="card shadow-sm border-0 rounded ms-3"
                                            style={{ cursor: "pointer", transition: "0.2s", padding: "15px" }}
                                            onClick={(event) => handleTaskClick(task.id, event)}
                                        >
                                            <div className="card-body">
                                                <h5 className="text-dark fw-bold mb-2">{task.title}</h5>
                                                <p className="card-text">
                                                    <span className="fw-bold">📆 Date:</span> {task.date}
                                                </p>
                                                <p className="card-text">
                                                    <span className="fw-bold">👤 Contact:</span> {task.contactName}
                                                </p>

                                                {selectedTask === task.id && (
                                                    <div className="task-message-container">
                                                        <TaskMessage task={task} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted ms-3">No tasks available.</p>
                                )}
                            </div>
                        </TaskAIContextProvider>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Home;
