import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = ({ events, onEventClick }) => {
  return (
    <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-3 shadow-inner overflow-hidden relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        locale="th"
        height="100%"
        // 🚩 เปลี่ยนจาก local เป็น UTC เพื่อให้จบปัญหาการบวก/ลบเวลาซ้อน
        timeZone="UTC"
        buttonText={{ today: "วันนี้", month: "เดือน", week: "สัปดาห์" }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
      />

      <style>{`
        .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 800; color: #2D2D86; }
        .fc .fc-button-primary { background-color: #2D2D86 !important; border: none !important; border-radius: 8px !important; font-weight: bold !important; font-size: 0.75rem !important; }
        .fc .fc-today-button { background-color: #B4C424 !important; color: #2D2D86 !important; opacity: 1 !important; }
        .fc .fc-button-primary:hover { background-color: #B4C424 !important; color: #2D2D86 !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6 !important; }
        .fc-day-today { background: rgba(180, 196, 36, 0.05) !important; }
        .fc-event { cursor: pointer !important; border-radius: 4px !important; padding: 2px !important; font-size: 0.7rem !important; border: none !important; }
        /* ซ่อนเวลาเริ่มต้นถ้ามันรกเกินไป */
        .fc-event-time { font-weight: bold; margin-right: 3px; }
      `}</style>
    </div>
  );
};

export default CalendarView;
