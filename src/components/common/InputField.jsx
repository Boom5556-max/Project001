import React from "react";

const InputField = ({ label, icon: Icon, ...props }) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        {Icon && <Icon size={12} />} {label}
      </label>
      <input
        {...props}
        className={`w-full bg-gray-50 border-2 border-transparent focus:border-[#B4C424] rounded-2xl py-4 px-5 outline-none font-semibold transition-all ${props.className}`}
      />
    </div>
  );
};

export default InputField;