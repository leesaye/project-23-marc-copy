import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import moment from "moment";

function Feed() {
    const [events, setEvents] = useState([]);
    const [addedEvents, setAddedEvents] = useState({}); 
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const BASE_URL = 'http://127.0.0.1:8000/';


    useEffect(() => {
        fetchMoreEvents();
    }, []);

    const fetchMoreEvents = async () => {
        setLoading(true);
        try {
            // Using Dummy Data for Now
            const dummyEvents = [
                { id: 1, title: "Event 1", description: "This is the first event", date: "2025-03-10" },
                { id: 2, title: "Event 2", description: "This is the second event", date: "2025-03-12" },
                { id: 3, title: "Event 3", description: "This is the third event", date: "2025-03-15" },
                { id: 4, title: "Event 4", description: "This is the fourth event", date: "2025-03-18" },
                { id: 5, title: "Event 5", description: "This is the fifth event", date: "2025-03-20" },
            ];

            setEvents(prevEvents => [...prevEvents, ...dummyEvents]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
        setLoading(false);
    };

    const lastEventRef = (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchMoreEvents();
            }
        });
        if (node) observer.current.observe(node);
    };

    const handleAddEventToCalendar = async (event) => {
        try {
            const newEvent = {
                title: event.title,
                start: moment(event.date).startOf('day').toDate(),
                end: moment(event.date).endOf('day').toDate(),
            };

            // Add the event to the calendar via API
            const response = await axiosInstance.post(`${BASE_URL}api/events/`, newEvent);
            const createdEvent = response.data;

            console.log("Event added to calendar:", createdEvent);

            // Update the added events state for the specific event ID
            setAddedEvents(prevState => ({
                ...prevState,
                [event.id]: true, // Mark the event as added to calendar
            }));
        } catch (error) {
            console.error('Error adding event to calendar:', error);
        }
    };

    return (
        <Layout>
            <div className="container bg-primary-subtle rounded p-3 vh-100">
                <div className="row">
                    <div className="col-2">
                        <h2>Feed</h2>
                    </div>
                </div>
                <div className="text-center mx-5">
                    <h3 className="mb-4">Upcoming Events</h3>
                    <div className="row">
                        {events.map((event, index) => (
                            <div 
                                key={event.id} 
                                className="col-12 mb-3" 
                                ref={index === events.length - 1 ? lastEventRef : null}
                            >
                                <div 
                                    className="card p-3 shadow-sm position-relative"
                                    style={{ minHeight: '150px' }}
                                >
                                    <div>
                                        <h5>{event.title}</h5>
                                        <p>{event.description}</p>
                                        <small>{event.date}</small>
                                    </div>
                                    {addedEvents[event.id] ? (
                                        <span 
                                            className="text-success position-absolute" 
                                            style={{
                                                top: '10px',
                                                right: '10px',
                                                fontSize: '20px'
                                            }}
                                        >
                                            ✔
                                        </span>
                                    ) : (
                                        <button 
                                            className="btn btn-success position-absolute" 
                                            style={{
                                                top: '10px',
                                                right: '10px',
                                                borderRadius: '50%',
                                                width: '30px',
                                                height: '30px',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }} 
                                            onClick={() => handleAddEventToCalendar(event)}
                                        >
                                            <span style={{ fontSize: '20px', color: 'white' }}>+</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {loading && <p>Loading more events...</p>}
                </div>
            </div>
        </Layout>
    );
}

export default Feed;
