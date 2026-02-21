import { useState, useEffect } from 'react';
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export const useRoomResults = (searchQuery) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚩 ฟังก์ชันจองห้อง (ปรับปรุงให้ส่งค่ากลับแทนการใช้ Swal)
  const handleConfirmBooking = async () => {
    // เช็คค่าว่างเบื้องต้น
    if (!purpose.trim()) {
      return { success: false, message: "กรุณาระบุวัตถุประสงค์" };
    }

    try {
      setIsSubmitting(true);
      
      const user = JSON.parse(localStorage.getItem("user")); 
      const role = user?.role;

      let endpoint = "";
      if (role === 'teacher') {
        endpoint = "/bookings/teacher";
      } else if (role === 'staff') {
        endpoint = "/bookings/staff";
      } else if (role === 'student') { // เพิ่มเผื่อไว้สำหรับนิสิต
        endpoint = "/bookings/student";
      } else {
        throw new Error("คุณไม่มีสิทธิ์ในการจองห้อง");
      }

      const bookingData = {
        room_id: selectedRoom.room_id,
        date: searchQuery.date,
        start_time: searchQuery.start_time,
        end_time: searchQuery.end_time,
        purpose: purpose
      };

      // ยิง API
      await axios.post(endpoint, bookingData);

      // 🚩 ส่งกลับว่าสำเร็จเพื่อให้ Component เปิด Modal Success
      return { success: true };

    } catch (err) {
      console.error(err);
      // 🚩 ส่งกลับว่าไม่สำเร็จเพื่อให้ Component เปิด Modal Error
      return { 
        success: false, 
        message: err.response?.data?.message || "ไม่สามารถจองได้" 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic fetchRooms (เหมือนเดิม)
  useEffect(() => {
    const fetchRooms = async () => {
      if (!searchQuery || !searchQuery.date) { setLoading(false); return; }
      try {
        setLoading(true);
        const response = await axios.post('/rooms/search', searchQuery);
        setRooms(response.data.available_rooms || []);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลห้องว่างได้");
      } finally { setLoading(false); }
    };
    fetchRooms();
  }, [searchQuery]);

  return { 
    rooms, loading, error, 
    selectedRoom, setSelectedRoom, 
    purpose, setPurpose, 
    isSubmitting, handleConfirmBooking 
  };
};