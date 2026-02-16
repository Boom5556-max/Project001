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
        // 🚩 ถ้าเป็น Staff ยิงเข้า API รวม 3 ตัวที่นายเขียนไว้ใน Backend
        const [pRes, aRes, rRes] = await Promise.all([
          api.get("/bookings/pending"),
          api.get("/bookings/approved"),
          api.get("/bookings/rejected")
        ]);
        setPendingRequests(pRes.data || []);
        setApprovedRequests(aRes.data || []);
        setHistoryRequests(rRes.data || []);
      } else {
        // 🚩 ถ้าเป็น Teacher ยิงเข้า My Bookings ปกติ
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

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "อัปเดตไม่สำเร็จ");
    }
  };

  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      await api.put(`/bookings/${bookingId}`, updatedData);
      setSelectedBooking(null);
      fetchBookings();
      alert("แก้ไขสำเร็จ");
    } catch (error) {
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("ยืนยันการยกเลิก?")) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      alert("ยกเลิกไม่สำเร็จ");
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