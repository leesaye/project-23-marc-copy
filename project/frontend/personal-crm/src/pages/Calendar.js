import React, { useEffect, useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import axiosInstance from "../endpoints/api"; 
import './Calendar.css';
import Layout from '../components/Layout';


const localizer = momentLocalizer(moment);

function GoogleCalendar() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formType, setFormType] = useState(null); 
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'Event' });
    const [newTask, setNewTask] = useState({ title: '', date: '', type: 'Task', contact: '' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [contacts, setContacts] = useState([]);

    const COLORS = ["#B5D22C", "#73AA2A", "#0995AE", "#04506A"]
    
    const BASE_URL = 'http://127.0.0.1:8000/';


    useEffect(() => {
        fetchEventsAndTasks();
    }, []);
    
    const fetchEventsAndTasks = async () => {
        try {
            const [eventsResponse, tasksResponse, contactsResponse] = await Promise.all([
                axiosInstance.get(`${BASE_URL}api/events/`),
                axiosInstance.get(`${BASE_URL}api/tasks/`),
                axiosInstance.get(`${BASE_URL}contacts/`)
            ]);
    
            setContacts(contactsResponse.data);
    
            const eventsData = eventsResponse.data.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                type: event.source === "google" ? "Google Event" : "Event",
                style: { backgroundColor: event.color || "#3174ad", color: 'white' }
            }));
            
            console.log(tasksResponse.data)

            const tasksData = tasksResponse.data.map(task => ({
                id: task.id,
                title: task.title,
                start: moment(task.date).startOf('day').toDate(),
                end: moment(task.date).startOf('day').toDate(),
                allDay: true,
                type: "Task",
                style: { backgroundColor: task.color || "#014F86", color: 'white' },
                contact: task.contact || "",
                completed: task.completed
            }));
    
            setEvents([...eventsData, ...tasksData]);
            setTasks(tasksResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
            
    const processEvents = (events = []) => {
        return events.map(event => {
            // Create new Date objects for the start and end times
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            
            console.log("Processed Event:", {
                title: event.title,
                start: startDate,
                end: endDate,
                all_day: event.all_day,
                color: event.color,
                style: { backgroundColor: event.color || "#3174ad", color: 'white' },
                type: "Event"
            });

            return {
                ...event,
                start: startDate,
                end: endDate,
                style: { backgroundColor: event.color || "#3174ad", color: 'white' },
                type: "Event"
            };
        });
    };
        
    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        onSuccess: (response) => {
            setUser({ id: response.userId });
            syncCalendar(response.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    const syncCalendar = async (token) => {
        try {
            const response = await axios.post(`${BASE_URL}api/sync_google_calendar/`, {
                access_token: token
            }, { withCredentials: true });
    
            const eventsData = response.data?.events || [];
            setEvents(processEvents(eventsData));
            window.location.reload();
        } catch (error) {
            console.error("Sync failed:", error);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (formType === 'event') {
            setNewEvent({ ...newEvent, [name]: value });
        } else if (formType === 'task') {
            setNewTask({ ...newTask, [name]: value });
        }
    };

    const handleAddEvent = async (e, selectedColor) => {
        e.preventDefault();

        if (newEvent.title.trim() !== '' && newEvent.start && newEvent.end) {
            try {
                newEvent.color = selectedColor;
                const response = await axiosInstance.post(`${BASE_URL}api/events/`, newEvent);
                const createdEvent = response.data;

                setEvents([...events, {
                    ...createdEvent,
                    start: new Date(moment.utc(createdEvent.start).format("YYYY-MM-DDTHH:mm:ss")),
                    end: new Date(moment.utc(createdEvent.end).format("YYYY-MM-DDTHH:mm:ss")), 
                    type: 'Event',
                    style: { backgroundColor: selectedColor, color: 'white' }
                }]);
            } catch (error) {
                console.error('Error adding event:', error);
            }

            setNewEvent({ title: '', start: '', end: '' });
            setSidebarOpen(false);
        }
    };

    const handleAddTask = async (e, selectedColor) => {
        e.preventDefault();
        if (newTask.title.trim() !== '' && newTask.date) {
            try {
                newTask.color = selectedColor;
                const response = await axiosInstance.post(`${BASE_URL}api/tasks/`, newTask);
                const createdTask = response.data;
                const taskEvent = {
                    id: `${createdTask.id}`,
                    title: `${createdTask.title}`,
                    start: moment(createdTask.date).startOf('day').toDate(),  
                    end: moment(createdTask.date).startOf('day').toDate(),    
                    allDay: true,
                    style: { backgroundColor: selectedColor, color: 'white' },
                    type: "Task",
                    contact: createdTask.contact || ""
                };

                setTasks([...tasks, createdTask]);
                setEvents([...events, taskEvent]);
            } catch (error) {
                console.error('Error adding task:', error);
            }

            setNewTask({ title: '', date: '' , contact: ''});
            setSidebarOpen(false);
        }
    };
    
    const handleUpdateEvent = async (e, selectedColor) => {
        e.preventDefault();
    
        if (!selectedEvent) return;
    
        try {
            const updatedEventData = {
                title: selectedEvent.title,
                start: selectedEvent.start,
                end: selectedEvent.end,
                color: selectedColor
            };
    
            await axiosInstance.put(`${BASE_URL}api/events/${selectedEvent.id}/`, updatedEventData);
    
            const updatedEvents = events.map(event =>
                event.id === selectedEvent.id
                    ? { 
                        ...event, 
                        title: updatedEventData.title,
                        start: new Date(moment.utc(updatedEventData.start).format("YYYY-MM-DDTHH:mm:ss")),
                        end: new Date(moment.utc(updatedEventData.end).format("YYYY-MM-DDTHH:mm:ss")),
                        style: { backgroundColor: selectedColor, color: 'white' }
                    } 
                    : event
            );
    
            setEvents(updatedEvents);
    
            setSelectedEvent(null);
            setSidebarOpen(false);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };
            
    const handleUpdateTask = async (e, selectedColor) => {
        e.preventDefault();
    
        if (!selectedTask) return;
        console.log(selectedTask);
        try {
            const updatedTaskData = {
                title: selectedTask.title,
                date: moment(selectedTask.start).format("YYYY-MM-DD"),
                contact: selectedTask.contact || "",
                color: selectedColor,
                completed: selectedTask.completed
            };
    
            await axiosInstance.put(`${BASE_URL}api/tasks/${selectedTask.id}/`, updatedTaskData);
    
            const updatedTasks = tasks.map(task =>
                task.id === selectedTask.id ? { ...task, ...updatedTaskData } : task
            );
    
            setTasks(updatedTasks);
    
            const updatedEvents = events.map(event =>
                event.id === selectedTask.id
                    ? { 
                        ...event, 
                        title: `${updatedTaskData.title}`,
                        start: moment(updatedTaskData.date).startOf('day').toDate(),
                        end: moment(updatedTaskData.date).startOf('day').toDate(),
                        contact: updatedTaskData.contact, 
                        style: { backgroundColor: selectedColor, color: 'white' },
                        completed: updatedTaskData.completed
                    } 
                    : event
            );
    
            setEvents(updatedEvents);
    
            setSelectedTask(null);
            setSidebarOpen(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
                
    const CustomEvent = ({ event }) => { 
        return (
            <div className="custom-event" onClick={() => {
                setFormType(event.type.toLowerCase());
    
                if (event.type === "Event") {
                    setSelectedEvent(event);
                    setNewEvent({ 
                        title: event.title, 
                        start: moment(event.start).format("YYYY-MM-DDTHH:mm"), 
                        end: moment(event.end).format("YYYY-MM-DDTHH:mm") 
                    });
                } else if (event.type === "Task") {
                    setSelectedTask(event);
                    setNewTask({ 
                        title: event.title, 
                        date: moment(event.start).format("YYYY-MM-DD"),
                        contact: event.contact ? event.contact : ""   
                    });
                }
    
                setSidebarOpen(true);  
            }}>
                <span>{event.title}</span>
            </div>
        );
    };    
            
    const deleteItem = async (event) => {
        if (event.type === "Event") {
            try {
                const response = await axiosInstance.delete(`${BASE_URL}api/events/${event.id}/delete/`);
                const updatedTasks = tasks.filter(task => task.id.toString() !== event.id.toString());
                const updatedEvents = events.filter(e => e.id.toString() !== event.id.toString());
                setTasks(updatedTasks)
                setEvents(updatedEvents)
    
            } catch (error) {
                console.error('Error deleting Event:', error);
            }

        } else if (event.type === "Task") {
            try {
                const response = await axiosInstance.delete(`${BASE_URL}api/tasks/${event.id}/delete/`);
                const updatedTasks = tasks.filter(task => task.id.toString() !== event.id.toString());
                const updatedEvents = events.filter(e => e.id.toString() !== event.id.toString());
                setTasks(updatedTasks)
                setEvents(updatedEvents)
    
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        } else {
            console.error("Trying to delete invalid item, shouldn't end up here")
        }
    };    

    return (
        <Layout>
            <div className={`calendar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className={`calendar-container ${sidebarOpen ? 'shrink' : ''}`}> 
                    <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "500px" }}
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    defaultView={Views.MONTH}
                    components={{
                        event: CustomEvent,
                    }}
                    eventPropGetter={(event) => {
                        console.log("Event:", event);
                    
                        return {
                            style: {
                                backgroundColor: event.completed ? "#808080" : event.style?.backgroundColor || "#3174ad",
                                color: "white",
                                textDecoration: event.completed ? "line-through" : "none",
                                backgroundImage: event.completed? 
                                    "repeating-linear-gradient(45deg, #808080, #808080 10px, #7a7a7a 10px, #7a7a7a 20px)"
                                    : "none",
                            }
                        };
                    }}
                />

                <div style={{ marginTop: "20px", display: "flex", gap: "20px", justifyContent: "center" }}>
                    <button 
                        className="blue-button"
                        onClick={() => {
                            setFormType('event');
                            setSelectedEvent(null);
                            setSelectedTask(null);
                            setNewEvent({ title: '', start: '', end: '', type: 'Event' });
                            setSidebarOpen(true);
                        }}
                    >
                        + Add Event
                    </button>
                    <button 
                        className="blue-button"
                        onClick={() => {
                            setFormType('task');
                            setSelectedEvent(null);
                            setSelectedTask(null);
                            setNewTask({ title: '', date: '', contact: '', type: 'Task' });
                            setSidebarOpen(true);
                        }}
                    >
                        + Add Task
                    </button>
                </div>
                
                <div style={{ marginTop: "40px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>📅 Google Calendar Integration</h2>

                    <p style={{ fontSize: "16px", color: "#555", marginBottom: "30px" }}>
                        Click the button below to securely connect your Google Calendar. After signing in, your Google Calendar events will automatically appear on the calendar above.
                    </p>

                    <button onClick={login} className={"button-style"}>Sign In with Google Calendar</button>
                </div>

            </div>
        
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {formType === 'event' ? (
                    selectedEvent ? (
                        <>
                            <h3>Edit Event</h3>
                            <label>Title:</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={selectedEvent.title} 
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} 
                            />
                            <label>Start Time:</label>
                            <input 
                                type="datetime-local" 
                                name="start" 
                                value={moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")} 
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
                            />
                            <label>End Time:</label>
                            <input 
                                type="datetime-local" 
                                name="end" 
                                value={moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")} 
                                onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
                            />
                            <div className="color-picker">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option`}
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        document.querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
                                        e.target.classList.add("selected");
                                        e.target.dataset.selectedColor = color;
                                    }}
                                >
                                </div>
                                ))}
                            </div>
                            <div className="button-group">
                                <button className="cancel-button" onClick={() => { deleteItem(selectedEvent); setSidebarOpen(false); }}>Delete</button>
                                <button 
                                    className="save-button" 
                                    onClick={(e) =>{
                                        const selectedColor = document.querySelector(".color-option.selected")?.dataset.selectedColor || "#3174ad";
                                        handleUpdateEvent(e, selectedColor);
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Add Event</h3>
                            <label>Title:</label>
                            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} />
                            <label>Start Time:</label>
                            <input type="datetime-local" name="start" value={newEvent.start} onChange={handleInputChange} />
                            <label>End Time:</label>
                            <input type="datetime-local" name="end" value={newEvent.end} onChange={handleInputChange} />
                            <div className="color-picker">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option`}
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        document.querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
                                        e.target.classList.add("selected");
                                        e.target.dataset.selectedColor = color;
                                    }}
                                >
                                </div>
                                ))}
                            </div>
                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                                <button 
                                    className="save-button" 
                                    onClick={(e) =>{
                                        const selectedColor = document.querySelector(".color-option.selected")?.dataset.selectedColor || "#3174ad";
                                        handleAddEvent(e, selectedColor);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </>
                    )
                ) : formType === 'task' ? (
                    selectedTask ? (
                        <>
                            <h3>Edit Task</h3>
                            <label>Title:</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={selectedTask.title} 
                                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} 
                            />
                            <label>Date:</label>
                            <input 
                                type="date" 
                                name="date" 
                                value={moment(selectedTask.start).format("YYYY-MM-DD")} 
                                onChange={(e) => setSelectedTask({ ...selectedTask, start: e.target.value })}
                            />
                            <label>Contact:</label>
                            <select 
                                name="contact" 
                                value={selectedTask.contact} 
                                onChange={(e) => setSelectedTask({ ...selectedTask, contact: e.target.value })}
                            >
                                <option value="">Select a contact (optional)</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                                ))}
                            </select>
                            <div className="completed-toggle">
                                <label htmlFor="completed">Mark as Complete:</label>
                                <input
                                    id="completed"
                                    type="checkbox"
                                    checked={selectedTask.completed}
                                    onChange={(e) => setSelectedTask({ ...selectedTask, completed: e.target.checked })}
                                />
                                
                            </div>
                            <div className="color-picker">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option`}
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        document.querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
                                        e.target.classList.add("selected");
                                        e.target.dataset.selectedColor = color;
                                    }}
                                >
                                </div>
                                ))}

                            </div>
                            <div className="button-group">
                                <button className="cancel-button" onClick={() => { deleteItem(selectedTask); setSidebarOpen(false); }}>Delete</button>
                                <button 
                                    className="save-button" 
                                    onClick={(e) =>{
                                        const selectedColor = document.querySelector(".color-option.selected")?.dataset.selectedColor || "#014F86";
                                        handleUpdateTask(e, selectedColor);
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Add Task</h3>
                            <label>Title:</label>
                            <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />
                            <label>Date:</label>
                            <input type="date" name="date" value={newTask.date} onChange={handleInputChange} />
                            <label>Contact:</label>
                            <select name="contact" value={newTask.contact} onChange={handleInputChange}>
                                <option value="">Select a contact (optional)</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id}>{contact.name}</option>
                                ))}
                            </select>
                            <div className="color-picker">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option`}
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        document.querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
                                        e.target.classList.add("selected");
                                        e.target.dataset.selectedColor = color;
                                    }}
                                >
                                </div>
                                ))}

                            </div>
                            <div className="button-group">
                                <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                                <button 
                                    className="save-button" 
                                    onClick={(e) =>{
                                        const selectedColor = document.querySelector(".color-option.selected")?.dataset.selectedColor || "#014F86";
                                        handleAddTask(e, selectedColor);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </>
                    )
                ) : null}
            </div>
        </div>
    </Layout>
    );
};

export default GoogleCalendar;
