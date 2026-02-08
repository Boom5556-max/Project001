import React from "react";
import { QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/room-detail/${room.room_id}`)}
      className="bg-white rounded-3xl p-5 flex justify-between items-center shadow-sm border border-transparent hover:border-[#B4C424]/30 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {room.room_id} <span className="text-[#B4C424] mx-1">|</span> {room.room_type}
        </h3>
        <p className="text-gray-500 text-xs font-medium">{room.location || "อาคารวิทยาศาสตร์"}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-[#B4C424]/10 px-2 py-0.5 rounded-full text-[#B4C424] font-bold">
            ความจุ {room.capacity} ที่นั่ง
          </span>
        </div>
      </div>
      <div className="text-gray-300 bg-gray-50 p-3 rounded-2xl">
        <QrCode size={32} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default RoomCard;