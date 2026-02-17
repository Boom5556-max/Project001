import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCalendarData } from "../hooks/useCalendarData";
import {
  Check,
  X,
  Power,
  RotateCcw,
  AlertCircle,
  Settings2,
} from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";
import RoomSelector from "../components/calendar/RoomSelector";
import CalendarView from "../components/calendar/CalendarView";
import EventModal from "../components/calendar/EventModal";

const Calendar = () => {
  const { id } = useParams();
  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    events,
    isLoading,
    isCancelMode,
    setIsCancelMode,
    handleCancelSchedule,
    handleRestoreSchedule,
  } = useCalendarData(id);

  // 1. ดึงข้อมูล User จาก LocalStorage (ยึดตามที่ Backend ต้องการ: user_id และ role)
  const userData = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log("Raw User Data from Storage:", parsed); // เช็คว่า role มาจริงไหม
        return {
          id: parsed?.user_id || parsed?.id,
          role: String(parsed?.role || "")
            .toLowerCase()
            .trim(),
        };
      }
    } catch (err) {
      console.error("User Parse Error", err);
    }
    return { id: null, role: "student" };
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);
  const [showConfirmRestore, setShowConfirmRestore] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    show: false,
    title: "",
    msg: "",
  });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-kanit font-black text-[#2D2D86] bg-white">
        <div className="w-12 h-12 border-4 border-[#2D2D86] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // ฟังก์ชันเช็คสิทธิ์ก่อนแสดง Modal (ยึดตาม Logic Backend)
  const checkPermission = (event) => {
    const props = event.extendedProps;
    const isSchedule = props?.isSchedule;

    // แปลงทั้งคู่เป็น String เพื่อป้องกันเรื่อง Data Type (ตัวเลข vs ตัวอักษร)
    const eventTeacherId = String(props?.teacher_id || "");
    const currentUserId = String(userData.id || "");
    const currentUserRole = String(userData.role || "")
      .toLowerCase()
      .trim();

    if (!isSchedule) {
      setAlertConfig({
        show: true,
        title: "ดำเนินการไม่ได้",
        msg: "จัดการได้เฉพาะ 'ตารางเรียนหลัก' เท่านั้น",
      });
      return false;
    }

    // เช็คสิทธิ์: ถ้าเป็น staff ให้ True ทันที
    if (currentUserRole === "staff") {
      console.log("Permission: Granted as Staff");
      return true;
    }

    // ถ้าไม่ใช่ staff ต้องเป็นเจ้าของวิชา
    if (eventTeacherId === currentUserId) {
      console.log("Permission: Granted as Owner");
      return true;
    }

    setAlertConfig({
      show: true,
      title: "ไม่มีสิทธิ์",
      msg: "เฉพาะเจ้าหน้าที่หรืออาจารย์เจ้าของวิชาเท่านั้นที่จัดการได้",
    });
    return false;
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative font-kanit">
      <Navbar />

      <div className="p-4 flex-grow flex flex-col overflow-hidden">
        <div className="flex items-end gap-6 mb-5 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
          <div className="w-80">
            <RoomSelector
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </div>

          {/* ปุ่มเปิดโหมดจัดการ (จะแสดงเมื่อเลือกห้องแล้ว) */}
          {selectedRoom && (
            <button
              onClick={() => setIsCancelMode(!isCancelMode)}
              className={`flex items-center justify-center gap-2 px-6 h-[46px] rounded-2xl font-black text-xs transition-all duration-300 shadow-md active:scale-95 border-2 ${
                isCancelMode
                  ? "bg-amber-500 text-white border-amber-500 ring-4 ring-amber-50 shadow-amber-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-[#2D2D86] hover:text-[#2D2D86]"
              }`}
            >
              {/* เปลี่ยนจาก Power เป็น Settings2 หรือ CalendarDays */}
              {isCancelMode ? (
                <X size={16} strokeWidth={3} />
              ) : (
                <Settings2 size={16} strokeWidth={3} />
              )}

              <span>
                {isCancelMode
                  ? "เสร็จสิ้นการแก้ไข"
                  : "งดใช้ห้อง/ยกเลิกการงดใช้ห้อง"}
              </span>
            </button>
          )}
        </div>

        <CalendarView
          events={events}
          isCancelMode={isCancelMode}
          currentUserId={userData.id}
          currentUserRole={userData.role}
          onEventClick={(info) => {
            if (isCancelMode) {
              if (checkPermission(info.event)) {
                const isClosed = info.event.extendedProps.temporarily_closed;
                if (isClosed) setShowConfirmRestore(info.event);
                else setShowConfirmCancel(info.event);
              }
              return;
            }
            setSelectedEvent(info.event);
            setShowModal(true);
          }}
        />
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
      />

      {/* --- Modal ยืนยัน (ส่ง ID ไปที่ Backend ผ่าน handle) --- */}
      {showConfirmCancel && (
        <ActionModal
          icon={<Power size={40} />}
          color="red"
          title="ยืนยันการงดใช้ห้อง"
          onClose={() => setShowConfirmCancel(null)}
          onConfirm={async () => {
            const res = await handleCancelSchedule(showConfirmCancel.id); // ส่ง $2 (id) ไป
            if (res.success) setShowConfirmCancel(null);
            else if (res.isForbidden) alert("คุณไม่มีสิทธิ์ (403)");
          }}
        />
      )}

      {showConfirmRestore && (
        <ActionModal
          icon={<RotateCcw size={40} />}
          color="emerald"
          title="ยกเลิกการงดใช้ห้อง"
          onClose={() => setShowConfirmRestore(null)}
          onConfirm={async () => {
            const res = await handleRestoreSchedule(showConfirmRestore.id);
            if (res.success) setShowConfirmRestore(null);
          }}
        />
      )}

      {/* --- Alert Modal --- */}
      {alertConfig.show && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[35px] p-8 w-full max-w-sm shadow-2xl text-center border border-slate-50 transform animate-in zoom-in">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-black text-[#2D2D86] mb-2">
              {alertConfig.title}
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {alertConfig.msg}
            </p>
            <button
              onClick={() => setAlertConfig({ ...alertConfig, show: false })}
              className="w-full py-4 bg-[#2D2D86] text-white rounded-2xl font-black"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component สำหรับ Modal แจ้งเตือน
const ActionModal = ({ icon, color, title, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-in fade-in">
    <div className="bg-white rounded-[40px] p-10 w-full max-w-xs shadow-2xl text-center animate-in zoom-in duration-200">
      <div
        className={`w-20 h-20 bg-${color}-50 rounded-full flex items-center justify-center mx-auto mb-6 text-${color}-500`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black text-[#2D2D86] mb-8 leading-tight">
        {title}
      </h3>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl hover:bg-gray-200 transition-all"
        >
          <X size={35} strokeWidth={3} className="mx-auto" />
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 py-5 bg-${color}-500 text-white rounded-3xl shadow-lg shadow-${color}-200 hover:opacity-90 transition-all`}
        >
          <Check size={35} strokeWidth={3} className="mx-auto" />
        </button>
      </div>
    </div>
  </div>
);

export default Calendar;
