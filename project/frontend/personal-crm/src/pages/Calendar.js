// import React, { useState, useEffect } from 'react';
// import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import Layout from '../components/Layout';
// import axiosInstance from "../endpoints/api"; 
// import './Calendar.css';

// const localizer = momentLocalizer(moment);

// const CalendarPage = () => {
//     const [events, setEvents] = useState([]);
//     const [tasks, setTasks] = useState([]);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [formType, setFormType] = useState(null); 
//     const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'Event' });
//     const [newTask, setNewTask] = useState({ title: '', date: '', type: 'Task', contact: '' });
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [selectedTask, setSelectedTask] = useState(null);
//     const [contacts, setContacts] = useState([]);
//     const [googleAuthToken, setGoogleAuthToken] = useState(null);
//     const [isSignedIn, setIsSignedIn] = useState(false);
    
//     const BASE_URL = 'http://127.0.0.1:8000/';

//     useEffect(() => {
//         const fetchEventsAndTasks = async () => {
//             try {
//                 const [eventsResponse, tasksResponse, contactsResponse] = await Promise.all([
//                     axiosInstance.get(`${BASE_URL}api/events/`),
//                     axiosInstance.get(`${BASE_URL}api/tasks/`), 
//                     axiosInstance.get(`${BASE_URL}contacts/`)
//                 ]);
                
//                 setContacts(contactsResponse.data);

//                 const eventsData = eventsResponse.data.map(event => ({
//                     ...event,
//                     start: new Date(moment.utc(event.start).format("YYYY-MM-DDTHH:mm:ss")),
//                     end: new Date(moment.utc(event.end).format("YYYY-MM-DDTHH:mm:ss")), 
//                     type: "Event"
//                 }));


//                 const sortedTasksData = tasksResponse.data.sort((a, b) => 
//                     new Date(a.date) - new Date(b.date)
//                 );

//                 const tasksData = sortedTasksData.map(task => ({
//                     id: `${task.id}`,
//                     title: `${task.title}`,
//                     start: moment(task.date).startOf('day').toDate(),  
//                     end: moment(task.date).startOf('day').toDate(),    
//                     allDay: true,
//                     style: { backgroundColor: '#014F86', color: 'white' },
//                     type: "Task", 
//                     contact: task.contact || "",
//                 }));

//                 setEvents([...eventsData, ...tasksData]);
//                 setTasks(sortedTasksData);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };

//         fetchEventsAndTasks();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;

//         if (formType === 'event') {
//             setNewEvent({ ...newEvent, [name]: value });
//         } else if (formType === 'task') {
//             setNewTask({ ...newTask, [name]: value });
//         }
//     };

//     const handleAddEvent = async (e) => {
//         e.preventDefault();

//         if (newEvent.title.trim() !== '' && newEvent.start && newEvent.end) {
//             try {
//                 const response = await axiosInstance.post(`${BASE_URL}api/events/`, newEvent);
//                 const createdEvent = response.data;

//                 setEvents([...events, {
//                     ...createdEvent,
//                     start: new Date(moment.utc(createdEvent.start).format("YYYY-MM-DDTHH:mm:ss")),
//                     end: new Date(moment.utc(createdEvent.end).format("YYYY-MM-DDTHH:mm:ss")), 
//                     type: 'Event'
//                 }]);
//             } catch (error) {
//                 console.error('Error adding event:', error);
//             }

//             setNewEvent({ title: '', start: '', end: '' });
//             setSidebarOpen(false);
//         }
//     };

//     const handleAddTask = async (e) => {
//         e.preventDefault();
//         if (newTask.title.trim() !== '' && newTask.date) {
//             try {
//                 const response = await axiosInstance.post(`${BASE_URL}api/tasks/`, newTask);
//                 const createdTask = response.data;

//                 const taskEvent = {
//                     id: `${createdTask.id}`,
//                     title: `${createdTask.title}`,
//                     start: moment(createdTask.date).startOf('day').toDate(),  
//                     end: moment(createdTask.date).startOf('day').toDate(),    
//                     allDay: true,
//                     style: { backgroundColor: '#014F86', color: 'white' },
//                     type: "Task",
//                     contact: createdTask.contact || ""
//                 };

//                 setTasks([...tasks, createdTask]);
//                 setEvents([...events, taskEvent]);
//             } catch (error) {
//                 console.error('Error adding task:', error);
//             }

//             setNewTask({ title: '', date: '' , contact: ''});
//             setSidebarOpen(false);
//             // setShowTaskForm(false);
//         }
//     };
    
//     const handleUpdateEvent = async (e) => {
//         e.preventDefault();
    
//         if (!selectedEvent) return;
    
//         try {
//             const updatedEventData = {
//                 title: selectedEvent.title,
//                 start: selectedEvent.start,
//                 end: selectedEvent.end,
//             };
    
