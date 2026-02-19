import React from "react";
import {
  Loader2,
  AlertCircle,
  User,
  Clock,
  Users,
  FileText,
} from "lucide-react";

// 1. หน้า Loading (Bold & Italic Style)
export const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#2D2D86]">
    <Loader2 className="animate-spin text-[#B4C424] mb-4" size={50} />
    <p className="text-white font-black italic tracking-[0.2em] animate-pulse uppercase text-sm">
      Syncing Data...
    </p>
  </div>
);

// 2. หน้า Error (Bold & Italic Style)
export const ErrorState = ({ message, onBack }) => (
  <div className="h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
    <AlertCircle size={64} className="text-red-500 mb-4" />
    <h2 className="text-3xl font-black text-[#2D2D86] uppercase italic tracking-tighter">
      Error Occurred
    </h2>
    <p className="text-gray-400 mt-2 mb-8 font-bold italic">{message}</p>
    <button
      onClick={onBack}
      className="w-full max-w-xs bg-[#2D2D86] text-[#B4C424] p-4 rounded-2xl font-black uppercase tracking-widest italic shadow-xl active:scale-95 transition-transform"
    >
      Back to Scanner
    </button>
  </div>
);

// 🚩 ส่วนที่ 1: Current Session (โชว์คนปัจจุบัน)
export const CurrentBookingCard = ({ item, isAvailable, capacity }) => (
  <div
    className={`rounded-[40px] p-8 border-2 transition-all shadow-sm ${
      !isAvailable
        ? "bg-red-50 border-red-100 shadow-red-100"
        : "bg-emerald-50 border-emerald-100 shadow-emerald-100"
    }`}
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400 italic">
        Live Status
      </h3>
      <div
        className={`px-5 py-2 rounded-2xl text-white text-sm font-black italic transition-all shadow-md ${
          !isAvailable
            ? "bg-[#EF4444] -rotate-2 animate-pulse"
            : "bg-[#B4C424] rotate-2"
        }`}
      >
        {!isAvailable ? "BUSY NOW" : "AVAILABLE"}
      </div>
    </div>

    {!isAvailable && item ? (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#2D2D86]">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
              Current Time Slot
            </p>
            <p className="text-xl font-black text-[#2D2D86] italic">
              {item.start_time} - {item.end_time}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 p-4 rounded-[25px] border border-white">
            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
              Host Teacher
            </p>
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#B4C424]" />
              <p className="text-sm font-black text-[#2D2D86] truncate">
                {item.full_name}
              </p>
            </div>
          </div>
          <div className="bg-white/80 p-4 rounded-[25px] border border-white">
            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
              Students
            </p>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#B4C424]" />
              {/* ตกแต่งตัวเลขให้ หนา+เอียง */}
              <p className="text-sm font-black text-[#2D2D86] italic">
                {item.student_count || capacity || 0} People
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#2D2D86] p-5 rounded-[30px] text-white">
          <p className="text-[9px] font-black text-white/50 uppercase mb-2 tracking-widest flex items-center gap-2">
            <FileText size={12} /> Purpose
          </p>
          <p className="text-sm font-bold italic leading-snug">
            "{item.purpose || "No specific reason"}"
          </p>
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-[#B4C424] text-3xl font-black italic mb-1 uppercase tracking-tighter">
          Ready for use
        </p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] leading-none">
          Max Capacity: {capacity || "-"} Students
        </p>
      </div>
    )}
  </div>
);

// 🚩 รายการตารางเวลาส่วนที่ 2: Timeline (ตกแต่งแบบ Bold & Italic)
export const ScheduleItem = ({ item, capacity }) => (
  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[30px] border border-gray-100 transition-all hover:bg-white hover:shadow-lg group">
    {/* ฝั่งเวลา (หนา+เอียง) */}
    <div className="flex flex-col items-center min-w-[85px] border-r-2 border-[#B4C424]/30 pr-4">
      <span className="text-[13px] font-black text-[#2D2D86] italic tracking-tighter">
        {item.start_time}
      </span>
      <div className="h-4 w-[2px] bg-[#B4C424] my-1 opacity-40"></div>
      <span className="text-[11px] font-black text-gray-400 italic tracking-tighter">
        {item.end_time}
      </span>
    </div>

    {/* ฝั่งรายละเอียด */}
    <div className="flex-grow overflow-hidden text-left">
      <p className="text-sm font-black text-[#2D2D86] truncate italic uppercase tracking-tighter mb-1">
        {item.purpose || "SESSION"}
      </p>
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
          <User size={12} className="text-[#B4C424]" />
          {/* 🚩 แก้ไขการแสดงผลชื่อ-นามสกุลตรงนี้ */}
          <span className="truncate max-w-[150px]">
            {item.full_name ||
              item.name ||
              `${item.first_name || "Unknown"} ${item.last_name || ""}`}
          </span>
        </span>
        {/* 🚩 ใช้ตัวแปร capacity ตัวเดียวกับข้างบนมาโชว์ที่นี่ */}
        <span className="flex items-center gap-1.5 text-[10px] font-black text-[#2D2D86] uppercase italic">
          <Users size={12} className="text-[#B4C424]" />
          {capacity || 0} People
        </span>
      </div>
    </div>
  </div>
);
