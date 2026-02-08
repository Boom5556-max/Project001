import React from "react";
import { X, User, Calendar, Timer, Clock } from "lucide-react";
import { useNotificationLogic } from "../hooks/useNotificationLogic.js";
import { BookingCard, SectionTitle } from "../components/ืืืืืnotification/NotificationComponents.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";

const Notification = () => {
  const {
    pendingRequests, approvedRequests, rejectedRequests,
    isLoading, userRole, selectedBooking, setSelectedBooking,
    handleUpdateStatus, getFullName
  } = useNotificationLogic();

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans relative">
      
      {/* --- Modal Details --- */}
      {selectedBooking && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-5xl font-black text-[#2D2D86] italic uppercase">
                ห้อง {selectedBooking.room_id}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)} className="bg-gray-50 text-gray-400">
                <X size={24} />
              </Button>
            </div>
            <p className="text-[#B4C424] font-black uppercase tracking-widest text-xs mb-8">Booking Details</p>

            <div className="space-y-4 mb-10">
              <DetailItem icon={User} label="ผู้ขอใช้ห้อง" value={getFullName(selectedBooking)} />
              <DetailItem icon={Calendar} label="วันที่ใช้งาน" value={formatThaiDate(selectedBooking.date)} />
              <DetailItem icon={Timer} label="ช่วงเวลา" value={`${selectedBooking.start_time?.slice(0, 5)} - ${selectedBooking.end_time?.slice(0, 5)} น.`} />
            </div>

            {userRole === "staff" && selectedBooking.status === "pending" && (
              <div className="flex gap-3 mb-6">
                <Button variant="secondary" size="lg" className="flex-grow shadow-xl" 
                        onClick={() => handleUpdateStatus(selectedBooking.booking_id, "approved")}>Approve</Button>
                <Button variant="dangerLight" size="lg" className="px-8 shadow-none"
                        onClick={() => handleUpdateStatus(selectedBooking.booking_id, "rejected")}>Reject</Button>
              </div>
            )}
            <button onClick={() => setSelectedBooking(null)} className="w-full py-2 text-gray-300 font-bold text-xs uppercase tracking-[0.3em]">Tap to dismiss</button>
          </div>
        </div>
      )}

      <Navbar />

      <div className="flex-grow overflow-y-auto bg-white rounded-t-[50px] p-6 shadow-2xl pt-8">
        {/* ส่วนที่ 1: รออนุมัติ */}
        <section className="mb-10">
          <SectionTitle title="รออนุมัติ" icon={Clock} colorClass="text-[#B4C424]" />
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <BookingCard key={req.booking_id} req={req} variant="pending" getFullName={getFullName} onClick={setSelectedBooking} />
            ))}
          </div>
        </section>

        {/* ส่วนที่ 2: อนุมัติแล้ว */}
        <section className="mb-8">
          <h2 className="text-emerald-500 text-[10px] font-black uppercase mb-4 ml-4 tracking-widest">อนุมัติแล้ว</h2>
          <div className="space-y-3">
            {approvedRequests.map(req => (
              <BookingCard key={req.booking_id} req={req} variant="approved" getFullName={getFullName} onClick={setSelectedBooking} />
            ))}
          </div>
        </section>

        {/* ส่วนที่ 3: ไม่อนุมัติ */}
        <section className="mb-12">
          <h2 className="text-red-400 text-[10px] font-black uppercase mb-4 ml-4 tracking-widest">ไม่อนุมัติ</h2>
          <div className="space-y-3 pb-10">
            {rejectedRequests.map(req => (
              <BookingCard key={req.booking_id} req={req} variant="rejected" getFullName={getFullName} onClick={setSelectedBooking} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper components ภายในไฟล์
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
    <div className="bg-white p-3 rounded-2xl text-[#2D2D86] shadow-sm"><Icon size={18} /></div>
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">{label}</p>
      <p className="text-[#2D2D86] font-black text-lg">{value}</p>
    </div>
  </div>
);

const formatThaiDate = (dateStr) => {
  if (!dateStr) return "---";
  // ตรงนี้ถ้าวันที่วาร์ป อย่าลืมใช้ Logic +7 ชม. ที่เราคุยกันตอนแรกนะครับ
  return new Date(dateStr).toLocaleDateString("th-TH", { dateStyle: "full" });
};

export default Notification;