//             await axiosInstance.put(`${BASE_URL}api/events/${selectedEvent.id}/`, updatedEventData);
    
//             const updatedEvents = events.map(event =>
//                 event.id === selectedEvent.id
//                     ? { 
//                         ...event, 
//                         title: updatedEventData.title,
//                         start: new Date(moment.utc(updatedEventData.start).format("YYYY-MM-DDTHH:mm:ss")),
//                         end: new Date(moment.utc(updatedEventData.end).format("YYYY-MM-DDTHH:mm:ss"))
//                     } 
//                     : event
//             );
    
//             setEvents(updatedEvents);
    
//             setSelectedEvent(null);
//             setSidebarOpen(false);
//         } catch (error) {
//             console.error('Error updating event:', error);
//         }
//     };
            
//     const handleUpdateTask = async (e) => {
//         e.preventDefault();
    
//         if (!selectedTask) return;
    
//         try {
//             const updatedTaskData = {
//                 title: selectedTask.title,
//                 date: moment(selectedTask.start).format("YYYY-MM-DD"),
//                 contact: selectedTask.contact || "",
//             };
    
//             await axiosInstance.put(`${BASE_URL}api/tasks/${selectedTask.id}/`, updatedTaskData);
    
//             const updatedTasks = tasks.map(task =>
//                 task.id === selectedTask.id ? { ...task, ...updatedTaskData } : task
//             );
    
//             setTasks(updatedTasks);
    
//             const updatedEvents = events.map(event =>
//                 event.id === selectedTask.id
//                     ? { 
//                         ...event, 
//                         title: `${updatedTaskData.title}`,
//                         start: moment(updatedTaskData.date).startOf('day').toDate(),
//                         end: moment(updatedTaskData.date).startOf('day').toDate(),
//                         contact: updatedTaskData.contact, 
//                         style: { backgroundColor: '#014F86', color: 'white' }
//                     } 
//                     : event
//             );
    
//             setEvents(updatedEvents);
    
//             setSelectedTask(null);
//             setSidebarOpen(false);
//         } catch (error) {
//             console.error('Error updating task:', error);
//         }
//     };
                
//     const CustomEvent = ({ event }) => { 
//         return (
//             <div className="custom-event" onClick={() => {
//                 setFormType(event.type.toLowerCase());
    
//                 if (event.type === "Event") {
//                     setSelectedEvent(event);
//                     setNewEvent({ 
//                         title: event.title, 
//                         start: moment(event.start).format("YYYY-MM-DDTHH:mm"), 
//                         end: moment(event.end).format("YYYY-MM-DDTHH:mm") 
//                     });
//                 } else if (event.type === "Task") {
//                     setSelectedTask(event);
//                     setNewTask({ 
//                         title: event.title, 
//                         date: moment(event.start).format("YYYY-MM-DD"),
//                         contact: event.contact ? event.contact : ""   
//                     });
//                 }
    
//                 setSidebarOpen(true);  
//             }}>
//                 <span>{event.title}</span>
//             </div>
//         );
//     };    
            
//     const deleteItem = async (event) => {
//         if (event.type === "Event") {
//             try {
//                 const response = await axiosInstance.delete(`${BASE_URL}api/events/${event.id}/delete/`);
//                 const updatedTasks = tasks.filter(task => task.id.toString() !== event.id.toString());
//                 const updatedEvents = events.filter(e => e.id.toString() !== event.id.toString());
//                 setTasks(updatedTasks)
//                 setEvents(updatedEvents)
    
//             } catch (error) {
//                 console.error('Error deleting Event:', error);
//             }

//         } else if (event.type === "Task") {
//             try {
//                 const response = await axiosInstance.delete(`${BASE_URL}api/tasks/${event.id}/delete/`);
//                 const updatedTasks = tasks.filter(task => task.id.toString() !== event.id.toString());
//                 const updatedEvents = events.filter(e => e.id.toString() !== event.id.toString());
//                 setTasks(updatedTasks)
//                 setEvents(updatedEvents)
    
//             } catch (error) {
//                 console.error('Error deleting task:', error);
//             }
//         } else {
//             console.error("Trying to delete invalid item, shouldn't end up here")
//         }
//     };  
    
//     const fetchGoogleCalendarEvents = async () => {
//         try {
//             const response = await axiosInstance.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
//                 headers: { Authorization: `Bearer ${googleAuthToken}` },
//             });
//             const googleEvents = response.data.items.map(event => ({
//                 id: event.id,
//                 title: event.summary,
//                 start: moment(event.start.dateTime || event.start.date).toDate(),
//                 end: moment(event.end.dateTime || event.end.date).toDate(),
//                 type: 'Google Calendar Event',
//             }));
//             setEvents(prevEvents => [...prevEvents, ...googleEvents]);
//         } catch (error) {
//             console.error('Error fetching Google Calendar events:', error);
//         }
//     };

