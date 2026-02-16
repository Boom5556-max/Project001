import React, { useState } from "react";
import { X, User, Calendar, Timer, Clock, Edit3, Trash2, Save, MessageSquare, History, CheckCircle, XCircle } from "lucide-react";
import { useNotificationLogic } from "../hooks/useNotificationLogic.js";
import { BookingCard, SectionTitle, DetailItem, EditField } from "../components/notification/NotificationComponents.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";

const Notification = () => {
  const {
    pendingRequests, approvedRequests, historyRequests, userRole,
    selectedBooking, setSelectedBooking, handleUpdateStatus,
    handleUpdateBooking, handleCancelBooking, getFullName
  } = useNotificationLogic();

  const [activeTab, setActiveTab] = useState("current");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ purpose: "", date: "", start_time: "", end_time: "" });

  const handleCloseModal = () => { setSelectedBooking(null); setIsEditing(false); };

  const startEditing = () => {
    if (!selectedBooking) return;
    setEditForm({
      purpose: selectedBooking.purpose || "",
      date: selectedBooking.date ? new Date(selectedBooking.date).toISOString().split('T')[0] : "",
      start_time: selectedBooking.start_time?.slice(0, 5) || "",
      end_time: selectedBooking.end_time?.slice(0, 5) || "",
    });
    setIsEditing(true);
  };

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden relative">
      <Navbar />

      {userRole === "teacher" && (
        <div className="flex px-6 pt-4 gap-2">
          <button onClick={() => setActiveTab("current")} className={`flex-1 py-4 rounded-t-[30px] font-black text-xs ${activeTab === "current" ? "bg-white text-[#2D2D86]" : "text-white/50"}`}>การจองของฉัน</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-4 rounded-t-[30px] font-black text-xs ${activeTab === "history" ? "bg-white text-[#2D2D86]" : "text-white/50"}`}>ประวัติการจอง</button>
        </div>
      )}

      <div className={`flex-grow overflow-y-auto bg-white p-6 shadow-2xl pt-8 pb-24 ${userRole === "staff" ? "rounded-t-[50px] mt-4" : "rounded-tr-[50px]"}`}>
        {userRole === "staff" ? (
          <div className="space-y-10">
            <StaffSection title="รออนุมัติ" icon={Clock} data={pendingRequests} color="text-[#B4C424]" getFullName={getFullName} onSelect={setSelectedBooking} variant="pending" />
            <StaffSection title="อนุมัติแล้ว" icon={CheckCircle} data={approvedRequests} color="text-emerald-500" getFullName={getFullName} onSelect={setSelectedBooking} variant="approved" />
            <StaffSection title="ไม่อนุมัติ" icon={XCircle} data={historyRequests} color="text-red-500" getFullName={getFullName} onSelect={setSelectedBooking} variant="rejected" />
          </div>
        ) : (
          <div>
            {activeTab === "current" ? (
              <>
                <SectionTitle title="รออนุมัติ" icon={Clock} colorClass="text-[#B4C424]" />
                {pendingRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="pending" getFullName={getFullName} onClick={setSelectedBooking} />)}
                <SectionTitle title="อนุมัติแล้ว" icon={Calendar} colorClass="text-emerald-500" />
                {approvedRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="approved" getFullName={getFullName} onClick={setSelectedBooking} />)}
              </>
            ) : (
              <>
                <SectionTitle title="ประวัติการจอง" icon={History} colorClass="text-gray-400" />
                {historyRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="rejected" getFullName={getFullName} onClick={setSelectedBooking} />)}
              </>
            )}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-2xl font-bold text-[#2D2D86] mb-6">ห้อง {selectedBooking.room_id}</h3>
            <div className="space-y-4 mb-8">
              <DetailItem icon={User} label="ผู้ขอใช้" value={getFullName(selectedBooking)} />
              <DetailItem icon={Calendar} label="วันที่" value={selectedBooking.date?.split('T')[0]} />
              <DetailItem icon={Timer} label="เวลา" value={`${selectedBooking.start_time?.slice(0,5)} - ${selectedBooking.end_time?.slice(0,5)}`} />
            </div>
            <ActionButtons userRole={userRole} booking={selectedBooking} onUpdateStatus={handleUpdateStatus} onCancel={handleCancelBooking} onEdit={startEditing} onClose={() => setSelectedBooking(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

const StaffSection = ({ title, icon, data, color, getFullName, onSelect, variant }) => (
  <section>
    <SectionTitle title={title} icon={icon} colorClass={color} />
    <div className="space-y-3">
      {data.length > 0 ? data.map(req => (
        <BookingCard key={req.booking_id || req.id} req={req} variant={variant} getFullName={getFullName} onClick={onSelect} />
      )) : <p className="text-gray-400 italic text-sm text-center py-2">ไม่มีรายการ</p>}
    </div>
  </section>
);

const ActionButtons = ({ userRole, booking, onUpdateStatus, onCancel, onEdit, onClose }) => {
  const bId = booking.booking_id || booking.id;
  return (
    <div className="flex flex-col gap-3">
      {userRole === "staff" && booking.status === "pending" && (
        <div className="flex gap-2">
          <Button className="flex-1 bg-emerald-500 text-white" onClick={() => onUpdateStatus(bId, "approved")}>อนุมัติ</Button>
          <Button className="flex-1 bg-red-500 text-white" onClick={() => onUpdateStatus(bId, "rejected")}>ไม่อนุมัติ</Button>
        </div>
      )}
      {userRole === "teacher" && booking.status === "pending" && (
        <Button variant="outline" onClick={onEdit}>แก้ไขข้อมูล</Button>
      )}
      <Button variant="ghost" onClick={onClose}>ปิดหน้าต่าง</Button>
    </div>
  );
};

export default Notification;