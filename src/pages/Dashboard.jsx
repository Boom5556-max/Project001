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
    </div>
  );
};

export default Dashboard;