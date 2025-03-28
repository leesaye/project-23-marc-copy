import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function CalendarView({ events, onSelectEvent }) {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "500px" }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            components={{
                event: ({ event }) => (
                    <div className="custom-event" onClick={() => onSelectEvent(event)}>
                        <span>{event.title}</span>
                    </div>
                )
            }}
            eventPropGetter={(event) => {
                return {
                    style: {
                        backgroundColor: event.completed
                            ? "#808080"
                            : event.style?.backgroundColor || "#3174ad",
                        color: "white",
                        textDecoration: event.completed ? "line-through" : "none",
                        backgroundImage: event.completed
                            ? "repeating-linear-gradient(45deg, #808080, #808080 10px, #7a7a7a 10px, #7a7a7a 20px)"
                            : "none",
                    },
                };
            }}
        />
    );
}

export default CalendarView;
