import React from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

// 1. การ์ดแสดงรายการแต่ละแถว (ปรับโฉมใหม่ให้ดูพรีเมียม)
export const BookingCard = ({ req, variant, onClick, getFullName }) => {
  const styles = {
    pending: {
      borderColor: "border-gray-100",
      statusColor: "text-[#302782]",
      Icon: Clock,
      label: "รออนุมัติ"
    },
    approved: {
      borderColor: "border-[#B2BB1E]/20",
      statusColor: "text-[#B2BB1E]",
      Icon: CheckCircle2,
      label: "อนุมัติแล้ว"
    },
    rejected: {
      borderColor: "border-gray-100",
      statusColor: "text-gray-400",
      Icon: XCircle,
      label: "ยกเลิก/ไม่อนุมัติ"
    },
  };

  const { borderColor, statusColor, Icon, label } = styles[variant] || styles.pending;

  return (
    <div
      onClick={() => onClick(req)}
      className={`group p-4 md:p-5 rounded-[32px] bg-[#FFFFFF] border ${borderColor} flex items-center gap-3 md:gap-5 transition-all cursor-pointer mb-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] w-full overflow-hidden`}
    >
      {/* ส่วน Icon ซ้ายสุด */}
      <div className={`w-12 h-12 md:w-14 md:h-14 flex-shrink-0 flex items-center justify-center rounded-[20px] bg-gray-50 ${statusColor}`}>
        <Icon size={22} />
      </div>
      
      {/* ส่วนเนื้อหาตรงกลาง */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5 md:mb-1">
          <h3 className="font-bold text-base md:text-lg text-[#302782] truncate">
            ห้อง {req.room_id || "---"}
          </h3>
          
          {/* 🚩 แก้ไขจุดนี้: ล็อคความกว้าง Badge ให้เท่ากันทุกลูก และใช้ Flex จัดกลาง */}
          <div className="flex-shrink-0 flex justify-end">
            <span className={`text-[9px] md:text-[10px] font-bold py-1 rounded-full bg-gray-50 flex items-center justify-center w-[75px] md:w-[85px] border border-gray-50 ${statusColor}`}>
              {label}
            </span>
          </div>
        </div>
        <p className="text-xs md:text-sm font-medium text-gray-400 truncate">
          ผู้จอง: {getFullName(req)}
        </p>
      </div>
      
      {/* ส่วนลูกศรขวาสุด */}
      <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-50 text-gray-300 group-hover:text-[#302782] group-hover:bg-gray-100 transition-all">
        <ChevronRight size={18} />
      </div>
    </div>
  );
};

// 2. หัวข้อ Section (สะอาดตาและมั่นคง)
export const SectionTitle = ({ title, icon: Icon, colorClass }) => (
  <h2 className="flex items-center gap-3 mt-8 mb-6 ml-1">
    {Icon && <Icon size={24} className={colorClass || "text-[#302782]"} />}
    <span className={`text-xl font-bold ${colorClass || "text-[#302782]"}`}>
      {title}
    </span>
  </h2>
);

// 3. แสดงรายละเอียดใน Modal (จัดลำดับข้อมูลใหม่ให้อ่านง่ายขึ้น)
export const DetailItem = ({ icon: Icon, label, value }) => (
  // 🚩 ปรับ p-5 -> p-3.5 และ gap-5 -> gap-4
  <div className="flex items-center gap-4 p-3.5 bg-gray-50/50 rounded-[24px] border border-gray-100 transition-colors hover:bg-gray-50">
    <div className="text-[#302782] bg-[#FFFFFF] p-2.5 rounded-xl shadow-sm border border-gray-50 flex-shrink-0">
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm md:text-base font-bold text-[#302782] leading-tight truncate">
        {value || "-"}
      </p>
    </div>
  </div>
);

// 4. ฟิลด์แก้ไขข้อมูล (ใช้ดีไซน์เดียวกับ Input หลักของเว็บ)
export const EditField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2 w-full font-sans">
    <label className="text-xs font-bold text-gray-500 ml-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 rounded-[18px] border border-gray-200 bg-[#FFFFFF] outline-none focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-base font-bold text-[#302782] shadow-sm transition-all placeholder:text-gray-300"
    />
  </div>
);
