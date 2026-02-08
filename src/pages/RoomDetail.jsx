import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useRoomDetail } from "../hooks/useRoomDetail";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomInfo from "../components/rooms/RoomInfo";

const RoomDetail = () => {
  const navigate = useNavigate();
  const { id, room, isLoading } = useRoomDetail();

  if (isLoading) return (
    <div className="h-screen bg-[#2D2D86] flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-xl font-medium animate-pulse">กำลังโหลดข้อมูลห้อง {id}...</p>
    </div>
  );

  if (!room) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-400 mb-4">ไม่พบข้อมูลห้องเรียนนี้</h2>
      <Button variant="ghost" size="none" onClick={() => navigate(-1)} className="text-[#2D2D86] underline font-medium bg-transparent">
        กลับไปหน้าหลัก
      </Button>
    </div>
  );

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      <Navbar />
      <div className="px-8 py-6 flex flex-none items-center gap-4">
        <Button variant="ghost" size="none" onClick={() => navigate(-1)} className="text-[#B4C424] hover:scale-110 bg-transparent">
          <ChevronLeft size={32} />
        </Button>
        <h1 className="text-[#B4C424] text-5xl font-bold italic tracking-tight">Room detail</h1>
      </div>

      <div className="flex-grow bg-white rounded-t-[60px] p-6 relative shadow-2xl overflow-y-auto">
        <div className="bg-[#F2F2F2] rounded-[40px] p-8 mt-4 flex flex-col items-center min-h-[500px]">
          <h2 className="text-[#999999] text-2xl font-bold mb-10 text-center uppercase tracking-wide">
            {room.name} | {room.id}
          </h2>

          <RoomInfo room={room} />

          {/* Facilities Section */}
          <div className="w-full px-2 mb-12">
            <p className="text-[#B4C424] text-lg font-bold mb-4">สิ่งอำนวยความสะดวกภายในห้อง:</p>
            <div className="grid grid-cols-1 gap-3">
              {room.facilities?.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-500 font-bold">
                  <CheckCircle2 size={18} className="text-[#B4C424]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-4 mt-auto pb-4">
            <Button variant="secondary" size="lg" onClick={() => navigate(`/calendar/${room.id}`)} className="w-full text-xl">
              ตรวจสอบตารางการใช้ห้อง
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate(`/BookingRoom/${room.id}`)} className="w-full text-xl">
              ดำเนินการจองห้องนี้
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;