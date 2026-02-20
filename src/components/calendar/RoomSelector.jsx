import React from "react";
import { ChevronDown } from "lucide-react";

const RoomSelector = ({ rooms, selectedRoom, onSelect }) => {
  return (
    <div className="flex flex-col flex-none font-sans">
      <label className="text-xs font-bold text-gray-500 mb-2 ml-1">
        เลือกห้องเรียน
      </label>
      <div className="relative w-full max-w-sm">
        <select
          value={selectedRoom || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-gray-200 text-[#302782] text-base font-bold rounded-[18px] py-4 px-5 appearance-none cursor-pointer focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 outline-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all"
        >
          <option value="" className="text-gray-500 font-bold">
            ห้องเรียนทั้งหมด
          </option>

          {rooms &&
            rooms
              .filter((room) => room.repair !== true) // กรองห้องซ่อมออก (ใช้อันนี้ตาม JSON นาย)
              .sort((a, b) => a.room_id.localeCompare(b.room_id)) // เรียงลำดับเลขห้องให้ดูง่าย
              .map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {/* 🚩 แก้ตรงนี้: ให้โชว์แค่ ID อย่างเดียว ไม่ต้องมีวงเล็บซ้ำ */}
                  {room.room_id}
                </option>
              ))}
        </select>
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;