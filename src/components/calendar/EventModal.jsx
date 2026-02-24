import React from "react";
import { X, Info, User, Clock, MapPin } from "lucide-react"; // เพิ่ม MapPin ให้สวยขึ้น

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const title = event.title || event._def?.title || "ไม่มีหัวข้อ";
  const props = event.extendedProps || event._def?.extendedProps || {};

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] w-full max-w-sm rounded-[32px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-5 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-xl text-[#302782] flex items-center gap-3">
            <Info size={24} className="text-[#B2BB1E]" />
            รายละเอียด
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">
              วิชา / วัตถุประสงค์
            </p>
            <p className="text-[#302782] font-bold text-xl leading-snug">
              {title}
            </p>
          </div>

          <div className="space-y-6">
            {/* 🚩 แสดงเลขห้อง/ชื่อห้อง (เพิ่มใหม่ให้ตรงกับ formatCalendarEvents) */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-2xl text-[#B2BB1E] border border-gray-100 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="pt-1">
                <p className="text-xs font-bold text-gray-500 mb-0.5">ห้องเรียน</p>
                <p className="text-sm font-bold text-[#302782]">
                  {props.room_id || "ไม่ระบุเลขห้อง"} 
                </p>
              </div>
            </div>

            {/* อาจารย์ */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-2xl text-[#302782] border border-gray-100 shrink-0">
                <User size={20} />
              </div>
              <div className="pt-1">
                <p className="text-xs font-bold text-gray-500 mb-0.5">ผู้สอน / ผู้จอง</p>
                <p className="text-sm font-bold text-[#302782]">
                  {props.teacher || "ไม่ระบุอาจารย์"}
                </p>
              </div>
            </div>

            {/* วันที่และเวลา */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-3 rounded-2xl text-[#302782] border border-gray-100 shrink-0">
                <Clock size={20} />
              </div>
              <div className="pt-1">
                <p className="text-xs font-bold text-gray-500 mb-0.5">วันและเวลา</p>
                <p className="text-sm font-bold text-[#302782]">
                  {props.fullDate || "ไม่ระบุวันที่"}
                </p>
                <p className="text-sm font-bold text-[#B2BB1E] mt-1">
                  {props.startTime || "--:--"} - {props.endTime || "--:--"} น.
                </p>
              </div>
            </div>

            {/* สถานะงดใช้ห้อง */}
            {props.temporarily_closed && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-[20px]">
                <p className="text-red-500 text-sm font-bold text-center flex items-center justify-center gap-2">
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