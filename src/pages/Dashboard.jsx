import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, ArrowRight, FilePlus, CheckCircle2 } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import StatusCards from "../components/dashboard/StatusCards"; // ตัวที่แยกมา
import UploadModal from "../components/dashboard/UploadModal"; // ตัวที่แยกมา

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, roomCount, pendingCount, approvedCount } = useDashboard();

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
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

        {/* ปุ่มไปหน้าห้องเรียน */}
        <Button
          variant="secondary" size="none"
          onClick={() => navigate("/Rooms")}
          className="w-full p-5 rounded-3xl justify-between group mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#B4C424] p-3 rounded-2xl text-[#2D2D86]"><LayoutGrid size={24} /></div>
            <div className="text-left">
              <p className="font-bold text-lg leading-none">ดูรายการห้องเรียน</p>
              <p className="text-white/50 text-[16px] mt-1 italic">จองห้องเรียน หรือตรวจสอบสถานะ</p>
            </div>
          </div>
          <ArrowRight className="group-hover:translate-x-2 transition-transform text-[#B4C424]" size={28} />
        </Button>

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

        {/* Footer Info */}
        {(role === "student" || role === "teacher") && (
          <div className="p-8 text-center bg-gray-50 rounded-[40px] border border-gray-100 mt-6">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#B4C424] rotate-3 shadow-sm">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-[#2D2D86] font-bold">ระบบจองห้องเรียนออนไลน์</p>
          </div>
        )}
      </div>

      {/* Modal แยกไฟล์ไว้ต่างหาก */}
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
        <div className="flex gap-3">
          <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">01</span>
          <p className="text-sm text-gray-600 font-medium">ให้บริการ <span className="text-[#2D2D86] font-bold">จันทร์ – ศุกร์ (08.30 - 16.30 น.)</span> ยกเว้นวันหยุดนักขัตฤกษ์</p>
        </div>
        <div className="flex gap-3">
          <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">02</span>
          <p className="text-sm text-gray-600 font-medium">ต้องทำรายการล่วงหน้าอย่างน้อย <span className="text-red-500 font-bold text-base underline">3 วันทำการ</span></p>
        </div>
        <div className="flex gap-3">
          <span className="flex-none w-6 h-6 bg-[#2D2D86] text-white text-[10px] font-bold rounded-full flex items-center justify-center">03</span>
          <p className="text-sm text-gray-600 font-medium">สถานะต้องได้รับการ <span className="text-emerald-600 font-bold italic">"อนุมัติ" (Approved)</span> เท่านั้นจึงจะเข้าใช้ห้องได้</p>
        </div>
      </div>

      <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
        <div className="flex gap-3">
          <span className="flex-none w-6 h-6 bg-[#B4C424] text-[#2D2D86] text-[10px] font-bold rounded-full flex items-center justify-center">04</span>
          <p className="text-sm text-gray-600 font-medium">ยกเลิกการจองล่วงหน้า <span className="font-bold text-gray-800">อย่างน้อย 1 วัน</span> เพื่อสิทธิ์ของผู้อื่น</p>
        </div>
        <div className="flex gap-3">
          <span className="flex-none w-6 h-6 bg-[#B4C424] text-[#2D2D86] text-[10px] font-bold rounded-full flex items-center justify-center">05</span>
          <p className="text-sm text-gray-400 italic">สงวนสิทธิ์เฉพาะอาจารย์และเจ้าหน้าที่ คณะวิทยาศาสตร์ ศรีราชา เท่านั้น</p>
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-100">
           <p className="text-[10px] text-amber-700 leading-tight">** หากมีปัญหาการใช้งานระบบ ติดต่อได้ที่งานสนับสนุนเทคโนโลยีสารสนเทศและสื่อสาร (IT Support)</p>
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