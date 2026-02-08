import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/config";

export const useAuth = () => {
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const requestOTP = async (email) => {
    if (!email) {
      setStatusMsg("❌ กรุณากรอกอีเมล");
      return;
    }
    setIsLoading(true);
    setStatusMsg("⏳ กำลังส่งรหัส...");
   try {
      const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json","ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSent(true);
        setTimer(10);
        setStatusMsg("✅ ส่งรหัสเรียบร้อยแล้ว");
      } else {
        const data = await res.json();
        setStatusMsg(`❌ ${data.message}`);
      }
    } catch (err) {
      setStatusMsg("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMsg(""), 3000);
    }
  };

  const verifyOTP = async (email, otp) => {
    setIsLoading(true); // เริ่มโหลด
    setStatusMsg(""); // ล้างข้อความเก่า
    
    try {
      const payload = {
        email: email.trim(),
        otp_code: otp.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" // กันหน้าขาวของ ngrok
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. เก็บข้อมูลลงเครื่อง
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // 2. ส่งค่า success กลับไปให้ Login.jsx
        return { success: true };
      } else {
        // 3. ถ้า Error ให้ส่งข้อความจาก Backend กลับไป
        return { success: false, message: data.message || "รหัส OTP ไม่ถูกต้อง" };
      }
    } catch (err) {
      console.error("Verify Error:", err);
      return { success: false, message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้" };
    } finally {
      setIsLoading(false); // เลิกโหลด
    }
  };

  return { timer, isSent, isLoading, statusMsg, setStatusMsg, requestOTP, verifyOTP };
};