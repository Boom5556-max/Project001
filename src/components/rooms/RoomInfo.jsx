import React from "react";

const InfoRow = ({ label, value }) => (
  <div className="flex text-[#808080] text-xl font-bold items-start border-b border-gray-200 pb-2">
    <span className="w-44 flex-none">{label} :</span>
    <span className="text-gray-600 font-medium leading-tight">{value}</span>
  </div>
);

const RoomInfo = ({ room }) => (
  <div className="w-full space-y-6 px-2 mb-12">
    <InfoRow label="ความจุห้อง" value={`${room.capacity} ที่นั่ง`} />
    <InfoRow label="ลักษณะ" value={room.description} />
    <InfoRow label="ที่ตั้ง" value={room.location} />
  </div>
);

export default RoomInfo;