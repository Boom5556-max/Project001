import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = ({ events, onEventClick, isCancelMode }) => {
  const renderEventContent = (eventInfo) => {
    const props = eventInfo.event.extendedProps;
    const isSchedule = props.isSchedule;
    const isClosed = props.temporarily_closed; 
    const shouldElevate = isCancelMode && isSchedule;

    // เลือกสีจุด: ถ้าปิดใช้สีเทา (slate), ตารางเรียนสีม่วง (indigo), จองสีเขียว (emerald)
    const dotColor = isClosed
      ? "bg-slate-400" 
      : isSchedule
        ? "bg-indigo-500 shadow-indigo-200"
        : "bg-emerald-500 shadow-emerald-200";

    return (
      <div
        className={`fc-event-inline-wrapper ${shouldElevate ? "elevated-clean" : ""} ${isClosed ? "is-closed" : ""}`}
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${dotColor}`}
        ></span>
        <span className="fc-event-time-bold">{eventInfo.timeText}</span>

        <span className="fc-event-title-light">
          {/* 🚩 เราถอด <b>(งดใช้ห้อง)</b> ออกจากตรงนี้แล้ว 
              เพราะมันจะติดมาจาก event.title ที่เราปรุงใน Helper เรียบร้อยแล้วครับ */}
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-3 shadow-inner overflow-hidden relative">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={onEventClick}
        locale="th"
        height="100%"
        timeZone="UTC"
        buttonText={{ today: "วันนี้", month: "เดือน", week: "สัปดาห์" }}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        eventContent={renderEventContent}
      />

      <style>{`
        .fc-event-inline-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          width: 100%;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .fc-event-time-bold { font-weight: 800; font-size: 0.65rem; white-space: nowrap; color: inherit; }
        .fc-event-title-light { font-size: 0.7rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: inherit; }

        /* --- สไตล์เวลาโดนงดใช้ห้อง --- */
        .is-closed {
          background-color: #fff1f2 !important; /* พื้นแดงระเรื่อ */
          border-radius: 8px;
          opacity: 0.9;
        }
        
        /* ขีดฆ่าเฉพาะตัว Title (ซึ่งรวมคำว่างดใช้ห้องที่มาจาก Helper แล้ว) */
        .is-closed .fc-event-title-light {
          color: #ef4444 !important; /* ตัวหนังสือแดงขรึมๆ */
          font-weight: 700;
        }

        .elevated-clean {
          background-color: white !important;
          color: #ef4444 !important;
          border: 2px solid #ef4444 !important;
          border-radius: 12px !important;
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 25px rgba(239, 68, 68, 0.18) !important;
          z-index: 50 !important;
          animation: floatClean 2s infinite ease-in-out;
        }

        @keyframes floatClean {
          0%, 100% { transform: translateY(-5px) scale(1.02); }
          50% { transform: translateY(-8px) scale(1.04); }
        }

        .fc-h-event, .fc-v-event { background: transparent !important; border: none !important; }
        
        ${isCancelMode ? `
          .fc-event:not(:has(.elevated-clean)) {
            opacity: 0.15;
            filter: grayscale(1) blur(0.4px);
            pointer-events: none;
          }
        ` : ""}

        .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 800; color: #2D2D86; }
        .fc .fc-button-primary { background-color: #2D2D86 !important; border: none !important; border-radius: 10px !important; font-size: 0.75rem !important; padding: 8px 16px !important; }
        .fc .fc-today-button { background-color: #B4C424 !important; color: #2D2D86 !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9 !important; }
        .fc-daygrid-event-dot { display: none !important; }
      `}</style>
    </div>
  );
};

export default CalendarView;