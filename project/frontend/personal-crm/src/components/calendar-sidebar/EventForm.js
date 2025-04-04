import React from "react";
import moment from "moment";
import TagSelector from "../Tags";
import ColorPicker from "./ColorPicker";

export default function EventForm({
    contacts,
    formErrors,
    handleInputChange,  
    selectedColor,
    selectedEvent,
    newEvent,
    setSelectedEvent,
    setNewEvent,
    handleAddEvent,
    handleUpdateEvent,
    setSidebarOpen,
    deleteItem,
    COLORS,
}) {
    return (
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
                <ColorPicker 
                    COLORS={COLORS}
                    formType={"event"}
                    selectedItem={selectedEvent}
                />
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
                <ColorPicker 
                    COLORS={COLORS}
                    formType={"event"}
                    selectedItem={selectedEvent}
                />
                <div className="button-group">
                    <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                    <button className="save-button" onClick={(e) => handleAddEvent(e, selectedColor())}>Save</button>
                </div>
            </>
        )
    );
}