import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
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
        const fetchEventsAndTasks = async () => {
            try {
                const [eventsResponse, tasksResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/events/'),
                    axios.get('http://127.0.0.1:8000/api/tasks/')
                ]);

                const eventsData = eventsResponse.data.map(event => ({
                    ...event,
                    start: new Date(event.start), 
                    end: new Date(event.end) 
                }));

                const tasksData = tasksResponse.data;

                const taskEvents = tasksData.map(task => ({
                    id: `task-${task.id}`,
                    title: `Task: ${task.title}`,
                    start: moment(task.date).startOf('day').toDate(),
                    end: moment(task.date).endOf('day').toDate(),
                    allDay: true,
                    style: { backgroundColor: task.color || '#014F86', color: 'white' } 
                }));

                setEvents([...eventsData, ...taskEvents]);
                setTasks(tasksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEventsAndTasks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showEventForm) {
            setNewEvent(prev => ({ ...prev, [name]: value }));
        } else if (showTaskForm) {
            setNewTask(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (newEvent.title.trim() !== '' && newEvent.start && newEvent.end) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/events/', newEvent);
                const createdEvent = response.data;

                setEvents([...events, {
                    ...createdEvent,
                    start: new Date(createdEvent.start), 
                    end: new Date(createdEvent.end),
                    color: newEvent.color || '#2f61a1'
                }]);
            } catch (error) {
                console.error('Error adding event:', error);
            }

            setNewEvent({ title: '', start: '', end: '', color: newEvent.color || '#2f61a1' });
            setShowEventForm(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask.title.trim() !== '' && newTask.date) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/tasks/', {
                    title: newTask.title,
                    date: newTask.date,
                    color: newTask.color || '#014F86' 
                });
                const createdTask = response.data;

                const taskEvent = {
                    id: `task-${createdTask.id}`,
                    title: `Task: ${createdTask.title}`,
                    start: moment(createdTask.date).startOf('day').toDate(),
                    end: moment(createdTask.date).endOf('day').toDate(),
                    allDay: true,
                    color: createdTask.color || '#014f86'
                };

                console.log(events);
                console.log(tasks);

                setTasks([...tasks, createdTask]);
                setEvents([...events, taskEvent]);
            } catch (error) {
                console.error('Error adding task:', error);
            }

            setNewTask({ title: '', date: '', color: newTask.color || '#014F86' });
            setShowTaskForm(false);
        }
    };

    const eventPropGetter = (event) => {
        if (typeof event.id === 'string' && event.id.startsWith('task-')) {
            return { style: { backgroundColor: event.color || '#014F86', color: 'white' } }; 
        }
        
        return { style: { backgroundColor: event.color || '#2f61a1', color: 'white' } };
    };

    const dayPropGetter = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
    
        if (date < today) {
            return {
                className: 'past-day'
            };
        }
        return {};
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
                    dayPropGetter={dayPropGetter} 
                />

                {tasks.length > 0 && (
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
                            <label htmlFor="eventColor">Color:</label>
                            <input type="color" id="eventColor" name="color" value={newEvent.color || "#000000"} onChange={handleInputChange} />
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
                            <label htmlFor="taskColor">Color:</label>
                            <input type="color" id="taskColor" name="color" value={newTask.color || "#000000"} onChange={handleInputChange} />
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