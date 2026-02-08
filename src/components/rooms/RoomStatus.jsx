import React from 'react';
import { Loader2, AlertCircle, User, Clock } from "lucide-react";
import Button from "../common/Button.jsx";

// 1. หน้า Loading
export const LoadingState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-[#2D2D86]">
    <Loader2 className="animate-spin text-[#B4C424] mb-4" size={50} />
    <p className="text-white font-black italic tracking-widest animate-pulse uppercase">Syncing Data...</p>
  </div>
);

// 2. หน้า Error
export const ErrorState = ({ message, onBack }) => (
  <div className="h-screen flex flex-col items-center justify-center p-8 bg-white text-center">
    <AlertCircle size={64} className="text-red-500 mb-4" />
    <h2 className="text-2xl font-black text-[#2D2D86] uppercase italic">Error Occurred</h2>
    <p className="text-gray-500 mt-2 mb-8 font-bold">{message}</p>
    <Button variant="secondary" size="lg" onClick={onBack} className="w-full max-w-xs font-black uppercase tracking-wider">
      BACK TO SCANNER
    </Button>
  </div>
);

// 3. รายการตารางเวลา (Schedule Item)
export const ScheduleItem = ({ item }) => (
  <div className="relative pl-6 border-l-2 border-[#B4C424] pb-2">
    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#B4C424]"></div>
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <User size={14} className="text-[#2D2D86]" />
        <p className="text-sm font-black text-[#2D2D86]">{item.full_name}</p>
      </div>
      <div className="bg-[#2D2D86] text-[#B4C424] px-3 py-1 rounded-lg text-[10px] font-black">
        {item.start_time} - {item.end_time}
      </div>
    </div>
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
        <Clock size={10} /> Purpose
      </p>
      <p className="text-sm font-bold text-gray-600 italic leading-tight">"{item.purpose}"</p>
    </div>
  </div>
);