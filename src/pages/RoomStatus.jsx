import React from 'react';
import { Home, Calendar, Bell, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const RoomStatus = () => {
  // ข้อมูลจำลองสถานะและการจองของห้อง
  const roomData = {
    name: "Computer Lab 26504",
    date: "วันที่ 1 มกราคม 2568",
    isAvailable: false,
    schedules: [
      { user: "จิรวรรณ เจริญสุข", objective: "นัดคุยเรื่องสหกิจศึกษา", time: "13.00 - 14.00" },
      { user: "จิรวรรณ เจริญสุข", objective: "นัดคุยเรื่องสหกิจศึกษา", time: "15.00 - 16.00" }
    ]
  };
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      
      {/* --- Top Navigation Bar (ดึงแถบหลักกลับมา) --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg flex-none sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        
        <div className="flex gap-6 text-white/80">
         <button onClick={() => navigate('/dashboard')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Home size={24} />
          </button>
          <button onClick={() => navigate('/calendar')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Calendar size={24} />
          </button>
          <button onClick={() => navigate('/notification')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Bell size={24} />
          </button>
          <button onClick={() => navigate('/Qrscanner')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <QrCode size={24} />
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-6 flex-grow overflow-y-auto bg-white rounded-t-[40px] -mt-6 z-10 shadow-2xl">
        
        {/* ชื่อห้องที่ย้ายมาไว้ด้านล่าง */}
        <h2 className="text-[#2D2D86] text-3xl font-bold mt-6 mb-4 ml-4">
          {roomData.name}
        </h2>

        {/* Card แสดงสถานะปัจจุบัน */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-6">
            
            {/* วันที่ */}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-black">{roomData.date}</span>
            </div>

            {/* แถบสถานะห้อง (ว่าง/ไม่ว่าง) */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-black">สถานะห้อง</span>
              <div className={`px-10 py-3 rounded-2xl text-white text-xl font-bold shadow-md ${roomData.isAvailable ? 'bg-[#B4C424]' : 'bg-[#CC2222]'}`}>
                {roomData.isAvailable ? 'ว่าง' : 'ไม่ว่าง'}
              </div>
            </div>

            {/* รายการผู้จอง (Time Slots) */}
            <div className="mt-4 space-y-10">
              {roomData.schedules.map((item, index) => (
                <div key={index} className="flex flex-col gap-1 border-l-4 border-[#B4C424] pl-4">
                  <p className="text-lg font-bold">
                    <span className="text-gray-900">ผู้ใช้ห้อง :</span> {item.user}
                  </p>
                  <p className="text-lg font-bold">
                    <span className="text-gray-900">วัตถุประสงค์ :</span>
                  </p>
                  <p className="text-lg font-bold text-black leading-tight">
                    {item.objective}
                  </p>
                  <p className="text-lg font-bold mt-1">
                    <span className="text-gray-900">ระยะเวลา :</span> {item.time}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default RoomStatus;