import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, SearchX, MapPin, Users, Calendar, Clock, ArrowRight, FileText, Send, Bookmark } from "lucide-react";
import { useRoomResults } from "../hooks/useRoomResults";
import Navbar from "../components/layout/Navbar";

const RoomResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = location.state;
  
  // 🚩 ดึงทั้ง Data และ Functions มาจาก Hook
  const { 
    rooms, loading, error, 
    selectedRoom, setSelectedRoom, 
    purpose, setPurpose, 
    isSubmitting, handleConfirmBooking 
  } = useRoomResults(searchQuery);

  if (!searchQuery) return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div className="text-center bg-[#FFFFFF] p-10 rounded-[40px] shadow-sm border border-gray-100">
        <p className="text-gray-500 mb-4 font-bold">ไม่พบข้อมูลการค้นหา กรุณาเริ่มค้นหาใหม่</p>
        <button onClick={() => navigate("/dashboard")} className="bg-[#302782] text-[#FFFFFF] px-8 py-3 rounded-2xl font-bold hover:bg-opacity-90">กลับหน้าหลัก</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="p-6 flex-grow max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#302782] mb-3 font-bold text-sm">
              <ChevronLeft size={20} className="bg-[#FFFFFF] rounded-lg shadow-sm p-1" /> แก้ไขการค้นหา
            </button>
            <h1 className="text-4xl font-bold text-[#302782]">ห้องที่ว่างสำหรับคุณ</h1>
          </div>

          <div className="flex flex-wrap gap-2 bg-[#FFFFFF]/80 backdrop-blur-md p-3 rounded-[24px] border border-[#FFFFFF] shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[#302782] rounded-xl text-xs font-bold">
              <Calendar size={16} /> {searchQuery.date}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[#302782] rounded-xl text-xs font-bold">
              <Clock size={16} /> {searchQuery.start_time} - {searchQuery.end_time} น.
            </div>
          </div>
        </div>

        {/* Room List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#302782] font-bold">กำลังตรวจสอบตารางห้องว่าง...</div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.room_id} className="bg-[#FFFFFF] rounded-[45px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-[#B2BB1E] text-[#FFFFFF] text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">ว่าง</div>
                  <Bookmark className="text-gray-200 group-hover:text-[#B2BB1E] transition-colors" size={24} />
                </div>
                <h3 className="text-3xl font-bold text-[#302782] mb-2">{room.room_id}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-2 mb-8 font-medium"><MapPin size={16} className="text-[#B2BB1E]" /> {room.location || 'คณะวิทยาศาสตร์ ศรีราชา'}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-[28px] border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold mb-1">ความจุ</p>
                    <p className="text-[#302782] font-bold text-lg flex items-center gap-2"><Users size={18} className="text-[#B2BB1E]" /> {room.capacity}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-[28px] border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold mb-1">ประเภทห้อง</p>
                    <p className="text-[#302782] font-bold truncate text-sm">{room.room_type || 'ห้องบรรยาย'}</p>
                  </div>
                </div>

                <button onClick={() => setSelectedRoom(room)} className="w-full bg-[#302782] text-[#FFFFFF] py-5 rounded-[28px] font-bold flex items-center justify-center gap-3 hover:bg-[#B2BB1E] hover:text-[#FFFFFF] transition-colors">
                  เลือกจองห้องนี้ <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-[#FFFFFF] rounded-[60px] border-2 border-dashed border-gray-200">
            <SearchX size={56} className="text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-[#302782]">ไม่พบห้องว่างตามเงื่อนไข</h2>
          </div>
        )}
      </div>

      {/* 🚩 Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-[#302782]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-[50px] p-10 shadow-2xl border border-[#FFFFFF]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#302782] flex items-center gap-3"><FileText className="text-[#B2BB1E]" /> รายละเอียดการจอง</h3>
              <button onClick={() => { setSelectedRoom(null); setPurpose(""); }} className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-2xl">×</button>
            </div>

            <div className="bg-gray-50 p-6 rounded-[35px] border border-gray-100 mb-8 grid grid-cols-2 gap-4">
              <div className="col-span-2 border-b pb-2 mb-1"><p className="text-xs text-gray-500 font-bold">ห้องที่เลือก</p><p className="text-2xl font-bold text-[#302782]">{selectedRoom.room_id}</p></div>
              <div><p className="text-xs text-gray-500 font-bold">วันที่</p><p className="text-sm font-bold text-[#302782]">{searchQuery.date}</p></div>
              <div><p className="text-xs text-gray-500 font-bold">เวลา</p><p className="text-sm font-bold text-[#302782]">{searchQuery.start_time} - {searchQuery.end_time}</p></div>
            </div>

            <div className="space-y-3 mb-10">
              <label className="text-xs font-bold text-gray-500 ml-2">วัตถุประสงค์ในการเข้าใช้งาน</label>
              <textarea rows="4" className="w-full bg-gray-50 border-2 border-transparent focus:border-[#B2BB1E] focus:bg-[#FFFFFF] rounded-[30px] p-6 outline-none transition-colors font-medium text-[#302782]" placeholder="ระบุชื่อวิชา หรือกิจกรรม..." value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>

            <button disabled={isSubmitting} onClick={handleConfirmBooking} className={`w-full py-5 rounded-[30px] font-bold flex items-center justify-center gap-3 transition-colors ${isSubmitting ? "bg-gray-200 text-gray-500" : "bg-[#B2BB1E] text-[#FFFFFF] hover:bg-[#302782]"}`}>
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการจองห้องเรียน"} <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomResults;