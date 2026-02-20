import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = ({
  events,
  onEventClick,
  isCancelMode,
  currentUserId,
  currentUserRole,
}) => {
  const renderEventContent = (eventInfo) => {
    const props = eventInfo.event.extendedProps;
    const isSchedule = props.isSchedule;
    const isClosed = props.temporarily_closed;

    // 🚩 เช็คสิทธิ์ (Owner หรือ Staff)
    const isOwner = String(props.teacher_id) === String(currentUserId);
    const isStaff = String(currentUserRole || "").toLowerCase().trim() === "staff";
    const hasPermission = isOwner || isStaff;

    // 🚩 กำหนดสถานะการแสดงผลเมื่ออยู่ในโหมดจัดการ
    const shouldElevate = isCancelMode && isSchedule && hasPermission && !isClosed;
    const shouldRestore = isCancelMode && isSchedule && hasPermission && isClosed;

    // คุมโทนจุดสีด้านหน้าให้มีแค่ น้ำเงิน, เขียว, และเทา
    const dotColor = isClosed
      ? "bg-gray-400"
      : isSchedule
        ? "bg-[#302782]"
        : "bg-[#B2BB1E]";

    return (
      <div
        className={`fc-event-inline-wrapper 
          ${shouldElevate ? "elevated-clean" : ""} 
          ${shouldRestore ? "elevated-restore" : ""}
          ${isClosed ? "is-closed" : ""}
          ${isCancelMode && isClosed && hasPermission ? "already-closed-active" : ""}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`}></span>
        <span className="fc-event-time-bold">{eventInfo.timeText}</span>
        <span className="fc-event-title-light">
          {isClosed ? `(งด) ${eventInfo.event.title}` : eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-grow w-full h-full bg-[#FFFFFF] p-4 md:p-6 flex flex-col relative font-sans">
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
        /* --- Event Base Styles --- */
        .fc-event-inline-wrapper { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          padding: 4px 10px; 
          width: 100%; 
          overflow: hidden; 
          border-radius: 8px;
          transition: all 0.2s ease; 
        }
        
        /* ขยายขนาด Font ให้ใหญ่อ่านง่ายขึ้น */
        .fc-event-time-bold { 
          font-weight: 700; 
          font-size: 0.8rem; 
          white-space: nowrap; 
          color: inherit; 
        }
        .fc-event-title-light { 
          font-size: 0.85rem; 
          font-weight: 600; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          white-space: nowrap; 
          color: inherit; 
        }

        /* --- โหมดปกติ: วิชาที่ถูกงดใช้ห้อง --- */
        .is-closed {
          background-color: #F9FAFB !important; 
          color: #9CA3AF !important; 
          border: 1px solid #F3F4F6 !important;
          cursor: pointer;
        }

        .already-closed-active {
          opacity: 1 !important;
          filter: none !important;
        }

        /* --- โหมดจัดการ: ไฮไลต์สำหรับงดใช้ห้อง (กรอบน้ำเงิน) --- */
        .elevated-clean {
          background-color: #FFFFFF !important;
          color: #302782 !important;
          border: 1.5px solid #302782 !important;
          border-radius: 12px !important;
          z-index: 50 !important;
          box-shadow: 0 4px 15px rgba(48, 39, 130, 0.15) !important;
          transform: translateY(-2px);
        }

        /* --- โหมดจัดการ: ไฮไลต์สำหรับยกเลิกการงด (กรอบเขียว) --- */
        .elevated-restore {
          background-color: #FFFFFF !important;
          color: #302782 !important; 
          border: 1.5px solid #B2BB1E !important; 
          border-radius: 12px !important;
          z-index: 50 !important;
          pointer-events: auto !important;
          box-shadow: 0 4px 15px rgba(178, 187, 30, 0.2) !important;
          transform: translateY(-2px);
        }

        /* ซ่อนกรอบสีฟ้าพื้นฐานของ FullCalendar */
        .fc-h-event, .fc-v-event { 
          background: transparent !important; 
          border: none !important; 
        }
        
        /* เฟดข้อมูลที่ไม่เกี่ยวข้องลงเมื่ออยู่ในโหมดจัดการ (ไม่มี Blur ให้รกตา) */
        ${isCancelMode ? `
          .fc-event:not(:has(.elevated-clean)):not(:has(.elevated-restore)) {
            opacity: 0.3;
            filter: grayscale(100%);
            pointer-events: none;
          }
        ` : ""}

        /* --- ปรับโฉม FullCalendar UI (ปุ่มและหัวข้อ) --- */
        .fc .fc-toolbar-title { 
          font-size: 1.5rem !important; 
          font-weight: 700; 
          color: #302782; 
        }
        .fc .fc-button-primary { 
          background-color: #FFFFFF !important; 
          color: #6B7280 !important;
          border: 1px solid #E5E7EB !important; 
          border-radius: 12px !important; 
          font-size: 0.9rem !important; 
          font-weight: 600 !important;
          padding: 8px 20px !important; 
          transition: all 0.2s;
          text-transform: capitalize !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
        }
        .fc .fc-button-primary:hover {
          background-color: #F9FAFB !important;
          color: #302782 !important;
          border-color: #302782 !important;
        }
        .fc .fc-button-active {
          background-color: #302782 !important;
          color: #FFFFFF !important;
          border-color: #302782 !important;
        }
        .fc .fc-today-button { 
          background-color: #B2BB1E !important; 
          color: #FFFFFF !important; 
          border: none !important;
        }
        .fc .fc-today-button:disabled {
          opacity: 0.5;
        }
        
        /* ซอฟต์เส้นขอบตาราง */
        .fc-theme-standard td, .fc-theme-standard th { 
          border-color: #F3F4F6 !important; 
        }
        .fc-col-header-cell-cushion {
          color: #6B7280 !important;
          font-weight: 600 !important;
          padding: 12px 0 !important;
        }
        .fc-daygrid-day-number {
          color: #374151 !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          padding: 8px !important;
        }
        .fc-daygrid-event-dot { 
          display: none !important; 
        }
      `}</style>
    </div>
  );
};

export default CalendarView;