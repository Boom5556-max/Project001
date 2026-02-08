import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../api/config.js";

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
    if (!token) return setIsLoading(false);

    try {
      const decoded = jwtDecode(token);
      const role = decoded?.role?.toLowerCase().trim() || "student";
      setUserRole(role);

      const headers = {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (role === "teacher" || role === "staff") {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/bookings/pending`, { headers }),
          fetch(`${API_BASE_URL}/bookings/approved`, { headers }),
          fetch(`${API_BASE_URL}/bookings/rejected`, { headers }),
        ]);

        const [p, a, r] = await Promise.all([
          pendingRes.ok ? pendingRes.json() : [],
          approvedRes.ok ? approvedRes.json() : [],
          rejectedRes.ok ? rejectedRes.json() : [],
        ]);

        setPendingRequests(Array.isArray(p) ? p : p.data || []);
        setApprovedRequests(Array.isArray(a) ? a : a.data || []);
        setRejectedRequests(Array.isArray(r) ? r : r.data || []);
      } else {
        const res = await fetch(`${API_BASE_URL}/bookings`, { headers });
        if (res.ok) {
          const allData = await res.json();
          const dataArray = Array.isArray(allData) ? allData : allData.data || [];
          setPendingRequests(dataArray.filter(i => i.status?.toLowerCase() === "pending"));
          setApprovedRequests(dataArray.filter(i => i.status?.toLowerCase() === "approved"));
          setRejectedRequests(dataArray.filter(i => i.status?.toLowerCase() === "rejected"));
        }
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (bookingId, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setSelectedBooking(null);
        fetchBookings();
      } else {
        const err = await response.json();
        alert(err.message || "Failed to update status");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  // Helper ดึงชื่อ (บวก Logic ป้องกันค่าว่าง)
  const getFullName = (req) => {
    if (!req) return "ไม่ระบุชื่อ";
    const first = req.teacher_name || req.name || req.first_name || "";
    const last = req.surname || req.last_name || "";
    return `${first} ${last}`.trim() || "ไม่ระบุชื่อ";
  };

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  return {
    pendingRequests, approvedRequests, rejectedRequests,
    isLoading, userRole, selectedBooking, setSelectedBooking,
    handleUpdateStatus, getFullName
  };
};