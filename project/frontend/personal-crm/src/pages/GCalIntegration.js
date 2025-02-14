// src/utils/GoogleCalendarIntegration.js
import { useState } from 'react';

// Google API client library script
const CLIENT_ID = '907064336132-ndgkcrejsl3kp89016p375at9j8udt2t.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDN_fjE9jISoshp6IW_F7vO3TNC0c6oFnU';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

export const useGoogleCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const loadGoogleAPI = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://apis.google.com/js/api.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });
    };

    const initClient = () => {
        window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
        }).then(() => {
            const authInstance = window.gapi.auth2.getAuthInstance();
            setIsSignedIn(authInstance.isSignedIn.get());

            authInstance.isSignedIn.listen(setIsSignedIn);
        }).catch(error => console.error("Error loading Google Calendar API", error));
    };

    const handleAuthClick = () => {
        window.gapi.auth2.getAuthInstance().signIn();
    };

    const handleSignOutClick = () => {
        window.gapi.auth2.getAuthInstance().signOut();
    };

    const fetchGoogleCalendarEvents = async () => {
        try {
            const response = await window.gapi.client.calendar.events.list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime",
            });

            return response.result.items.map(event => ({
                title: event.summary,
                start: new Date(event.start.dateTime || event.start.date),
                end: new Date(event.end.dateTime || event.end.date),
            }));
        } catch (error) {
            console.error("Error fetching Google Calendar events:", error);
            return [];
        }
    };

    return { isSignedIn, loadGoogleAPI, initClient, handleAuthClick, handleSignOutClick, fetchGoogleCalendarEvents };
};
