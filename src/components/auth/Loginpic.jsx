import React from "react";
import Humanpic from "../../assets/image/picture1.jpg";

const Loginpic = () => {
  return (
    <div className="w-full h-[35vh] lg:h-auto lg:w-[55%] relative shrink-0">
      <img 
        src={Humanpic} 
        alt="Teacher" 
        className="absolute inset-0 w-full h-full object-cover object-top lg:object-center" 
      />
      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-tr from-[#2D2D86]/90 via-[#2D2D86]/40 to-transparent"></div>
      
      {/* 🟢 แก้ตรงนี้: ลดจาก bottom-20 เป็น bottom-12 และตัวหนังสือเหลือ 5xl สำหรับโน้ตบุ๊ก (lg) */}
      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 xl:bottom-20 xl:left-16 text-white max-w-md z-10">
        <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black mb-1 lg:mb-2 tracking-tight drop-shadow-md">
          KU Src<br/>Booking
        </h2>
        <p className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-white/90 uppercase tracking-widest drop-shadow">
          Classroom
        </p>
      </div>
    </div>
  );
};

export default Loginpic;