import React, { useState } from "react";
import { X, User, Calendar, Timer, Edit3, Trash2, Save, Ban, MessageSquare, CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";
import { DetailItem, EditField } from "./NotificationComponents";
import Button from "../common/Button";

const BookingDetailModal = ({ 
  booking, userRole, onClose, onUpdateStatus, onCancel, onBan, onUpdateBooking, getFullName, showAlert 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ purpose: "", date: "", start_time: "", end_time: "" });

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const startEditing = () => {
    setEditForm({
      purpose: booking.purpose || "",
      date: formatDateForDisplay(booking.date),
      start_time: booking.start_time?.slice(0, 5) || "",
      end_time: booking.end_time?.slice(0, 5) || "",
    });
    setIsEditing(true);
  };

  const onSaveEdit = async () => {
    const bId = booking.booking_id || booking.id;
    const result = await onUpdateBooking(bId, editForm);
    if (result?.success) {
      setIsEditing(false);
      onClose();
      showAlert("บันทึกการแก้ไขสำเร็จ", <CheckCircle size={50} className="text-[#B2BB1E]" />, null, false);
    } else {
      showAlert("แก้ไขไม่สำเร็จ", <XCircle size={50} />, null, false, "danger");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FFFFFF] w-full max-w-md md:max-w-lg rounded-[32px] p-5 sm:p-7 flex flex-col shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-[#302782]">{isEditing ? "แก้ไขข้อมูล" : `ห้อง ${booking.room_id}`}</h3>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20}/></button>
        </div>

        <div className="flex-grow space-y-3 mb-2">
          {isEditing ? (
            <div className="space-y-3 pb-2">
              <EditField icon={MessageSquare} label="วัตถุประสงค์" value={editForm.purpose} onChange={v => setEditForm({...editForm, purpose: v})} />
              <EditField icon={Calendar} label="วันที่" type="date" value={editForm.date} onChange={v => setEditForm({...editForm, date: v})} />
              <div className="flex gap-3">
                <EditField icon={ClockIcon} label="เริ่ม" type="time" value={editForm.start_time} onChange={v => setEditForm({...editForm, start_time: v})} />
                <EditField icon={ClockIcon} label="สิ้นสุด" type="time" value={editForm.end_time} onChange={v => setEditForm({...editForm, end_time: v})} />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              <DetailItem icon={User} label="ผู้ขอใช้" value={getFullName(booking)} />
              <DetailItem icon={Calendar} label="วันที่" value={formatDateForDisplay(booking.date)} />
              <DetailItem icon={Timer} label="เวลา" value={`${booking.start_time?.slice(0,5)} - ${booking.end_time?.slice(0,5)}`} />
              <DetailItem icon={MessageSquare} label="วัตถุประสงค์" value={booking.purpose} />
            </div>
          )}
        </div>

        {!booking.isHistory && (
          <div className="pt-3 border-t border-gray-100 flex-shrink-0 mt-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button className="flex-1 bg-[#302782] text-white rounded-2xl py-3 font-bold" onClick={onSaveEdit}><Save size={18} className="mr-2 inline"/> บันทึก</Button>
                <Button className="bg-gray-200 text-gray-600 rounded-2xl px-6 py-3 font-bold" onClick={() => setIsEditing(false)}>ยกเลิก</Button>
              </div>
            ) : (
              <ActionButtons userRole={userRole} booking={booking} onUpdateStatus={onUpdateStatus} onCancel={onCancel} onBan={onBan} onEdit={startEditing} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButtons = ({ userRole, booking, onUpdateStatus, onCancel, onBan, onEdit }) => {
  const bId = booking.booking_id || booking.id;
  const isPending = booking.status === "pending";
  const isApproved = booking.status === "approved";

  return (
    <div className="flex flex-col gap-2">
      {userRole === "staff" && isPending && (
        <div className="flex gap-3">
          <Button className="flex-1 bg-[#B2BB1E] text-white rounded-2xl font-bold py-3.5 active:scale-95 transition-all" onClick={() => onUpdateStatus(bId)}>อนุมัติ</Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold py-3.5 shadow-lg shadow-red-100 active:scale-95 transition-all" onClick={() => onCancel(bId)}>ไม่อนุมัติ</Button>
        </div>
      )}
      {((userRole === "staff" || userRole === "teacher") && isApproved) && (
        <Button className="w-full bg-red-500 text-white rounded-2xl font-bold py-3.5 active:scale-95 transition-all" onClick={() => onBan(bId)}>
          <Ban size={18} className="mr-2 inline"/> งดใช้ห้อง
        </Button>
      )}
      {userRole === "teacher" && isPending && (
        <>
          <Button className="w-full bg-[#302782] text-white rounded-2xl font-bold py-3.5" onClick={onEdit}><Edit3 size={18} className="mr-2 inline"/> แก้ไขข้อมูล</Button>
          <Button className="w-full bg-gray-100 text-gray-500 hover:text-red-500 rounded-2xl font-bold py-3.5 transition-colors" onClick={() => onCancel(bId)}><Trash2 size={18} className="mr-2 inline"/> ยกเลิกคำขอ</Button>
        </>
      )}
    </div>
  );
};

export default BookingDetailModal;