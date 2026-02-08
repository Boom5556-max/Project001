import React from 'react';
import { QrCode, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Button from  "../common/Button.jsx";

// โชว์เมื่อสแกนสำเร็จ
export const SuccessOverlay = () => (
  <div className="absolute inset-0 bg-[#B4C424] flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in zoom-in">
    <div className="bg-white p-5 rounded-full mb-4 text-[#2D2D86] shadow-2xl animate-bounce">
      <QrCode size={50} />
    </div>
    <h3 className="text-[#2D2D86] font-black text-3xl italic uppercase">Verified!</h3>
  </div>
);

// โชว์เมื่อกำลังประมวลผลไฟล์
export const LoadingOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white z-30">
    <Loader2 className="animate-spin mb-3 text-[#B4C424]" size={40} />
    <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">Scanning...</p>
  </div>
);

// โชว์เมื่อกล้องมีปัญหา
export const CameraErrorOverlay = ({ message }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 p-8 text-center z-10">
    <AlertCircle size={48} className="text-red-500 mb-4" />
    <p className="text-white text-sm font-bold mb-6 leading-relaxed">{message}</p>
    <Button 
      variant="ghost" size="none" 
      onClick={() => window.location.reload()}
      className="bg-white text-[#2D2D86] font-black text-[10px] px-6 py-3 rounded-xl uppercase shadow-md"
    >
      <RefreshCw size={14} className="mr-2" />
      <span>Try Again</span>
    </Button>
  </div>
);