import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, Bell, QrCode, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 💡 เพิ่มตัวนี้เพื่อทำปุ่ม "Active" (สีเหลืองตามหน้าที่อยู่จริง)

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/"); // ใช้ replace เพื่อไม่ให้กด back กลับมาได้
  };

  // ฟังก์ชันช่วยเช็คว่าตอนนี้อยู่หน้านี้ไหม ถ้าใช่ให้เป็นสีเหลือง
  const isActive = (path) => location.pathname === path ? "text-[#B4C424]" : "text-white/80 hover:text-[#B4C424]";

  return (
    /* ลบ h-screen และ flex-col ออก เพื่อให้เป็นแค่แถบด้านบนตัวเดียว */
    <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none">
      
      {/* Logo Section */}
      <div
        className="flex flex-col cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <h1 className="text-white text-xl font-bold leading-none">
          SCI <span className="text-[#B4C424]">KU</span>
        </h1>
        <p className="text-white text-xs tracking-[0.2em]">SRC</p>
      </div>

      {/* Menu Icons */}
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/dashboard")}
          className={`${isActive("/dashboard")} transition-colors`}
        >
          <Home size={24} />
        </button>

        <button
          onClick={() => navigate("/calendar")}
          className={`${isActive("/calendar")} transition-colors`}
        >
          <CalendarIcon size={24} />
        </button>

        <button
          onClick={() => navigate("/notification")}
          className={`${isActive("/notification")} transition-colors`}
        >
          <Bell size={24} />
        </button>

        <button
          onClick={() => navigate("/scanner")}
          className={`${isActive("/scanner")} transition-colors`}
        >
          <QrCode size={24} />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-white/80 hover:text-red-500 transition-colors ml-2 p-1 border-l border-white/20 pl-4"
          title="ออกจากระบบ"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div> // 🚩 ปิด Div ให้ถูกต้อง
  );
};

export default Navbar;