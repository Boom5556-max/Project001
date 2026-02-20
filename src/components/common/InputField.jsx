import React from "react";

const InputField = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="flex flex-col gap-2 font-sans">
      <label className="text-xs font-bold text-gray-500 flex items-center gap-2 ml-1">
        {Icon && <Icon size={16} className="text-gray-400" />} {label}
      </label>
      <input
        {...props}
        className={`w-full bg-[#FFFFFF] border border-gray-200 text-[#302782] text-base font-bold rounded-[18px] py-4 px-5 outline-none focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all placeholder:text-gray-300 placeholder:font-medium ${props.className || ""}`}
      />
    </div>
  );
};

export default InputField;