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
  showBg = true 
}) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#302782]/20 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFFFF] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 w-full max-w-[340px] sm:max-w-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] text-center border border-white scale-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Icon Area: ปรับขนาดตามหน้าจอ */}
        <div className={`mx-auto mb-6 sm:mb-8 flex items-center justify-center transition-all duration-500
          ${showBg 
            ? `w-20 h-20 sm:w-28 sm:h-28 rounded-[24px] sm:rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-[#302782]'}` 
            : `${variant === 'danger' ? 'text-red-500' : 'text-[#302782]'}`
          }`}>
          <div className="scale-75 sm:scale-100">
            {icon}
          </div>
        </div>

        {/* Title: ปรับขนาดฟอนต์ให้กระชับขึ้นบนมือถือ */}
        <h3 className="text-2xl sm:text-3xl font-black text-[#302782] mb-8 sm:mb-10 leading-tight tracking-tight">
          {title}
        </h3>

        {singleButton ? (
          <div className="flex justify-center">
            <button
              onClick={onConfirm || onClose}
              className="w-full py-4 sm:py-5 bg-[#302782] text-[#FFFFFF] rounded-[18px] sm:rounded-[20px] shadow-lg shadow-[#302782]/20 font-bold text-lg sm:text-xl active:scale-95 transition-all"
            >
              {buttonText}
            </button>
          </div>
        ) : (
          <div className="flex gap-3 sm:gap-4">
            {/* ปุ่มยกเลิก */}
            <button
              onClick={onClose}
              className="flex-1 py-4 sm:py-5 bg-gray-50 text-gray-400 rounded-[18px] sm:rounded-[20px] hover:bg-gray-100 transition-colors flex items-center justify-center active:scale-95"
            >
              <X size={28} sm:size={32} strokeWidth={2.5} />
            </button>
            
            {/* ปุ่มยืนยัน */}
            {showConfirm && (
              <button
                onClick={onConfirm}
                className={`flex-1 py-4 sm:py-5 text-[#FFFFFF] rounded-[18px] sm:rounded-[20px] transition-all flex items-center justify-center shadow-lg active:scale-95
                  ${variant === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                    : 'bg-[#B2BB1E] hover:bg-opacity-90 shadow-lime-100'}`}
              >
                <Check size={28} sm:size={32} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ActionModal;