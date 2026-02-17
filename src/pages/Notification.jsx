import React, { useState } from "react";
import { 
  X, User, Calendar, Timer, Edit3, Trash2, Save, History, 
  CheckCircle, XCircle, Clock, Ban, MessageSquare 
} from "lucide-react";
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

  // --- ฟังก์ชันจัดการวันที่ให้ตรงกับ Timezone ไทย (ป้องกันวันที่ลดลง 1 วัน) ---
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // ใช้ getFullYear/Month/Date เพื่อดึงค่าตามเวลาเครื่องผู้ใช้ (Local Time)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCloseModal = () => { 
    setSelectedBooking(null); 
    setIsEditing(false); 
  };

  const startEditing = () => {
    if (!selectedBooking) return;
    setEditForm({
      purpose: selectedBooking.purpose || "",
      date: formatDateForDisplay(selectedBooking.date), // ใช้ฟังก์ชันใหม่ตรงนี้
      start_time: selectedBooking.start_time?.slice(0, 5) || "",
      end_time: selectedBooking.end_time?.slice(0, 5) || "",
    });
    setIsEditing(true);
  };

  const onSaveEdit = async () => {
    const bId = selectedBooking.booking_id || selectedBooking.id;
    const result = await handleUpdateBooking(bId, editForm);
    if (result?.success) {
      setIsEditing(false);
      setSelectedBooking(null);
    }
  };

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden relative">
      <Navbar />

      {userRole === "teacher" && (
        <div className="flex px-6 pt-4 gap-2">
          <button onClick={() => setActiveTab("current")} className={`flex-1 py-4 rounded-t-[30px] font-black text-xs transition-all ${activeTab === "current" ? "bg-white text-[#2D2D86]" : "text-white/50"}`}>การจองของฉัน</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-4 rounded-t-[30px] font-black text-xs transition-all ${activeTab === "history" ? "bg-white text-[#2D2D86]" : "text-white/50"}`}>ประวัติการจอง</button>
        </div>
      )}

      <div className={`flex-grow overflow-y-auto bg-white p-6 shadow-2xl pt-8 pb-24 transition-all duration-500 ${userRole === "staff" ? "rounded-t-[50px] mt-4" : "rounded-tr-[50px]"}`}>
        {userRole === "staff" ? (
          <div className="space-y-10">
            <StaffSection title="รออนุมัติ" icon={Clock} data={pendingRequests} color="text-[#B4C424]" getFullName={getFullName} onSelect={setSelectedBooking} variant="pending" />
            <StaffSection title="อนุมัติแล้ว" icon={CheckCircle} data={approvedRequests} color="text-emerald-500" getFullName={getFullName} onSelect={setSelectedBooking} variant="approved" />
            <StaffSection title="ไม่อนุมัติ/ยกเลิก" icon={XCircle} data={historyRequests} color="text-red-500" getFullName={getFullName} onSelect={setSelectedBooking} variant="rejected" />
          </div>
        ) : (
          <div>
            {activeTab === "current" ? (
              <>
                <SectionTitle title="รออนุมัติ" icon={Clock} colorClass="text-[#B4C424]" />
                {pendingRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="pending" getFullName={getFullName} onClick={setSelectedBooking} />)}
                <SectionTitle title="อนุมัติแล้ว" icon={CheckCircle} colorClass="text-emerald-500" />
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

      {/* Modal จัดการการจอง */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-[#2D2D86] italic uppercase">
                {isEditing ? "แก้ไขข้อมูลการจอง" : `ห้อง ${selectedBooking.room_id}`}
              </h3>
              <button onClick={handleCloseModal} className="p-2 bg-gray-100 rounded-full text-gray-400"><X size={20}/></button>
            </div>

            {isEditing ? (
              <div className="space-y-4 mb-8">
                <EditField icon={MessageSquare} label="วัตถุประสงค์" value={editForm.purpose} onChange={v => setEditForm({...editForm, purpose: v})} />
                <EditField icon={Calendar} label="วันที่" type="date" value={editForm.date} onChange={v => setEditForm({...editForm, date: v})} />
                <div className="flex gap-4">
                  <EditField icon={Clock} label="เริ่ม" type="time" value={editForm.start_time} onChange={v => setEditForm({...editForm, start_time: v})} />
                  <EditField icon={Clock} label="สิ้นสุด" type="time" value={editForm.end_time} onChange={v => setEditForm({...editForm, end_time: v})} />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-[#2D2D86] text-white rounded-2xl" onClick={onSaveEdit}><Save size={18} className="mr-2"/>บันทึกการแก้ไข</Button>
                  <Button className="bg-red-200 text-white rounded-2xl px-6" onClick={() => setIsEditing(false)}>ยกเลิก</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  <DetailItem icon={User} label="ผู้ขอใช้" value={getFullName(selectedBooking)} />
                  {/* แสดงวันที่โดยใช้ formatDateForDisplay */}
                  <DetailItem icon={Calendar} label="วันที่" value={formatDateForDisplay(selectedBooking.date)} />
                  <DetailItem icon={Timer} label="เวลา" value={`${selectedBooking.start_time?.slice(0,5)} - ${selectedBooking.end_time?.slice(0,5)}`} />
                  <DetailItem icon={MessageSquare} label="วัตถุประสงค์" value={selectedBooking.purpose} />
                </div>
                <ActionButtons 
                  userRole={userRole} 
                  booking={selectedBooking} 
                  onUpdateStatus={handleUpdateStatus} 
                  onCancel={handleCancelBooking} 
                  onEdit={startEditing} 
                  onClose={handleCloseModal} 
                />
              </>
            )}
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
  const isPending = booking.status === "pending";
  const isApproved = booking.status === "approved";

  return (
    <div className="flex flex-col gap-3">
      {userRole === "staff" && isPending && (
        <div className="flex gap-2">
          <Button className="flex-1 bg-emerald-500 text-white rounded-2xl font-bold py-4" onClick={() => onUpdateStatus(bId, "approved")}>อนุมัติ</Button>
          <Button className="flex-1 bg-red-500 text-white rounded-2xl font-bold py-4" onClick={() => onUpdateStatus(bId, "rejected")}>ไม่อนุมัติ</Button>
        </div>
      )}

      {userRole === "teacher" && (
        <>
          {isPending && (
            <div className="flex flex-col gap-2">
              <Button className="bg-[#B4C424] text-white rounded-2xl font-bold py-4" onClick={onEdit}>
                <Edit3 size={18} className="mr-2 inline"/> แก้ไขข้อมูลการจอง
              </Button>
              <Button className="bg-red-500 text-white rounded-2xl font-bold py-4" onClick={() => onCancel(bId)}>
                <Trash2 size={18} className="mr-2 inline"/> ยกเลิกคำขอจอง
              </Button>
            </div>
          )}
          
          {isApproved && (
            <Button className="bg-red-500 text-white rounded-2xl font-bold py-4" onClick={() => onCancel(bId)}>
              <Ban size={18} className="mr-2 inline"/> งดใช้ห้อง 
            </Button>
          )}
        </>
      )}
      
      <Button variant="ghost" className="text-gray-400 font-bold" onClick={onClose}>ปิดหน้าต่าง</Button>
    </div>
  );
};

export default Notification;