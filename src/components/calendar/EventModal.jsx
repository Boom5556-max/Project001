import React from "react";
import { X, Info, User, Clock } from "lucide-react";

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  // 🔍 ตรวจสอบโครงสร้างข้อมูล (FullCalendar บางเวอร์ชันเก็บข้อมูลต่างกัน)
  // พยายามดึงจาก extendedProps ของ FullCalendar หรือดึงจาก Object ปกติ
  const title = event.title || event._def?.title || "ไม่มีหัวข้อ";
  
  // 🚩 จุดสำคัญ: ดึง props มาจากที่ๆ มันควรจะอยู่
  const props = event.extendedProps || event._def?.extendedProps || {};

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2D2D86] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Info size={18} className="text-[#B4C424]" />
            รายละเอียด
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              วิชา / วัตถุประสงค์
            </p>
            <p className="text-[#2D2D86] font-bold text-lg leading-tight">
              {title}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* อาจารย์ */}
            <div className="flex items-start gap-3">
              <div className="bg-[#B4C424]/20 p-2 rounded-lg text-[#B4C424] shrink-0">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">ผู้สอน / ผู้จอง</p>
                <p className="text-sm font-semibold text-gray-700">
                  {props.teacher || "ไม่ระบุอาจารย์"}
                </p>
              </div>
            </div>

            {/* วันที่และเวลา */}
            <div className="flex items-start gap-3">
              <div className="bg-[#B4C424]/20 p-2 rounded-lg text-[#B4C424] shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">วันและเวลา</p>
                <p className="text-sm font-semibold text-gray-700">
                  {/* 🚩 แสดงผลวันที่ไทยที่ format มาจาก helper */}
                  {props.fullDate || "ไม่ระบุวันที่"}
                </p>
                <p className="text-xs font-bold text-[#B4C424] mt-0.5">
                  {props.startTime || "--:--"} - {props.endTime || "--:--"} น.
                </p>
              </div>
            </div>
            
            {/* 🚩 แสดงสถานะ "งดใช้ห้อง" เพิ่มเติมถ้ามี */}
            {props.temporarily_closed && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-500 text-xs font-black text-center">
                  ⚠️ คาบเรียนนี้ถูกงดใช้ห้อง
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;