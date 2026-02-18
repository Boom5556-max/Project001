import { useState, useEffect } from 'react';
import axios from "../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useRoomResults = (searchQuery) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚩 ฟังก์ชันจองห้อง (แยกตาม Role)
  const handleConfirmBooking = async () => {
    if (!purpose.trim()) {
      return Swal.fire({ title: "กรุณาระบุวัตถุประสงค์", icon: "warning" });
    }

    try {
      setIsSubmitting(true);
      
      // 1. ดึงข้อมูล User/Role จาก localStorage (หรือที่ที่นายเก็บไว้)
      const user = JSON.parse(localStorage.getItem("user")); 
      const role = user?.role; // 'teacher' หรือ 'staff'

      // 2. เลือก Endpoint ให้ตรงกับ Route ที่นายเขียนไว้
      let endpoint = "";
      if (role === 'teacher') {
        endpoint = "/bookings/teacher";
      } else if (role === 'staff') {
        endpoint = "/bookings/staff";
      } else {
        throw new Error("คุณไม่มีสิทธิ์ในการจองห้อง (Unauthorized Role)");
      }

      const bookingData = {
        room_id: selectedRoom.room_id,
        date: searchQuery.date,
        start_time: searchQuery.start_time,
        end_time: searchQuery.end_time,
        purpose: purpose
      };

      // 3. ยิง API พร้อม Token (axios instance ของนายควรจัดการ Header ให้อยู่แล้ว)
      await axios.post(endpoint, bookingData);

      await Swal.fire({
        title: "จองสำเร็จ!",
        text: `บันทึกการจองในฐานะ ${role} เรียบร้อยแล้ว`,
        icon: "success"
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "ไม่สามารถจองได้ กรุณาลองใหม่";
      Swal.fire("เกิดข้อผิดพลาด", msg, "error");
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