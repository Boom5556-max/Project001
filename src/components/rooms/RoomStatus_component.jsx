import React from "react";
import {
  Loader2,
  AlertCircle,
  User,
  Clock,
  Users,
  FileText,
  ChevronLeft
} from "lucide-react";
import Button from "../common/Button.jsx";

// 1. หน้า Loading (Professional & Clean)
export const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#F8F9FA] font-sans">
    <div className="w-16 h-16 border-[5px] border-[#302782]/10 border-t-[#302782] rounded-full animate-spin mb-6"></div>
    <p className="text-xl font-bold text-[#302782]">
      กำลังซิงค์ข้อมูล...
    </p>
  </div>
);

// 2. หน้า Error (Formal Style)
export const ErrorState = ({ message, onBack }) => (
  <div className="h-screen flex flex-col items-center justify-center p-10 bg-[#FFFFFF] text-center font-sans">
    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
      <AlertCircle size={48} />
    </div>
    <h2 className="text-3xl font-bold text-[#302782] mb-4">
      เกิดข้อผิดพลาด
    </h2>
    <p className="text-lg font-medium text-gray-400 mb-10 max-w-sm mx-auto">{message}</p>
    <Button
      onClick={onBack}
      variant="secondary"
      className="w-full max-w-xs py-5 rounded-[20px] text-lg font-bold"
    >
      กลับไปหน้าสแกน
    </Button>
  </div>
);

// 🚩 ส่วนที่ 1: Current Session (โชว์สถานะปัจจุบันแบบ High-End)
export const CurrentBookingCard = ({ item, isAvailable, capacity }) => (
  <div
    className={`rounded-[40px] p-10 border transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] ${
      !isAvailable
        ? "bg-[#FFFFFF] border-red-100"
        : "bg-[#FFFFFF] border-gray-100"
    }`}
  >
    <div className="flex justify-between items-center mb-10">
      <h3 className="font-bold text-xs text-gray-400">
        สถานะการใช้งานปัจจุบัน
      </h3>
      <div
        className={`px-6 py-2 rounded-full text-[#FFFFFF] text-sm font-bold transition-all ${
          !isAvailable
            ? "bg-red-500 shadow-lg shadow-red-200"
            : "bg-[#B2BB1E] shadow-lg shadow-[#B2BB1E]/20"
        }`}
      >
        {!isAvailable ? "ไม่ว่าง (กำลังใช้งาน)" : "ว่างพร้อมใช้งาน"}
      </div>
    </div>

    {!isAvailable && item ? (
      <div className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-[#302782] border border-gray-100">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">
              ช่วงเวลาที่จอง
            </p>
            <p className="text-2xl font-bold text-[#302782]">
              {item.start_time} - {item.end_time} น.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-gray-50/50 p-5 rounded-[28px] border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 mb-2">
              ผู้รับผิดชอบ
            </p>
            <div className="flex items-center gap-2">
              <User size={18} className="text-[#B2BB1E]" />
              <p className="text-base font-bold text-[#302782] truncate">
                {item.full_name}
              </p>
            </div>
          </div>
          <div className="bg-gray-50/50 p-5 rounded-[28px] border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 mb-2">
              จำนวนคน
            </p>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#B2BB1E]" />
              <p className="text-base font-bold text-[#302782]">
                {item.student_count || capacity || 0} คน
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#302782] p-6 rounded-[32px] text-[#FFFFFF] shadow-lg shadow-[#302782]/20">
          <p className="text-[11px] font-bold text-[#FFFFFF]/50 mb-2 flex items-center gap-2">
            <FileText size={14} /> วัตถุประสงค์การใช้งาน
          </p>
          <p className="text-base font-medium leading-relaxed">
            "{item.purpose || "ไม่ระบุวัตถุประสงค์"}"
          </p>
        </div>
      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-[#B2BB1E] text-4xl font-bold mb-3 tracking-tight">
          ห้องว่างพร้อมใช้งาน
        </p>
        <p className="text-sm font-bold text-gray-400">
          รองรับได้สูงสุด: {capacity || "-"} ที่นั่ง
        </p>
      </div>
    )}
  </div>
);

// 🚩 รายการตารางเวลาส่วนที่ 2: Timeline (สะอาดและเป็นมืออาชีพ)
export const ScheduleItem = ({ item, capacity }) => (
  <div className="flex items-center gap-6 p-6 bg-[#FFFFFF] rounded-[32px] border border-gray-100 transition-all hover:border-[#B2BB1E]/30 hover:shadow-xl group">
    {/* ฝั่งเวลา */}
    <div className="flex flex-col items-center min-w-[100px] border-r border-gray-100 pr-6">
      <span className="text-base font-bold text-[#302782]">
        {item.start_time}
      </span>
      <span className="text-sm font-bold text-gray-400 mt-1">
        {item.end_time}
      </span>
    </div>

    {/* ฝั่งรายละเอียด */}
    <div className="flex-grow overflow-hidden text-left">
      <p className="text-lg font-bold text-[#302782] truncate mb-2">
        {item.purpose || "รายการจอง"}
      </p>
      <div className="flex flex-wrap gap-4">
        <span className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <User size={16} className="text-[#B2BB1E]" />
          <span className="truncate max-w-[180px]">
            {item.full_name ||
              item.name ||
              `${item.first_name || "ไม่ระบุชื่อ"} ${item.last_name || ""}`}
          </span>
        </span>
        <span className="flex items-center gap-2 text-xs font-bold text-[#302782]">
          <Users size={16} className="text-[#B2BB1E]" />
          {capacity || 0} ที่นั่ง
        </span>
      </div>
    </div>
  </div>
);