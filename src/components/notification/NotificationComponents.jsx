import React from "react";
import { Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

// 1. การ์ดแสดงรายการแต่ละแถว (ปรับโฉมใหม่ให้ดูพรีเมียม)
export const BookingCard = ({ req, variant, onClick, getFullName }) => {
  const styles = {
    pending: {
      borderColor: "border-gray-100",
      statusColor: "text-[#302782]", // ใช้น้ำเงินหลักสำหรับรออนุมัติ
      Icon: Clock,
      label: "รออนุมัติ"
    },
    approved: {
      borderColor: "border-[#B2BB1E]/20",
      statusColor: "text-[#B2BB1E]", // ใช้เขียวหลักสำหรับอนุมัติ
      Icon: CheckCircle2,
      label: "อนุมัติแล้ว"
    },
    rejected: {
      borderColor: "border-gray-100",
      statusColor: "text-gray-400", // ใช้เทาสำหรับรายการที่ถูกยกเลิก/ไม่ผ่าน
      Icon: XCircle,
      label: "ยกเลิก/ไม่อนุมัติ"
    },
  };

  const { borderColor, statusColor, Icon, label } = styles[variant] || styles.pending;

  return (
    <div
      onClick={() => onClick(req)}
      className={`group p-5 rounded-[32px] bg-[#FFFFFF] border ${borderColor} flex items-center gap-5 transition-all cursor-pointer mb-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)]`}
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-[20px] bg-gray-50 ${statusColor}`}>
        <Icon size={24} />
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-[#302782]">
            ห้อง {req.room_id || "---"}
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 ${statusColor}`}>
            {label}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-400">
          ผู้จอง: {getFullName(req)}
        </p>
      </div>
      
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-300 group-hover:text-[#302782] group-hover:bg-gray-100 transition-all">
        <ChevronRight size={20} />
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
  <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[28px] border border-gray-100 transition-colors hover:bg-gray-50">
    <div className="text-[#302782] bg-[#FFFFFF] p-3 rounded-2xl shadow-sm border border-gray-50">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-base font-bold text-[#302782] leading-tight">{value || "-"}</p>
    </div>
  </div>
);

// 4. ฟิลด์แก้ไขข้อมูล (ใช้ดีไซน์เดียวกับ Input หลักของเว็บ)
export const EditField = ({ label, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-2 w-full font-sans">
    <label className="text-xs font-bold text-gray-500 ml-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 rounded-[18px] border border-gray-200 bg-[#FFFFFF] outline-none focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-base font-bold text-[#302782] shadow-sm transition-all placeholder:text-gray-300"
    />
  </div>
);