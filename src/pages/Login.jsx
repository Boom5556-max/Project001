import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";
import Loginpic from "../components/auth/Loginpic.jsx";

const Login = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  const { timer, isSent, isLoading, statusMsg, requestOTP, verifyOTP } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // เรียกใช้ verifyOTP และรับผลลัพธ์
    const result = await verifyOTP(email, otp);

    // ถ้าล็อกอินผ่าน ให้ส่งไปหน้า Dashboard ทันที
    if (result && result.success) {
      navigate("/dashboard"); 
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 overflow-hidden text-[#302782]">
      {/* ฝั่งซ้าย: ส่วนแสดงรูปภาพ */}
      <Loginpic />

      {/* ฝั่งขวา: ส่วนฟอร์มเข้าสู่ระบบ */}
      <div className="w-full lg:w-[45%] bg-[#FFFFFF] flex flex-col justify-center relative p-8 md:p-16">
        <LoginForm 
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          onSubmit={handleLoginSubmit}
          requestOTP={requestOTP}
          authData={{ timer, isSent, isLoading, statusMsg }}
        />
      </div>
    </div>
  );
};

export default Login;