//     useEffect(() => {
//         if (googleAuthToken) {
//             fetchGoogleCalendarEvents();
//         }
//     }, [googleAuthToken]);

//     const handleGoogleSignIn = () => {
//         const clientId = "YOUR_CLIENT_ID";
//         const redirectUri = "http://localhost:3000/calendars/";
//         const scope = "https://www.googleapis.com/auth/calendar.readonly";
//         const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
//         window.location.href = authUrl;
//     };

//     useEffect(() => {
//         const fragment = window.location.hash;
//         const tokenMatch = fragment.match(/#access_token=([a-zA-Z0-9_-]+)/);
//         if (tokenMatch) {
//             const token = tokenMatch[1];
//             setGoogleAuthToken(token);
//             window.location.hash = '';
//             setIsSignedIn(true);
//         }
//     }, []);  

//     return (
//         <Layout>
//             <div className={`calendar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
//                 <div className={`calendar-container ${sidebarOpen ? 'shrink' : ''}`}>
//                     <Calendar
//                         localizer={localizer}
//                         events={events}  
//                         startAccessor="start"
//                         endAccessor="end"
//                         style={{ height: "95vh" }} 
//                         views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
//                         defaultView={Views.MONTH}
//                         components={{
//                             event: CustomEvent, 
//                         }}
//                         eventPropGetter={(event) => {
//                             let backgroundColor = event.type === "Task" ? "#014F86" : "#3174ad"; 
//                             let color = "white";
//                             return { style: { backgroundColor, color } };
//                         }}  
                                         
//                     />
//                 </div>

//                 <div className="bottom-right-buttons">
//                 <button 
//                     className="blue-button" 
//                     onClick={() => { 
//                         setFormType('event'); 
//                         setSelectedEvent(null); 
//                         setSelectedTask(null);
//                         setNewEvent({ title: '', start: '', end: '', type: 'Event' });  // Reset fields
//                         setSidebarOpen(true); 
//                     }}
//                 >
//                     + Add Event
//                 </button>
//                 <button 
//                     className="blue-button" 
//                     onClick={() => { 
//                         setFormType('task'); 
//                         setSelectedEvent(null); 
//                         setSelectedTask(null);
//                         setNewTask({ title: '', date: '', contact: '', type: 'Task' }); // Reset fields
//                         setSidebarOpen(true); 
//                     }}
//                 >
//                     + Add Task
//                 </button>

//             </div>

//             <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
//                 {formType === 'event' ? (
//                     selectedEvent ? (
//                         <>
//                             <h3>Edit Event</h3>
//                             <label>Title:</label>
//                             <input 
//                                 type="text" 
//                                 name="title" 
//                                 value={selectedEvent.title} 
//                                 onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} 
//                             />
//                             <label>Start Time:</label>
//                             <input 
//                                 type="datetime-local" 
//                                 name="start" 
//                                 value={moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")} 
//                                 onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
//                             />
//                             <label>End Time:</label>
//                             <input 
//                                 type="datetime-local" 
//                                 name="end" 
//                                 value={moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")} 
//                                 onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
//                             />
//                             <div className="button-group">
//                                 <button className="cancel-button" onClick={() => { deleteItem(selectedEvent); setSidebarOpen(false); }}>Delete</button>
//                                 <button className="save-button" onClick={handleUpdateEvent}>Save Changes</button>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <h3>Add Event</h3>
//                             <label>Title:</label>
//                             <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} />
//                             <label>Start Time:</label>
//                             <input type="datetime-local" name="start" value={newEvent.start} onChange={handleInputChange} />
//                             <label>End Time:</label>
//                             <input type="datetime-local" name="end" value={newEvent.end} onChange={handleInputChange} />
//                             <div className="button-group">
//                                 <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
//                                 <button className="save-button" onClick={handleAddEvent}>Save</button>
//                             </div>
//                         </>
//                     )
//                 ) : formType === 'task' ? (
//                     selectedTask ? (
//                         <>
//                             <h3>Edit Task</h3>
//                             <label>Title:</label>
//                             <input 
//                                 type="text" 
//                                 name="title" 
//                                 value={selectedTask.title} 
//                                 onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} 
//                             />
//                             <label>Date:</label>
//                             <input 
//                                 type="date" 
//                                 name="date" 
//                                 value={moment(selectedTask.start).format("YYYY-MM-DD")} 
//                                 onChange={(e) => setSelectedTask({ ...selectedTask, start: e.target.value })}
//                             />
//                             <label>Contact:</label>
//                             <select 
//                                 name="contact" 
//                                 value={selectedTask.contact} 
//                                 onChange={(e) => setSelectedTask({ ...selectedTask, contact: e.target.value })}
//                             >
//                                 <option value="">Select a contact (optional)</option>
//                                 {contacts.map(contact => (
//                                     <option key={contact.id} value={contact.id}>{contact.name}</option>
//                                 ))}
//                             </select>
//                             <div className="button-group">
//                                 <button className="cancel-button" onClick={() => { deleteItem(selectedTask); setSidebarOpen(false); }}>Delete</button>
//                                 <button className="save-button" onClick={handleUpdateTask}>Save Changes</button>
//                             </div>
//                         </>
//                     ) : (
//                         <>
//                             <h3>Add Task</h3>
//                             <label>Title:</label>
//                             <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />
//                             <label>Date:</label>
//                             <input type="date" name="date" value={newTask.date} onChange={handleInputChange} />
//                             <label>Contact:</label>
//                             <select name="contact" value={newTask.contact} onChange={handleInputChange}>
//                                 <option value="">Select a contact (optional)</option>
//                                 {contacts.map(contact => (
//                                     <option key={contact.id} value={contact.id}>{contact.name}</option>
//                                 ))}
//                             </select>
//                             <div className="button-group">
//                                 <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
//                                 <button className="save-button" onClick={handleAddTask}>Save</button>
//                             </div>
//                         </>
//                     )
//                 ) : null}
//             </div>
//             </div>
//             {isSignedIn ? (
//                 <p>You are signed in with Google Calendar.</p>
//             ) : (
//                 <p>You are not signed in. Please sign in with Google to access your calendar events.</p>
//             )}
//             <button className="blue-button" onClick={handleGoogleSignIn}>
//                 Sign in with Google Calendar
//             </button>
//         </Layout>
//     );
// };

