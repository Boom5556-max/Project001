import React from 'react';
import { QrCode, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import Button from "../common/Button.jsx";

// 1. SuccessOverlay: แสดงเมื่อสแกนสำเร็จ (เน้นความชัดเจนและพรีเมียม)
export const SuccessOverlay = () => (
  <div className="absolute inset-0 bg-[#B2BB1E]/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-[100] transition-all duration-300">
    <div className="bg-[#FFFFFF] p-6 rounded-[32px] mb-6 text-[#302782] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)]">
      <CheckCircle2 size={64} strokeWidth={2.5} />
    </div>
    <h3 className="text-[#302782] font-bold text-3xl">ตรวจสอบสำเร็จ</h3>
    <p className="text-[#302782]/70 font-medium mt-2">กำลังนำคุณไปยังหน้ารายละเอียด...</p>
  </div>
);

// 2. LoadingOverlay: แสดงขณะประมวลผล (เรียบหรู ไม่บังจอทั้งหมด)
export const LoadingOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#302782]/40 backdrop-blur-md text-[#FFFFFF] z-[110]">
    <div className="bg-[#FFFFFF] p-5 rounded-[24px] mb-4 shadow-xl">
      <Loader2 className="animate-spin text-[#302782]" size={32} />
    </div>
    <p className="text-sm font-bold tracking-widest text-white drop-shadow-md">กำลังประมวลผล...</p>
  </div>
);

// 3. CameraErrorOverlay: แสดงเมื่อกล้องมีปัญหา (ใช้โทนสีที่ดูสุภาพ)
export const CameraErrorOverlay = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 p-10 text-center z-[50]">
    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-400">
      <AlertCircle size={40} />
    </div>
    <p className="text-[#FFFFFF] text-lg font-bold mb-8 leading-relaxed max-w-xs">
      {message || "ไม่สามารถเปิดใช้งานกล้องได้"}
    </p>
    <Button 
      variant="primary" 
      size="md" 
      onClick={() => window.location.reload()}
      className="bg-[#B2BB1E] text-[#FFFFFF] px-10 py-4 rounded-[18px] font-bold shadow-lg"
    >
      <RefreshCw size={20} className="mr-2" />
      <span>ลองใหม่อีกครั้ง</span>
    </Button>
  </div>
);