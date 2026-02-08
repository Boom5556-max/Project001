import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios"; // ใช้ axios instance ที่จัดการ headers ให้เราแล้ว

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

  // 1. ดึงรายชื่อห้อง (ใช้ Axios)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/");
        // Axios เก็บข้อมูลใน res.data ทันที ไม่ต้อง await res.json()
        setRooms(Array.isArray(res.data) ? res.data : []);
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
      // ดึง Role เพื่อเลือก Endpoint
      const decoded = jwtDecode(token);
      const userRole = decoded?.role?.toLowerCase().trim() || "student";

      let endpoint = "/bookings";
      if (userRole === "teacher") endpoint += "/teacher";
      if (userRole === "staff") endpoint += "/staff";

      // 2. ส่งข้อมูลจอง (ใช้ Axios)
      // ไม่ต้องส่ง headers มาเอง เพราะ api instance ของเราจัดการเรื่อง Token และ ngrok ให้แล้ว
      const response = await api.post(endpoint, formData);

      // ถ้า Axios รันมาถึงบรรทัดนี้ได้ แปลว่า status code คือ 2xx (Success)
      setIsRoomBusy(false);
      setServerMessage(userRole === "staff" ? "✅ จองสำเร็จ" : "✅ ส่งคำขอจองสำเร็จ");
      setShowStatus(true);
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error) {
      // Axios จะโยน error มาที่นี่ถ้า status code ไม่ใช่ 2xx
      setIsRoomBusy(true);
      
      // ดึง message จาก Backend
      const errorMessage = error.response?.data?.message || "ห้องไม่ว่างในช่วงเวลานี้";
      setServerMessage(error.response ? errorMessage : "❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
      
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