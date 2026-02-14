import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCalendarData } from "../hooks/useCalendarData";
import { Check, X, Power, RotateCcw, AlertCircle } from "lucide-react";
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

  const user = JSON.parse(localStorage.getItem("user"));
  const currentUserId = user?.user_id;

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
      <div className="h-screen flex items-center justify-center font-black text-[#2D2D86] animate-pulse">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  // 🚩 ตรวจสอบว่าเลือกห้องอยู่หรือไม่ (ถ้าไม่เลือกคือโหมด "All")
  const isRoomSelected = selectedRoom && selectedRoom !== "";

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative font-kanit">
      <Navbar />

      <div className="p-4 flex-grow flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="flex items-end gap-6 mb-5 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
          <div className="w-80">
            {/* 🚩 RoomSelector ต้องส่ง value="" ไปที่ backend ได้ */}
            <RoomSelector
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </div>

          {isRoomSelected && (
            <button
              onClick={() => setIsCancelMode(!isCancelMode)}
              className={`flex items-center justify-center gap-2 px-6 h-[46px] rounded-2xl font-black text-xs uppercase transition-all duration-300 shadow-md active:scale-95 border-2 animate-in fade-in slide-in-from-left-3 ${
                isCancelMode
                  ? "bg-white text-red-500 border-red-500 ring-4 ring-red-50 shadow-red-200"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
              }`}
            >
              {isCancelMode && (
                <X size={16} strokeWidth={3} className="animate-in zoom-in" />
              )}
              <span>งดใช้ห้อง/ยกเลิกการงดใช้ห้อง</span>
            </button>
          )}
        </div>

        {/* ปฏิทิน */}
        <CalendarView
          events={events}
          isCancelMode={isCancelMode}
          currentUserId={currentUserId}
          onEventClick={(info) => {
            const props = info.event.extendedProps;
            const isClosed = props.temporarily_closed;
            const isSchedule = props.isSchedule;
            const isOwner = props.teacher_id == currentUserId;

            if (isCancelMode && isSchedule) {
              if (!isOwner) {
                setAlertConfig({
                  show: true,
                  title: "เข้าถึงไม่ได้!",
                  msg: "เฉพาะอาจารย์เจ้าของวิชาเท่านั้นที่สามารถงดการใช้ห้องได้",
                });
                return;
              }

              if (isClosed) {
                setShowConfirmRestore(info.event);
              } else {
                setShowConfirmCancel(info.event);
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

      {/* --- 🔴 Modal ยืนยันการงดใช้ห้อง --- */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-in fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xs shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Power size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#2D2D86] mb-8 leading-tight">
              งดใช้ห้อง <br /> ใช่หรือไม่?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmCancel(null)}
                className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl hover:bg-gray-200 flex justify-center"
              >
                <X size={35} strokeWidth={3} />
              </button>
              <button
                onClick={async () => {
                  const res = await handleCancelSchedule(showConfirmCancel.id);
                  if (res.success) {
                    setShowConfirmCancel(null);
                    setIsCancelMode(false);
                  } else if (res.isForbidden) {
                    setShowConfirmCancel(null);
                    setAlertConfig({
                      show: true,
                      title: "ไม่มีสิทธิ์",
                      msg: "คุณไม่มีสิทธิ์จัดการวิชานี้",
                    });
                  }
                }}
                className="flex-1 py-5 bg-red-500 text-white rounded-3xl shadow-lg shadow-red-200 hover:bg-red-600 flex justify-center"
              >
                <Check size={35} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🟢 Modal ยกเลิกการงด (Restore) --- */}
      {showConfirmRestore && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-in fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xs shadow-2xl text-center animate-in zoom-in duration-200 border-4 border-emerald-50">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <RotateCcw size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#2D2D86] mb-8 leading-tight">
              ยกเลิกงดใช้ห้อง <br /> ใช่หรือไม่?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmRestore(null)}
                className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl hover:bg-gray-200 flex justify-center"
              >
                <X size={35} strokeWidth={3} />
              </button>
              <button
                onClick={async () => {
                  const res = await handleRestoreSchedule(
                    showConfirmRestore.id,
                  );
                  if (res.success) {
                    setShowConfirmRestore(null);
                    setIsCancelMode(false);
                  } else if (res.isForbidden) {
                    setShowConfirmRestore(null);
                    setAlertConfig({
                      show: true,
                      title: "ไม่มีสิทธิ์",
                      msg: "คุณไม่มีสิทธิ์จัดการวิชานี้",
                    });
                  }
                }}
                className="flex-1 py-5 bg-emerald-500 text-white rounded-3xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 flex justify-center"
              >
                <Check size={35} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ⚠️ Tailwind Custom Alert --- */}
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
              className="w-full py-4 bg-[#2D2D86] text-white rounded-2xl font-black hover:bg-opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-100"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
