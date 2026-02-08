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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-[#2D2D86]">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative border border-gray-100">
        
        {/* Header */}
        <div className="p-8 pb-2 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold italic">
            <span className="text-[#B4C424]">Book</span> <span className="text-gray-400 font-normal">a room</span>
          </h1>
          <Button variant="danger" size="icon" onClick={() => navigate(-1)} className="hover:rotate-90 p-1">
            <X size={24} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
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
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-[#B4C424] appearance-none text-gray-600 font-bold shadow-inner"
              >
                <option value="" disabled>กรุณาเลือกห้อง</option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>{r.room_type} | {r.room_id}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
            </div>
          </FormField>

          {/* 2. วันที่ */}
          <FormField label="วันที่">
            <input
              type="date"
              required
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-[#B4C424] text-gray-600 font-medium shadow-inner"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                setShowStatus(false);
              }}
            />
          </FormField>

          {/* 3. เวลา */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="เริ่ม">
              <input
                type="time" required value={formData.start_time}
                className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none font-medium shadow-inner"
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </FormField>
            <FormField label="สิ้นสุด">
              <input
                type="time" required value={formData.end_time}
                className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none font-medium shadow-inner"
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </FormField>
          </div>

          {/* 4. วัตถุประสงค์ */}
          <FormField label="วัตถุประสงค์">
            <textarea
              rows="3" placeholder="ระบุวัตถุประสงค์การใช้ห้อง..." required
              className="w-full bg-gray-50 border-none rounded-3xl py-4 px-4 outline-none focus:ring-2 focus:ring-[#B4C424] text-gray-600 resize-none font-medium shadow-inner"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            ></textarea>
          </FormField>

          {/* 5. ปุ่มส่งคำขอ */}
          <Button type="submit" variant="secondary" isLoading={isLoading} disabled={isLoading} className="w-full mt-4 text-xl">
            ส่งคำขอจอง
          </Button>

          {/* Status Message */}
          {showStatus && (
            <div className={`mt-2 p-4 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-bold">สถานะการจอง</span>
                <div className={`${isRoomBusy ? "bg-red-500" : "bg-green-500"} text-white px-4 py-1 rounded-full font-bold text-xs uppercase`}>
                  {isRoomBusy ? "ไม่ว่าง" : "ว่าง"}
                </div>
              </div>
              <p className={`text-sm font-bold text-center ${isRoomBusy ? "text-red-500" : "text-green-600"}`}>
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