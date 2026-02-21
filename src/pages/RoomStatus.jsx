import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"; // นำเข้า useNavigate ถ้าใช้ตรงๆ หรือใช้จาก hook ก็ได้
import { ChevronLeft } from "lucide-react"; 

import { useRoomStatusLogic } from "../hooks/useRoomStatus.js";
import {
  LoadingState,
  ErrorState,
  ScheduleItem,
  CurrentBookingCard,
} from "../components/rooms/RoomStatus_component.jsx";

const RoomStatus = () => {
  const { id } = useParams();
  const {
    roomData,
    roomDetail,
    isLoading,
    error,
    isAvailable,
    formatDate,
    navigate,
  } = useRoomStatusLogic(id);

  // 🚩 ฟังก์ชันจัดการปุ่มย้อนกลับ
  const handleBack = () => {
    // เช็คว่ามี Token (หรือข้อมูลที่บ่งบอกว่า Login อยู่) ใน localStorage หรือไม่
    // (ปรับชื่อ "token" ให้ตรงกับที่ระบบน้องใช้เก็บข้อมูล Login นะครับ)
    const isLoggedIn = localStorage.getItem("token"); 

    if (isLoggedIn) {
      navigate("/scanner"); // ถ้า Login แล้ว กลับไปหน้าสแกนของระบบหลังบ้าน
    } else {
      navigate("/"); // ถ้ายังไม่ Login (นักศึกษาทั่วไป) กลับไปหน้า Landing Page
    }
  };

  // 1. คำนวณข้อมูลการจอง (Memoized เพื่อ Performance)
  const { currentBooking, filteredSchedule } = useMemo(() => {
    if (!roomData?.schedule)
      return { currentBooking: null, filteredSchedule: [] };

    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date().getTime();

    // หาว่าตอนนี้มี Session ไหนที่คาบเกี่ยวเวลาปัจจุบันจริงๆ
    const current = roomData.schedule.find((item) => {
      const startTimeStr = item.start_time.includes("T")
        ? item.start_time
        : `${todayStr}T${item.start_time}`;
      const endTimeStr = item.end_time.includes("T")
        ? item.end_time
        : `${todayStr}T${item.end_time}`;
      const start = new Date(startTimeStr).getTime();
      const end = new Date(endTimeStr).getTime();
      return now >= start && now < end;
    });

    // กรองรายการ: ถ้าตัวไหนถูกโชว์ข้างบนแล้ว ให้เอาออกจากรายการข้างล่าง
    const filtered = roomData.schedule.filter((item) => {
      return item.booking_id !== current?.booking_id;
    });

    return { currentBooking: current, filteredSchedule: filtered };
  }, [roomData, isAvailable]);

  // --- Early Returns ---
  if (isLoading) return <LoadingState />;

  if (error) {
    // 🚩 ใช้ handleBack ตรงนี้ด้วย เผื่อสแกนมาแล้วพัง จะได้กลับถูกหน้า
    return <ErrorState message={error} onBack={handleBack} />;
  }

  if (!roomData) return null;

  return (
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden font-sans">
      
      {/* Header เฉพาะกิจ */}
      <header className="px-6 py-5 text-white flex items-center justify-between z-10">
        <button 
          onClick={handleBack} // 🚩 เรียกใช้ฟังก์ชัน handleBack เมื่อกดปุ่ม
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all shadow-sm"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-bold tracking-wide">สถานะห้องเรียน</h1>
        <div className="w-10"></div>
      </header>

      {/* Main Container */}
      <div className="flex-grow bg-[#FFFFFF] rounded-t-[40px] p-6 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t-[5px] border-[#B2BB1E]">
        <div className="max-w-md mx-auto space-y-8 pb-10">
          
          {/* Header Section */}
          <header className="flex justify-between items-end mt-2">
            <div>
              <p className="text-gray-500 font-bold text-xs mb-1">
                {roomDetail?.room_type || "ประเภทห้องเรียน"}
              </p>
              <h2 className="text-[#302782] text-5xl font-extrabold leading-none drop-shadow-sm">
                {id}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 leading-none mb-1">
                ข้อมูล ณ วันที่
              </p>
              <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                {formatDate(roomData.date)}
              </span>
            </div>
          </header>

          <hr className="border-gray-100" />

          {/* ส่วนที่ 1: การจองปัจจุบัน (Hero Section) */}
          <section className="relative">
            <CurrentBookingCard
              item={currentBooking}
              isAvailable={isAvailable}
              capacity={roomDetail?.capacity}
            />
          </section>

          {/* ส่วนที่ 2: ตารางเวลาที่เหลือ */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 px-2">
              <div className="h-[2px] flex-grow bg-gray-100" />
              <h4 className="text-xs font-bold text-gray-400 whitespace-nowrap uppercase tracking-widest">
                {isAvailable ? "ตารางการใช้ห้องวันนี้" : "รายการจองถัดไป"}
              </h4>
              <div className="h-[2px] flex-grow bg-gray-100" />
            </div>

            <div className="space-y-3">
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((item, index) => (
                  <ScheduleItem
                    key={item.booking_id || `schedule-${index}`}
                    item={item}
                    capacity={roomDetail?.capacity}
                  />
                ))
              ) : (
                <EmptyScheduleState isAvailable={isAvailable} />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// แยก Component เล็กๆ
const EmptyScheduleState = ({ isAvailable }) => (
  <div className="py-12 text-center bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl opacity-50">📅</span>
    </div>
    <p className="text-gray-500 font-bold text-sm">
      {isAvailable ? "ไม่มีรายการจองในวันนี้" : "ไม่มีรายการจองถัดไป"}
    </p>
  </div>
);

export default RoomStatus;