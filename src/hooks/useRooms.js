import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/config.js";

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, isLoading, fetchRooms };
};