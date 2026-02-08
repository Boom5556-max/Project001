import React from "react";

const StatusCard = ({ label, value }) => (
  <div className="bg-[#B4C424] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border-b-4 border-[#a3b120]">
    <p className="text-white text-[10px] font-black uppercase tracking-tighter text-center">{label}</p>
    <span className="text-white text-4xl font-black">{value}</span>
  </div>
);

const StatusCards = ({ role, roomCount, pendingCount, approvedCount }) => {
  const isStaff = role === "staff" || role === "teacher";
  return (
    <div className={`grid gap-4 mb-6 ${isStaff ? "grid-cols-3" : "grid-cols-1"}`}>
      <StatusCard label="ห้องทั้งหมด" value={roomCount} />
      {isStaff && (
        <>
          <StatusCard label="รออนุมัติ" value={pendingCount} />
          <StatusCard label="อนุมัติแล้ว" value={approvedCount} />
        </>
      )}
    </div>
  );
};

export default StatusCards;