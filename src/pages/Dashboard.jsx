import React, { useState, useEffect } from 'react';
import { Home, Calendar, Bell, QrCode, FilePlus, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 1. เพิ่ม State เพื่อเก็บ Role ---
  const [userRole, setUserRole] = useState('');

  // --- 2. ดึงค่า Role มาจาก LocalStorage ทันทีที่เปิดหน้านี้ ---
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || 'student';
    setUserRole(savedRole);
  }, []);

  const handleUploadDemo = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* --- Top Navigation Bar --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/dashboard')}>
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        
        <div className="flex gap-6 text-white/80">
          <button onClick={() => navigate('/dashboard')} className="text-[#B4C424]"><Home size={24} /></button>
          <button onClick={() => navigate('/calendar')} className="hover:text-[#B4C424]"><Calendar size={24} /></button>
          <button onClick={() => navigate('/notification')} className="hover:text-[#B4C424]"><Bell size={24} /></button>
          <button onClick={() => navigate('/scanner')} className="hover:text-[#B4C424]"><QrCode size={24} /></button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black border-b-2 border-[#B4C424] inline-block">Dash board</h2>
          {/* แสดงชื่อ Role เล็กๆ ไว้เช็คตอน Demo */}
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Role: {userRole}</span>
        </div>

        {/* --- Status Cards --- */}
        {/* ปรับ Grid: ถ้าเป็น student ให้โชว์ใบเดียวเต็มๆ ถ้าเป็นคนอื่นโชว์ 3 ใบ */}
        <div className={`grid gap-3 mb-8 ${userRole === 'student' ? 'grid-cols-1' : 'grid-cols-3'}`}>
          
          {/* ทุกคนเห็น "ห้องทั้งหมด" */}
          <div 
            onClick={() => navigate('/rooms')} 
            className="bg-[#B4C424] rounded-xl p-6 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <p className="text-white text-[12px] font-bold mb-1 text-center leading-tight">ห้องทั้งหมด</p>
            <span className="text-white text-3xl font-bold">4</span>
          </div>

          {/* --- 3. เพิ่มเงื่อนไข: Admin และ Teacher เท่านั้นที่เห็น 2 การ์ดนี้ --- */}
          {(userRole === 'admin' || userRole === 'teacher') && (
            <>
              <div 
                onClick={() => navigate('/notification')}
                className="bg-[#B4C424] rounded-xl p-6 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <p className="text-white text-[12px] font-bold mb-1 text-center leading-tight">รออนุมัติ</p>
                <span className="text-white text-3xl font-bold">2</span>
              </div>

              <div 
                onClick={() => navigate('/notification')}
                className="bg-[#B4C424] rounded-xl p-6 flex flex-col items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <p className="text-white text-[12px] font-bold mb-1 text-center leading-tight">อนุมัติแล้ว</p>
                <span className="text-white text-3xl font-bold">1</span>
              </div>
            </>
          )}
        </div>

        {/* --- 4. เพิ่มเงื่อนไข: เฉพาะ Admin เท่านั้นที่เห็นส่วน Upload --- */}
        {userRole === 'admin' && (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="mt-20 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
          >
            <h3 className="text-lg font-bold mb-4 text-[#2D2D86] flex items-center gap-2">
              <FilePlus size={20} /> จัดการตารางเรียน
            </h3>
            <div className="flex items-center bg-white border-2 border-dashed border-gray-300 rounded-xl p-5 group">
              <div className="flex-grow">
                <p className="text-sm font-bold text-gray-700 group-hover:text-[#2D2D86]">คลิกเพื่ออัปโหลดไฟล์ (Admin Only)</p>
                <p className="text-gray-400 text-[10px]">รองรับไฟล์ .xlsx .xls .csv</p>
              </div>
              <div className="bg-[#B4C424] p-3 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform">
                <FilePlus size={24} />
              </div>
            </div>
          </div>
        )}

        {/* ข้อความต้อนรับสำหรับ Teacher/Student (เพื่อไม่ให้หน้าจอดูโล่งเกินไป) */}
        {userRole !== 'admin' && (
          <div className="mt-20 p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 italic text-sm font-medium">
              ยินดีต้อนรับเข้าสู่ระบบจองห้องเรียน SCI KU SRC
            </p>
          </div>
        )}
      </div>

      {/* ... ส่วน Modal เหมือนเดิม ... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-[32px] p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400"><X size={24} /></button>
              <h2 className="text-2xl font-bold text-[#2D2D86] mb-6 italic">Upload Schedule</h2>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-10 bg-gray-50">
                {isSuccess ? <CheckCircle2 size={48} className="text-[#B4C424]" /> : <button onClick={handleUploadDemo} className="bg-[#2D2D86] text-white px-8 py-3 rounded-full font-bold shadow-lg">Select File</button>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;