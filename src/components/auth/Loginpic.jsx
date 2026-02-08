import React from "react";
import Humanpic from "../../assets/image/picture1.jpg";

const Loginpic = () => {
  return (
    <div className="hidden lg:block lg:w-[55%] relative">
      <img src={Humanpic} alt="Teacher" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#2D2D86]/80 to-transparent"></div>
      <div className="absolute bottom-20 left-16 text-white max-w-md">
        <h2 className="text-6xl font-black mb-4 tracking-tight">KU Src Booking</h2>
      </div>
    </div>
  );
};

export default Loginpic;