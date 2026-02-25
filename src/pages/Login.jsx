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
  const [errorMsg, setErrorMsg] = useState("");
  
  const { timer, isSent, isLoading, statusMsg, requestOTP, verifyOTP } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    const result = await verifyOTP(email, otp);

    if (result && result.success) {
      navigate("/dashboard"); 
    } else {
      setErrorMsg(result?.message || "รหัส OTP ไม่ถูกต้อง หรือหมดอายุ กรุณาลองใหม่อีกครั้ง");
    }
  };

return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row font-sans bg-[#FFFFFF] overflow-y-auto lg:overflow-hidden text-[#302782]">
      
      <Loginpic />

      <div className="w-full lg:w-[45%] bg-[#FFFFFF] flex flex-col relative min-h-[70vh] lg:min-h-screen">
        
        {/* 🟢 แก้ตรงนี้: ลดความสูง Header บนโน้ตบุ๊กเหลือ h-16 (จากเดิม h-24) */}
        <div className="h-16 flex items-center px-6 lg:px-10 xl:px-12 flex-shrink-0">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2.5 text-gray-400 hover:text-[#302782] transition-all font-bold text-sm group"
          >
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#302782]/10 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="inline">กลับไปหน้าสแกน</span>
          </button>
        </div>

        {/* 🟢 แก้ตรงนี้: ลด Padding (px) ด้านข้างไม่ให้บีบฟอร์มมากไปบนหน้าจอโน้ตบุ๊ก */}
        <div className="flex-grow flex flex-col justify-center px-8 lg:px-10 xl:px-20 pb-12 lg:pb-16">
          <div className="max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              {/* 🟢 แก้ตรงนี้: ลดขนาดหัวข้อ "เข้าสู่ระบบ" ให้เหลือ text-3xl สำหรับโน้ตบุ๊ก */}
              <h1 className="text-3xl lg:text-3xl xl:text-4xl font-black text-[#302782] mb-2 xl:mb-3 tracking-tight">
                เข้าสู่ระบบ <span className="text-[#B2BB1E]">.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                กรุณาระบุอีเมลเพื่อรับรหัส OTP สำหรับเข้าใช้งาน
              </p>
            </div>

            {/* ส่วน LoginForm เหมือนเดิม */}
            <LoginForm 
              email={email}
              setEmail={setEmail}
              otp={otp}
              setOtp={(value) => {
                setOtp(value);
                if (errorMsg) setErrorMsg(""); 
              }}
              onSubmit={handleLoginSubmit}
              requestOTP={requestOTP}
              authData={{ timer, isSent, isLoading, statusMsg }}
              errorMsg={errorMsg}
            />


          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;