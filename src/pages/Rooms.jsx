import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomCard from "../components/rooms/RoomCard";

const Rooms = () => {
  const navigate = useNavigate();
  const { rooms, isLoading, fetchRooms } = useRooms();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8F9FA] p-6">
        {/* ส่วนหัว */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="none" onClick={() => navigate(-1)} className="text-[#B4C424] p-0 shadow-none bg-transparent">
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
        </div>

        {/* ส่วน Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-[#B4C424] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">กำลังโหลดข้อมูลห้อง...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.room_id} room={room} />
            ))}

            {/* ส่วน Empty State */}
            {rooms.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-300 italic">ไม่พบข้อมูลห้องเรียนในฐานข้อมูล</p>
                <Button variant="ghost" size="none" onClick={fetchRooms} className="mt-4 text-[#B4C424] font-bold underline bg-transparent shadow-none">
                  ลองโหลดใหม่อีกครั้ง
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Rooms;