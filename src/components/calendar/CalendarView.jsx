import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = ({ events, onEventClick, isCancelMode, currentUserId }) => {
  const renderEventContent = (eventInfo) => {
    const props = eventInfo.event.extendedProps;
    const isSchedule = props.isSchedule;
    const isClosed = props.temporarily_closed;
    
    // 🚩 เช็คว่าเป็นเจ้าของวิชาไหม (ดูจาก teacher_id ที่เราเก็บไว้ใน props ตอน formatEvents)
    const isOwner = props.teacher_id === currentUserId;

    // 🚩 ปรับเงื่อนไขการนูน: ต้องเป็นโหมดงดใช้ห้อง + เป็นตารางเรียน + "เป็นเจ้าของวิชา"
    const shouldElevate = isCancelMode && isSchedule && isOwner && !isClosed;
    const shouldRestore = isCancelMode && isSchedule && isOwner && isClosed;

    const dotColor = isClosed
      ? "bg-slate-400"
      : isSchedule
        ? "bg-indigo-500 shadow-indigo-200"
        : "bg-emerald-500 shadow-emerald-200";

    return (
      <div className={`fc-event-inline-wrapper 
          ${shouldElevate ? "elevated-clean" : ""} 
          ${shouldRestore ? "elevated-restore" : ""}
          ${isClosed ? "is-closed" : ""}
          ${isCancelMode && isClosed && isOwner ? "already-closed-active" : ""}`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 shadow-sm ${dotColor}`}></span>
        <span className="fc-event-time-bold">{eventInfo.timeText}</span>
        <span className="fc-event-title-light">{eventInfo.event.title}</span>
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
        .fc-event-inline-wrapper { display: flex; align-items: center; gap: 6px; padding: 2px 8px; width: 100%; overflow: hidden; transition: all 0.3s ease; }
        .fc-event-time-bold { font-weight: 800; font-size: 0.65rem; white-space: nowrap; color: inherit; }
        .fc-event-title-light { font-size: 0.7rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: inherit; }

        /* สไตล์พื้นฐานของวิชาที่โดนงด */
        .is-closed {
          background-color: #fff1f2 !important;
          border-radius: 8px;
          opacity: 0.8;
          cursor: pointer;
        }
        
        .is-closed .fc-event-title-light {
          color: #ef4444 !important;
          font-weight: 700;
        }

        /* 🚩 วิชาที่งดแล้ว ในโหมดปกติ/โหมดงดใช้ห้อง ให้ยังคลิกได้ (เพื่อเปิด Modal) */
        .already-closed-active {
          opacity: 1 !important;
          filter: none !important;
        }

        /* 🚩 สไตล์นูนแดง (สำหรับกดงดใช้ห้อง) */
        .elevated-clean {
          background-color: white !important;
          color: #ef4444 !important;
          border: 2px solid #ef4444 !important;
          border-radius: 12px !important;
          z-index: 50 !important;
          animation: floatRed 2s infinite ease-in-out;
        }

        /* 🚩 สไตล์นูนเขียว (สำหรับกดยกเลิกการงด) */
        .elevated-restore {
          background-color: white !important;
          color: #10b981 !important;
          border: 2px dashed #10b981 !important;
          border-radius: 12px !important;
          z-index: 50 !important;
          animation: floatGreen 2s infinite ease-in-out;
        }

        @keyframes floatRed {
          0%, 100% { transform: translateY(-5px) scale(1.02); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2); }
          50% { transform: translateY(-8px) scale(1.04); box-shadow: 0 12px 25px rgba(239, 68, 68, 0.3); }
        }

        @keyframes floatGreen {
          0%, 100% { transform: translateY(-5px) scale(1.02); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2); }
          50% { transform: translateY(-8px) scale(1.04); box-shadow: 0 12px 25px rgba(16, 185, 129, 0.3); }
        }

        .fc-h-event, .fc-v-event { background: transparent !important; border: none !important; }
        
        ${isCancelMode ? `
          /* จางตัวที่ไม่เกี่ยวข้องออก */
          .fc-event:not(:has(.elevated-clean)):not(:has(.elevated-restore)) {
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