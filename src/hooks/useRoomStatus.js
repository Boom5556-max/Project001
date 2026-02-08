import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ใช้ Instance กลางที่รวม Token ไว้แล้ว

export const useRoomStatusLogic = (id) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomStatus = useCallback(async () => {
    // เช็ค Token เบื้องต้นก่อนยิง
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Axios: baseURL ถูกตั้งไว้แล้ว แค่เรียกเส้นที่ต้องการ
      // Interceptor ใน axios.js จะแนบ Bearer Token และ ngrok header ให้เอง
      const response = await api.get(`/bookings/${id}`);

      // ข้อมูลพร้อมใช้ใน response.data
      setRoomData(response.data);
    } catch (err) {
      console.error("Fetch Room Status Error:", err);
      
      // Axios จัดการ Error มาให้ใน err.response
      if (err.response?.status === 404) {
        setError("ไม่พบข้อมูลห้องเรียนนี้ในระบบ");
      } else {
        setError(err.response?.data?.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchRoomStatus();
  }, [fetchRoomStatus, id]);

  // Logic การเช็คสถานะห้อง (เหมือนเดิม)
  const isAvailable = roomData?.status_label === "ว่าง";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("th-TH", options);
  };

  return { roomData, isLoading, error, isAvailable, formatDate, navigate };
};