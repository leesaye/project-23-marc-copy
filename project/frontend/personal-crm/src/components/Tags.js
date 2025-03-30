import { useState } from "react";
import '../pages/Calendar.css';

const TagSelector = ({ selectedTag, setSelectedTag }) => {
    const [isCustomTag, setIsCustomTag] = useState(false);

    const tags = ["Meetup", "Work", "Personal"];

    const handleTagChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "custom") {
            setIsCustomTag(true);
            setSelectedTag("");  // Reset selectedTag for custom input
        } else {
            setIsCustomTag(false);
            setSelectedTag(selectedValue);
        }
    };

    const handleCustomTagChange = (e) => {
        setSelectedTag(e.target.value);  // Updates selectedTag live
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <label>Tag:</label>
            <select name="tag" value={isCustomTag ? "custom" : selectedTag} onChange={handleTagChange}>
                <option value="">Select a tag</option>
                {tags.map(tag => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
                <option value="custom">+ Create New Tag</option>
            </select>

            {isCustomTag && (
                <div>
                    <label>New Tag Name:</label>
                    <input
                        type="text"
                        value={selectedTag}
                        onChange={handleCustomTagChange}
                        placeholder="Enter tag name"
                    />
                </div>
            )}
        </div>
    );
};

export default TagSelector;
