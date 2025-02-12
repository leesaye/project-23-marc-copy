import React, { useState } from 'react';
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
            setEvents([...events, {
                title: newEvent.title,
                start: new Date(newEvent.start),
                end: new Date(newEvent.end),
            }]);
            setNewEvent({ title: '', start: '', end: '' });
            setShowEventForm(false);
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim() !== '' && newTask.date) {
            const taskEvent = {
                title: newTask.title,
                start: new Date(newTask.date),
                end: new Date(newTask.date),
                allDay: true
            };
            setTasks([...tasks, newTask]);
            setEvents([...events, taskEvent]);
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
