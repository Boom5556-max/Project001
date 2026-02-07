import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Mail, Lock, Loader2, RefreshCw } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0); 
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(''); // แสดงข้อความสถานะแทน alert

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!email) {
        setStatusMsg('❌ กรุณากรอกอีเมล');
        return;
    }
    
    setIsLoading(true);
    setStatusMsg('⏳ กำลังส่งรหัส...');
    setOtp(''); 

    try {
      const response = await fetch('https://dave-unincited-ariyah.ngrok-free.dev/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSent(true);
        setTimer(10); // ⚡ ปรับเหลือ 10 วินาทีตามคำขอ!
        setStatusMsg('✅ ส่งรหัสใหม่เรียบร้อยแล้ว');
      } else {
        const data = await response.json();
        setStatusMsg(`❌ ${data.message}`);
      }
    } catch (error) {
      setStatusMsg('❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    } finally {
      setIsLoading(false);
      // หายไปหลังจาก 3 วินาที
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg('');

    // 🌟 สร้าง Payload ให้ตรงกับที่ Backend กำหนด (ใช้ email และ otp_code)
    const payload = { 
      email: email.trim(), 
      otp_code: otp.trim() // นำค่าจาก State 'otp' มาใส่ในชื่อ 'otp_code'
    };

    try {
      const response = await fetch('https://dave-unincited-ariyah.ngrok-free.dev/auth/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // ป้องกันหน้า Warning ของ ngrok
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // เก็บข้อมูลลงใน localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setStatusMsg('✅ เข้าสู่ระบบสำเร็จ!');
        
        // หน่วงเวลาเล็กน้อยให้ User เห็นข้อความสำเร็จก่อนเปลี่ยนหน้า
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1000);
      } else {
        // Backend จะส่งข้อความผิดพลาดกลับมา (เช่น OTP ไม่ถูกต้องหรือหมดอายุ)
        setStatusMsg(`❌ ${data.message || 'รหัส OTP ไม่ถูกต้อง'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMsg('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 overflow-hidden">
      {/* ส่วนรูปภาพ */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img 
          src="https://img.freepik.com/free-photo/young-asian-teacher-man-teaching-student-university-classroom_7861-3101.jpg" 
          alt="Teacher"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D2D86]/80 to-transparent"></div>
        <div className="absolute bottom-20 left-16 text-white max-w-md">
          <h2 className="text-6xl font-black mb-4 tracking-tight">KU Src Booking</h2>
        </div>
      </div>

      {/* ส่วนฟอร์ม */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center relative p-8 md:p-16">
        <div className="max-w-[400px] mx-auto w-full">
          
          <div className="mb-10 text-right">
            <h1 className="text-6xl font-black italic tracking-tighter leading-[0.8] text-[#2D2D86]">
              <span className="text-[#B4C424]">KU</span><br />LOGIN
            </h1>
          </div>

          {/* ข้อความสถานะ (Status Message) */}
          <div className={`h-6 mb-4 text-sm font-bold transition-all ${statusMsg ? 'opacity-100' : 'opacity-0'}`}>
            <p className={statusMsg.includes('❌') ? 'text-red-500' : 'text-green-500'}>{statusMsg}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> KU Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#B4C424] rounded-2xl py-4 px-5 outline-none font-semibold transition-all"
                placeholder="student.n@ku.th"
              />
            </div>

            <button 
                type="button"
                onClick={handleSendOTP}
                disabled={timer > 0 || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-md
                  ${timer > 0 ? 'bg-gray-100 text-gray-400' : 'bg-[#2D2D86] text-white hover:bg-[#1e1e61]'}`}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : isSent ? <RefreshCw size={20} /> : <Send size={20} />}
                {timer > 0 ? `ขอรหัสใหม่ใน (${timer}s)` : isSent ? 'ส่งรหัสอีกครั้ง' : 'ขอรหัส OTP'}
            </button>

            <div className="space-y-2 pt-2">
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={12} /> Verification Code
              </label>
              <input 
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#B4C424] rounded-2xl py-4 px-5 outline-none text-center text-3xl tracking-[0.3em] font-black text-[#2D2D86]"
                placeholder="000000"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-[#B4C424] text-white py-4 rounded-2xl text-xl font-black shadow-lg hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;