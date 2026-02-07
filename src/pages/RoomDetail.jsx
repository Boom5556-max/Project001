import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Bell,
  QrCode,
  ChevronLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await fetch(
          `https://dave-unincited-ariyah.ngrok-free.dev/rooms/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setRoom(data);
        } else {
          console.error("Failed to fetch room details");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#2D2D86] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-xl font-medium animate-pulse">
          กำลังโหลดข้อมูลห้อง {id}...
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">
          ไม่พบข้อมูลห้องเรียนนี้
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-[#2D2D86] underline"
        >
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      {/* Top Navigation */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-white text-xl font-bold leading-none">
            SCI <span className="text-[#B4C424]">KU</span>
          </h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>

        <div className="flex gap-6 text-white/80">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Calendar size={24} />
          </button>
          <button
            onClick={() => navigate("/notification")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Bell size={24} />
          </button>
          <button
            onClick={() => navigate("/scanner")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <QrCode size={24} />
          </button>
        </div>
      </div>

      <div className="px-8 py-6 flex flex-none items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#B4C424] hover:scale-110 transition-transform"
        >
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-[#B4C424] text-5xl font-bold italic tracking-tight">
          Room detail
        </h1>
      </div>

      <div className="flex-grow bg-white rounded-t-[60px] p-6 relative shadow-2xl overflow-y-auto">
        <div className="bg-[#F2F2F2] rounded-[40px] p-8 mt-4 flex flex-col items-center min-h-[500px]">
          <h2 className="text-[#999999] text-2xl font-bold mb-10 text-center uppercase tracking-wide">
            {room.name} | {room.id}
          </h2>

          <div className="w-full space-y-6 px-2 mb-12">
            <div className="flex text-[#808080] text-xl font-bold items-start border-b border-gray-200 pb-2">
              <span className="w-44 flex-none">ความจุห้อง :</span>
              <span className="text-gray-600 font-medium">
                {room.capacity} ที่นั่ง
              </span>
            </div>

            <div className="flex text-[#808080] text-xl font-bold items-start border-b border-gray-200 pb-2">
              <span className="w-44 flex-none">ลักษณะ :</span>
              <span className="text-gray-600 font-medium leading-tight">
                {room.description}
              </span>
            </div>

            <div className="flex text-[#808080] text-xl font-bold items-start border-b border-gray-200 pb-2">
              <span className="w-44 flex-none">ที่ตั้ง :</span>
              <span className="text-gray-600 font-medium">{room.location}</span>
            </div>

            <div className="pt-4">
              <p className="text-[#B4C424] text-lg font-bold mb-4">
                สิ่งอำนวยความสะดวกภายในห้อง:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {room.facilities &&
                  room.facilities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-500 font-bold"
                    >
                      <CheckCircle2 size={18} className="text-[#B4C424]" />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* --- ส่วนปุ่มกดที่ปรับปรุงใหม่ --- */}
          <div className="w-full space-y-4 mt-auto pb-4">
            <button
              onClick={() => navigate(`/calendar/${room.id}`)} // 🌟 ส่ง ID ห้องไปด้วย
              className="w-full bg-[#2D2D86] text-white py-4 rounded-2xl text-xl font-bold shadow-md active:scale-95 transition-all hover:bg-[#1e1e61]"
            >
              ตรวจสอบตารางการใช้ห้อง
            </button>

            <button
              onClick={() => navigate(`/BookingRoom/${room.id}`)} // 🚀 ส่ง ID ของห้องไปใน URL
              className="w-full bg-[#B4C424] text-[#2D2D86] py-4 rounded-2xl text-xl font-bold shadow-md active:scale-95 transition-all hover:brightness-105"
            >
              ดำเนินการจองห้องนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
