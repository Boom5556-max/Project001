import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCalendarData } from "../hooks/useCalendarData";
import { Check, X, Power } from "lucide-react";
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
  } = useCalendarData(id);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-black text-[#2D2D86]">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative">
      <Navbar />

      <div className="p-4 flex-grow flex flex-col overflow-hidden">
        {/* --- Header: จัดวางขนานกัน + เพิ่ม Legend จุดสี --- */}
        <div className="flex items-end gap-6 mb-5 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
          {/* 1. Selector */}
          <div className="w-80">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1">
              Classroom Selector
            </label>
            <RoomSelector
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelect={setSelectedRoom}
            />
          </div>


          {/* 3. ปุ่มงดใช้ห้อง (อยู่ขวาสุด) */}
          <button
            onClick={() => setIsCancelMode(!isCancelMode)}
            className={`flex items-center justify-center gap-2 px-6 h-[46px] rounded-2xl font-black text-xs uppercase transition-all duration-300 shadow-md active:scale-95 border-2 ${
              isCancelMode
                ? "bg-white text-red-500 border-red-500 ring-4 ring-red-50 shadow-red-200"
                : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
            }`}
          >
            {isCancelMode && <X size={16} strokeWidth={3} className="animate-in zoom-in" />}
            <span>งดใช้ห้อง</span>
          </button>
        </div>

        {/* --- ปฏิทิน --- */}
        <CalendarView
          events={events}
          isCancelMode={isCancelMode}
          onEventClick={(info) => {
            if (isCancelMode && info.event.extendedProps.isSchedule) {
              setShowConfirmCancel(info.event);
            } else {
              setSelectedEvent(info.event);
              setShowModal(true);
            }
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

      {/* Modal ยืนยันการงดใช้ห้อง */}
      {showConfirmCancel && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xs shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Power size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#2D2D86] mb-8 leading-tight">
              งดใช้ห้อง <br /> ในคาบนี้ใช่หรือไม่?
            </h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmCancel(null)} className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl hover:bg-gray-200 transition-all flex justify-center">
                <X size={35} strokeWidth={3} />
              </button>
              <button
                onClick={async () => {
                  const success = await handleCancelSchedule(showConfirmCancel.id);
                  if (success) {
                    setShowConfirmCancel(null);
                    setIsCancelMode(false);
                  }
                }}
                className="flex-1 py-5 bg-emerald-500 text-white rounded-3xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all flex justify-center"
              >
                <Check size={35} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;