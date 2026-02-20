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
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden font-sans">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow bg-[#FFFFFF] rounded-t-[50px] p-6 overflow-y-auto shadow-2xl border-t-4 border-[#B2BB1E]">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header Section */}
          <header className="flex justify-between items-end mt-2">
            <div>
              <p className="text-gray-500 font-bold text-xs mb-1">
                {roomDetail?.room_type || "ประเภทห้องเรียน"}
              </p>
              <h2 className="text-[#302782] text-5xl font-bold leading-none">
                {id}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 leading-none mb-1">
                ข้อมูล ณ วันที่
              </p>
              <span className="text-sm font-bold text-gray-800">
                {formatDate(roomData.date)}
              </span>
            </div>
          </header>

          <hr className="border-gray-100" />

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
              <h4 className="text-xs font-bold text-gray-400 whitespace-nowrap">
                {isAvailable ? "ตารางการใช้ห้องวันนี้" : "รายการจองถัดไป"}
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
  <div className="py-12 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
    <p className="text-gray-500 font-bold text-sm">
      {isAvailable ? "ไม่มีรายการจองในวันนี้" : "ไม่มีรายการจองถัดไป"}
    </p>
  </div>
);

export default RoomStatus;