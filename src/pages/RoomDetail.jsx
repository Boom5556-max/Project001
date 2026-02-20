import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useRoomDetail } from "../hooks/useRoomDetail"; // Hook ที่เป็น Axios แล้ว
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomInfo from "../components/rooms/RoomInfo";

const RoomDetail = () => {
  const navigate = useNavigate();
  // id, room, isLoading ถูกดึงมาจาก useRoomDetail ที่ใช้ Axios
  const { id, room, isLoading, error } = useRoomDetail();

  // --- 1. หน้า Loading (คงเดิม) ---
  if (isLoading) return (
    <div className="h-screen bg-[#302782] flex flex-col items-center justify-center text-[#FFFFFF]">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-xl font-medium">กำลังโหลดข้อมูลห้อง {id}...</p>
    </div>
  );

  // --- 2. หน้า Error หรือไม่พบห้อง (เพิ่มเช็ค error จาก Axios) ---
  if (!room || error) return (
    <div className="h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center font-sans">
      <h2 className="text-2xl font-bold text-gray-500 mb-4">
        {error || "ไม่พบข้อมูลห้องเรียนนี้"}
      </h2>
      <Button 
        variant="ghost" 
        size="none" 
        onClick={() => navigate(-1)} 
        className="text-[#302782] underline font-bold bg-transparent"
      >
        กลับไปหน้าหลัก
      </Button>
    </div>
  );

  // --- 3. หน้า UI หลัก (ยึดตามดีไซน์เดิมเป๊ะๆ) ---
  return (
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden font-sans">
      <Navbar />
      
      {/* Header Area */}
      <div className="px-8 py-6 flex flex-none items-center gap-4">
        <Button 
          variant="ghost" 
          size="none" 
          onClick={() => navigate(-1)} 
          className="text-[#B2BB1E] bg-transparent"
        >
          <ChevronLeft size={32} />
        </Button>
        <h1 className="text-[#B2BB1E] text-4xl font-bold">รายละเอียดห้อง</h1>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-[#FFFFFF] rounded-t-[60px] p-6 relative shadow-2xl overflow-y-auto">
        <div className="bg-gray-50 rounded-[40px] p-8 mt-4 flex flex-col items-center min-h-[500px]">
          
          {/* Room Title Header */}
          <h2 className="text-gray-500 text-2xl font-bold mb-10 text-center">
            {room.name || room.room_name} | {room.id || id}
          </h2>

          {/* Room Icons/Info Component */}
          <RoomInfo room={room} />

          {/* Facilities Section */}
          <div className="w-full px-2 mb-12">
            <p className="text-[#B2BB1E] text-lg font-bold mb-4">สิ่งอำนวยความสะดวกภายในห้อง:</p>
            <div className="grid grid-cols-1 gap-3">
              {/* เช็คเผื่อกรณี facilities เป็น undefined */}
              {room.facilities && room.facilities.length > 0 ? (
                room.facilities.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-500 font-bold">
                    <CheckCircle2 size={18} className="text-[#B2BB1E]" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">ไม่มีข้อมูลสิ่งอำนวยความสะดวก</p>
              )}
            </div>
          </div>

          {/* Action Buttons Area */}
          <div className="w-full space-y-4 mt-auto pb-4">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate(`/calendar/${room.id || id}`)} 
              className="w-full text-xl font-bold"
            >
              ตรวจสอบตารางการใช้ห้อง
            </Button>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate(`/BookingRoom/${room.id || id}`)} 
              className="w-full text-xl font-bold"
            >
              ดำเนินการจองห้องนี้
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;