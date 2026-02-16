import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/");
        setRooms(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch rooms error:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

      let endpoint = "/bookings";
      if (userRole === "teacher") endpoint += "/teacher";
      if (userRole === "staff") endpoint += "/staff";

      const response = await api.post(endpoint, formData);

      // --- ✅ ส่วนที่แก้ไข: จองสำเร็จแล้วทำอะไรต่อ? ---
      setIsRoomBusy(false);
      setServerMessage(userRole === "staff" ? "✅ จองสำเร็จแล้ว" : "✅ ส่งคำขอจองสำเร็จแล้ว");
      setShowStatus(true);

      // 1. ล้างข้อมูลในฟอร์ม (Reset Form)
      // เราเก็บ room_id เดิมไว้เผื่อจองห้องเดิมแต่เปลี่ยนเวลา แต่ล้างส่วนอื่นทิ้ง
      setFormData({
        room_id: formData.room_id, 
        date: "",
        start_time: "",
        end_time: "",
        purpose: "",
      });

      // 2. (Optional) ลบข้อความแจ้งเตือนออกอัตโนมัติหลังจาก 4 วินาที
      setTimeout(() => {
        setShowStatus(false);
      }, 4000);

      // ❌ ลบ navigate("/dashboard") ออก เพื่อให้อยู่หน้าเดิม
      // -------------------------------------------

    } catch (error) {
      setIsRoomBusy(true);
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