// export default CalendarPage;

//WORKING

import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Google Calendar Component
function GoogleCalendar() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);

    // Google Login Function
    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        onSuccess: (response) => {
            console.log("Google OAuth Token:", response.access_token);
            setUser(response);
            fetchEvents(response.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    // Fetch Google Calendar Events
    const fetchEvents = async (accessToken) => {
        try {
            const now = new Date();
            const pastDate = new Date(); 
            pastDate.setDate(now.getDate() - 365); // Fetch up to 1 year of past events
    
            // Fetch past events
            const pastResponse = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1000&orderBy=startTime&singleEvents=true&timeMin=${pastDate.toISOString()}&timeMax=${now.toISOString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: "application/json",
                    },
                }
            );
    
            // Fetch future events
            const futureResponse = await fetch(
                `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1500&orderBy=startTime&singleEvents=true&timeMin=${now.toISOString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: "application/json",
                    },
                }
            );
    
            const pastData = await pastResponse.json();
            const futureData = await futureResponse.json();
    
            console.log("Past Events:", pastData);
            console.log("Future Events:", futureData);
    
            const processEvents = (data) =>
                data.items
                    ?.filter(event => event.start && event.end)
                    .map((event) => {
                        const isAllDay = !!event.start.date; // Check if it's an all-day event
            
                        if (isAllDay) {
                            const startDate = new Date(event.end.date); // Start of the all-day event
                            const endDate = new Date(event.end.date); // Google Calendar uses exclusive end date
            
                            // Set the start to midnight of the start date
                            startDate.setHours(0, 0, 0, 0);
            
                            // Set the end to 23:59:59 of the actual end date
                            endDate.setHours(23, 59, 59, 999);
            
                            return {
                                title: event.summary || "No Title",
                                start: startDate,
                                end: endDate,
                                allDay: true,
                            };
                        } else {
                            return {
                                title: event.summary || "No Title",
                                start: new Date(event.start.dateTime),
                                end: new Date(event.end.dateTime),
                                allDay: false,
                            };
                        }
                    }) || [];                     
            
    
            // Merge past and future events
            const allEvents = [...processEvents(pastData), ...processEvents(futureData)];
    
            console.log("Merged Events:", allEvents);
            setEvents(allEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    
                
    // Logout Function
    const logout = () => {
        googleLogout();
        setUser(null);
        setEvents([]); // Clear events on logout
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Google Calendar Integration</h2>

            {!user ? (
                <button onClick={login} style={buttonStyle}>Sign In with Google</button>
            ) : (
                <>
                    <button onClick={logout} style={buttonStyle}>Sign Out</button>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500, marginTop: 20 }}
                    />
                </>
            )}
        </div>
    );
}

// Button Styling
const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
};

// App Component (Wraps Everything with OAuth Provider)
function App() {
    return (
        <GoogleOAuthProvider clientId="907064336132-ndgkcrejsl3kp89016p375at9j8udt2t.apps.googleusercontent.com">
            <GoogleCalendar />
        </GoogleOAuthProvider>
    );
}

export default App;