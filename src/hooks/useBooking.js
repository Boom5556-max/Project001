import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../api/config.js";

export const useBookingLogic = (initialId) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [isRoomBusy, setIsRoomBusy] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [formData, setFormData] = useState({
    room_id: initialId || "",
    date: "",
    start_time: "",
    end_time: "",
    purpose: "",
  });

  // ดึงรายชื่อห้อง
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch rooms error:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 🚩 Validation: เช็คเวลาเบื้องต้น
    if (formData.start_time >= formData.end_time) {
      setServerMessage("❌ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม");
      setIsRoomBusy(true);
      setShowStatus(true);
      return;
    }

    setIsLoading(true);
    setShowStatus(false);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded?.role?.toLowerCase().trim() || "student";

      let endpoint = `${API_BASE_URL}/bookings`;
      if (userRole === "teacher") endpoint += "/teacher";
      if (userRole === "staff") endpoint += "/staff";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRoomBusy(false);
        setServerMessage(userRole === "staff" ? "✅ จองสำเร็จ" : "✅ ส่งคำขอจองสำเร็จ");
        setShowStatus(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setIsRoomBusy(true);
        setServerMessage(data.message || "ห้องไม่ว่างในช่วงเวลานี้");
        setShowStatus(true);
      }
    } catch (error) {
      setServerMessage("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
      setShowStatus(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rooms, formData, setFormData, handleSubmit,
    isLoading, showStatus, isRoomBusy, serverMessage, setShowStatus
  };
};