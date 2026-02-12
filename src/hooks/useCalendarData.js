import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { formatCalendarEvents } from "../utils/calendarHelper.js";

export const useCalendarData = (roomIdFromUrl) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ โหมดงดใช้ห้อง (Cancel Mode)

  const [isCancelMode, setIsCancelMode] = useState(false); // 1. ดึงข้อมูลห้องทั้งหมด

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms/");
      if (res.data?.length > 0) {
        setRooms(res.data); // ถ้ามี id ใน URL ให้เลือกห้องนั้น ถ้าไม่มีให้เอาห้องแรก
        setSelectedRoom(roomIdFromUrl || res.data[0].room_id);
      }
    } catch (err) {
      console.error("Fetch Rooms Error:", err);
    } finally {
      setIsLoading(false);
    }
  }; // 2. ดึงข้อมูลตารางเรียนและการจอง (พ่วงจุดสีด้วย formatCalendarEvents)

  const fetchData = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const [bookRes, schedRes] = await Promise.all([
        api.get(`/bookings/allBooking/${selectedRoom}?status=approved`),
        api.get(`/schedules/${selectedRoom}`),
      ]);
      console.log("Check Booking Data:", bookRes.data?.[0]);
      console.log("Check Schedule Data:", schedRes.data?.schedules?.[0]); // formatCalendarEvents จะเป็นตัวแยก isSchedule: true/false เพื่อไปทำจุดสี

      const formatted = formatCalendarEvents(
        bookRes.data || [],
        schedRes.data?.schedules || [],
      );
      setEvents(formatted);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setEvents([]);
    }
  }, [selectedRoom]); // 3. ฟังก์ชันส่งคำสั่งงดใช้ห้อง (Cancel Schedule)

  const handleCancelSchedule = async (id) => {
    setIsLoading(true);
    try {
      const payload = { temporarily_closed: true };
      await api.patch(`/schedules/${id}/status`, payload); // 🚩 สำคัญ: ต้องดึงข้อมูลใหม่หลังจาก Update เพื่อให้สถานะใน UI เปลี่ยน

      await fetchData();
      return true;
    } catch (err) {
      // ... error handling ...
      return false;
    } finally {
      setIsLoading(false);
    }
  }; // --- Effects ---

  useEffect(() => {
    fetchRooms();
  }, [roomIdFromUrl]);

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
  };
};
// เมื่อกดงดใช้ห้องเเล้ว ให้วันนั้น มีคำว่า (งดใช้ห้องข้างหน้า)
