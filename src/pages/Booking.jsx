import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import Button from "../components/common/Button.jsx";
import { useBookingLogic } from "../hooks/useBooking.js"; // นำเข้า Logic
import { FormField } from "../components/common/FormField.jsx"; // นำเข้า UI ย่อย

const BookingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    rooms, formData, setFormData, handleSubmit,
    isLoading, showStatus, isRoomBusy, serverMessage, setShowStatus
  } = useBookingLogic(id);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-[#FFFFFF] w-full max-w-lg rounded-[40px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative border border-gray-100">
        
        {/* Header Section */}
        <div className="px-10 pt-10 pb-6 flex justify-between items-start border-b border-gray-50">
          <div>
            <h1 className="text-3xl font-bold text-[#302782] mb-2">จองห้องเรียน</h1>
            <p className="text-sm font-medium text-gray-400">กรุณากรอกรายละเอียดด้านล่างเพื่อดำเนินการ</p>
          </div>
          <Button 
            variant="ghost" 
            size="none" 
            onClick={() => navigate(-1)} 
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          
          {/* 1. เลือกห้อง */}
          <FormField label="เลือกห้อง">
            <div className="relative">
              <select
                required
                value={formData.room_id}
                onChange={(e) => {
                  setFormData({ ...formData, room_id: e.target.value });
                  setShowStatus(false);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 appearance-none text-[#302782] font-bold transition-all"
              >
                <option value="" disabled>กรุณาเลือกห้อง</option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>{r.room_type} | {r.room_id}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
            </div>
          </FormField>

          {/* 2. วันที่ */}
          <FormField label="วันที่">
            <input
              type="date"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-[#302782] font-medium transition-all"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setShowStatus(false);
              }}
            />
          </FormField>

          {/* 3. เวลา */}
          <div className="grid grid-cols-2 gap-5">
            <FormField label="เวลาเริ่ม">
              <input
                type="time" required value={formData.start_time}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-[#302782] font-medium transition-all"
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </FormField>
            <FormField label="เวลาสิ้นสุด">
              <input
                type="time" required value={formData.end_time}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-[#302782] font-medium transition-all"
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </FormField>
          </div>

          {/* 4. วัตถุประสงค์ */}
          <FormField label="วัตถุประสงค์">
            <textarea
              rows="3" placeholder="ระบุวัตถุประสงค์การใช้งาน..." required
              className="w-full bg-gray-50 border border-gray-200 rounded-[24px] py-4 px-5 outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 text-[#302782] resize-none font-medium transition-all leading-relaxed"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            ></textarea>
          </FormField>

          {/* 5. ปุ่มส่งคำขอ */}
          <div className="pt-2">
            <Button 
              type="submit" 
              variant="secondary" 
              isLoading={isLoading} 
              disabled={isLoading} 
              className="w-full py-4 text-lg font-bold rounded-[20px] shadow-sm bg-[#302782] text-[#FFFFFF] hover:bg-opacity-90"
            >
              ส่งคำขอจองห้องเรียน
            </Button>
          </div>

          {/* Status Message Card */}
          {showStatus && (
            <div className="mt-6 p-6 rounded-[24px] border border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">สถานะการตรวจสอบ</span>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${isRoomBusy ? "bg-red-50 text-red-600" : "bg-[#B2BB1E]/10 text-[#B2BB1E]"}`}>
                  {isRoomBusy ? "ไม่ว่าง" : "ว่าง"}
                </div>
              </div>
              <p className={`text-sm font-bold ${isRoomBusy ? "text-red-600" : "text-[#302782]"}`}>
                {serverMessage}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingRoom;