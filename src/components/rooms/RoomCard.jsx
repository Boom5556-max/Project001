import React, { useState, useEffect } from "react";
import { Lock, Wrench } from "lucide-react"; // เพิ่ม Wrench (ประแจ) ให้ดูเข้ากับงานซ่อม
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded?.role?.toLowerCase().trim() || "student");
      } catch (err) {
        console.error("Token Decode Error:", err);
      }
    }
  }, []);

  // LOGIC ใหม่: ถ้า repair = true (กำลังซ่อม) และไม่ใช่ staff -> ห้ามเข้า
  const isCurrentlyInRepair = room.repair === true;
  const isDisabledForUser = isCurrentlyInRepair && userRole !== "staff";

  const handleCardClick = () => {
    if (isDisabledForUser) return;
    navigate(`/room-detail/${room.room_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative bg-white rounded-3xl p-5 flex justify-between items-center shadow-sm border-2 transition-all 
        ${isDisabledForUser 
          ? "opacity-60 grayscale cursor-not-allowed border-gray-100" 
          : "hover:border-[#B4C424]/30 hover:shadow-md active:scale-[0.98] cursor-pointer border-transparent"
        }
        ${isCurrentlyInRepair && userRole === "staff" ? "border-red-200 bg-red-50/20" : ""} `}
    >
      <div className="flex flex-col gap-1">
        <h3 className={`text-lg font-bold leading-tight ${isDisabledForUser ? "text-gray-400" : "text-gray-800"}`}>
          {room.room_id} <span className="text-[#B4C424] mx-1">|</span> {room.room_type}
        </h3>
        
        <p className="text-gray-500 text-xs font-medium">{room.location}</p>

        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isDisabledForUser ? "bg-gray-200 text-gray-400" : "bg-[#B4C424]/10 text-[#B4C424]"
          }`}>
            ความจุ {room.capacity} ที่นั่ง
          </span>

          {/* ป้ายเตือนซ่อม */}
          {isCurrentlyInRepair && (
            <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded-full text-white font-bold flex items-center gap-1">
              <Wrench size={10} /> อยู่ระหว่างซ่อมแซม
            </span>
          )}
        </div>
      </div>

      <div className={`p-3 rounded-2xl transition-colors ${
        isDisabledForUser ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-300"
      }`}>
        {isDisabledForUser ? (
          <Lock size={32} strokeWidth={1.5} />
        ) : (
          <div className={`w-8 h-8 flex items-center justify-center font-black ${isCurrentlyInRepair ? "text-red-500" : "text-[#B4C424]"}`}>
            {isCurrentlyInRepair ? "EDIT" : "GO"}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;