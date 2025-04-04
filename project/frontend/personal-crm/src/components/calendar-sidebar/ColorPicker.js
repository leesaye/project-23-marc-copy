import React from "react";

export default function ColorPicker({ COLORS, formType, selectedItem}) {
    return (
        <div className="color-picker">
            {COLORS.map((color) => (
                <div
                    key={color}
                    className={`color-option ${
                        (formType === "event" && selectedItem?.color === color) ||
                        (formType === "task" && selectedItem?.color === color)
                            ? "selected"
                            : ""
                    }`}
                    style={{ backgroundColor: color }}
                    data-selected-color={color}
                    onClick={(e) => {
                        document.querySelectorAll(".color-option").forEach(el =>
                            el.classList.remove("selected")
                        );
                        e.currentTarget.classList.add("selected");
                    }}
                />
            ))}
        </div>
    );
}