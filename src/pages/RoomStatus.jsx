import React, { useState, useEffect, useCallback } from 'react';
import { Home, Calendar, QrCode, Loader2, AlertCircle, ArrowLeft, Clock, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`https://dave-unincited-ariyah.ngrok-free.dev/bookings/${id}`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('ไม่พบข้อมูลห้องเรียนนี้ในระบบ');
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      }

      const data = await response.json();
      setRoomData(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchRoomStatus();
  }, [fetchRoomStatus, id]);

  // Helper: ตรวจสอบว่าห้องว่างหรือไม่จาก status_label
  const checkIfAvailable = () => {
    if (!roomData) return false;
    // ปรับตาม JSON: ถ้า status_label คือ "ว่าง" จะเป็น true
    return roomData.status_label === "ว่าง";
  };

  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('th-TH', options);
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#2D2D86]">
      <Loader2 className="animate-spin text-[#B4C424] mb-4" size={50} />
      <p className="text-white font-black italic tracking-widest animate-pulse">SYNCING DATA...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black text-[#2D2D86] uppercase italic">Error Occurred</h2>
      <p className="text-gray-500 mt-2 mb-8 font-bold">{error}</p>
      <button onClick={() => navigate('/scanner')} className="w-full max-w-xs bg-[#2D2D86] text-white py-4 rounded-2xl font-black">BACK TO SCANNER</button>
    </div>
  );

  if (!roomData) return null;

  const isAvailable = checkIfAvailable();

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white bg-white/10 p-2 rounded-xl"><ArrowLeft size={24} /></button>
        <h1 className="text-white text-xl font-black italic tracking-tighter uppercase">Room <span className="text-[#B4C424]">Status</span></h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-white/70"><Home size={24} /></button>
          <button onClick={() => navigate('/scanner')} className="text-[#B4C424]"><QrCode size={24} /></button>
        </div>
      </div>

      {/* Content Area */}
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
              <div className={`px-6 py-3 rounded-2xl text-white text-lg font-black shadow-lg italic transition-all ${isAvailable ? 'bg-[#B4C424] rotate-2' : 'bg-[#EF4444] -rotate-2'}`}>
                {isAvailable ? 'AVAILABLE' : 'BUSY'}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#2D2D86]/30 uppercase tracking-[0.4em]">Reservation Detail ({roomData.total_bookings})</h4>
              
              {roomData.schedule && roomData.schedule.length > 0 ? (
                roomData.schedule.map((item) => (
                  <div key={item.booking_id} className="relative pl-6 border-l-2 border-[#B4C424] pb-2">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#B4C424]"></div>
                    
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-[#2D2D86]" />
                            <p className="text-sm font-black text-[#2D2D86]">{item.full_name}</p>
                        </div>
                        <div className="bg-[#2D2D86] text-[#B4C424] px-3 py-1 rounded-lg text-[10px] font-black">
                            {item.start_time} - {item.end_time}
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                        <Clock size={10} /> Purpose
                      </p>
                      <p className="text-sm font-bold text-gray-600 italic leading-tight">"{item.purpose}"</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center bg-white rounded-[30px] border-2 border-dashed border-gray-100">
                  <p className="text-gray-300 font-black italic uppercase text-xs">No active bookings for today</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <button 
            onClick={() => isAvailable ? navigate(`/bookingroom/${id}`) : null}
            disabled={!isAvailable}
            className={`w-full py-5 rounded-[25px] font-black text-xl shadow-xl transition-all uppercase italic tracking-tighter ${
              isAvailable 
              ? 'bg-[#B4C424] text-[#2D2D86] active:scale-95 shadow-[0_10px_20px_rgba(180,196,36,0.3)]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Book Room Now' : 'Room Currently Occupied'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomStatus;