import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

// ... import เหมือนเดิม ...

export const useNotificationLogic = () => {
  const [activeBookings, setActiveBookings] = useState({ pending: [], approved: [] });
  const [historyBookings, setHistoryBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ 1. ย้ายฟังก์ชันนี้มาไว้ใน useCallback หรือเขียนไว้ข้างนอก Export
  const isPastDate = useCallback((dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateStr);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate < today;
  }, []);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.role?.toLowerCase().trim() || "student";
      const myId = decoded?.id || decoded?.sub;
      setUserRole(role);

      // ✅ 2. ยิง 3 เส้นทางที่ถูกต้องตาม Backend (เอา /api ออกถ้า baseURL มีแล้ว)
      // ถ้า baseURL นายคือ .../api ให้ลบ /api ข้างหน้าออกครับ
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        api.get("/bookings/pending"),
        api.get("/bookings/approved"),
        api.get("/bookings/rejected")
      ]);

      const pendingData = pendingRes.data?.data || pendingRes.data || [];
      const approvedData = approvedRes.data?.data || approvedRes.data || [];
      const rejectedData = rejectedRes.data?.data || rejectedRes.data || [];

      // กรองข้อมูล
      const filterByRole = (data) => 
        role === "teacher" 
          ? data.filter(i => i.user_id === myId || i.teacher_id === myId)
          : data;

      const myPending = filterByRole(pendingData);
      const myApproved = filterByRole(approvedData);
      const myRejected = filterByRole(rejectedData);

      setActiveBookings({
        pending: myPending,
        approved: myApproved.filter(i => !isPastDate(i.date))
      });

      const pastApproved = myApproved.filter(i => isPastDate(i.date));
      setHistoryBookings([...pastApproved, ...myRejected]);

    } catch (error) {
      console.error("❌ Fetch Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isPastDate]); // ตอนนี้ isPastDate นิ่งแล้ว ไม่ทำให้เกิด loop

  // --- 🛠️ Action Handlers (เช็คเรื่อง /api ให้ดี) ---
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      // ถ้านายใช้ api instance ที่ตั้ง baseURL ไว้แล้ว ไม่ต้องใส่ /api ซ้ำนะครับ
      await api.put(`/bookings/${bookingId}/status`, { status });
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "อัปเดตสถานะไม่สำเร็จ");
    }
  };

  // ... handleUpdateBooking และ handleCancelBooking แก้ให้ path ตรงเหมือนกัน ...
  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      // 🛑 Check logic: แก้ไขได้เฉพาะรายการที่ยังไม่ถูกอนุมัติ/ปฏิเสธ
      if (selectedBooking?.status !== 'pending') {
        alert("สามารถแก้ไขได้เฉพาะรายการที่รออนุมัติเท่านั้น");
        return;
      }

      // 🚀 ยิงไปที่ Path แก้ไข (อิงตาม Path /bookings/ ที่นายแก้ล่าสุด)
      // Path ใน Backend นายควรจะเป็น: PUT /bookings/:id
      await api.put(`/bookings/${bookingId}`, updatedData);
      
      setSelectedBooking(null); // ปิด Modal/Overlay หลังแก้เสร็จ
      fetchBookings();          // Refresh ข้อมูลใหม่ทันที
      alert("แก้ไขข้อมูลการจองสำเร็จ");
    } catch (error) {
      console.error("❌ Update Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!bookingId) return;
    const confirmMsg = selectedBooking?.status === 'pending' 
      ? "คุณต้องการยกเลิกคำขอใช่หรือไม่?" 
      : "คุณต้องการงดใช้ห้องใช่หรือไม่?";

    if (!window.confirm(confirmMsg)) return;

    try {
      // 🚀 ยิงไปที่ Path ยกเลิก (อิงตาม Path /bookings/ ที่นายแก้ล่าสุด)
      await api.put(`/bookings/${bookingId}/cancel`);
      setSelectedBooking(null);
      fetchBookings();
      alert("ดำเนินการเรียบร้อยแล้ว");
    } catch (error) {
      alert(error.response?.data?.message || "ไม่สามารถยกเลิกได้");
    }
  };

  const getFullName = (req) => {
    if (!req) return "ไม่ระบุชื่อ";
    const first = req.teacher_name || req.name || req.first_name || "";
    const last = req.surname || req.last_name || "";
    return `${first} ${last}`.trim() || "ไม่ระบุชื่อ";
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    pendingRequests: activeBookings.pending,
    approvedRequests: activeBookings.approved,
    historyRequests: historyBookings,
    isLoading,
    userRole,
    selectedBooking,
    setSelectedBooking,
    handleUpdateStatus,
    getFullName,
    fetchBookings
  };
};