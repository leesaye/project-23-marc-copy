import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import axiosInstance from "../endpoints/api"; 
import './Calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', type: 'Event' });
    const [newTask, setNewTask] = useState({ title: '', date: '', type: 'Task' });

    useEffect(() => {
        const fetchEventsAndTasks = async () => {
            try {
                const [eventsResponse, tasksResponse] = await Promise.all([
                    axiosInstance.get('http://127.0.0.1:8000/api/events/'),
                    axiosInstance.get('http://127.0.0.1:8000/api/tasks/')
                ]);

                const eventsData = eventsResponse.data.map(event => ({
                    ...event,
                    start: moment(event.start).toDate(),
                    end: moment(event.end).toDate(),
                    type: "Event"
                }));

                const sortedTasksData = tasksResponse.data.sort((a, b) => 
                    new Date(a.date) - new Date(b.date)
                );

                const tasksData = sortedTasksData.map(task => ({
                    id: `${task.id}`,
                    title: `Task: ${task.title}`,
                    start: moment(task.date).startOf('day').toDate(),  
                    end: moment(task.date).startOf('day').toDate(),    
                    allDay: true,
                    style: { backgroundColor: '#014F86', color: 'white' },
                    type: "Task"
                }));

                setEvents([...eventsData, ...tasksData]);
                setTasks(sortedTasksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEventsAndTasks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (showEventForm) {
            setNewEvent({ ...newEvent, [name]: value });
        } else if (showTaskForm) {
            setNewTask({ ...newTask, [name]: value });
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();

        const startDate = new Date(newEvent.start);
        const endDate = new Date(newEvent.end);

        if (endDate < startDate) {
            alert("Error: End date/time cannot be earlier than start date/time.");
            return;
        }

        if (newEvent.title.trim() !== '' && newEvent.start && newEvent.end) {
            try {
                const response = await axiosInstance.post('http://127.0.0.1:8000/api/events/', newEvent);
                const createdEvent = response.data;

                console.log("Event added:", createdEvent);

                setEvents([...events, {
                    ...createdEvent,
                    start: moment(createdEvent.start).toDate(),
                    end: moment(createdEvent.end).toDate(),
                    type: 'Event'
                }]);
            } catch (error) {
                console.error('Error adding event:', error);
            }

            setNewEvent({ title: '', start: '', end: '' });
            setShowEventForm(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask.title.trim() !== '' && newTask.date) {
            try {
                const response = await axiosInstance.post('http://127.0.0.1:8000/api/tasks/', newTask);
                const createdTask = response.data;

                console.log("Task added:", createdTask);

                const taskEvent = {
                    id: `${createdTask.id}`,
                    title: `Task: ${createdTask.title}`,
                    start: moment(createdTask.date).startOf('day').toDate(),  
                    end: moment(createdTask.date).startOf('day').toDate(),    
                    allDay: true,
                    style: { backgroundColor: '#014F86', color: 'white' },
                    type: "Task"
                };

                setTasks([...tasks, createdTask]);
                setEvents([...events, taskEvent]);
            } catch (error) {
                console.error('Error adding task:', error);
            }

            setNewTask({ title: '', date: '' });
            setShowTaskForm(false);
        }
    };

    const eventPropGetter = (event) => {
        if (typeof event.id === 'string' && event.id.startsWith('task-')) {
            return { style: { backgroundColor: '#014F86', color: 'white' } };
        }
        return {};
    };

    const deleteItem = async (event) => {
        if (event.type === "Event") {
            try {
                const response = await axiosInstance.delete(`http://127.0.0.1:8000/api/events/${event.id}/delete/`);
                const updatedTasks = tasks.filter(task => task.id !== event.id);
                const updatedEvents = events.filter(e => e.id !== event.id);
                setTasks(updatedTasks)
                setEvents(updatedEvents)
    
            } catch (error) {
                console.error('Error deleting Event:', error);
            }

        } else if (event.type === "Task") {
            try {
                const response = await axiosInstance.delete(`http://127.0.0.1:8000/api/tasks/${event.id}/delete/`);
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
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "80vh" }}
                    views={{ month: true, week: true, day: true, agenda: true }} 
                    defaultView={Views.MONTH}
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={deleteItem}
                />

                {tasks?.length > 0 && (
                    <div className="task-list">
                        <h3>Tasks</h3>
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <strong>{task.title}</strong> - {moment(task.date).format('MMM DD, YYYY')}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bottom-right-buttons">
                    <button className="blue-button" onClick={() => setShowEventForm(true)}>+ Add Event</button>
                    <button className="blue-button" onClick={() => setShowTaskForm(true)}>+ Add Task</button>
                </div>

                {showEventForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Add Event</h3>
                            <label htmlFor="eventTitle">Title:</label>
                            <input type="text" id="eventTitle" name="title" value={newEvent.title} onChange={handleInputChange} required />
                            <label htmlFor="start">Start Time:</label>
                            <input type="datetime-local" id="start" name="start" value={newEvent.start} onChange={handleInputChange} required />
                            <label htmlFor="end">End Time:</label>
                            <input type="datetime-local" id="end" name="end" value={newEvent.end} onChange={handleInputChange} required />
                            <div className="modal-buttons">
                                <button className="blue-button" onClick={handleAddEvent}>Save</button>
                                <button className="cancel-button" onClick={() => setShowEventForm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showTaskForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Add Task</h3>
                            <label htmlFor="taskTitle">Title:</label>
                            <input type="text" id="taskTitle" name="title" value={newTask.title} onChange={handleInputChange} required />
                            <label htmlFor="taskDate">Date:</label>
                            <input type="date" id="taskDate" name="date" value={newTask.date} onChange={handleInputChange} required />
                            <div className="modal-buttons">
                                <button className="blue-button" onClick={handleAddTask}>Save</button>
                                <button className="cancel-button" onClick={() => setShowTaskForm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CalendarPage;
