import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Calendar, Bell, QrCode } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams(); // รับค่า ID ห้องจาก URL
  const navigate = useNavigate();

  // ข้อมูลจำลองสำหรับแสดงผล
  const roomInfo = {
    id: id || "26504",
    name: "Computer Lab",
    capacity: "60 ที่นั่ง",
    type: "สำหรับการเรียนการสอน : ฝึกอบรม",
    projector: "1 เครื่อง",
    soundSystem: "1 ชุด",
    mic: "2 ชุด"
  };

  // ฟังก์ชันสำหรับการจองห้อง
  const handleBooking = () => {
    // เชื่อมต่อไปยัง Google Forms ที่คุณระบุ
    window.open("https://forms.gle/SCtvWH1rNQYHCgLb6", "_blank");
  };

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      
      {/* --- Top Navigation Bar (แบบเดิมที่คุณเคยใช้) --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none">
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/dashboard')}>
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
          <button onClick={() => navigate('/scanner')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <QrCode size={24} />
          </button>
        </div>
      </div>

      {/* --- Header Section --- */}
      <div className="px-8 py-6 flex-none">
        <h1 className="text-[#B4C424] text-5xl font-bold italic">Room detail</h1>
      </div>

      {/* --- Main White Card Area --- */}
      <div className="flex-grow bg-white rounded-t-[60px] p-6 relative shadow-2xl overflow-y-auto">
        
        <div className="bg-[#F2F2F2] rounded-[40px] p-8 mt-4 flex flex-col items-center min-h-[500px]">
          
          <h2 className="text-[#999999] text-2xl font-bold mb-10">
            {roomInfo.name} | {roomInfo.id}
          </h2>

          <div className="w-full space-y-4 px-2 mb-12">
            <div className="flex text-[#808080] text-xl font-bold">
              <span className="w-40">ความจุห้อง :</span>
              <span>{roomInfo.capacity}</span>
            </div>
            
            <div className="flex text-[#808080] text-xl font-bold leading-tight">
              <span className="w-40 flex-none">ลักษณะ :</span>
              <div className="flex flex-col">
                <span>สำหรับการเรียนการสอน</span>
                <span className="mt-1">: ฝึกอบรม</span>
              </div>
            </div>

            <div className="flex text-[#808080] text-xl font-bold">
              <span className="w-40">เครื่องโปรเจคเตอร์ :</span>
              <span>{roomInfo.projector}</span>
            </div>

            <div className="flex text-[#808080] text-xl font-bold">
              <span className="w-40">เครื่องเสียง :</span>
              <span>{roomInfo.soundSystem}</span>
            </div>

            <div className="flex text-[#808080] text-xl font-bold">
              <span className="w-40">ไมค์ :</span>
              <span>{roomInfo.mic}</span>
            </div>
          </div>

          <div className="w-full space-y-4 mt-auto pb-4">
            <button 
              onClick={() => navigate('/calendar')}
              className="w-full bg-[#2D2D86] text-white py-4 rounded-2xl text-xl font-bold shadow-md active:scale-95 transition-all"
            >
              ตรวจสอบตารางการใช้ห้อง
            </button>
            
            {/* ปุ่มจองห้องที่เชื่อมต่อไปยัง Google Forms */}
            <button 
              onClick={handleBooking}
              className="w-full bg-[#B4C424] text-white py-4 rounded-2xl text-xl font-bold shadow-md active:scale-95 transition-all"
            >
              จองห้อง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;