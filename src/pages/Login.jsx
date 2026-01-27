import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // --- 1. เพิ่ม State สำหรับเก็บค่า username ---
  const [username, setUsername] = useState(''); 
  const navigate = useNavigate();

  const handleDemoSignIn = (e) => {
    e.preventDefault(); 
    
    // --- 2. ตรวจสอบเงื่อนไข และบันทึก Role ลง LocalStorage ---
    if (username === 'admin@ku.th') {
      localStorage.setItem('userRole', 'admin');
    } else if (username === 'teacher@ku.th') {
      localStorage.setItem('userRole', 'teacher');
    } else {
      // ถ้าพิมพ์อย่างอื่น หรือไม่พิมพ์เลย ให้เป็น student
      localStorage.setItem('userRole', 'student');
    }

    // ไปหน้า Dashboard
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D2D86] p-4 font-sans">
      
      <div className="bg-[#D9D9D9] w-full max-w-[360px] p-10 flex flex-col items-center shadow-2xl rounded-sm">
        
        <div className="mb-6 text-center">
          <div className="flex flex-col items-center">
             <div className="text-[#2D2D86] text-5xl font-bold leading-none">Sci</div>
             <div className="text-[#006837] text-xl font-bold tracking-[0.2em] -mt-1 flex items-center">
               KUSRC 
               <span className="w-2 h-2 bg-yellow-400 rounded-full ml-1 mb-2"></span>
             </div>
          </div>
          <h2 className="text-2xl font-bold text-black mt-4">Login</h2>
        </div>

        <form className="w-full space-y-4" onSubmit={handleDemoSignIn}>
          
          <div className="w-full">
            <label className="block text-black font-bold text-sm mb-1">username</label>
            <input 
              type="text" 
              // --- 3. ผูกค่าเข้ากับ State ---
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@ku.th หรือ teacher@ku.th"
              className="w-full bg-white border-none h-10 px-3 focus:outline-none shadow-inner text-sm"
            />
          </div>

          <div className="w-full">
            <label className="block text-black font-bold text-sm mb-1">password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                className="w-full bg-white border-none h-10 px-3 focus:outline-none shadow-inner pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-800"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-[#B4C424] text-black font-bold py-1.5 px-6 shadow-md hover:bg-[#a3b320] active:scale-95 transition-all border-none uppercase text-sm tracking-wider"
            >
              sign in
            </button>
          </div>
          
          {/* ส่วนแนะนำการทดสอบ Role */}
          <div className="mt-6 p-3 bg-white/50 rounded text-[9px] text-gray-600 leading-relaxed">
            <p className="font-bold border-b border-gray-300 mb-1">Demo Credentials:</p>
            <p>• Admin: <span className="text-[#2D2D86]">admin@ku.th</span></p>
            <p>• Teacher: <span className="text-[#2D2D86]">teacher@ku.th</span></p>
            <p>• Student: พิมพ์อะไรก็ได้ หรือปล่อยว่าง</p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;