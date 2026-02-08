import React from 'react';
import { Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

// การ์ดแสดงรายการแต่ละแถว
export const BookingCard = ({ req, variant, onClick, getFullName }) => {
  const styles = {
    pending: { bg: "bg-white border-2 border-gray-50", icon: "bg-[#2D2D86] text-[#B4C424]", Icon: Clock },
    approved: { bg: "bg-emerald-50/50 border border-emerald-100", icon: "bg-white text-emerald-500 shadow-sm border border-emerald-50", Icon: CheckCircle2 },
    rejected: { bg: "bg-red-50 border-2 border-red-100", icon: "bg-white text-red-500 shadow-sm", Icon: XCircle }
  };

  const { bg, icon, Icon } = styles[variant];

  return (
    <div 
      onClick={() => onClick(req)}
      className={`group p-4 rounded-[30px] flex items-center gap-4 transition-all cursor-pointer hover:shadow-lg ${bg}`}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${icon}`}>
        <Icon size={20} />
      </div>
      <div className="flex-grow">
        <h3 className="font-black text-sm uppercase text-[#2D2D86]">
          ห้อง {req.room_id || "---"}
        </h3>
        <p className="text-[10px] font-bold uppercase text-gray-400">
          {getFullName(req)}
        </p>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

// หัวข้อ Section
export const SectionTitle = ({ title, icon: Icon, colorClass }) => (
  <h2 className={`flex items-center gap-3 mb-6 ml-2`}>
    {Icon && <Icon size={20} className={colorClass} />}
    <span className={`text-xl font-black uppercase leading-none ${colorClass || "text-[#2D2D86]"}`}>
      {title}
    </span>
  </h2>
);