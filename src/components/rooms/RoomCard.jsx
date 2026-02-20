import React, { useState, useEffect } from 'react';
import { Lock, Wrench, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  const isCurrentlyInRepair = room.repair === true;
  const isDisabledForUser = isCurrentlyInRepair && userRole !== "staff";

  const handleCardClick = () => {
    if (isDisabledForUser) return;
    navigate(`/room-detail/${room.room_id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-[#FFFFFF] rounded-[32px] p-6 flex justify-between items-center border transition-all duration-300 mb-4 font-sans
        ${isDisabledForUser 
          ? "opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50/50" 
          : "hover:border-[#B2BB1E] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] cursor-pointer border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]"
        }
        ${isCurrentlyInRepair && userRole === "staff" ? "border-amber-200 bg-amber-50/10" : ""} `}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className={`text-2xl font-bold leading-none ${isDisabledForUser ? "text-gray-400" : "text-[#302782]"}`}>
            {room.room_id}
          </h3>
          <span className="text-gray-200 text-xl font-light">|</span>
          <p className={`text-base font-bold ${isDisabledForUser ? "text-gray-400" : "text-gray-500"}`}>
            {room.room_type}
          </p>
        </div>
        
        <p className="text-gray-400 text-sm font-medium ml-0.5">{room.location}</p>

        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xs px-4 py-1.5 rounded-full font-bold ${
            isDisabledForUser ? "bg-gray-200 text-gray-400" : "bg-gray-50 text-[#302782] border border-gray-100"
          }`}>
            ความจุ {room.capacity} ที่นั่ง
          </span>

          {isCurrentlyInRepair && (
            <span className="text-xs bg-[#302782] px-4 py-1.5 rounded-full text-[#FFFFFF] font-bold flex items-center gap-2 shadow-sm">
              <Wrench size={14} strokeWidth={2.5} /> อยู่ระหว่างซ่อมแซม
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* สำหรับ Staff แสดงป้ายบอกว่ากำลังจัดการ */}
        {!isDisabledForUser && isCurrentlyInRepair && (
          <span className="hidden md:block text-[10px] font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-lg">
            โหมดเจ้าหน้าที่
          </span>
        )}

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDisabledForUser 
            ? "bg-gray-100 text-gray-300" 
            : "bg-gray-50 text-gray-300 group-hover:bg-[#302782] group-hover:text-[#FFFFFF]"
        }`}>
          {isDisabledForUser ? (
            <Lock size={28} strokeWidth={2} />
          ) : isCurrentlyInRepair ? (
            <Settings size={28} strokeWidth={2} className="group-hover:rotate-90 transition-transform duration-500" />
          ) : (
            <ChevronRight size={28} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;