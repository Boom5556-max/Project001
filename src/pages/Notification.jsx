import React, { useState } from "react";
import { CheckCircle, XCircle, Clock as ClockIcon, Ban, History, Trash2 } from "lucide-react";
import { useNotificationLogic } from "../hooks/useNotificationLogic.js";
import { BookingCard, SectionTitle } from "../components/notification/NotificationComponents.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ActionModal from "../components/common/ActionModal";
import BookingDetailModal from "../components/notification/BookingDetailModal";

const isPastDate = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingDate = new Date(dateString);
  bookingDate.setHours(0, 0, 0, 0);
  return bookingDate < today;
};

const Notification = () => {
  const {
    pendingRequests, approvedRequests, historyRequests, userRole,
    selectedBooking, setSelectedBooking, handleUpdateStatus,
    handleUpdateBooking, handleCancelBooking, getFullName
  } = useNotificationLogic();

  const [activeTab, setActiveTab] = useState("current");
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false, title: "", icon: null, onConfirm: null, showConfirm: true, variant: "primary"
  });

  const showAlert = (title, icon, onConfirm = null, showConfirm = true, variant = "primary") => {
    setAlertConfig({
      isOpen: true, title, icon, showConfirm, variant,
      onConfirm: onConfirm || (() => setAlertConfig(prev => ({ ...prev, isOpen: false }))),
    });
  };

  // ✅ ฟังก์ชัน "อนุมัติ" แบบปิด Modal ทันที
  const handleApproveClick = (bookingId) => {
    showAlert(
      "คุณต้องการอนุมัติคำขอนี้ใช่หรือไม่?",
      <CheckCircle size={50} className="text-[#B2BB1E]" />,
      async () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
        setSelectedBooking(null); // ✨ ปิด Modal รายละเอียดทันที

        const result = await handleUpdateStatus(bookingId, "approved");
        
        setTimeout(() => {
          if (result?.success) {
            showAlert("อนุมัติสำเร็จ", <CheckCircle size={50} className="text-green-500" />, null, false);
          } else {
            showAlert("เกิดข้อผิดพลาด", <XCircle size={50} className="text-red-500" />, null, false, "danger");
          }
        }, 150);
      }
    );
  };

  // 🔴 ฟังก์ชัน "ไม่อนุมัติ/ยกเลิก" แบบปิด Modal ทันที
  const handleCancelClick = (bookingId) => {
    showAlert(
      "คุณแน่ใจหรือไม่ที่จะปฏิเสธ/ยกเลิกคำขอนี้?",
      <Trash2 size={50} className="text-red-500" />,
      async () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false })); 
        setSelectedBooking(null); // ✨ ปิด Modal รายละเอียดทันที

        const result = await handleCancelBooking(bookingId); 
        
        setTimeout(() => {
          if (result?.success) {
            showAlert("ทำรายการสำเร็จ", <CheckCircle size={50} className="text-green-500" />, null, false);
          } else {
            showAlert("ไม่สำเร็จ", <XCircle size={50} className="text-red-500" />, null, false, "danger");
          }
        }, 150);
      },
      true, "danger"
    );
  };

  const handleBanClick = (bookingId) => {
    showAlert(
      "คุณแน่ใจหรือไม่ที่จะงดการใช้ห้องนี้?",
      <Ban size={50} className="text-red-500" />,
      async () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false })); 
        setSelectedBooking(null); // ✨ ปิด Modal รายละเอียด
        const result = await handleCancelBooking(bookingId); 
        setTimeout(() => {
          if (result?.success) {
            showAlert("ทำรายการสำเร็จ", <CheckCircle size={50} className="text-green-500" />, null, false);
          } else {
            showAlert("ไม่สำเร็จ", <XCircle size={50} className="text-red-500" />, null, false, "danger");
          }
        }, 150);
      },
      true, "danger"
    );
  };

  return (
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden relative font-sans">
      <Navbar />
      {userRole === "teacher" && (
        <div className="flex px-4 sm:px-6 pt-4 gap-2">
          <button onClick={() => setActiveTab("current")} className={`flex-1 py-3 sm:py-4 rounded-t-[30px] font-bold text-sm transition-colors ${activeTab === "current" ? "bg-[#FFFFFF] text-[#302782]" : "bg-[#FFFFFF]/10 text-[#FFFFFF] hover:bg-[#FFFFFF]/20"}`}>การจองของฉัน</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 sm:py-4 rounded-t-[30px] font-bold text-sm transition-colors ${activeTab === "history" ? "bg-[#FFFFFF] text-[#302782]" : "bg-[#FFFFFF]/10 text-[#FFFFFF] hover:bg-[#FFFFFF]/20"}`}>ประวัติการจอง</button>
        </div>
      )}

      <div className={`flex-grow overflow-y-auto bg-[#FFFFFF] p-4 sm:p-6 shadow-2xl pt-6 sm:pt-8 pb-24 ${userRole === "staff" ? "rounded-t-[50px] mt-4" : "rounded-b-[50px]"}`}>
        {userRole === "staff" ? (
          <div className="space-y-8">
            <StaffSection title="รออนุมัติ" icon={ClockIcon} data={pendingRequests} color="text-[#302782]" getFullName={getFullName} onSelect={setSelectedBooking} variant="pending" />
            <StaffSection title="อนุมัติแล้ว" icon={CheckCircle} data={approvedRequests} color="text-[#B2BB1E]" getFullName={getFullName} onSelect={(b) => setSelectedBooking({...b, isHistory: isPastDate(b.booking_date || b.date)})} variant="approved" />
            <StaffSection title="ไม่อนุมัติ/ยกเลิก" icon={XCircle} data={historyRequests} color="text-gray-400" getFullName={getFullName} onSelect={(b) => setSelectedBooking({...b, isHistory: true})} variant="rejected" />
          </div>
        ) : (
          <div>
            {activeTab === "current" ? (
              <>
                <SectionTitle title="รออนุมัติ" icon={ClockIcon} colorClass="text-[#302782]" />
                {pendingRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="pending" getFullName={getFullName} onClick={setSelectedBooking} />)}
                <SectionTitle title="อนุมัติแล้ว" icon={CheckCircle} colorClass="text-[#B2BB1E]" />
                {approvedRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="approved" getFullName={getFullName} onClick={(b) => setSelectedBooking({...b, isHistory: isPastDate(b.booking_date || b.date)})} />)}
              </>
            ) : (
              <>
                <SectionTitle title="ประวัติการจอง" icon={History} colorClass="text-gray-400" />
                {historyRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="rejected" getFullName={getFullName} onClick={(b) => setSelectedBooking({...b, isHistory: true})} />)}
              </>
            )}
          </div>
        )}
      </div>

      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking} userRole={userRole} onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleApproveClick} onCancel={handleCancelClick} onBan={handleBanClick}
          onUpdateBooking={handleUpdateBooking} getFullName={getFullName} showAlert={showAlert}
        />
      )}

      {alertConfig.isOpen && (
        <ActionModal
          icon={alertConfig.icon} title={alertConfig.title} showConfirm={alertConfig.showConfirm}
          variant={alertConfig.variant}
          onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
        />
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
      )) : <p className="text-gray-400 text-sm text-center py-2">ไม่มีรายการ</p>}
    </div>
  </section>
);

export default Notification;