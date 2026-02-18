import React from "react";
import { ChevronDown } from "lucide-react";

const RoomSelector = ({ rooms, selectedRoom, onSelect }) => {
  return (
    <div className="mb-3 flex flex-col flex-none">
      <label className="text-[10px] font-bold text-[#2D2D86] uppercase mb-1 ml-1 opacity-60">
        เลือกห้องเรียน
      </label>
      <div className="relative w-full max-w-sm">
        <select
          value={selectedRoom || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl block p-3 appearance-none cursor-pointer focus:ring-2 focus:ring-[#B4C424] outline-none shadow-sm transition-all hover:bg-white"
        >
          <option value="" className="text-indigo-600 font-black">
            All Room
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#2D2D86]">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;
