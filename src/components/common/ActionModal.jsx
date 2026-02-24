import React from "react";
import { X, Check } from "lucide-react";

const ActionModal = ({ 
  icon, 
  title, 
  onClose, 
  onConfirm, 
  showConfirm = true,
  singleButton = false, 
  buttonText = "ตกลง",
  variant = "primary",
  showBg = true // 🚩 Default เป็น true เพื่อไม่ให้กระทบไฟล์อื่น
}) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-6">
      <div className="bg-[#FFFFFF] rounded-[32px] p-10 w-full max-w-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] text-center border border-white">
        
        {/* 🚩 แก้ไข Logic ตรงนี้: ถ้า showBg เป็น false จะเอา Class วงกลมและสีพื้นหลังออก */}
        <div className={`mx-auto mb-8 flex items-center justify-center transition-all
          ${showBg 
            ? `w-28 h-28 rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[#302782]'}` 
            : `${variant === 'danger' ? 'text-red-500' : 'text-[#302782]'}`
          }`}>
          {icon}
        </div>

        <h3 className="text-3xl font-bold text-[#302782] mb-10 leading-tight">
          {title}
        </h3>

        {singleButton ? (
          <div className="flex justify-center">
            <button
              onClick={onConfirm || onClose}
              className="w-full py-5 bg-[#302782] text-[#FFFFFF] rounded-[20px] shadow-lg font-bold text-xl active:scale-95 transition-all"
            >
              {buttonText}
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-[20px] hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <X size={32} strokeWidth={2.5} />
            </button>
            
            {showConfirm && (
              <button
                onClick={onConfirm}
                className={`flex-1 py-5 text-[#FFFFFF] rounded-[20px] transition-colors flex items-center justify-center shadow-lg
                  ${variant === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-[#B2BB1E] hover:bg-opacity-90 shadow-lime-100'}`}
              >
                <Check size={32} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionModal;