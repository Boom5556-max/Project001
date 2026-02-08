import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios"; 

export const useRoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // 👈 เพิ่มตัวนี้เข้าไป

  useEffect(() => {
    if (!id) return;

    const fetchRoomDetail = async () => {
      setIsLoading(true);
      setError(null); // ล้าง error เก่าก่อนเริ่มยิงใหม่
      try {
        const response = await api.get(`/rooms/${id}`);
        // ปกติ Axios จะเอา JSON มาใส่ใน response.data ให้เลย
        setRoom(response.data);
      } catch (err) {
        console.error("Error fetching room detail:", err);
        // เก็บข้อความ Error จาก Backend
        setError(err.response?.data?.message || "ไม่สามารถดึงข้อมูลห้องได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  // ส่ง error ออกไปให้หน้า UI ใช้ด้วย
  return { id, room, isLoading, error };
};