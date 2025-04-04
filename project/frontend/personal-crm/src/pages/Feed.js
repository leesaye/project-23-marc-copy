import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import axiosInstance from "../endpoints/api";
import moment from "moment";
import "./Calendar.css";

function Feed() {
  const [events, setEvents] = useState([]);
  const [addedEvents, setAddedEvents] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  // const BASE_URL = "http://127.0.0.1:8000/";
  // const BASE_URL = `https://project-23-marc.onrender.com/`;
  // const BASE_URL = `https://project-23-marc-backend-d4.onrender.com/`;
  // const BASE_URL = `https://project-23-marc-backend-deployment.onrender.com/`;
  const BASE_URL = `https://project-23-marc-1.onrender.com/`;

  const COLORS = ["#B5D22C", "#73AA2A", "#0995AE", "#04506A"];
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [selectedFeedEventId, setSelectedFeedEventId] = useState(null);

  useEffect(() => {
    fetchMoreEvents();
  }, []);

  const fetchMoreEvents = async () => {
    setLoading(true);
    try {
      // Using Dummy Data for Now
      const dummyEvents = [
        { id: 1, title: "Event 1", description: "This is the first event", date: "2025-03-10", contact: "John Smith" },
        { id: 2, title: "Event 2", description: "This is the second event", date: "2025-03-12", contact: "John Smith"},
        { id: 3, title: "Event 3", description: "This is the third event", date: "2025-03-15", contact: "John Smith"},
        { id: 4, title: "Event 4", description: "This is the fourth event", date: "2025-03-18", contact: "John Smith" },
        { id: 5, title: "Event 5", description: "This is the fifth event", date: "2025-03-20",  contact: "John Smith" },
      ];

      setEvents((prevEvents) => [...prevEvents, ...dummyEvents]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  };

  const lastEventRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreEvents();
      }
    });
    if (node) observer.current.observe(node);
  };

  // Opens modal
  const handleOpenEventModal = (event) => {
    setNewEvent({
      title: event.title,
      start: moment(event.date).set({ hour: 9, minute: 0 }).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.date).set({ hour: 17, minute: 0 }).format("YYYY-MM-DDTHH:mm"),
    });
    setSelectedFeedEventId(event.id);
    setShowEventForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Adds Event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${BASE_URL}api/events/`, {
        ...newEvent,
        color: selectedColor,
      });
      const createdEvent = response.data;

      setAddedEvents((prevState) => ({
        ...prevState,
        [selectedFeedEventId]: true,
      }));
    } catch (error) {
      console.error("Error adding event to calendar:", error);
    }
    setShowEventForm(false);
    setNewEvent({ title: "", start: "", end: "" });
    setSelectedFeedEventId(null);
    setSelectedColor(COLORS[0]);
  };

  const handleCancel = () => {
    setShowEventForm(false);
    setNewEvent({ title: "", start: "", end: "" });
    setSelectedFeedEventId(null);
  };

  return (
    <Layout>
      <div className="container bg-primary-subtle rounded p-3 min-vh-100">
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
                key={`${event.id}-${index}`}
                className="col-12 mb-3"
                ref={index === events.length - 1 ? lastEventRef : null}
              >
                <div className="card p-3 shadow-sm position-relative" style={{ minHeight: "150px" }}>
                  <div>
                    <h5>{event.title}</h5>
                    <p>{event.description}</p>
                    <small>{event.date} {event.contact} </small>
                  </div>
                  {addedEvents[event.id] ? (
                    <span
                      className="text-success position-absolute"
                      style={{ top: "10px", right: "10px", fontSize: "20px" }}
                    >
                      ✔
                    </span>
                  ) : (
                    <button
                      className="btn btn-success position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() => handleOpenEventModal(event)}
                    >
                      <span style={{ fontSize: "20px", color: "white" }}>+</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {loading && <p>Loading more events...</p>}
        </div>


        {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Event</h3>
            <label htmlFor="eventTitle">Title:</label>
            <input
              type="text"
              id="eventTitle"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="start">Start Time:</label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="end">End Time:</label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={newEvent.end}
              onChange={handleInputChange}
              required
            />

            <div className="color-picker">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>

            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="blue-button" onClick={handleAddEvent}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </Layout>
  );
}

export default Feed;
