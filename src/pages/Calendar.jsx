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

  // 1. ดึงข้อมูล User จาก LocalStorage
  const userData = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        console.log("Raw User Data from Storage:", parsed);
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
      <div className="h-screen flex flex-col items-center justify-center font-sans bg-[#F9FAFB]">
        <div className="w-16 h-16 border-[5px] border-[#302782]/20 border-t-[#302782] rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold text-[#302782]">กำลังโหลดข้อมูลตาราง...</p>
        <p className="text-base font-medium text-gray-500 mt-2">กรุณารอสักครู่</p>
      </div>
    );
  }

  // ฟังก์ชันเช็คสิทธิ์ก่อนแสดง Modal
  const checkPermission = (event) => {
    const props = event.extendedProps;
    const isSchedule = props?.isSchedule;

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

    if (currentUserRole === "staff") {
      console.log("Permission: Granted as Staff");
      return true;
    }

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
    <div className="h-screen bg-[#F8F9FA] flex flex-col overflow-hidden relative font-sans">
      <Navbar />

      <div className="p-4 md:p-8 flex-grow flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Top Controls Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 bg-[#FFFFFF] p-6 rounded-[24px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex-shrink-0">
          <div className="w-full max-w-sm">
            <RoomSelector
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </div>

          {/* ปุ่มเปิดโหมดจัดการ - ปรับขนาดกลับให้เท่าเดิม h-[46px] */}
          {selectedRoom && (
            <button
              onClick={() => setIsCancelMode(!isCancelMode)}
              className={`flex items-center justify-center gap-2 px-6 h-[46px] rounded-2xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                isCancelMode
                  ? "bg-[#B2BB1E] text-[#FFFFFF] shadow-[0_8px_20px_-8px_rgba(178,187,30,0.5)]"
                  : "bg-[#FFFFFF] text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
              }`}
            >
              {isCancelMode ? (
                <X size={18} strokeWidth={2.5} />
              ) : (
                <Settings2 size={18} strokeWidth={2.5} />
              )}

              <span>
                {isCancelMode
                  ? "เสร็จสิ้นการแก้ไข"
                  : "จัดการสถานะการใช้ห้อง"}
              </span>
            </button>
          )}
        </div>

        {/* Calendar Main View */}
        <div className="flex-grow bg-[#FFFFFF] rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100 flex flex-col min-h-[500px]">
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
      </div>

      {/* --- Sub Components (Modals) --- */}
      <EventModal
        event={selectedEvent}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
      />

      {showConfirmCancel && (
        <ActionModal
          icon={<Power size={40} strokeWidth={2.5} />}
          title="ยืนยันการงดใช้ห้อง"
          onClose={() => setShowConfirmCancel(null)}
          onConfirm={async () => {
            const res = await handleCancelSchedule(showConfirmCancel.id);
            if (res.success) setShowConfirmCancel(null);
            else if (res.isForbidden) alert("คุณไม่มีสิทธิ์ (403)");
          }}
        />
      )}

      {showConfirmRestore && (
        <ActionModal
          icon={<RotateCcw size={40} strokeWidth={2.5} />}
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] rounded-[32px] p-10 w-full max-w-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] text-center border border-white">
            <div className="w-24 h-24 bg-gray-50 text-[#302782] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={44} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-bold text-[#302782] mb-4">
              {alertConfig.title}
            </h3>
            <p className="text-gray-500 text-base mb-10 leading-relaxed font-medium">
              {alertConfig.msg}
            </p>
            <button
              onClick={() => setAlertConfig({ ...alertConfig, show: false })}
              className="w-full py-5 bg-[#302782] text-[#FFFFFF] rounded-[20px] font-bold text-xl hover:bg-opacity-90 transition-colors shadow-[0_8px_20px_-8px_rgba(48,39,130,0.4)]"
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
const ActionModal = ({ icon, title, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-6">
    <div className="bg-[#FFFFFF] rounded-[32px] p-10 w-full max-w-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] text-center border border-white">
      <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#302782]">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-[#302782] mb-10 leading-tight">
        {title}
      </h3>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-[20px] hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <X size={32} strokeWidth={2.5} />
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-5 bg-[#B2BB1E] text-[#FFFFFF] rounded-[20px] shadow-[0_8px_20px_-8px_rgba(178,187,30,0.5)] hover:bg-opacity-90 transition-colors flex items-center justify-center"
        >
          <Check size={32} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </div>
);

export default Calendar;