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

// 🚩 ส่วนที่ 1: Current Session
export const CurrentBookingCard = ({ item, isAvailable, capacity }) => (
  <div
    className={`rounded-[40px] p-6 sm:p-10 border transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] ${
      !isAvailable
        ? "bg-[#FFFFFF] border-red-100"
        : "bg-[#FFFFFF] border-gray-100"
    }`}
  >
    <div className="flex justify-between items-center mb-8 sm:mb-10">
      <h3 className="font-bold text-xs text-gray-400">
        สถานะการใช้งานปัจจุบัน
      </h3>
      <div
        className={`px-4 sm:px-6 py-2 rounded-full text-[#FFFFFF] text-[11px] sm:text-sm font-bold transition-all ${
          !isAvailable
            ? "bg-red-500 shadow-lg shadow-red-200"
            : "bg-[#B2BB1E] shadow-lg shadow-[#B2BB1E]/20"
        }`}
      >
        {!isAvailable ? "ไม่ว่าง (กำลังใช้งาน)" : "ว่างพร้อมใช้งาน"}
      </div>
    </div>

    {!isAvailable && item ? (
      <div className="space-y-5 sm:space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-[20px] sm:rounded-[24px] flex items-center justify-center text-[#302782] border border-gray-100 flex-shrink-0">
            <Clock size={28} className="sm:w-[32px] sm:h-[32px]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">
              ช่วงเวลาที่จอง
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#302782]">
              {item.start_time} - {item.end_time} น.
            </p>
          </div>
        </div>

        {/* ✨ แก้ไขเลย์เอาต์ตรงนี้: เปลี่ยนจาก grid-cols-2 เป็น flex เพื่อแบ่งสัดส่วนพื้นที่ใหม่ */}
        <div className="flex gap-3 sm:gap-5">
          
          {/* กล่องชื่อ: ให้พื้นที่กว้างกว่า (flex-[2]) และบังคับบรรทัดเดียว */}
          <div className="flex-[2] min-w-0 bg-gray-50/50 p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] border border-gray-100">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-2">
              ผู้รับผิดชอบ
            </p>
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#B2BB1E] flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <p className="text-sm sm:text-base font-bold text-[#302782] whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {item.full_name}
              </p>
            </div>
          </div>

          {/* กล่องจำนวนคน: ให้พื้นที่แคบกว่า (flex-[1]) */}
          <div className="flex-[1] min-w-0 bg-gray-50/50 p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] border border-gray-100">
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mb-2">
              จำนวนคน
            </p>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#B2BB1E] flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
              <p className="text-sm sm:text-base font-bold text-[#302782] whitespace-nowrap">
                {item.student_count || capacity || 0} คน
              </p>
            </div>
          </div>

        </div>

        <div className="bg-[#302782] p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] text-[#FFFFFF] shadow-lg shadow-[#302782]/20">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#FFFFFF]/50 mb-2 flex items-center gap-2">
            <FileText size={14} /> วัตถุประสงค์การใช้งาน
          </p>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
            "{item.purpose || "ไม่ระบุวัตถุประสงค์"}"
          </p>
        </div>
      </div>
    ) : (
      <div className="text-center py-10">
        <p className="text-[#B2BB1E] text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
          ห้องว่างพร้อมใช้งาน
        </p>
        <p className="text-xs sm:text-sm font-bold text-gray-400">
          รองรับได้สูงสุด: {capacity || "-"} ที่นั่ง
        </p>
      </div>
    )}
  </div>
);

// 🚩 รายการตารางเวลาส่วนที่ 2: Timeline
export const ScheduleItem = ({ item, capacity }) => (
  <div className="flex items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-[#FFFFFF] rounded-[28px] sm:rounded-[32px] border border-gray-100 transition-all hover:border-[#B2BB1E]/30 hover:shadow-xl group">
    {/* ฝั่งเวลา */}
    <div className="flex flex-col items-center min-w-[80px] sm:min-w-[100px] border-r border-gray-100 pr-4 sm:pr-6">
      <span className="text-sm sm:text-base font-bold text-[#302782]">
        {item.start_time}
      </span>
      <span className="text-xs sm:text-sm font-bold text-gray-400 mt-1">
        {item.end_time}
      </span>
    </div>

    {/* ฝั่งรายละเอียด */}
    <div className="flex-grow overflow-hidden text-left">
      <p className="text-base sm:text-lg font-bold text-[#302782] break-words mb-2">
        {item.purpose || "รายการจอง"}
      </p>
      {/* ✨ แกไขตรงนี้ให้รองรับการแสดงชื่อยาวๆ บรรทัดเดียว */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <span className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gray-400 min-w-0">
          <User size={14} className="text-[#B2BB1E] flex-shrink-0 sm:w-[16px] sm:h-[16px]" />
          <span className="whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {item.full_name || item.name || `${item.first_name || "ไม่ระบุชื่อ"} ${item.last_name || ""}`}
          </span>
        </span>
        <span className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#302782] whitespace-nowrap">
          <Users size={14} className="text-[#B2BB1E] flex-shrink-0 sm:w-[16px] sm:h-[16px]" />
          {capacity || 0} ที่นั่ง
        </span>
      </div>
    </div>
  </div>
);