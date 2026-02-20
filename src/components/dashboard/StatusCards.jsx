import React from "react";

const StatusCard = ({ label, value }) => (
  <div className="bg-[#FFFFFF] rounded-[32px] p-8 flex flex-col items-center justify-center border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden group">
    {/* Accent Element: แถบสีเขียวเล็กๆ ด้านบนเพื่อบ่งบอกเอกลักษณ์ */}
    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#B2BB1E] opacity-20 group-hover:opacity-100 transition-opacity" />
    
    <p className="text-gray-400 font-bold text-xs mb-2 text-center">
      {label}
    </p>
    <span className="text-[#302782] text-5xl font-bold leading-none">
      {value}
    </span>
  </div>
);

const StatusCards = ({ role, roomCount, pendingCount, approvedCount }) => {
  const isStaff = role === "staff" || role === "teacher";
  
  return (
    <div className={`grid gap-6 mb-8 ${isStaff ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
      <StatusCard label="ห้องเรียนทั้งหมด" value={roomCount} />
      {isStaff && (
        <>
          <StatusCard label="รายการที่รออนุมัติ" value={pendingCount} />
          <StatusCard label="รายการที่อนุมัติแล้ว" value={approvedCount} />
        </>
      )}
    </div>
  );
};

export default StatusCards;