import React, { useEffect, useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);
const API_BASE_URL = "http://127.0.0.1:8000/api/";

function GoogleCalendar() {
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const storedEvents = localStorage.getItem("calendar_events");
        if (storedEvents) {
            setEvents(processEvents(JSON.parse(storedEvents)));
        } else {
            fetchEventsFromBackend();
        }
    }, []);

    const processEvents = (events) => {
        return events.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }));
    };

    const fetchEventsFromBackend = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}get_google_events/`, {
                withCredentials: true
            });

            const formattedEvents = processEvents(response.data);
            setEvents(formattedEvents);
            localStorage.setItem("calendar_events", JSON.stringify(formattedEvents));
        } catch (error) {
            console.error("Error fetching events from backend:", error);
        }
    };

    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.readonly",
        onSuccess: (response) => {
            setUser({ id: response.userId });
            setAccessToken(response.access_token);
            syncCalendar(response.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    const syncCalendar = async (token) => {
        try {
            const response = await axios.post(`${API_BASE_URL}sync_google_calendar/`, {
                access_token: token
            }, { withCredentials: true });

            const formattedEvents = processEvents(response.data.events);
            setEvents(formattedEvents);
            localStorage.setItem("calendar_events", JSON.stringify(formattedEvents));
        } catch (error) {
            console.error("Sync failed:", error);
        }
    };

    useEffect(() => {
        if (user && accessToken) {
            const syncInterval = setInterval(() => {
                syncCalendar(accessToken);
            }, 5 * 60 * 1000);

            return () => {
                clearInterval(syncInterval);
            };
        }
    }, [user, accessToken]);

    const logout = () => {
        googleLogout();
        setUser(null);
        setEvents([]);
        localStorage.removeItem("calendar_events");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Google Calendar Integration</h2>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, marginTop: 20 }}
                views={["month", "week", "day", "agenda"]}
                defaultView={Views.WEEK}
            />

            {!user && (
                <button onClick={login} style={buttonStyle}>Sign In with Google</button>
            )}

            {user && (
                <button onClick={logout} style={unsyncButtonStyle}>Unsync & Sign Out</button>
            )}
        </div>
    );
}

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

const unsyncButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#D32F2F",
};

export default GoogleCalendar;
