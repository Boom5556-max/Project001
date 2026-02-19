import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
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

  // 🚩 1. คำนวณข้อมูลการจอง (Memoized เพื่อ Performance)
  // ใน RoomStatus.jsx
  const { currentBooking, filteredSchedule } = useMemo(() => {
    if (!roomData?.schedule)
      return { currentBooking: null, filteredSchedule: [] };

    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date().getTime();

    // 🚩 หาว่าตอนนี้มี Session ไหนที่คาบเกี่ยวเวลาปัจจุบันจริงๆ
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
  }, [roomData, isAvailable]); // isAvailable เปลี่ยน current จะเปลี่ยนตาม

  // --- Early Returns ---
  if (isLoading) return <LoadingState />;

  if (error) {
    return <ErrorState message={error} onBack={() => navigate("/scanner")} />;
  }

  if (!roomData) return null;

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow bg-white rounded-t-[50px] p-6 overflow-y-auto shadow-2xl border-t-4 border-[#B4C424]">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header Section */}
          <header className="flex justify-between items-end mt-2">
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">
                {roomDetail?.room_type || "Room Identification"}
              </p>
              <h2 className="text-[#2D2D86] text-5xl font-black italic tracking-tighter leading-none">
                {id}
              </h2>
            </div>
            <div className="text-right animate-in fade-in slide-in-from-right duration-500">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Status Date
              </p>
              <span className="text-xs font-bold text-gray-800 italic">
                {formatDate(roomData.date)}
              </span>
            </div>
          </header>

          <hr className="border-gray-50" />

          {/* 🚩 ส่วนที่ 1: การจองปัจจุบัน (Hero Section) */}
          <section className="relative">
            <CurrentBookingCard
              item={currentBooking}
              isAvailable={isAvailable}
              capacity={roomDetail?.capacity}
            />
          </section>

          {/* 🚩 ส่วนที่ 2: ตารางเวลาที่เหลือ */}
          <section className="space-y-5">
            <div className="flex items-center gap-3 px-2">
              <div className="h-[2px] flex-grow bg-gray-100" />
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic whitespace-nowrap">
                {isAvailable ? "Today's Schedule" : "Next Sessions"}
              </h4>
              <div className="h-[2px] flex-grow bg-gray-100" />
            </div>

            <div className="space-y-3 pb-12">
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

// แยก Component เล็กๆ เพื่อความอ่านง่าย (Sub-component)
const EmptyScheduleState = ({ isAvailable }) => (
  <div className="py-12 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 transition-all hover:bg-gray-100/50">
    <p className="text-gray-300 font-black italic uppercase text-[10px] tracking-widest">
      {isAvailable ? "No bookings today" : "No upcoming sessions"}
    </p>
  </div>
);

export default RoomStatus;
