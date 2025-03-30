import React, { useState } from "react";
import moment from "moment";
import axiosInstance from "../endpoints/api";
import "../pages/Calendar.css";
import TagSelector from "./Tags";

// const BASE_URL = "http://127.0.0.1:8000/";
const BASE_URL = `https://project-23-marc-backend-d4.onrender.com/`;

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
    const [formErrors, setFormErrors] = useState({});

    const handleAddEvent = async (e, selectedColor) => {
        e.preventDefault();
        const errors = {};
        if (!newEvent.title.trim()) errors.title = "Title is required.";
        if (!newEvent.start) errors.start = "Start time is required.";
        if (!newEvent.end) errors.end = "End time is required.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({}); {
            try {
                newEvent.color = selectedColor;
                const response = await axiosInstance.post(`${BASE_URL}api/events/`, newEvent);
                const created = response.data;
                const eventData = {
                    ...created,
                    start: new Date(moment.utc(created.start).format("YYYY-MM-DDTHH:mm:ss")),
                    end: new Date(moment.utc(created.end).format("YYYY-MM-DDTHH:mm:ss")),
                    type: "Event",
                    style: { backgroundColor: selectedColor, color: "white" },
                    contact: created.contact || "",
                    tag: created.tag || "",
                };
                setEvents(prev => [...prev, eventData]);
            } catch (err) {
                console.error("Error adding event:", err);
            }
            setNewEvent({ title: "", start: "", end: "", contact: "", tag: "" });
            setSidebarOpen(false);
        }
    };

    const handleAddTask = async (e, selectedColor) => {
        e.preventDefault();
        const errors = {};
        if (!newTask.title.trim()) errors.title = "Title is required.";
        if (!newTask.date) errors.date = "Date is required.";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({}); {
            try {
                newTask.color = selectedColor;
                const response = await axiosInstance.post(`${BASE_URL}api/tasks/`, newTask);
                const created = response.data;
                const taskEvent = {
                    id: created.id,
                    title: created.title,
                    start: moment(created.date).startOf("day").toDate(),
                    end: moment(created.date).startOf("day").toDate(),
                    allDay: true,
                    style: { backgroundColor: selectedColor, color: "white" },
                    type: "Task",
                    contact: created.contact || "",
                    tag: created.tag || "",
                };
                setTasks(prev => [...prev, created]);
                setEvents(prev => [...prev, taskEvent]);
            } catch (err) {
                console.error("Error adding task:", err);
            }
            setNewTask({ title: "", date: "", contact: "", tag: "" });
            setSidebarOpen(false);
        }
    };

    const handleUpdateEvent = async (e, selectedColor) => {
        e.preventDefault();

        if (!selectedEvent) return;

        try {
            const updatedEventData = {
                title: selectedEvent.title,
                start: selectedEvent.start,
                end: selectedEvent.end,
                contact: selectedEvent.contact || "",
                color: selectedColor,
                ...(selectedEvent.tag ? { tag: selectedEvent.tag } : {})
            };

            await axiosInstance.put(`${BASE_URL}api/events/${selectedEvent.id}/`, updatedEventData);

            const updatedEvents = events.map(event =>
                event.id === selectedEvent.id
                    ? {
                        ...event,
                        title: updatedEventData.title,
                        start: new Date(moment.utc(updatedEventData.start).format("YYYY-MM-DDTHH:mm:ss")),
                        end: new Date(moment.utc(updatedEventData.end).format("YYYY-MM-DDTHH:mm:ss")),
                        contact: updatedEventData.contact,
                        style: { backgroundColor: selectedColor, color: 'white' },
                        tag: updatedEventData.tag
                    }
                    : event
            );
            // console.log("✅ Final updated object to insert into calendar:", {
            //     start: moment(updatedEventData.start, "YYYY-MM-DDTHH:mm").toDate(),
            //     end: moment(updatedEventData.end, "YYYY-MM-DDTHH:mm").toDate(),
            //   });

            setEvents(updatedEvents);

            setSelectedEvent(null);
            setSidebarOpen(false);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleUpdateTask = async (e, selectedColor) => {
        e.preventDefault();
        if (!selectedTask) return;

        try {
            const wasCompleted = tasks.find(t => t.id === selectedTask.id)?.completed;
            const nowCompleted = selectedTask.completed;
            const updated = {
                title: selectedTask.title,
                date: moment(selectedTask.start).format("YYYY-MM-DD"),
                contact: selectedTask.contact || "",
                color: selectedColor,
                completed: selectedTask.completed,
                tag: selectedTask.tag === "" ? "" : selectedTask.tag
            };
            await axiosInstance.put(`${BASE_URL}api/tasks/${selectedTask.id}/`, updated);

            const updatedTasks = tasks.map(t =>
                t.id === selectedTask.id ? { ...t, ...updated } : t
            );
            setTasks(updatedTasks);

            const updatedEvents = events.map(ev =>
                ev.id === selectedTask.id
                    ? {
                        ...ev,
                        title: updated.title,
                        start: moment(updated.date).startOf("day").toDate(),
                        end: moment(updated.date).startOf("day").toDate(),
                        contact: updated.contact,
                        completed: updated.completed,
                        style: { backgroundColor: selectedColor, color: "white" },
                        tag: updated.tag
                    }
                    : ev
            );
            setEvents(updatedEvents);

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
            console.error("Error updating task:", err);
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
            console.error(`Error deleting ${item.type}:`, err);
        }
        setSidebarOpen(false);
    };

    const renderColorPicker = () => (
        <div className="color-picker">
            {COLORS.map((color) => (
                <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                        document.querySelectorAll(".color-option").forEach(el => el.classList.remove("selected"));
                        e.target.classList.add("selected");
                        e.target.dataset.selectedColor = color;
                    }}
                />
            ))}
        </div>
    );

    const selectedColor = () =>
        document.querySelector(".color-option.selected")?.dataset.selectedColor ||
        (formType === "task" ? "#014F86" : "#3174ad");

    return (
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            {formType === "event" ? (
                selectedEvent ? (
                    <>
                        <h3>Edit Event</h3>
                        <label>Title:</label>
                        <input type="text" name="title" value={selectedEvent.title} onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} />
                        <label>Start Time:</label>
                        <input type="datetime-local" name="start" value={moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")} onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })} />
                        <label>End Time:</label>
                        <input type="datetime-local" name="end" value={moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")}  onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })} />
                        <label>Contact:</label>
                        <select name="contact" value={selectedEvent.contact} onChange={(e) => setSelectedEvent({ ...selectedEvent, contact: e.target.value })}>
                            <option value="">Select a contact (optional)</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <TagSelector
                            selectedTag={selectedEvent.tag}
                            setSelectedTag={(tagValue) =>
                                setSelectedEvent((prev) => ({ ...prev, tag: tagValue }))
                        }
                        />
                        {renderColorPicker()}
                        <div className="button-group">
                            <button className="cancel-button" onClick={() => deleteItem(selectedEvent)}>Delete</button>
                            <button className="save-button" onClick={(e) => handleUpdateEvent(e, selectedColor())}>Save Changes</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Add Event</h3>
                        <label>Title:</label>
                        <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} />
                        {formErrors.title && <span className="form-error">{formErrors.title}</span>}

                        <label>Start Time:</label>
                        <input type="datetime-local" name="start" value={newEvent.start} onChange={handleInputChange} />
                        {formErrors.start && <span className="form-error">{formErrors.start}</span>}

                        <label>End Time:</label>
                        <input type="datetime-local" name="end" value={newEvent.end} onChange={handleInputChange} />
                        {formErrors.end && <span className="form-error">{formErrors.end}</span>}

                        <label>Contact:</label>
                        <select name="contact" value={newEvent.contact} onChange={handleInputChange}>
                            <option value="">Select a contact (optional)</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <TagSelector
                        selectedTag={newEvent.tag || ""}
                        setSelectedTag={(tagValue) =>
                            setNewEvent((prev) => ({ ...prev, tag: tagValue }))
                        }
                        />
                        {renderColorPicker()}
                        <div className="button-group">
                            <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                            <button className="save-button" onClick={(e) => handleAddEvent(e, selectedColor())}>Save</button>
                        </div>
                    </>
                )
            ) : formType === "task" ? (
                selectedTask ? (
                    <>
                        <h3>Edit Task</h3>
                        <label>Title:</label>
                        <input type="text" name="title" value={selectedTask.title} onChange={handleInputChange} />
                        {formErrors.title && <span className="form-error">{formErrors.title}</span>}

                        <label>Date:</label>
                        <input type="date" name="date" value={selectedTask.date} onChange={handleInputChange} />
                        {formErrors.date && <span className="form-error">{formErrors.date}</span>}

                        <label>Contact:</label>
                        <select value={selectedTask.contact} onChange={(e) => setSelectedTask({ ...selectedTask, contact: e.target.value })}>
                            <option value="">Select a contact (optional)</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <TagSelector
                        selectedTag={selectedTask.tag || ""}
                        setSelectedTag={(tagValue) =>
                            setSelectedTask((prev) => ({ ...prev, tag: tagValue }))
                        }
                        />
                        <div className="completed-toggle">
                            <div className="label-with-checkbox">
                                <label htmlFor="completed">Mark Completed:</label>
                                <input
                                id="completed"
                                type="checkbox"
                                checked={selectedTask.completed}
                                onChange={(e) =>
                                    setSelectedTask({ ...selectedTask, completed: e.target.checked })
                                }
                                />
                            </div>
                            {selectedTask.contact && (
                                <div className="relationship-badge">+5 Relationship Rating</div>
                            )}
                            </div>
                        {renderColorPicker()}
                        <div className="button-group">
                            <button className="cancel-button" onClick={() => deleteItem(selectedTask)}>Delete</button>
                            <button className="save-button" onClick={(e) => handleUpdateTask(e, selectedColor())}>Save Changes</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>Add Task</h3>
                        <label>Title:</label>
                        <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />
                        <label>Date:</label>
                        <input type="date" name="date" value={newTask.date} onChange={handleInputChange} />
                        <label>Contact:</label>
                        <select name="contact" value={newTask.contact} onChange={handleInputChange}>
                            <option value="">Select a contact (optional)</option>
                            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <TagSelector
                        selectedTag={newTask.tag || ""}
                        setSelectedTag={(tagValue) =>
                            setNewTask((prev) => ({ ...prev, tag: tagValue }))
                        }
                        />
                        {renderColorPicker()}
                        <div className="button-group">
                            <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                            <button className="save-button" onClick={(e) => handleAddTask(e, selectedColor())}>Save</button>
                        </div>
                    </>
                )
            ) : null}
        </div>
    );
}
