import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Home,
  Calendar as CalendarIcon,
  Bell,
  QrCode,
  ChevronDown,
  Loader2,
  X,
  User,
  Clock,
  Info,
  LogOut
} from "lucide-react"; // เพิ่ม Icon ใหม่
import { useNavigate, useParams } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const { id: roomIdFromUrl } = useParams();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 1. เพิ่ม State สำหรับ Popup
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ดึงรายชื่อห้อง
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "https://dave-unincited-ariyah.ngrok-free.dev/rooms/",
          { headers: { "ngrok-skip-browser-warning": "true" } },
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setRooms(data);
          // ถ้ามี id ใน URL ให้เลือกห้องนั้น ถ้าไม่มีให้เลือกห้องแรก
          setSelectedRoom(roomIdFromUrl || data[0].room_id);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, [roomIdFromUrl]);

  // 2. ดึงข้อมูลการจอง + ตารางสอน (จะรันใหม่ทุกครั้งที่เปลี่ยน selectedRoom)
  useEffect(() => {
    const fetchAllCalendarData = async () => {
      const token = localStorage.getItem("token");
      if (!selectedRoom || !token) return;

      const headers = {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [bookingsRes, schedulesRes] = await Promise.all([
          fetch(
            `https://dave-unincited-ariyah.ngrok-free.dev/bookings/allBooking/${selectedRoom}?status=approved`,
            { headers },
          ),
          fetch(
            `https://dave-unincited-ariyah.ngrok-free.dev/schedule/${selectedRoom}`,
            { headers },
          ),
        ]);

        let bookingEvents = [];
        let scheduleEvents = [];

        // 1. จัดการข้อมูลการจอง (Bookings)
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          bookingEvents = (Array.isArray(bookings) ? bookings : []).map(
            (b) => ({
              id: `booking-${b.booking_id}`,
              title: `[จอง] ${b.purpose || "ไม่มีหัวข้อ"}`,
              start: `${b.date?.split("T")[0]}T${b.start_time}`,
              end: `${b.date?.split("T")[0]}T${b.end_time}`,
              extendedProps: {
                teacher:
                  `${b.teacher_name || ""} ${b.teacher_surname || ""}`.trim() ||
                  "ไม่ระบุ",
                startTime: b.start_time?.substring(0, 5),
                endTime: b.end_time?.substring(0, 5),
                fullDate: b.date
                  ? new Date(b.date).toLocaleDateString("th-TH", {
                      dateStyle: "long",
                    })
                  : "",
                type: "booking",
              },
              backgroundColor: "#2D2D86",
              borderColor: "#B4C424",
            }),
          );
        }

        // 2. จัดการข้อมูลตารางสอน (Schedules) - แก้จุดนี้เยอะหน่อยตาม JSON นาย
        if (schedulesRes.ok) {
          const responseData = await schedulesRes.json();
          // 🚩 ดึงจาก responseData.schedules เพราะ JSON ของนายซ้อนอยู่ชั้นหนึ่ง
          const schedulesArray = responseData.schedules || [];

          scheduleEvents = schedulesArray.map((s) => {
            // 🚩 แก้เรื่องวันเลื่อน: ตัดเอาแค่ YYYY-MM-DD ไม่เอาเวลาที่ติดมากับ ISO
            const dateOnly = s.date?.substring(0, 10);

            return {
              id: `schedule-${s.schedule_id}`,
              title: `[เรียน] ${s.subject_name}`,
              // 🚩 ประกอบร่าง: วันที่จริง + เวลาเรียน
              start: `${dateOnly}T${s.start_time}`,
              end: `${dateOnly}T${s.end_time}`,
              extendedProps: {
                teacher: s.teacher_name || "ไม่ระบุอาจารย์",
                startTime: s.start_time?.substring(0, 5),
                endTime: s.end_time?.substring(0, 5),
                // ใช้ dateOnly ตรงๆ เพื่อให้ชื่อวันที่ในไทยไม่เลื่อน
                fullDate: dateOnly
                  ? new Date(dateOnly).toLocaleDateString("th-TH", {
                      dateStyle: "long",
                    })
                  : "",
                type: "schedule",
              },
              backgroundColor: "#1e3a8a",
              borderColor: "#60a5fa",
              textColor: "#ffffff",
            };
          });
        }

        setEvents([...bookingEvents, ...scheduleEvents]);
      } catch (error) {
        console.error("❌ Error fetching calendar data:", error);
      }
    };

    fetchAllCalendarData();
  }, [selectedRoom]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch("https://dave-unincited-ariyah.ngrok-free.dev/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      // ใช้ window.location.replace เพื่อเคลียร์ประวัติการเข้าชม ไม่ให้กด Back กลับมาได้
      window.location.replace("/");
    }
  };

  // 🌟 2. ฟังก์ชันเมื่อคลิกที่รายการจอง
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowModal(true);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-[#2D2D86]">
        <Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
      </div>
    );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans relative">
      {/* Top Navigation */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <h1 className="text-white text-xl font-bold leading-none">
            SCI <span className="text-[#B4C424]">KU</span>
          </h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        <div className="flex gap-6 text-white/80">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:text-[#B4C424]"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="text-[#B4C424]"
          >
            <CalendarIcon size={24} />
          </button>
          <button
            onClick={() => navigate("/notification")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Bell size={24} />
          </button>
          <button
            onClick={() => navigate("/scanner")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <QrCode size={24} />
          </button>
          <button
            onClick={handleLogout}
            className="hover:text-red-500 transition-colors ml-2 p-1 border-l border-white/20 pl-4"
            title="ออกจากระบบ"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col overflow-hidden bg-white">
        <div className="mb-3 flex flex-col flex-none">
          <label className="text-[10px] font-bold text-[#2D2D86] uppercase mb-1 ml-1 opacity-60">
            เลือกห้องเรียน
          </label>
          <div className="relative w-full max-w-sm">
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl block p-3 appearance-none cursor-pointer focus:ring-2 focus:ring-[#B4C424] outline-none shadow-sm"
            >
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_name} ({room.room_id})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#2D2D86]">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-3 shadow-inner overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick} // 🌟 3. เชื่อมต่อฟังก์ชันคลิก
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            locale="th"
            height="100%"
            buttonText={{ today: "วันนี้", month: "เดือน", week: "สัปดาห์" }}
          />
        </div>
      </div>

      {/* 🌟 4. Popup รายละเอียดการจอง */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header Popup */}
            <div className="bg-[#2D2D86] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Info size={18} className="text-[#B4C424]" /> รายละเอียด
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="hover:bg-white/20 p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-gray-700">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  วิชา / วัตถุประสงค์
                </p>
                <p className="text-[#2D2D86] font-bold text-lg leading-tight mt-1">
                  {selectedEvent.title}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <User size={18} className="text-[#B4C424]" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    ผู้ขอใช้งาน
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedEvent.extendedProps.teacher}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#B4C424]" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    วันและเวลา
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedEvent.extendedProps.fullDate} <br />
                    <span className="text-[#2D2D86]">
                      {selectedEvent.extendedProps.startTime} -{" "}
                      {selectedEvent.extendedProps.endTime} น.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#2D2D86] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#B4C424] hover:text-[#2D2D86] transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 800; color: #2D2D86; }
        .fc .fc-button-primary { background-color: #2D2D86 !important; border: none !important; border-radius: 8px !important; font-weight: bold !important; font-size: 0.75rem !important; transition: all 0.2s; }
        .fc .fc-today-button { background-color: #B4C424 !important; color: #2D2D86 !important; opacity: 1 !important; }
        .fc .fc-button-primary:hover { background-color: #B4C424 !important; color: #2D2D86 !important; transform: translateY(-1px); }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6 !important; }
        .fc-day-today { background: rgba(180, 196, 36, 0.05) !important; }
        .fc-daygrid-day-number { font-weight: bold; color: #2D2D86; padding: 4px !important; }
        .fc-event { cursor: pointer !important; transition: opacity 0.2s; }
        .fc-event:hover { opacity: 0.8; }
      `,
        }}
      />
    </div>
  );
};

export default Calendar;
