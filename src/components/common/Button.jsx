import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children,            // ข้อความหรือไอคอนข้างใน
  onClick, 
  type = "button", 
  variant = "primary", // primary, secondary, danger, dangerLight, outline, gray
  size = "md",         // sm, md, lg, icon, none
  isLoading = false, 
  disabled = false, 
  className = "",      // รับ class เพิ่มเติมเพื่อปรับแต่งเฉพาะจุด
  ...props             // รับค่าอื่นๆ เช่น form, id, style
}) => {

  // 1. สไตล์พื้นฐานที่ทุกปุ่มต้องมี (ความลื่นไหล, การกด, การจัดวาง)
  const baseStyles = "flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden font-bold";

  // 2. สไตล์แยกตามสี (Variants)
  const variants = {
    // ปุ่มสีเขียว KU (เข้าสู่ระบบ)
    primary: "bg-[#B4C424] text-white hover:brightness-105 shadow-lg",
    // ปุ่มสีน้ำเงิน (ขอ OTP / Approve / ดูรายการห้อง)
    secondary: "bg-[#2D2D86] text-white hover:bg-[#1e1e61] shadow-lg",
    // ปุ่มสีแดง (กากบาท X / ยกเลิก)
    danger: "bg-red-500 text-white shadow-md hover:bg-red-600",
    // ปุ่มสีแดงอ่อน (ปุ่ม Reject ในหน้าจอง)
    dangerLight: "bg-red-50 text-red-500 hover:bg-red-100",
    // ปุ่มโปร่งใส (ปุ่ม X ใน Modal)
    ghost: "hover:bg-gray-100 text-gray-500",
    // ปุ่มสีเทา (ตอนติด Timer 10s)
    gray: "bg-gray-100 text-gray-400"
  };

  // 3. สไตล์แยกตามขนาด (Sizes)
  const sizes = {
    sm: "px-4 py-2 rounded-xl text-sm",
    md: "px-6 py-4 rounded-2xl text-base",
    lg: "px-8 py-5 rounded-[25px] text-lg font-black", // ทรงมนพิเศษแบบปุ่ม Approve
    icon: "p-2 rounded-full",                         // ทรงกลมสำหรับปุ่ม X
    none: ""                                          // ไม่กำหนดขนาด (เอาไปคุมเอง)
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* ถ้า isLoading เป็น true ให้แสดงตัวหมุน ถ้าไม่ให้แสดงสิ่งที่ส่งมา (children) */}
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'icon' ? 20 : 24} />
      ) : (
        <>
          {children}
        </>
      )}
    </button>
  );
};

export default Button;