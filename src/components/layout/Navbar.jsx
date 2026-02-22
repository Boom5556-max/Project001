import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, Bell, QrCode, LogOut, Users } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import ActionModal from "../common/ActionModal"; // ✨ นำเข้า ActionModal

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");

  // ✨ เพิ่ม State สำหรับจัดการ Alert
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    icon: null,
    onConfirm: null,
    showConfirm: true,
  });

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

  // ✨ ฟังก์ชันเรียก Alert
  const showAlert = (title, icon, onConfirm = null, showConfirm = true) => {
    setAlertConfig({
      isOpen: true,
      title,
      icon,
      onConfirm:
        onConfirm ||
        (() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))),
      showConfirm,
    });
  };

  // ✨ เปลี่ยนจากออกระบบทันที เป็นเรียก Popup ถามก่อน
  const handleLogoutClick = () => {
    showAlert(
      "คุณแน่ใจหรือไม่ที่จะออกจากระบบ?",
      <LogOut size={50} className="text-red-500" />,
      () => {
        // เมื่อกดยืนยัน ค่อยเคลียร์ Token แล้วเด้งออก
        localStorage.removeItem("token");
        window.location.replace("/");
      }
    );
  };

  const getNavStyle = (path) => {
    const active = location.pathname === path;
    return {
      container: `relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${active ? "text-[#B2BB1E]" : "text-[#FFFFFF]/60 hover:text-[#FFFFFF]"}`,
      indicator: `absolute -bottom-1 w-5 h-1 bg-[#B2BB1E] rounded-full transition-all duration-300 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0"}`
    };
  };

  return (
    <>
      <nav className="bg-[#302782] w-full px-8 py-3 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] sticky top-0 z-[1000] border-b border-[#FFFFFF]/5 backdrop-blur-md font-sans flex-none">
        
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex flex-col">
            <h1 className="text-[#FFFFFF] text-4xl font-bold leading-tight tracking-tight">
              SCI <span className="text-[#B2BB1E]">KU</span>
            </h1>
            <p className="text-[#FFFFFF]/40 text-[9px] font-bold tracking-[0.50em] leading-none uppercase">Sriracha Campus</p>
          </div>
        </div>

        {/* Menu Icons Section */}
        <div className="flex gap-2 md:gap-4 items-center">
          
          <NavItem 
            onClick={() => navigate("/dashboard")} 
            style={getNavStyle("/dashboard")} 
            icon={<Home size={22} />} 
            title="หน้าหลัก" 
          />

          <NavItem 
            onClick={() => navigate("/calendar")} 
            style={getNavStyle("/calendar")} 
            icon={<CalendarIcon size={22} />} 
            title="ตารางเวลา" 
          />

          {userRole === "staff" && (
            <NavItem 
              onClick={() => navigate("/users")} 
              style={getNavStyle("/users")} 
              icon={<Users size={22} />} 
              title="จัดการผู้ใช้งาน" 
            />
          )}

          <NavItem 
            onClick={() => navigate("/notification")} 
            style={getNavStyle("/notification")} 
            icon={<Bell size={22} />} 
            title="การแจ้งเตือน" 
          />

          <NavItem 
            onClick={() => navigate("/scanner")} 
            style={getNavStyle("/scanner")} 
            icon={<QrCode size={22} />} 
            title="สแกนคิวอาร์" 
          />

          {/* Logout Section */}
          <div className="ml-4 pl-4 border-l border-[#FFFFFF]/10 flex items-center">
            <button
              onClick={handleLogoutClick} // ✨ เปลี่ยนมาเรียกฟังก์ชัน Popup
              className="w-10 h-10 flex items-center justify-center text-[#FFFFFF]/40 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/10"
              title="ออกจากระบบ"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* ✨ Component แสดง Popup ยืนยันการออกจากระบบ */}
      {alertConfig.isOpen && (
        <ActionModal
          icon={alertConfig.icon}
          title={alertConfig.title}
          showConfirm={alertConfig.showConfirm}
          onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </>
  );
};

// Sub-component สำหรับ Navigation Item
const NavItem = ({ onClick, style, icon, title }) => (
  <button onClick={onClick} className={style.container} title={title}>
    {icon}
    <div className={style.indicator} />
  </button>
);

export default Navbar;