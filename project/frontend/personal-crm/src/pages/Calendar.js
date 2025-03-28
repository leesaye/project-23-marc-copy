import React, { useEffect, useState } from "react";
import moment from "moment";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import axiosInstance from "../endpoints/api";
import Layout from "../components/Layout";
import CalendarView from "./CalendarView";
import CalendarSidebar from "../components/CalendarSidebar";
import "./Calendar.css";

const BASE_URL = 'http://127.0.0.1:8000/';
const COLORS = ["#B5D22C", "#73AA2A", "#0995AE", "#04506A"];

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [googleConnection, setGoogleConnection] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formType, setFormType] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', contact: '', type: 'Event' });
    const [newTask, setNewTask] = useState({ title: '', date: '', type: 'Task', contact: '' });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const googleLogin = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        onSuccess: (response) => {
            const encoded_token = btoa(response.access_token);
            axiosInstance.post(`${BASE_URL}api/googleToken/`, { googleToken: encoded_token });
            setUser(response);
            setGoogleConnection(response.access_token);
            syncCalendar(response.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    useEffect(() => {
        fetchEventsAndTasks();
        axiosInstance.get(`${BASE_URL}api/googleToken/`)
            .then((response) => {
                if (response.data) {
                    const decoded_token = atob(response.data.googleToken);
                    setGoogleConnection(decoded_token);
                    setUser(response.data.user);
                }
            }).catch(() => setUser(null));
    }, []);

    const fetchEventsAndTasks = async () => {
        try {
            const [eventsRes, tasksRes, contactsRes] = await Promise.all([
                axiosInstance.get(`${BASE_URL}api/events/`),
                axiosInstance.get(`${BASE_URL}api/tasks/`),
                axiosInstance.get(`${BASE_URL}contacts/`)
            ]);

            const eventsData = eventsRes.data.map(event => ({
                ...event,
                start: new Date(moment.utc(event.start).format("YYYY-MM-DDTHH:mm:ss")),
                end: new Date(moment.utc(event.end).format("YYYY-MM-DDTHH:mm:ss")), 
                type: event.source === "google" ? "Google Event" : "Event",
                contact: event.contact || "",
                style: { backgroundColor: event.color || "#3174ad", color: 'white' }
            }));

            const tasksData = tasksRes.data.map(task => ({
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
            setTasks(tasksRes.data);
            setContacts(contactsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const syncCalendar = async (token) => {
        try {
            const response = await axios.post(`${BASE_URL}api/sync_google_calendar/`, {
                access_token: token
            }, { withCredentials: true });

            const synced = response.data?.events.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                type: "Event",
                style: { backgroundColor: event.color || "#3174ad", color: 'white' }
            }));

            setEvents(prev => [...prev.filter(e => e.type !== "Google Event"), ...synced]);
            window.location.reload();
        } catch (error) {
            console.error("Sync failed:", error);
        }
    };

    const handleLogout = () => {
        axiosInstance.delete(`${BASE_URL}api/googleLogout/`);
        setUser(null);
        setGoogleConnection(null);
        googleLogout();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (formType === "event") setNewEvent(prev => ({ ...prev, [name]: value }));
        if (formType === "task") setNewTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectEvent = (event) => {
        setFormType(event.type.toLowerCase());
        if (event.type === "Event") {
            setSelectedEvent(event);
            setNewEvent({
                title: event.title,
                start: new Date(moment.utc(event.start).format("YYYY-MM-DDTHH:mm:ss")),
                end: new Date(moment.utc(event.end).format("YYYY-MM-DDTHH:mm:ss")), 
            contact: event.contact || ""
            });
        } else if (event.type === "Task") {
            setSelectedTask(event);
            setNewTask({
                title: event.title,
                date: moment(event.start).format("YYYY-MM-DD"),
                contact: event.contact || "",
                completed: event.completed || false
            });
        }
        setSidebarOpen(true);
    };

    return (
        <Layout>
            <div className={`calendar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className={`calendar-container ${sidebarOpen ? 'shrink' : ''}`}>
                    <CalendarView
                        events={events}
                        onSelectEvent={handleSelectEvent}
                    />
                    <div className="center-buttons">
                        <button className="blue-button" onClick={() => {
                            setFormType('event');
                            setSelectedEvent(null);
                            setSelectedTask(null);
                            setNewEvent({ title: '', start: '', end: '', contact: '', type: 'Event' });
                            setSidebarOpen(true);
                        }}>+ Add Event</button>
                        <button className="blue-button" onClick={() => {
                            setFormType('task');
                            setSelectedEvent(null);
                            setSelectedTask(null);
                            setNewTask({ title: '', date: '', contact: '', type: 'Task' });
                            setSidebarOpen(true);
                        }}>+ Add Task</button>
                    </div>

                    <div className="google-integration">
                        <h2>
                            <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_20_2x.png" alt="Google Calendar" style={{ width: "30px", height: "30px" }} />
                            Google Calendar Integration
                        </h2>
                        <p>Click the button below to securely connect your Google Calendar. This may take a few seconds...</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {!user ? (
                                <button onClick={googleLogin} className="button-style">Sign In with Google Calendar</button>
                            ) : (
                                <>
                                    <button onClick={() => syncCalendar(googleConnection)} className="button-style">Sync Google Calendar</button>
                                    <button onClick={handleLogout} className="button-style">Disconnect from Google</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <CalendarSidebar
                    {...{
                        formType,
                        sidebarOpen,
                        setSidebarOpen,
                        newEvent,
                        setNewEvent,
                        newTask,
                        setNewTask,
                        selectedEvent,
                        setSelectedEvent,
                        selectedTask,
                        setSelectedTask,
                        handleInputChange,
                        setEvents,
                        setTasks,
                        tasks,
                        events,
                        contacts,
                        COLORS
                    }}
                />
            </div>
        </Layout>
    );
}
