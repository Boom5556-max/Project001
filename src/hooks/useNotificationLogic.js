import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios"; // ใช้ Axios Instance ที่เราเซ็ต Interceptor ไว้แล้ว

export const useNotificationLogic = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
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
      const role = decoded?.role?.toLowerCase().trim() || "student";
      setUserRole(role);

      if (role === "teacher" || role === "staff") {
        // --- 👨‍🏫 สำหรับ Teacher/Staff: ยิง 3 เส้นพร้อมกัน ---
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          api.get("/bookings/pending"),
          api.get("/bookings/approved"),
          api.get("/bookings/rejected"),
        ]);

        // Axios เก็บ data ไว้ใน .data เลย (ถ้าไม่มีให้ default เป็น array ว่าง)
        setPendingRequests(pendingRes.data?.data || pendingRes.data || []);
        setApprovedRequests(approvedRes.data?.data || approvedRes.data || []);
        setRejectedRequests(rejectedRes.data?.data || rejectedRes.data || []);
      } else {
        // --- 🎓 สำหรับ Student: ดึงทั้งหมดแล้วมา Filter เอง ---
        const res = await api.get("/bookings");
        const allData = res.data?.data || res.data || [];
        
        setPendingRequests(allData.filter(i => i.status?.toLowerCase() === "pending"));
        setApprovedRequests(allData.filter(i => i.status?.toLowerCase() === "approved"));
        setRejectedRequests(allData.filter(i => i.status?.toLowerCase() === "rejected"));
      }
    } catch (error) {
      console.error("❌ Axios Fetch Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ฟังก์ชันอัปเดตสถานะ (Approve / Reject)
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      // ใช้ api.put สั้นๆ ไม่ต้องส่ง Headers/Token เองเพราะมี Interceptor แล้ว
      const response = await api.put(`/bookings/${bookingId}/status`, { status });

      if (response.status === 200 || response.status === 204) {
        setSelectedBooking(null);
        fetchBookings(); // ดึงข้อมูลใหม่มาโชว์
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update status";
      alert(errMsg);
    }
  };

  // Helper ดึงชื่อ (Logic เดิมของนาย ดีอยู่แล้วครับ)
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
    pendingRequests, approvedRequests, rejectedRequests,
    isLoading, userRole, selectedBooking, setSelectedBooking,
    handleUpdateStatus, getFullName
  };
};