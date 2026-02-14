import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { formatCalendarEvents } from "../utils/calendarHelper.js";

export const useCalendarData = (roomIdFromUrl) => {
  const [rooms, setRooms] = useState([]);
  // 🚩 1. เริ่มต้นด้วย roomId จาก URL ถ้าไม่มีให้เป็นค่าว่าง (เพื่อดึงทั้งหมด)
  const [selectedRoom, setSelectedRoom] = useState(roomIdFromUrl || ""); 
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelMode, setIsCancelMode] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms/");
      if (res.data?.length > 0) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error("Fetch Rooms Error:", err);
    }
  }; // 2. ดึงข้อมูลตารางเรียนและการจอง (พ่วงจุดสีด้วย formatCalendarEvents)

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let bookingUrl, scheduleUrl;

      if (selectedRoom && selectedRoom !== "") {
        // --- กรณีเลือกเฉพาะห้อง ---
        bookingUrl = `/bookings/allBookingSpecific/${selectedRoom}?status=approved`;
        scheduleUrl = `/schedules/${selectedRoom}`;
      } else {
        // --- 🚩 กรณี Default: ดึงข้อมูล "ทุกห้อง" มารวมกัน ---
        // (หมายเหตุ: นายต้องมี Endpoint เหล่านี้ใน Backend ที่ส่งข้อมูลทุกห้องออกมา)
        bookingUrl = `/bookings/allBooking?status=approved`; 
        scheduleUrl = `/schedules/`;
      }

      const [bookRes, schedRes] = await Promise.all([
        api.get(bookingUrl).catch(() => ({ data: [] })),
        api.get(scheduleUrl).catch(() => ({ data: { schedules: [] } })),
      ]);

      // นำข้อมูลจากการจอง (bookRes) และตารางเรียน (schedRes) มา Format รวมกัน
      const formatted = formatCalendarEvents(
        bookRes.data || [],
        schedRes.data?.schedules || schedRes.data || []
      );
      
      setEvents(formatted);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoom]); // 3. ฟังก์ชันส่งคำสั่งงดใช้ห้อง (Cancel Schedule)

  const handleCancelSchedule = async (id) => {
  setIsLoading(true);
  try {
    const payload = { temporarily_closed: true };
    await api.patch(`/schedules/${id}/status`, payload);
    
    await fetchData();
    return true;
  } catch (err) {
    // 🚩 เช็คว่าถ้า Error เป็น 403 (Forbidden)
    if (err.response && err.response.status === 403) {
      alert("❌ คุณไม่มีสิทธิ์งดใช้ห้องในคาบนี้ (เฉพาะเจ้าของวิชาเท่านั้น)");
    } else {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
    console.error("Cancel Schedule Error:", err);
    return false;
  } finally {
    setIsLoading(false);
  }
};

const handleRestoreSchedule = async (scheduleId) => {
  setIsLoading(true);
  try {
    await api.patch(`/schedules/${scheduleId}/status`, { temporarily_closed: false });
    
    await fetchData();
    return true;
  } catch (err) {
    if (err.response && err.response.status === 403) {
      alert("❌ คุณไม่มีสิทธิ์เปิดใช้ห้องในคาบนี้ (เฉพาะเจ้าของวิชาเท่านั้น)");
    } else {
      alert("ไม่สามารถคืนสถานะได้");
    }
    return false;
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rooms,
    selectedRoom,
    setSelectedRoom,
    events,
    isLoading,
    isCancelMode,
    setIsCancelMode,
    handleCancelSchedule,
    handleRestoreSchedule
  };
};

