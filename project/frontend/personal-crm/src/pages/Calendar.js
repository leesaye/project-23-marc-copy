import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
    const [newTask, setNewTask] = useState({ title: '', date: '' });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/events/')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error fetching events:', error));

        axios.get('http://127.0.0.1:8000/api/tasks/')
            .then(response => {
                setTasks(response.data);
                const taskEvents = response.data.map(task => ({
                    title: `Task: ${task.title}`,
                    start: moment(task.date).startOf('day').toDate(),
                    end: moment(task.date).endOf('day').toDate(),
                    allDay: true
                }));
                setEvents(prevEvents => [...prevEvents, ...taskEvents]); // Merge tasks with events
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (showEventForm) {
            setNewEvent({ ...newEvent, [name]: value });
        } else if (showTaskForm) {
            setNewTask({ ...newTask, [name]: value });
        }
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (newEvent.title.trim() !== '' && newEvent.start && newEvent.end) {
            axios.post('http://127.0.0.1:8000/api/events/', newEvent)
                .then(response => setEvents([...events, response.data]))
                .catch(error => console.error('Error adding event:', error));
            setNewEvent({ title: '', start: '', end: '' });
            setShowEventForm(false);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim() !== '' && newTask.date) {
            const taskEvent = {
                title: `Task: ${newTask.title}`,
                start: moment(newTask.date).startOf('day').toDate(),
                end: moment(newTask.date).endOf('day').toDate(),
                allDay: true
            };

            axios.post('http://127.0.0.1:8000/api/tasks/', newTask)
                .then(response => {
                    setTasks([...tasks, response.data]);
                    setEvents([...events, taskEvent]); // Ensure the new task appears immediately
                })
                .catch(error => console.error('Error adding task:', error));

            setNewTask({ title: '', date: '' });
            setShowTaskForm(false);
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
                />

                {tasks.length > 0 && (
                    <div className="task-list">
                        <h3>Tasks</h3>
                        <ul>
                            {tasks.map((task, index) => (
                                <li key={index}>
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
