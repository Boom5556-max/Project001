import { useState, useEffect } from "react";
import api from "../api/axios"; // ดึง axios instance ที่เราเซ็ตไว้มาใช้

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      // Axios จะยิง GET ไปที่ baseURL + "/rooms/"
      // และดึง Headers จาก api instance มาใส่ให้เองอัตโนมัติ
      const response = await api.get("/rooms/");
      
      // Axios เก็บข้อมูลจาก JSON ไว้ใน property .data เรียบร้อยแล้ว
      setRooms(response.data);
    } catch (error) {
      // ถ้า Error เช่น 404 หรือ 500 Axios จะเด้งมาที่นี่ทันที
      console.error("Error fetching rooms:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, isLoading, fetchRooms };
};