import React from 'react';
import { Home, Calendar, Bell, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const navigate = useNavigate();
  
  const roomList = [
    {id: '26305', name: 'Computer Lecture', detail: 'ตึกวิทยาศาสตร์ ชั้น 3', capacity: 'ความจุ 50 ที่นั่ง'},
    { id: '26307', name: 'Computer Lecture', detail: 'ตึกวิทยาศาสตร์ ชั้น 3', capacity: 'ความจุ 50 ที่นั่ง' },
    { id: '26504', name: 'Computer Lab', detail: 'ตึกวิทยาศาสตร์ ชั้น 5', capacity: 'ความจุ 30 ที่นั่ง' },
    { id: '26506', name: 'Computer Lab', detail: 'ตึกวิทยาศาสตร์ ชั้น 5', capacity: 'ความจุ 30 ที่นั่ง' },
    { id: '26508', name: 'Computer Lab', detail: 'ตึกวิทยาศาสตร์ ชั้น 5', capacity: 'ความจุ 50 ที่นั่ง' },
    { id: '26512', name: 'Computer Lecture', detail: 'ตึกวิทยาศาสตร์ ชั้น 5', capacity: 'ความจุ 50 ที่นั่ง' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* --- Top Navigation Bar --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
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
          <button onClick={() => navigate('/scanner')} className="hover:text-[#B4C424] transition-colors active:scale-90 ">
            <QrCode size={24} />
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-6 flex-grow">
        <h2 className="text-4xl font-bold mb-8 text-[#B4C424]">Rooms</h2>

        <div className="space-y-4">
          {roomList.map((room) => (
            <div 
              key={room.id} 
              // แก้ไขตรงนี้: เพิ่ม onClick เพื่อส่งไปหน้า room-status
              onClick={() => navigate('/room-detail')} 
              className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-md hover:bg-gray-100 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-black group-hover:text-[#2D2D86] transition-colors">
                  {room.name} | {room.id}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{room.detail}</p>
                <p className="text-gray-400 text-sm">{room.capacity}</p>
              </div>

              <div className="text-gray-300 group-hover:text-[#B4C424] transition-colors">
                <QrCode size={32} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;