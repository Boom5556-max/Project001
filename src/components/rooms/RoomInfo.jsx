import React from "react";
import { Users, FileText, MapPin } from "lucide-react";

// 1. ปรับโฉมแถวข้อมูลใหม่ให้ดูพรีเมียมและมีมิติ
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-6 p-5 rounded-[24px] bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300 group">
    {/* ส่วนของ Icon และ Label */}
    <div className="flex items-center gap-3 w-48 shrink-0">
      <div className="p-2.5 rounded-xl bg-[#FFFFFF] text-[#302782] shadow-sm border border-gray-100 group-hover:text-[#B2BB1E] transition-colors">
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <span className="text-base font-bold text-gray-400">
        {label}
      </span>
    </div>

    {/* ส่วนของข้อมูล (Value) ขยายให้ใหญ่และเด่นชัด */}
    <div className="flex-grow">
      <span className="text-lg font-bold text-[#302782] leading-snug">
        {value || "ไม่ระบุข้อมูล"}
      </span>
    </div>
  </div>
);

const RoomInfo = ({ room }) => (
  <div className="w-full space-y-4 px-1 mb-12 font-sans">
    <InfoRow 
      label="ความจุห้องเรียน" 
      value={`${room.capacity} ที่นั่ง`} 
      icon={Users} 
    />
    <InfoRow 
      label="ลักษณะการใช้งาน" 
      value={room.description || room.room_characteristics} 
      icon={FileText} 
    />
    <InfoRow 
      label="สถานที่ตั้ง" 
      value={room.location} 
      icon={MapPin} 
    />
  </div>
);

export default RoomInfo;