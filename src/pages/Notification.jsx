import React, { useState } from "react";
import { CheckCircle, XCircle, Clock as ClockIcon, Ban, History, Trash2 } from "lucide-react";
import { useNotificationLogic } from "../hooks/useNotificationLogic.js";
import { BookingCard, SectionTitle } from "../components/notification/NotificationComponents.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ActionModal from "../components/common/ActionModal";
import BookingDetailModal from "../components/notification/BookingDetailModal";

const Notification = () => {
  const {
    pendingRequests, approvedRequests, historyRequests, userRole,
    selectedBooking, setSelectedBooking, handleUpdateStatus,
    handleUpdateBooking, handleCancelBooking, getFullName
  } = useNotificationLogic();

  const [activeTab, setActiveTab] = useState("current");

  // State สำหรับจัดการ Alert (Pop-up ยืนยัน และ แจ้งผลสำเร็จ/ไม่สำเร็จ)
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false, title: "", icon: null, onConfirm: null, showConfirm: true,
  });

  const showAlert = (title, icon, onConfirm = null, showConfirm = true) => {
    setAlertConfig({
      isOpen: true, 
      title, 
      icon, 
      onConfirm: onConfirm || (() => setAlertConfig(prev => ({ ...prev, isOpen: false }))), 
      showConfirm,
    });
  };

  // 🔴 ฟังก์ชันจัดการ "งดใช้ห้อง" (กรณีอนุมัติแล้ว)
  const handleBanClick = (bookingId) => {
    showAlert(
      "คุณแน่ใจหรือไม่ที่จะงดการใช้ห้องนี้?",
      <Ban size={50} className="text-red-500" />,
      async () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false })); // ปิดหน้าต่างยืนยันก่อน
        const result = await handleCancelBooking(bookingId); // เรียก API
        
        // รอให้ Modal ยืนยันปิดสนิทก่อน ค่อยแสดงผลลัพธ์
        setTimeout(() => {
          if (result?.success) {
            // ✨ ลบ result.message || ออกไปเลยครับ ให้เหลือแค่นี้:
            showAlert("งดใช้ห้องสำเร็จ", <CheckCircle size={50} className="text-green-500" />, null, false);
            setSelectedBooking(null);
          } else {
            showAlert("ไม่สำเร็จ: " + (result?.message || ""), <XCircle size={50} className="text-red-500" />, null, false);
          }
        }, 150);
      }
    );
  };

  // 🔴 ฟังก์ชันจัดการ "ยกเลิกคำขอจอง" (กรณีรออนุมัติ)
  const handleCancelClick = (bookingId) => {
    showAlert(
      "คุณแน่ใจหรือไม่ที่จะยกเลิกคำขอจองนี้?",
      <Trash2 size={50} className="text-red-500" />,
      async () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false })); // ปิดหน้าต่างยืนยันก่อน
        const result = await handleCancelBooking(bookingId); // เรียก API
        
        // รอให้ Modal ยืนยันปิดสนิทก่อน ค่อยแสดงผลลัพธ์
        setTimeout(() => {
          if (result?.success) {
            showAlert(result.message || "ยกเลิกคำขอสำเร็จ", <CheckCircle size={50} className="text-green-500" />, null, false);
            setSelectedBooking(null);
          } else {
            showAlert("ไม่สำเร็จ: " + (result?.message || ""), <XCircle size={50} className="text-red-500" />, null, false);
          }
        }, 150);
      }
    );
  };

  return (
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden relative font-sans">
      <Navbar />

      {/* Tabs สำหรับ Teacher */}
      {userRole === "teacher" && (
        <div className="flex px-4 sm:px-6 pt-4 gap-2">
          <button onClick={() => setActiveTab("current")} className={`flex-1 py-3 sm:py-4 rounded-t-[30px] font-bold text-sm ${activeTab === "current" ? "bg-[#FFFFFF] text-[#302782]" : "text-[#FFFFFF]/50"}`}>การจองของฉัน</button>
          <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 sm:py-4 rounded-t-[30px] font-bold text-sm ${activeTab === "history" ? "bg-[#FFFFFF] text-[#302782]" : "text-[#FFFFFF]/50"}`}>ประวัติการจอง</button>
        </div>
      )}

      {/* Main Content Area (เอา Scrollbar ออก ปล่อยให้มันลื่นๆ เนียนๆ) */}
      <div className={`flex-grow overflow-y-auto bg-[#FFFFFF] p-4 sm:p-6 shadow-2xl pt-6 sm:pt-8 pb-24 ${userRole === "staff" ? "rounded-t-[50px] mt-4" : "rounded-tr-[50px]"}`}>
        {userRole === "staff" ? (
          <div className="space-y-8">
            <StaffSection title="รออนุมัติ" icon={ClockIcon} data={pendingRequests} color="text-[#302782]" getFullName={getFullName} onSelect={setSelectedBooking} variant="pending" />
            <StaffSection title="อนุมัติแล้ว" icon={CheckCircle} data={approvedRequests} color="text-[#B2BB1E]" getFullName={getFullName} onSelect={setSelectedBooking} variant="approved" />
            {/* ✨ แนบ isHistory: true ไปด้วยเพื่อให้ Modal รู้และซ่อนปุ่ม */}
            <StaffSection title="ไม่อนุมัติ/ยกเลิก" icon={XCircle} data={historyRequests} color="text-gray-400" getFullName={getFullName} onSelect={(b) => setSelectedBooking({...b, isHistory: true})} variant="rejected" />
          </div>
        ) : (
          <div>
            {activeTab === "current" ? (
              <>
                <SectionTitle title="รออนุมัติ" icon={ClockIcon} colorClass="text-[#302782]" />
                {pendingRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="pending" getFullName={getFullName} onClick={setSelectedBooking} />)}
                <SectionTitle title="อนุมัติแล้ว" icon={CheckCircle} colorClass="text-[#B2BB1E]" />
                {approvedRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="approved" getFullName={getFullName} onClick={setSelectedBooking} />)}
              </>
            ) : (
              <>
                <SectionTitle title="ประวัติการจอง" icon={History} colorClass="text-gray-400" />
                {/* ✨ แนบ isHistory: true ไปด้วยเพื่อให้ Modal รู้และซ่อนปุ่ม */}
                {historyRequests.map(req => <BookingCard key={req.booking_id || req.id} req={req} variant="rejected" getFullName={getFullName} onClick={(b) => setSelectedBooking({...b, isHistory: true})} />)}
              </>
            )}
          </div>
        )}
      </div>

      {/* 🟢 Modal แสดงรายละเอียดและแก้ไขการจอง (แยกไฟล์ไปแล้ว) */}
      {selectedBooking && (
        <BookingDetailModal 
          booking={selectedBooking}
          userRole={userRole}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleUpdateStatus}
          onCancel={handleCancelClick} // ใช้ฟังก์ชันที่มี Pop-up แทน
          onBan={handleBanClick}       // ใช้ฟังก์ชันที่มี Pop-up แทน
          onUpdateBooking={handleUpdateBooking}
          getFullName={getFullName}
          showAlert={showAlert}        // ส่งฟังก์ชันเรียก Pop-up ให้ Modal ใช้ตอนบันทึกแก้ไข
        />
      )}

      {/* 🟢 Alert Modal สำหรับแสดงข้อความ ยืนยัน/สำเร็จ/ผิดพลาด */}
      {alertConfig.isOpen && (
        <ActionModal
          icon={alertConfig.icon}
          title={alertConfig.title}
          showConfirm={alertConfig.showConfirm}
          onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </div>
  );
};

// Sub-component สำหรับจัดกลุ่ม UI ของ Staff
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