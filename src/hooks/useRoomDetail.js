import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/config.js";

export const useRoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
        if (response.ok) {
          const data = await response.json();
          setRoom(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomDetail();
  }, [id]);

  return { id, room, isLoading };
};