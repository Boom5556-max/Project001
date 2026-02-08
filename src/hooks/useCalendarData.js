import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/config.js";
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
        const res = await fetch(`${API_BASE_URL}/rooms/`, { 
          headers: { "ngrok-skip-browser-warning": "true" } 
        });
        const data = await res.json();
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
      const token = localStorage.getItem("token");
      if (!selectedRoom || !token) return;

      const headers = { 
        "ngrok-skip-browser-warning": "true", 
        "Authorization": `Bearer ${token}` 
      };

      try {
        const [bookRes, schedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/bookings/allBooking/${selectedRoom}?status=approved`, { headers }),
          fetch(`${API_BASE_URL}/schedule/${selectedRoom}`, { headers })
        ]);

        const bookingData = bookRes.ok ? await bookRes.json() : [];
        const scheduleResponse = schedRes.ok ? await schedRes.json() : { schedules: [] };

        // 🚩 เรียกใช้ Helper จัด Format ข้อมูลที่แก้เรื่องวันวาร์ปแล้ว
        const formatted = formatCalendarEvents(bookingData, scheduleResponse.schedules || []);
        setEvents(formatted);
      } catch (err) { 
        console.error("Fetch Calendar Data Error:", err); 
      }
    };
    fetchData();
  }, [selectedRoom]);

  return { rooms, selectedRoom, setSelectedRoom, events, isLoading };
};