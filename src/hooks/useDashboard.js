import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../api/config.js";

export const useDashboard = () => {
  const [data, setData] = useState({
    roomCount: 0,
    pendingCount: 0,
    approvedCount: 0,
  });
  const [user, setUser] = useState({ name: "", role: "student" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser({
        name: decoded.name || decoded.username || "User",
        role: decoded.role ? decoded.role.toLowerCase() : "student",
      });

      const fetchData = async () => {
        const headers = {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        };
        try {
          const [roomRes, pendingRes, approvedRes] = await Promise.all([
            fetch(`${API_BASE_URL}/rooms`, { headers }),
            fetch(`${API_BASE_URL}/bookings/pending`, { headers }),
            fetch(`${API_BASE_URL}/bookings/approved`, { headers }),
          ]);

          const parse = async (res) => {
            if (!res.ok) return 0;
            const json = await res.json();
            return Array.isArray(json) ? json.length : json.data?.length || 0;
          };

          setData({
            roomCount: await parse(roomRes),
            pendingCount: await parse(pendingRes),
            approvedCount: await parse(approvedRes),
          });
        } catch (err) {
          console.error("Fetch Error:", err);
        }
      };
      fetchData();
    } catch (err) {
      console.error("Token Error:", err);
    }
  }, []);

  return { ...data, ...user };
};