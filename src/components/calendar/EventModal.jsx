import React from "react";
import { X, Info, User, Clock } from "lucide-react";
import Button from "../common/Button.jsx";

const EventModal = ({ event, onClose }) => {
  // 🚩 ถ้าไม่มี event หรือไม่มีข้อมูลข้างใน ไม่ต้อง render
  if (!event) return null;

  // FullCalendar มักจะเก็บข้อมูลจริงไว้ใน .title หรือ ._def.title 
  // การเขียนแบบนี้จะช่วยป้องกัน Error ได้ดีกว่า
  const title = event.title || event._def?.title || "ไม่มีหัวข้อ";
  const props = event.extendedProps || event._def?.extendedProps || {};

  return (
    // 🚩 เพิ่ม onClick={onClose} ที่พื้นหลังสีดำด้วย เผื่อคนอยากกดข้างนอกเพื่อปิด
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} 
    >
      <div 
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200"
        // 🚩 สำคัญ: ใส่ e.stopPropagation() เพื่อไม่ให้คลิกที่ตัว Modal แล้วมันไปปิดตัวเอง
        onClick={(e) => e.stopPropagation()} 
      >
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

        <div className="p-6 space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">วิชา / วัตถุประสงค์</p>
          <p className="text-[#2D2D86] font-bold text-lg leading-tight">{title}</p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#B4C424]/20 p-2 rounded-lg text-[#B4C424]">
                <User size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-700">{props.teacher || "ไม่ระบุอาจารย์"}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#B4C424]/20 p-2 rounded-lg text-[#B4C424]">
                <Clock size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {props.fullDate || "ไม่ระบุวันที่"} <br/>
                <span className="text-xs text-gray-500">
                  ({props.startTime || "--:--"} - {props.endTime || "--:--"} น.)
                </span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventModal;