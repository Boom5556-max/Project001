import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { formatCalendarEvents } from "../utils/calendarHelper.js";

export const useCalendarData = (roomIdFromUrl) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(roomIdFromUrl || "");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelMode, setIsCancelMode] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms/");
      if (res.data?.length > 0) setRooms(res.data);
    } catch (err) {
      console.error("Fetch Rooms Error:", err);
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let bookingUrl, scheduleUrl;
      if (selectedRoom && selectedRoom !== "") {
        bookingUrl = `/bookings/allBookingSpecific/${selectedRoom}?status=approved`;
        scheduleUrl = `/schedules/${selectedRoom}`;
      } else {
        bookingUrl = `/bookings/allBooking?status=approved`;
        scheduleUrl = `/schedules/`;
      }

      const [bookRes, schedRes] = await Promise.all([
        api.get(bookingUrl).catch(() => ({ data: [] })),
        api.get(scheduleUrl).catch(() => ({ data: { schedules: [] } })),
      ]);

      const rawSchedules = schedRes.data?.schedules || schedRes.data || [];
      const formatted = formatCalendarEvents(bookRes.data || [], rawSchedules);
      setEvents(formatted);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setEvents([]);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [selectedRoom]);

  // 🚩 แก้ไขฟังก์ชันอัปเดตสถานะให้เข้มงวดขึ้น
  const updateStatus = async (id, isClosed) => {
    // เช็คก่อนว่ามี ID ส่งมาไหม
    if (!id) {
      console.error("Update Error: Missing schedule ID");
      return { success: false };
    }

    try {
      console.log(`📡 Sending Update: ID=${id}, Status=${isClosed}`);
      
      const payload = { temporarily_closed: isClosed };
      const response = await api.patch(`/schedules/${id}/status`, payload);
      
      console.log("✅ API Response:", response.data);

      // สำคัญ: ต้องรอให้ fetchData เสร็จก่อนถึงจะ return
      await fetchData();
      return { success: true };
    } catch (err) {
      // 🚩 Log ดู Error ที่แท้จริงจาก Backend
      console.error("❌ API Error Details:", err.response?.data || err.message);
      
      const isForbidden = err.response?.status === 403;
      const message = err.response?.data?.message || "เกิดข้อผิดพลาด";
      
      return { success: false, isForbidden, message };
    }
  };

  useEffect(() => { fetchRooms(); }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    rooms,
    selectedRoom,
    setSelectedRoom,
    events,
    isLoading,
    isCancelMode,
    setIsCancelMode,
    // ใช้สถาปัตยกรรมที่ชัดเจนในการส่งออกฟังก์ชัน
    handleCancelSchedule: async (id) => await updateStatus(id, true),
    handleRestoreSchedule: async (id) => await updateStatus(id, false),
    refreshData: fetchData 
  };
};