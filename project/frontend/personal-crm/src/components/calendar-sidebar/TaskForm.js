import React from "react";
import moment from "moment";
import TagSelector from "../Tags";
import ColorPicker from "./ColorPicker";

export default function TaskForm({
    selectedTask,
    setSelectedTask,
    newTask,
    setNewTask,
    contacts,
    handleInputChange,
    handleAddTask,
    handleUpdateTask,
    deleteItem,
    setSidebarOpen,
    selectedColor,
    COLORS
}) {
    return (
        selectedTask ? (
            <>
                <h3>Edit Task</h3>
                <label>Title:</label>
                <input type="text" name="title" value={selectedTask.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} />

                <label>Date:</label>
                <input type="date" name="date" value={moment(selectedTask.start).format("YYYY-MM-DD")} onChange={(e) => setSelectedTask({ ...selectedTask, start: e.target.value })} />

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
                <ColorPicker 
                    COLORS={COLORS}
                    formType={"task"}
                    selectedItem={selectedTask}
                />
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
                <ColorPicker 
                    COLORS={COLORS}
                    formType={"task"}
                    selectedItem={selectedTask}
                />
                <div className="button-group">
                    <button className="cancel-button" onClick={() => setSidebarOpen(false)}>Cancel</button>
                    <button className="save-button" onClick={(e) => handleAddTask(e, selectedColor())}>Save</button>
                </div>
            </>
        )
    );
}