import React from 'react';
import { Home, Calendar, Bell, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  // ข้อมูลจำลองรายการแจ้งเตือน
  const pendingRequests = [
    { id: 1, room: '26504', user: 'จิรวรรณ เจริญสุข', objective: 'นัดคุยเรื่องสหกิจศึกษา', date: '1 ธันวาคม 2568', duration: '13.00 - 14.00' },
    { id: 2, room: '26504', user: 'จิรวรรณ เจริญสุข', objective: 'นัดคุยเรื่องสหกิจศึกษา', date: '16 มกราคม 2568', duration: '13.00 - 14.00' },
  ];

  const approvedRequests = [
    { id: 3, room: '26504', user: 'จิรวรรณ เจริญสุข', objective: 'นัดคุยเรื่องสหกิจศึกษา', date: '1 มกราคม 2568', duration: '13.00 - 14.00', approvedAt: '1 มกราคม 2568' },
  ];
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      {/* --- Top Navigation Bar --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-5 flex justify-between items-center shadow-lg flex-none sticky top-0 z-50">
        <h1 className="text-[#B4C424] text-4xl font-bold">Notification</h1>
        
        <div className="flex gap-6 text-white/80">
            <button onClick={() => navigate('/dashboard')} className="hover:text-[#B4C424]"><Home size={24} /></button>
            <button onClick={() => navigate('/calendar')} className="hover:text-[#B4C424]"><Calendar size={24} /></button>
            <button onClick={() => navigate('/notification')} className="text-[#B4C424]"><Bell size={24} /></button>
            <button onClick={() => navigate('/Qrscanner')} className="hover:text-[#B4C424]"><QrCode size={24} /></button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-4 flex-grow overflow-y-auto bg-white rounded-t-[40px] -mt-4 z-10">
        
        {/* ส่วนที่ 1: คำขอที่รออนุมัติ */}
        <section className="mb-8">
          <h2 className="text-gray-400 text-xl mb-4 ml-2">คำขอที่รออนุมัติ</h2>
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-gray-500 space-y-1 text-sm">
                  <p><span className="font-semibold">ห้อง :</span> {req.room}</p>
                  <p><span className="font-semibold">ผู้ขอใช้ :</span> {req.user}</p>
                  <p><span className="font-semibold">วัตถุประสงค์ :</span> {req.objective}</p>
                  <p><span className="font-semibold">วันที่ :</span> {req.date}</p>
                  <p><span className="font-semibold">ระยะเวลา :</span> {req.duration}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="bg-[#B4C424] text-white px-4 py-1 rounded-md text-xs font-bold hover:opacity-80">accept</button>
                  <button className="bg-[#CC2222] text-white px-4 py-1 rounded-md text-xs font-bold hover:opacity-80">reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ส่วนที่ 2: คำขอที่อนุมัติแล้ว */}
        <section>
          <h2 className="text-gray-400 text-xl mb-4 ml-2">คำขอที่อนุมัติแล้ว</h2>
          <div className="space-y-4">
            {approvedRequests.map((req) => (
              <div key={req.id} className="bg-[#D9E396] p-5 rounded-xl border border-[#B4C424]/20 shadow-sm relative">
                <div className="text-[#2D2D86]/80 space-y-1 text-sm font-medium">
                  <p>ห้อง : {req.room}</p>
                  <p>ผู้ขอใช้ : {req.user}</p>
                  <p>วัตถุประสงค์ : {req.objective}</p>
                  <p>วันที่ : {req.date}</p>
                  <p>ระยะเวลา : {req.duration}</p>
                </div>
                <p className="text-[10px] text-[#2D2D86]/60 text-right mt-2 italic">อนุมัติเมื่อ {req.approvedAt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

    
    </div>
  );
};

export default Notification;