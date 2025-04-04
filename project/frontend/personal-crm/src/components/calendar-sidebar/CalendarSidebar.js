import React, { useState } from "react";
import moment from "moment";
import axiosInstance from "../../endpoints/api.js";
import "../../pages/Calendar.css";
import EventForm from "./EventForm.js";
import TaskForm from "./TaskForm.js";

const BASE_URL = "http://127.0.0.1:8000/";

export default function CalendarSidebar({
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
}) {
    const [formErrors] = useState({});

    const handleAddEvent = async (e, selectedColor) => {
        e.preventDefault();
        if (!newEvent.title.trim()) {
            alert("Title is required.");
            return;
        }

        if (!newEvent.start) {
            alert("Start time is required.");
            return;
        }
        if (!newEvent.end) {
            alert("End time is required.");
            return;
        }
        if (newEvent.start >= newEvent.end) {
            alert("Start date must be before the end date.");
            return;
        }


            try {
                const color = selectedColor || "#4285F4"
                newEvent.color = color;

                const payload = {
                    ...newEvent,
                    start: new Date(newEvent.start).toISOString(),
                    end: new Date(newEvent.end).toISOString(),
                    color
                };

                const response = await axiosInstance.post(`${BASE_URL}api/events/`, payload);
                const created = response.data;
                const eventData = {
                    ...created,
                    start: new Date(moment(created.start).local().format("YYYY-MM-DDTHH:mm")),
                    end: new Date(moment(created.end).local().format("YYYY-MM-DDTHH:mm")),
                    type: "Event",
                    style: { backgroundColor: selectedColor, color: "white" },
                    contact: created.contact || "",
                    tag: created.tag || "",
                };

                setEvents(prev => [...prev, eventData]);
            } catch (err) {

            }
            setNewEvent({ title: "", start: "", end: "", contact: "", tag: "" });
            setSidebarOpen(false);
    };

    const handleAddTask = async (e, selectedColor) => {
        e.preventDefault();

        if (!newTask.title.trim()) {
            alert("Title is required.");
            return;
        }

        if (!newTask.date) {
            alert("Date is required.");
            return;
        }

        try {
            const payload = { ...newTask, color: selectedColor };
            const color = selectedColor || "#014F86";
            const response = await axiosInstance.post(`${BASE_URL}api/tasks/`, payload);
            const created = response.data;

            const taskEvent = {
                ...created,
                start: moment(created.date).startOf("day").toDate(),
                end: moment(created.date).endOf("day").toDate(),
                allDay: true,
                type: "Task",
                style: { backgroundColor: color, color: "white" },
                contact: created.contact || "",
                tag: created.tag || "",
                completed: created.completed || false,
            };

            setTasks(prev => [...prev, taskEvent]);
            setNewTask({ title: "", date: "", contact: "", tag: "", type: "Task", completed: false });
            setSidebarOpen(false);
        } catch (err) {

        }
        setNewTask({ title: "", date: "", contact: "", tag: "" });
        setSidebarOpen(false);
    };

    const handleUpdateEvent = async (e, selectedColor) => {
        e.preventDefault();

        if (!selectedEvent) return;

        if (!selectedEvent.title.trim()) {
            alert("Title is required.");
            return;
        }
        if (!selectedEvent.start) {
            alert("Start time is required.");
            return;
        }
        if (!selectedEvent.end) {
            alert("End time is required.");
            return;
        }
        if (selectedEvent.start >= selectedEvent.end) {
            alert("Start date must be before the end date.");
            return;
        }

        try {
            const color = selectedColor || "#4285F4";

            const updatedEventData = {
                title: selectedEvent.title,
                start: new Date(selectedEvent.start).toISOString(),
                end: new Date(selectedEvent.end).toISOString(),
                contact: selectedEvent.contact || "",
                color: color,
                ...(selectedEvent.tag ? { tag: selectedEvent.tag } : {})
            };

            await axiosInstance.put(`${BASE_URL}api/events/${selectedEvent.id}/`, updatedEventData);

            const updatedEvents = events.map(event =>
                event.id === selectedEvent.id
                    ? {
                        ...event,
                        title: updatedEventData.title,
                        start: new Date(moment(updatedEventData.start).local().format("YYYY-MM-DDTHH:mm")),
                        end: new Date(moment(updatedEventData.end).local().format("YYYY-MM-DDTHH:mm")),
                        contact: updatedEventData.contact,
                        style: { backgroundColor: selectedColor, color: 'white' },
                        tag: updatedEventData.tag
                    }
                    : event
            );

            if (updatedEventData.start >= updatedEventData.end) {
                alert("Start date must be before the end date.");
                return;
            }

            setEvents(updatedEvents);

            setSelectedEvent(null);
            setSidebarOpen(false);
        } catch (error) {

        }
    };

    const handleUpdateTask = async (e, selectedColor) => {
        e.preventDefault();

        if (!selectedTask) return;

        if (!selectedTask.title.trim()) {
            alert("Title is required.");
            return;
        }

        if (!selectedTask.start) {
            alert("Date is required.");
            return;
        }

        try {
            const color = selectedColor || "#014F86";
            const wasCompleted = tasks.find(t => t.id === selectedTask.id)?.completed;
            const nowCompleted = selectedTask.completed;
            const updated = {
                title: selectedTask.title,
                date: moment(selectedTask.start).format("YYYY-MM-DD"),
                contact: selectedTask.contact || "",
                color: color,
                completed: selectedTask.completed,
                tag: selectedTask.tag === "" ? "" : selectedTask.tag
            };
            await axiosInstance.put(`${BASE_URL}api/tasks/${selectedTask.id}/`, updated);

            const updatedTasks = tasks.map(t =>
                t.id === selectedTask.id ? { ...t, ...updated } : t
            );
            setTasks(updatedTasks);

            const updatedTaskData = tasks.map(ev =>
                ev.id === selectedTask.id
                    ? {
                        ...ev,
                        title: updated.title,
                        start: moment(updated.date).startOf("day").toDate(),
                        end: moment(updated.date).endOf("day").toDate(),
                        allDay: true,
                        contact: updated.contact,
                        completed: updated.completed,
                        style: { backgroundColor: selectedColor, color: "white" },
                        tag: updated.tag
                    }
                    : ev
            );
            setTasks(updatedTaskData);

            if (!wasCompleted && nowCompleted && selectedTask.contact) {
                const contact = contacts.find(c => c.id === selectedTask.contact);
                if (contact && contact.relationship_rating < 100) {
                    const updatedRating = Math.min(contact.relationship_rating + 5, 100);
                    await axiosInstance.post(`${BASE_URL}contacts/${contact.id}`, {
                        relationship_rating: updatedRating
                    });
                }
            }

            setSelectedTask(null);
            setSidebarOpen(false);
        } catch (err) {

        }
    };

    const deleteItem = async (item) => {
        const isTask = item.type === "Task";
        const endpoint = isTask ? "tasks" : "events";
        try {
            await axiosInstance.delete(`${BASE_URL}api/${endpoint}/${item.id}/delete/`);
            setEvents(prev => prev.filter(e => e.id !== item.id));
            setTasks(prev => prev.filter(t => t.id !== item.id));
                    } catch (err) {

        }
        setSidebarOpen(false);
    };

    const selectedColor = () => {
        const selected = document.querySelector(".color-option.selected")?.dataset.selectedColor;

        if (selected) return selected;

        if (formType === "task") {
            return selectedTask?.color || "#014F86";
        } else if (formType === "event") {
            return selectedEvent?.color || "#4285F4";
        }

        return "#4285F4";
    };

    return (
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            {formType === "event" ? (
                <EventForm
                    contacts={contacts}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    selectedColor={selectedColor}
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    handleAddEvent={handleAddEvent}
                    handleUpdateEvent={handleUpdateEvent}
                    setSidebarOpen={setSidebarOpen}
                    deleteItem={deleteItem}
                    COLORS={COLORS}
                />
            ) : formType === "task" ? (
                <TaskForm
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    contacts={contacts}
                    handleInputChange={handleInputChange}
                    handleAddTask={handleAddTask}
                    handleUpdateTask={handleUpdateTask}
                    deleteItem={deleteItem}
                    setSidebarOpen={setSidebarOpen}
                    selectedColor={selectedColor}
                    COLORS={COLORS}
                />
            ) : null}
        </div>
    );
}
