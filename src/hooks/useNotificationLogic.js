import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export const useNotificationLogic = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.role?.toLowerCase().trim() || "teacher";
      setUserRole(role);

      if (role === "staff") {
        const [pRes, aRes, rRes] = await Promise.all([
          api.get("/bookings/pending"),
          api.get("/bookings/approved"),
          api.get("/bookings/rejected")
        ]);
        setPendingRequests(pRes.data || []);
        setApprovedRequests(aRes.data || []);
        setHistoryRequests(rRes.data || []);
      } else {
        const [activeRes, historyRes] = await Promise.all([
          api.get("/bookings/my-bookings/active"),
          api.get("/bookings/my-bookings/history")
        ]);
        const active = activeRes.data || [];
        setPendingRequests(active.filter(i => i.status === 'pending'));
        setApprovedRequests(active.filter(i => i.status === 'approved'));
        setHistoryRequests(historyRes.data || []);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error.response?.status);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✨ ปรับให้ return ค่า success กลับไป แทนการใช้ alert
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      fetchBookings(); // ดึงข้อมูลใหม่
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "อัปเดตไม่สำเร็จ" };
    }
  };

  // ✨ ปรับให้ return ค่า success กลับไป และลบ alert ออก
  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      await api.put(`/bookings/${bookingId}`, updatedData);
      fetchBookings(); // ดึงข้อมูลใหม่
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "แก้ไขไม่สำเร็จ" };
    }
  };

  // ✨ ปรับให้ return ค่า success กลับไป และลบ window.confirm กับ alert ออก
  const handleCancelBooking = async (bookingId) => {
    try {
      // ✨ 1. เปลี่ยนเป็น api.patch (ถ้า backend ใช้ route แบบ router.patch('/:id/cancel', ...))
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings(); // ดึงข้อมูลใหม่
      // ✨ 2. ดึงเอาข้อความ success จาก backend ส่งกลับไปด้วย
      return { success: true, message: response.data.message }; 
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "ยกเลิกไม่สำเร็จ" };
    }
  };

  const getFullName = (req) => {
    if (!req) return "ไม่ระบุชื่อ";
    return `${req.teacher_name || req.name || ''} ${req.teacher_surname || req.surname || ''}`.trim() || "ไม่ระบุชื่อ";
  };

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return {
    pendingRequests, approvedRequests, historyRequests,
    userRole, selectedBooking, setSelectedBooking, isLoading,
    handleUpdateStatus, handleUpdateBooking, handleCancelBooking, getFullName
  };
};