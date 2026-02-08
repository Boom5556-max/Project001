import { useState, useEffect } from "react";
import api from "../api/axios"; // ใช้ Instance กลางที่เราเซ็ตไว้
import { formatCalendarEvents } from "../utils/calendarHelper.js";

export const useCalendarData = (roomIdFromUrl) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. ดึงรายชื่อห้องทั้งหมดครั้งแรก
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // api.get จะแนบ ngrok-skip-browser-warning ให้อัตโนมัติ
        const res = await api.get("/rooms/");
        const data = res.data;

        if (data?.length > 0) {
          setRooms(data);
          // ลำดับความสำคัญ: ID จาก URL > ห้องแรกใน List
          setSelectedRoom(roomIdFromUrl || data[0].room_id);
        }
      } catch (err) {
        console.error("Fetch Rooms Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, [roomIdFromUrl]);

  // 2. ดึงข้อมูลตารางเมื่อเปลี่ยนห้อง
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedRoom) return;

      try {
        // ใช้ Promise.all ยิงคู่ ทั้ง Booking และ Schedule
        // Axios จะจัดการเรื่อง Token ผ่าน Interceptor ให้เอง
        const [bookRes, schedRes] = await Promise.all([
          api.get(`/bookings/allBooking/${selectedRoom}?status=approved`),
          api.get(`/schedule/${selectedRoom}`)
        ]);

        // ดึงข้อมูลจาก .data (ถ้าตัวไหนพัง Axios จะเด้งไป catch ทันที)
        const bookingData = bookRes.data || [];
        const scheduleResponse = schedRes.data || { schedules: [] };

        // 🚩 ส่งต่อให้ Helper จัดการ Format ข้อมูล
        const formatted = formatCalendarEvents(
          bookingData, 
          scheduleResponse.schedules || []
        );
        setEvents(formatted);
      } catch (err) {
        console.error("Fetch Calendar Data Error:", err);
        // กรณีเกิด Error เราล้าง Events เก่าออกเพื่อป้องกันข้อมูลสับสน
        setEvents([]);
      }
    };
    fetchData();
  }, [selectedRoom]);

  return { rooms, selectedRoom, setSelectedRoom, events, isLoading };
};