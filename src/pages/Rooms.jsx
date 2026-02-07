import React, { useState, useEffect } from 'react';
import { QrCode, ChevronLeft, Home, Calendar, Bell, Search } from 'lucide-react'; // เพิ่มไอคอนที่ขาด
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://dave-unincited-ariyah.ngrok-free.dev/rooms/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setRooms(data);
        } else {
          const text = await response.text();
          console.error("Backend did not return JSON.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      {/* --- Top Navigation Bar --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        
        <div className="flex gap-6 text-white/80">
          <button onClick={() => navigate('/')} className="hover:text-[#B4C424] transition-colors"><Home size={24} /></button>
          <button onClick={() => navigate('/calendar')} className="hover:text-[#B4C424] transition-colors"><Calendar size={24} /></button>
          <button onClick={() => navigate('/notification')} className="hover:text-[#B4C424] transition-colors"><Bell size={24} /></button>
          <button onClick={() => navigate('/scanner')} className="hover:text-[#B4C424] transition-colors"><QrCode size={24} /></button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="min-h-screen bg-[#F8F9FA] p-6">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate(-1)} className="text-[#B4C424] hover:scale-110 transition-transform">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-[#B4C424] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse font-medium">กำลังโหลดข้อมูลห้อง...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rooms.map((room) => (
              <div 
                key={room.room_id} 
                onClick={() => navigate(`/room-detail/${room.room_id}`)}
                className="bg-white rounded-3xl p-5 flex justify-between items-center shadow-sm border border-transparent hover:border-[#B4C424]/30 hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {room.room_id} <span className="text-[#B4C424] mx-1">|</span> {room.room_type}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium">{room.location || "อาคารวิทยาศาสตร์"}</p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] bg-[#B4C424]/10 px-2 py-0.5 rounded-full text-[#B4C424] font-bold">
                       ความจุ {room.capacity} ที่นั่ง
                     </span>
                  </div>
                </div>

                <div className="text-gray-300 group-hover:text-[#B4C424] transition-colors bg-gray-50 p-3 rounded-2xl">
                  <QrCode size={32} strokeWidth={1.5} />
                </div>
              </div>
            ))}
            
            {rooms.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-300 italic">ไม่พบข้อมูลห้องเรียนในฐานข้อมูล</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 text-sm text-[#B4C424] font-bold underline"
                >
                  ลองโหลดใหม่อีกครั้ง
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Rooms;