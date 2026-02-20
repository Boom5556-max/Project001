import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children,            // ข้อความหรือไอคอนข้างใน
  onClick, 
  type = "button", 
  variant = "primary", // primary, secondary, danger, dangerLight, ghost, gray
  size = "md",         // sm, md, lg, icon, none
  isLoading = false, 
  disabled = false, 
  className = "",      // รับ class เพิ่มเติมเพื่อปรับแต่งเฉพาะจุด
  ...props             // รับค่าอื่นๆ เช่น form, id, style
}) => {

  // 1. สไตล์พื้นฐานที่ทุกปุ่มต้องมี (เรียบหรู, ไม่มี Effect เด้งดึ๋ง, จัดวางกึ่งกลาง)
  const baseStyles = "flex items-center justify-center gap-2 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden font-sans font-bold";

  // 2. สไตล์แยกตามสี (Variants) คุมโทน ขาว, เทา, น้ำเงิน, เขียว
  const variants = {
    // ปุ่มสีเขียวหลัก (KU Green)
    primary: "bg-[#B2BB1E] text-[#FFFFFF] shadow-[0_8px_20px_-8px_rgba(178,187,30,0.5)] hover:bg-opacity-90",
    
    // ปุ่มสีน้ำเงินหลัก (Deep Navy)
    secondary: "bg-[#302782] text-[#FFFFFF] shadow-[0_8px_20px_-8px_rgba(48,39,130,0.4)] hover:bg-opacity-90",
    
    // ปุ่มยกเลิก/อันตราย (เปลี่ยนจากแดงเป็นเทาขาวตามกฎคุมโทน เพื่อความนิ่ง)
    danger: "bg-[#FFFFFF] text-gray-500 border border-gray-200 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:bg-gray-50 hover:text-[#302782]",
    
    // ปุ่มยกเลิกแบบอ่อน (ใช้เป็นปุ่มรอง)
    dangerLight: "bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 hover:text-[#302782]",
    
    // ปุ่มโปร่งใส (ไม่มีพื้นหลัง เช่น ปุ่ม X)
    ghost: "bg-transparent hover:bg-gray-50 text-gray-500",
    
    // ปุ่มสีเทา (ตอนติด Timer หรือสถานะรอ)
    gray: "bg-gray-100 text-gray-400"
  };

  // 3. สไตล์แยกตามขนาด (Sizes) ปรับความมนให้เป็นมาตรฐาน Modern UI
  const sizes = {
    sm: "px-5 py-2.5 rounded-[14px] text-sm",
    md: "px-6 py-4 rounded-[16px] text-base",
    lg: "px-8 py-5 rounded-[20px] text-lg", // นำ font-black ออก ใช้แค่ font-bold จาก baseStyles ก็พอ
    icon: "p-3 rounded-full flex items-center justify-center aspect-square", // บังคับให้เป็นจตุรัสโค้งมนเสมอ
    none: "" 
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