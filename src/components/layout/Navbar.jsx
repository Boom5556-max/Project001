import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, Bell, QrCode, LogOut, Users } from 'lucide-react'; // 🚩 เพิ่ม Users icon
import { jwtDecode } from "jwt-decode"; // 🚩 เพิ่มตัวถอดรหัส Token

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(""); // 🚩 เก็บ Role ของผู้ใช้

  // 🚩 ตรวจสอบสิทธิ์จาก Token เมื่อ Component โหลด
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded?.role?.toLowerCase().trim() || "");
      } catch (err) {
        console.error("Token Decode Error in Navbar:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  const isActive = (path) => location.pathname === path ? "text-[#B4C424]" : "text-white/80 hover:text-[#B4C424]";

  return (
    <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none font-sans">
      
      {/* Logo Section */}
      <div
        className="flex flex-col cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <h1 className="text-white text-xl font-bold leading-none italic uppercase">
          SCI <span className="text-[#B4C424]">KU</span>
        </h1>
        <p className="text-white text-[10px] tracking-[0.2em] font-black italic">SRC</p>
      </div>

      {/* Menu Icons */}
      <div className="flex gap-5 items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className={`${isActive("/dashboard")} transition-all hover:scale-110`}
          title="Dashboard"
        >
          <Home size={24} />
        </button>

        <button
          onClick={() => navigate("/calendar")}
          className={`${isActive("/calendar")} transition-all hover:scale-110`}
          title="Calendar"
        >
          <CalendarIcon size={24} />
        </button>

        {/* 🚩 แสดงปุ่ม Users เฉพาะ Role Staff เท่านั้น */}
        {userRole === "staff" && (
          <button
            onClick={() => navigate("/users")}
            className={`${isActive("/users")} transition-all hover:scale-110 flex items-center`}
            title="User Management"
          >
            <Users size={24} />
          </button>
        )}

        <button
          onClick={() => navigate("/notification")}
          className={`${isActive("/notification")} transition-all hover:scale-110`}
          title="Notification"
        >
          <Bell size={24} />
        </button>

        <button
          onClick={() => navigate("/scanner")}
          className={`${isActive("/scanner")} transition-all hover:scale-110`}
          title="QR Scanner"
        >
          <QrCode size={24} />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-white/80 hover:text-red-500 transition-all hover:scale-110 ml-2 p-1 border-l border-white/20 pl-4"
          title="ออกจากระบบ"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;