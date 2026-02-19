import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const useRoomStatusLogic = (id) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚩 1. สร้าง State สำหรับเวลาปัจจุบัน เพื่อใช้ Trigger การ Re-render
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchRoomStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [bookingRes, roomRes] = await Promise.all([
        api.get(`/bookings/${id}`),
        api.get(`/rooms/${id}`),
      ]);

      setRoomData(bookingRes.data);
      setRoomDetail(roomRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  // 🚩 2. ตั้ง Timer ให้ Update เวลาทุกๆ 30 วินาที หรือ 1 นาที
  useEffect(() => {
    if (id) fetchRoomStatus();

    const timer = setInterval(() => {
      setCurrentTime(new Date()); // บังคับให้ Component รู้ว่าเวลาเปลี่ยนแล้วนะ
    }, 30000); // 30 วินาทีเช็คทีหนึ่ง

    return () => clearInterval(timer); // Clean up เมื่อออกจากหน้า
  }, [fetchRoomStatus, id]);

  // 🚩 3. คำนวณสถานะ "ว่าง/ไม่ว่าง" เองโดยอิงจากเวลาปัจจุบัน (Client-side Check)
  const isAvailable = useMemo(() => {
  if (!roomData?.schedule || roomData.schedule.length === 0) return true;

  const now = currentTime.getTime();
  const todayStr = new Date().toISOString().split('T')[0]; // ดึงวันที่ "2026-02-19"

  const ongoingBooking = roomData.schedule.find((item) => {
    // 🚩 ตรวจสอบว่าเวลาที่ส่งมามีวันที่ติดมาด้วยไหม ถ้าไม่มีให้แปะวันที่ปัจจุบัน
    const startTimeStr = item.start_time.includes('T') ? item.start_time : `${todayStr}T${item.start_time}`;
    const endTimeStr = item.end_time.includes('T') ? item.end_time : `${todayStr}T${item.end_time}`;

    const start = new Date(startTimeStr).getTime();
    const end = new Date(endTimeStr).getTime();

    return !isNaN(start) && now >= start && now < end;
  });

  return !ongoingBooking;
}, [roomData, currentTime]); // 💡 ใส่ currentTime เพื่อให้คำนวณใหม่ทุกครั้งที่เข็มนาฬิกาเดิน

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return {
    roomData,
    roomDetail,
    isLoading,
    error,
    isAvailable, // ค่านี้จะเปลี่ยน auto เมื่อถึงเวลา
    formatDate,
    navigate,
  };
};
