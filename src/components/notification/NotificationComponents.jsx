import React from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

// 1. การ์ดแสดงรายการแต่ละแถว
export const BookingCard = ({ req, variant, onClick, getFullName }) => {
  const styles = {
    pending: {
      bg: "bg-white border-2 border-gray-50",
      icon: "bg-[#2D2D86] text-[#B4C424]",
      Icon: Clock,
    },
    approved: {
      bg: "bg-emerald-50/50 border border-emerald-100",
      icon: "bg-white text-emerald-500 shadow-sm border border-emerald-50",
      Icon: CheckCircle2,
    },
    rejected: {
      bg: "bg-red-50 border-2 border-red-100",
      icon: "bg-white text-red-500 shadow-sm",
      Icon: XCircle,
    },
  };

  const { bg, icon, Icon } = styles[variant] || styles.pending;

  return (
    <div
      onClick={() => onClick(req)}
      className={`group p-4 rounded-[30px] flex items-center gap-4 transition-all cursor-pointer hover:shadow-lg mb-3 ${bg}`}
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
      <ChevronRight
        size={16}
        className="text-gray-300 group-hover:translate-x-1 transition-transform"
      />
    </div>
  );
};

// 2. หัวข้อ Section
export const SectionTitle = ({ title, icon: Icon, colorClass }) => (
  <h2 className={`flex items-center gap-3 mb-6 ml-2`}>
    {Icon && <Icon size={20} className={colorClass} />}
    <span className={`text-xl font-black uppercase leading-none ${colorClass || "text-[#2D2D86]"}`}>
      {title}
    </span>
  </h2>
);

// 3. แสดงรายละเอียดใน Modal
export const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-[25px] border border-gray-100">
    <div className="text-[#2D2D86] bg-white p-2.5 rounded-2xl shadow-sm">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-[#2D2D86]">{value || "-"}</p>
    </div>
  </div>
);

// 4. ฟิลด์แก้ไขข้อมูล
export const EditField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[10px] font-black text-[#2D2D86] uppercase ml-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-2xl border-2 border-white bg-white shadow-sm focus:border-[#2D2D86] outline-none text-sm font-bold text-[#2D2D86] transition-all"
    />
  </div>
);