import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import { useRoomStatusLogic } from "../hooks/useRoomStatus.js";
import { LoadingState, ErrorState, ScheduleItem } from "../components/rooms/RoomStatus.jsx";

const RoomStatus = () => {
  const { id } = useParams();
  const { roomData, isLoading, error, isAvailable, formatDate, navigate } = useRoomStatusLogic(id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onBack={() => navigate("/scanner")} />;
  if (!roomData) return null;

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      <Navbar />

      <div className="flex-grow bg-white rounded-t-[50px] p-6 overflow-y-auto shadow-2xl border-t-4 border-[#B4C424]">
        <div className="max-w-md mx-auto">
          {/* Room Title */}
          <div className="mb-8 mt-2">
            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Room Identification</p>
            <h2 className="text-[#2D2D86] text-5xl font-black italic tracking-tighter leading-none">
              {roomData.room_info?.room_id || id}
            </h2>
          </div>

          {/* Status Card */}
          <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Date</span>
                <span className="text-lg font-bold text-gray-800">{formatDate(roomData.date)}</span>
              </div>
              <div className={`px-6 py-3 rounded-2xl text-white text-lg font-black shadow-lg italic transition-all ${
                isAvailable ? "bg-[#B4C424] rotate-2" : "bg-[#EF4444] -rotate-2"
              }`}>
                {isAvailable ? "AVAILABLE" : "BUSY"}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#2D2D86]/30 uppercase tracking-[0.4em]">
                Reservation Detail ({roomData.total_bookings})
              </h4>

              {roomData.schedule?.length > 0 ? (
                roomData.schedule.map((item) => (
                  <ScheduleItem key={item.booking_id} item={item} />
                ))
              ) : (
                <div className="py-10 text-center bg-white rounded-[30px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-300 font-black italic uppercase text-xs">No active bookings for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant={isAvailable ? "primary" : "gray"}
            size="lg"
            disabled={!isAvailable}
            onClick={() => isAvailable && navigate(`/bookingroom/${id}`)}
            className={`w-full text-xl uppercase italic tracking-tighter ${
              isAvailable ? "shadow-[0_10px_20px_rgba(180,196,36,0.3)]" : "cursor-not-allowed"
            }`}
          >
            {isAvailable ? "Book Room Now" : "Room Currently Occupied"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomStatus;