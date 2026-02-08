import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config.js";

export const useRoomStatusLogic = (id) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404)
          throw new Error("ไม่พบข้อมูลห้องเรียนนี้ในระบบ");
        throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }

      const data = await response.json();
      setRoomData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchRoomStatus();
  }, [fetchRoomStatus, id]);

  const isAvailable = roomData?.status_label === "ว่าง";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("th-TH", options);
  };

  return { roomData, isLoading, error, isAvailable, formatDate, navigate };
};