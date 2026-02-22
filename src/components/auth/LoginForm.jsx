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
  errorMsg // รับค่า errorMsg เข้ามา
}) => {
  const { timer, isSent, isLoading, statusMsg } = authData;

  return (
    <div className="max-w-[400px] mx-auto w-full">
      {/* Header ของฟอร์ม */}
      <div className="mb-10 text-right">
        <h1 className="text-6xl font-black italic tracking-tighter leading-[0.8] text-[#2D2D86]">
          <span className="text-[#B4C424]">KU</span><br />LOGIN
        </h1>
      </div>

      {/* Message แสดงสถานะตอนส่งอีเมล */}
      <div className={`h-6 mb-4 text-sm font-bold transition-all ${statusMsg && !errorMsg ? "opacity-100" : "opacity-0"}`}>
        <p className={statusMsg?.includes("❌") ? "text-red-500" : "text-green-500"}>
          {statusMsg}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* ส่วน Email */}
        <InputField
          label="KU Email"
          icon={Mail}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student.n@ku.th"
        />

        {/* ปุ่มขอ OTP */}
        <Button
          type="button"
          onClick={() => requestOTP(email)}
          isLoading={isLoading}
          disabled={timer > 0 || isLoading}
          variant={timer > 0 ? "gray" : "secondary"}
          className="w-full"
        >
          {!isLoading && (
            <div className="flex items-center gap-2">
              {isSent ? <RefreshCw size={20} /> : <Send size={20} />}
              <span>
                {timer > 0 ? `ขอรหัสใหม่ใน (${timer}s)` : isSent ? "ส่งรหัสอีกครั้ง" : "ขอรหัส OTP"}
              </span>
            </div>
          )}
        </Button>

        {/* ส่วน OTP */}
        <div>
          <InputField
            label="Verification Code"
            icon={Lock}
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className={`text-center text-3xl tracking-[0.3em] font-black transition-colors ${errorMsg ? 'text-red-500' : 'text-[#2D2D86]'}`}
          />
          
          {/* ✨ แก้ไขจุดนี้: เปลี่ยนจาก absolute เป็นการจัด Layout ธรรมดา (มี mt-2 ดันลงมา) เพื่อไม่ให้ทับปุ่ม */}
          {errorMsg && (
            <div className="flex items-center justify-center gap-1.5 text-red-500 mt-3 animate-[fadeIn_0.2s_ease-in-out]">
              <AlertCircle size={16} />
              <span className="text-sm font-bold">{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ปุ่ม Submit */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={otp.length < 6 || isLoading}
          className="w-full mt-2 text-xl"
        >
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;