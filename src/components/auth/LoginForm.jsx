import React from "react";
import { Mail, Lock, RefreshCw, Send, AlertCircle } from "lucide-react"; 
import InputField from "../common/InputField";
import Button from "../common/Button";

const LoginForm = ({ 
  email, 
  setEmail, 
  otp, 
  setOtp, 
  onSubmit, 
  requestOTP, 
  authData,
  errorMsg 
}) => {
  const { timer, isSent, isLoading, statusMsg } = authData;

  return (
    /* 1. ปรับ max-w ให้ยืดหยุ่น: มือถือใช้เต็มจอแต่มี padding, จอใหญ่ล็อกที่ 400px-450px 
       2. เพิ่ม Responsive Padding และ Margin
    */
    <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] mx-auto px-4 sm:px-0 transition-all duration-300">
      
      {/* Header: ปรับขนาดฟอนต์ตามหน้าจอ (Text scaling) */}
      <div className="mb-6 sm:mb-10 text-right">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter leading-[0.8] text-[#2D2D86] select-none">
          <span className="text-[#B4C424]">KU</span><br />LOGIN
        </h1>
      </div>

      {/* Message Status: ปรับความสูงให้คงที่เพื่อไม่ให้ Layout กระโดดตอนข้อความมา */}
      <div className={`min-h-[24px] mb-4 text-xs sm:text-sm font-bold transition-all duration-200 ${statusMsg && !errorMsg ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
        <p className={statusMsg?.includes("❌") ? "text-red-500" : "text-green-500"}>
          {statusMsg}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        {/* Email Field */}
        <div className="group">
          <InputField
            label="KU Email"
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student.n@ku.th"
            // ปรับขนาด input ข้างใน (ถ้า InputField รองรับ className)
          />
        </div>

        {/* ปุ่มขอ OTP: ปรับความสูงให้กดง่ายขึ้นบนมือถือ (Touch Target) */}
        <Button
          type="button"
          onClick={() => requestOTP(email)}
          isLoading={isLoading}
          disabled={timer > 0 || isLoading}
          variant={timer > 0 ? "gray" : "secondary"}
          className="w-full py-3 sm:py-4 transition-all active:scale-[0.98]"
        >
          {!isLoading && (
            <div className="flex items-center justify-center gap-2">
              {isSent ? <RefreshCw size={18} className={timer > 0 ? "animate-spin" : ""} /> : <Send size={18} />}
              <span className="text-sm sm:text-base font-bold">
                {timer > 0 ? `ขอรหัสใหม่ใน (${timer}s)` : isSent ? "ส่งรหัสอีกครั้ง" : "ขอรหัส OTP"}
              </span>
            </div>
          )}
        </Button>

        {/* ส่วน Verification Code */}
        <div className="relative">
          <InputField
            label="Verification Code"
            icon={Lock}
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            // ปรับขนาดตัวอักษร OTP ให้เล็กลงหน่อยบนมือถือเพื่อไม่ให้ล้น
            className={`text-center text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.3em] font-black transition-colors ${errorMsg ? 'text-red-500 border-red-500' : 'text-[#2D2D86]'}`}
          />
          
          {errorMsg && (
            <div className="flex items-center justify-center gap-1.5 text-red-500 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={14} className="sm:w-[16px]" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ปุ่ม Submit: ใหญ่และเด่นชัด */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={otp.length < 6 || isLoading}
          className="w-full mt-2 py-3 sm:py-4 text-lg sm:text-xl shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-transform"
        >
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;