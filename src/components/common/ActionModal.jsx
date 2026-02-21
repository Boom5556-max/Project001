import React from "react";
import { X, Check } from "lucide-react";

const ActionModal = ({ icon, title, onClose, onConfirm, showConfirm = true }) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-6">
      <div className="bg-[#FFFFFF] rounded-[32px] p-10 w-full max-w-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] text-center border border-white">
        {/* Icon Area */}
        <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#302782]">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-[#302782] mb-10 leading-tight">
          {title}
        </h3>

        {/* Buttons */}
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
              className="flex-1 py-5 bg-[#B2BB1E] text-[#FFFFFF] rounded-[20px] shadow-[0_8px_20px_-8px_rgba(178,187,30,0.5)] hover:bg-opacity-90 transition-colors flex items-center justify-center"
            >
              <Check size={32} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionModal;