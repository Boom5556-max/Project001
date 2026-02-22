import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";
import Loginpic from "../components/auth/Loginpic.jsx";

const Login = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // State สำหรับเก็บข้อความแจ้งเตือน Error
  const [errorMsg, setErrorMsg] = useState("");
  
  const { timer, isSent, isLoading, statusMsg, requestOTP, verifyOTP } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // ล้างข้อความ Error เก่าออกก่อนเริ่มเช็คใหม่
    
    const result = await verifyOTP(email, otp);

    if (result && result.success) {
      navigate("/dashboard"); 
    } else {
      setErrorMsg(result?.message || "รหัส OTP ไม่ถูกต้อง หรือหมดอายุ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 overflow-hidden text-[#302782]">
      {/* ฝั่งซ้าย: ส่วนแสดงรูปภาพ */}
      <Loginpic />

      {/* ฝั่งขวา: ส่วนฟอร์มเข้าสู่ระบบ */}
      <div className="w-full lg:w-[45%] bg-[#FFFFFF] flex flex-col justify-center relative p-8 md:p-16">
        
        {/* --- ปุ่มย้อนกลับ --- */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#302782] transition-colors font-medium text-sm group"
        >
          <div className="p-2 bg-gray-50 rounded-full group-hover:bg-[#302782]/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span>กลับไปหน้าสแกน</span>
        </button>

        <div className="max-w-md mx-auto w-full">
          {/* ❌ เอา Alert Box ด้านบนออกไปแล้ว ✨ */}

          <LoginForm 
            email={email}
            setEmail={setEmail}
            otp={otp}
            setOtp={(value) => {
              setOtp(value);
              if (errorMsg) setErrorMsg(""); // ล้าง Error ทันทีที่พิมพ์ใหม่
            }}
            onSubmit={handleLoginSubmit}
            requestOTP={requestOTP}
            authData={{ timer, isSent, isLoading, statusMsg }}
            errorMsg={errorMsg} // ✨ ส่งค่า error ไปที่นี่
          />
        </div>
      </div>
    </div>
  );
};

export default Login;