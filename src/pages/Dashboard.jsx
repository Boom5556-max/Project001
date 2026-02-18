import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, ArrowRight, FilePlus, CheckCircle2, Search, Calendar, Clock, Users } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import StatusCards from "../components/dashboard/StatusCards"; 
import UploadModal from "../components/dashboard/UploadModal"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, roomCount, pendingCount, approvedCount } = useDashboard();

  // 🚩 State สำหรับเก็บค่าฟอร์มค้นหา
  const [searchQuery, setSearchQuery] = useState({
    date: "",
    start_time: "",
    end_time: "",
    capacity: ""
  });

  // 🚩 ฟังก์ชันเมื่อกดปุ่มค้นหา
  const handleSmartSearch = (e) => {
    e.preventDefault();
    // ส่งข้อมูลไปยังหน้า RoomResults ผ่าน state ของ react-router
    navigate("/room-results", { state: searchQuery });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-kanit">
      <Navbar />
      <div className="p-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold border-b-2 border-[#B4C424] inline-block italic">Dashboard</h2>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Role: {role}
          </span>
        </div>

        {/* สถิติ */}
        <StatusCards role={role} roomCount={roomCount} pendingCount={pendingCount} approvedCount={approvedCount} />

        {/* ปุ่มไปหน้าห้องเรียนปกติ */}
        <Button
          variant="secondary" size="none"
          onClick={() => navigate("/Rooms")}
          className="w-full p-5 rounded-3xl justify-between group mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#B4C424] p-3 rounded-2xl text-[#2D2D86]"><LayoutGrid size={24} /></div>
            <div className="text-left">
              <p className="font-bold text-lg leading-none">ดูรายการห้องเรียน</p>
              <p className="text-white/50 text-[16px] mt-1 italic">ตรวจสอบตารางการใช้ห้องทั้งหมด</p>
            </div>
          </div>
          <ArrowRight className="group-hover:translate-x-2 transition-transform text-[#B4C424]" size={28} />
        </Button>

        {/* 🚩 Smart Search Section สำหรับ Staff & Teacher เท่านั้น */}
        {(role === "staff" || role === "teacher") && (
          <div className="bg-[#2D2D86] rounded-[40px] p-8 mb-6 shadow-xl shadow-indigo-100 border border-indigo-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#B4C424] rounded-xl text-[#2D2D86]">
                <Search size={20} />
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-wider">จองห้องเรียน </h3>
            </div>
            
            <form onSubmit={handleSmartSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* วันที่ */}
              <div className="space-y-1">
                <label className="text-[10px] text-indigo-200 ml-2 font-bold uppercase tracking-widest">วันที่เข้าใช้งาน</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                  <input 
                    required 
                    type="date" 
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:bg-white focus:text-[#2D2D86] outline-none transition-all text-sm font-bold" 
                    onChange={e => setSearchQuery({...searchQuery, date: e.target.value})} 
                  />
                </div>
              </div>

              {/* เวลา */}
              <div className="space-y-1">
                <label className="text-[10px] text-indigo-200 ml-2 font-bold uppercase tracking-widest">ช่วงเวลา (เริ่ม - สิ้นสุด)</label>
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
                    <input 
                      required 
                      type="time" 
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-10 pr-2 text-white focus:bg-white focus:text-[#2D2D86] outline-none text-sm font-bold" 
                      onChange={e => setSearchQuery({...searchQuery, start_time: e.target.value})} 
                    />
                  </div>
                  <div className="relative w-1/2">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
                    <input 
                      required 
                      type="time" 
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-10 pr-2 text-white focus:bg-white focus:text-[#2D2D86] outline-none text-sm font-bold" 
                      onChange={e => setSearchQuery({...searchQuery, end_time: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* จำนวนนิสิต */}
              <div className="space-y-1">
                <label className="text-[10px] text-indigo-200 ml-2 font-bold uppercase tracking-widest">จำนวนนิสิต</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={16} />
                  <input 
                    required 
                    type="number" 
                    placeholder="เช่น 50" 
                    className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:bg-white focus:text-[#2D2D86] outline-none text-sm font-bold placeholder:text-indigo-300/30" 
                    onChange={e => setSearchQuery({...searchQuery, capacity: e.target.value})} 
                  />
                </div>
              </div>

              {/* ปุ่ม Submit */}
              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="w-full bg-[#B4C424] hover:bg-white text-[#2D2D86] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/20"
                >
                  ค้นหาห้องว่าง <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ระบบจัดการไฟล์สำหรับ Staff */}
        {role === "staff" && (
          <div onClick={() => setIsModalOpen(true)} className="bg-gray-50 rounded-[32px] p-6 border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#B4C424] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#2D2D86] flex items-center gap-2">
                  <FilePlus size={20} className="text-[#B4C424]" /> ระบบจัดการไฟล์
                </h3>
                <p className="text-gray-400 text-xs mt-1">อัปโหลดตารางเรียน (.xlsx, .csv)</p>
              </div>
              <FilePlus size={32} className="text-[#2D2D86] opacity-20" />
            </div>
          </div>
        )}

        {/* Footer Info สำหรับ Student/Teacher */}
        {(role === "student" || role === "teacher") && (
          <div className="p-8 text-center bg-gray-50 rounded-[40px] border border-gray-100 mt-6">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#B4C424] rotate-3 shadow-sm">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-[#2D2D86] font-bold">ระบบจองห้องเรียนออนไลน์</p>
          </div>
        )}
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* --- Booking Guidelines Footer --- */}
      <footer className="mt-12 mb-8 px-4">
        <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-[30px] p-8 border border-white/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[#2D2D86]">
            <div className="p-2 bg-[#B4C424]/20 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-wide">ระเบียบการให้บริการ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-3">
              <div className="flex gap-3 text-sm text-gray-600 font-medium">
                <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">01</span>
                <p>ให้บริการ <span className="text-[#2D2D86] font-bold">จันทร์ – ศุกร์ (08.30 - 16.30 น.)</span></p>
              </div>
              <div className="flex gap-3 text-sm text-gray-600 font-medium">
                <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">02</span>
                <p>ทำรายการล่วงหน้าอย่างน้อย <span className="text-red-500 font-bold underline">3 วันทำการ</span></p>
              </div>
              <div className="flex gap-3 text-sm text-gray-600 font-medium">
                <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">03</span>
                <p>สถานะต้องได้รับ <span className="text-emerald-600 font-bold italic">"อนุมัติ"</span> เท่านั้น</p>
              </div>
            </div>

            <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
              <div className="flex gap-3 text-sm text-gray-600 font-medium">
                <span className="flex-none w-6 h-6 bg-[#B4C424] text-[#2D2D86] text-[10px] font-bold rounded-full flex items-center justify-center">04</span>
                <p>ยกเลิกการจองล่วงหน้าอย่างน้อย 1 วัน</p>
              </div>
              <div className="flex gap-3 text-sm text-gray-400 italic font-medium">
                <span className="flex-none w-6 h-6 bg-[#B4C424] text-[#2D2D86] text-[10px] font-bold rounded-full flex items-center justify-center">05</span>
                <p>สำหรับอาจารย์และเจ้าหน้าที่ คณะวิทย์ฯ ศรีราชา</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 text-[10px] mt-6 uppercase tracking-widest opacity-50">Faculty of Science at Sriracha - Room Booking System v1.0</p>
      </footer>
    </div>
  );
};

export default Dashboard;