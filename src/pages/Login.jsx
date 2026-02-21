import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // นำเข้าไอคอนลูกศร
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
    
    const result = await verifyOTP(email, otp);

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
        
        {/* --- ปุ่มย้อนกลับที่เพิ่มเข้ามา --- */}
        <button 
          onClick={() => navigate("/")} 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-[#302782] transition-colors font-medium text-sm group"
        >
          <div className="p-2 bg-gray-50 rounded-full group-hover:bg-[#302782]/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span>กลับไปหน้าสแกน</span>
        </button>
        {/* --------------------------- */}

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