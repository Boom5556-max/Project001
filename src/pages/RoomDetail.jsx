import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRoomDetail } from "../hooks/useRoomDetail"; 
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomInfo from "../components/rooms/RoomInfo";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { room, isLoading, error } = useRoomDetail();

  // 1. หน้า Loading
  if (isLoading) return (
    <div className="h-screen bg-[#302782] flex flex-col items-center justify-center text-[#FFFFFF]">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-xl font-medium">กำลังโหลดข้อมูลห้อง {id}...</p>
    </div>
  );

  // 2. หน้า Error
  if (error || !room) return (
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

  return (
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden font-sans">
      <Navbar />
      
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

      <div className="flex-grow bg-[#FFFFFF] rounded-t-[60px] p-6 relative shadow-2xl overflow-y-auto">
        <div className="bg-gray-50 rounded-[40px] p-8 mt-4 flex flex-col items-center min-h-[500px]">
          
          <h2 className="text-gray-500 text-2xl font-bold mb-10 text-center">
            {room.name || "ไม่ระบุชื่อห้อง"} | {room.id || id}
          </h2>

          <RoomInfo room={room} />

          {/* ส่วนสิ่งอำนวยความสะดวก */}
          <div className="w-full px-2 mb-12">
            <p className="text-[#B2BB1E] text-lg font-bold mb-4">สิ่งอำนวยความสะดวกภายในห้อง:</p>
            <div className="grid grid-cols-1 gap-3">
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

          {/* --- ✅ ส่วนที่แก้ไข: เช็คค่า repair อย่างละเอียด --- */}
          <div className="w-full space-y-4 mt-auto pb-4">
            {room.repair === true || room.repair === 1 ? (
              /* 🚩 แสดงเมื่อห้องซ่อม */
              <div className="w-full p-6 bg-red-50 border-2 border-red-100 rounded-[30px] flex flex-col items-center gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={28} />
                  <span className="text-red-600 font-extrabold text-xl">
                    ห้องนี้ปิดปรับปรุง
                  </span>
                </div>
                <p className="text-red-400 text-sm font-bold">ไม่สามารถตรวจสอบตารางหรือจองได้ในขณะนี้</p>
              </div>
            ) : (
              /* ✅ แสดงเมื่อห้องปกติ */
              <>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate(`/calendar/${room.id || id}`)} 
                  className="w-full text-xl font-bold py-4 rounded-[20px]"
                >
                  ตรวจสอบตารางการใช้ห้อง
                </Button>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate(`/BookingRoom/${room.id || id}`)} 
                  className="w-full text-xl font-bold py-4 rounded-[20px]"
                >
                  ดำเนินการจองห้องนี้
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomDetail;