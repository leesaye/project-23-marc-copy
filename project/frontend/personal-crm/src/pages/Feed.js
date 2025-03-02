import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";

function Feed() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

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
                                <div className="card p-3 shadow-sm">
                                    <h5>{event.title}</h5>
                                    <p>{event.description}</p>
                                    <small>{event.date}</small>
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
