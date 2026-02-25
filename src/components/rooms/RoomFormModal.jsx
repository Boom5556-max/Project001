import React, { useState } from "react";
import { X, Monitor, Save, Check, AlertCircle, Trash2 } from "lucide-react";
import Button from "../common/Button.jsx";
import InputField from "../common/InputField.jsx"; // เรียกใช้ InputField ที่เรา Refactor ไว้

const RoomFormModal = ({ room, onClose, onSave, showAlert }) => {
  const [formData, setFormData] = useState({
    room_id: room?.room_id || "",
    room_type: room?.room_type || "",
    location: room?.location || "อาคาร 26 คณะวิทยาศาสตร์ ศรีราชา",
    capacity: room?.capacity ?? 0,
    room_characteristics: room?.room_characteristics || "",
    repair: room?.repair ?? false,
    equipments: {
      projector: room?.equipments?.projector ?? 0,
      microphone: room?.equipments?.microphone ?? 0,
      computer: room?.equipments?.computer ?? 0,
      whiteboard: room?.equipments?.whiteboard ?? 0,
      type_of_computer: room?.equipments?.type_of_computer || "-",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      room_id: formData.room_id.trim(),
      room_type: formData.room_type.trim(),
      capacity: parseInt(formData.capacity) || 0,
      equipments: {
        ...formData.equipments,
        projector: parseInt(formData.equipments.projector) || 0,
        microphone: parseInt(formData.equipments.microphone) || 0,
        computer: parseInt(formData.equipments.computer) || 0,
        whiteboard: parseInt(formData.equipments.whiteboard) || 0,
      },
    };
    const result = await onSave(payload.room_id, payload);
    if (result.success) {
      onClose();
      showAlert(
        "บันทึกข้อมูลสำเร็จ",
        <Check size={50} className="text-[#B2BB1E]" />,
        null,
        false
      );
    } else {
      showAlert(
        "เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกข้อมูลได้"),
        <AlertCircle size={50} className="text-red-500" />,
        null,
        false,
        "danger"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-[#302782]/30 backdrop-blur-md p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] w-full max-w-2xl rounded-t-[40px] sm:rounded-[40px] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 md:p-8 pb-4 border-b border-gray-50">
          <div>
            <h2 className="text-2xl font-black text-[#302782]">
              {room ? "แก้ไขข้อมูลห้อง" : "เพิ่มห้องเรียนใหม่"}
            </h2>
            <p className="text-xs font-bold text-[#B2BB1E] uppercase tracking-widest mt-1">
              Room Management System
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 custom-scrollbar space-y-6">
          
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="รหัสห้องเรียน"
              disabled={!!room}
              placeholder="เช่น 26-301"
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
              required
            />
            <InputField
              label="ประเภทห้อง"
              placeholder="เช่น ห้องบรรยาย"
              value={formData.room_type}
              onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
              required
            />
          </div>

          {/* Location Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">สถานที่ตั้ง / อาคาร</label>
            <select
              className="w-full p-4 bg-gray-50 rounded-[20px] border-2 border-transparent focus:border-[#B2BB1E] focus:bg-white outline-none font-bold text-[#302782] transition-all cursor-pointer appearance-none text-sm"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="อาคาร 26 คณะวิทยาศาสตร์ ศรีราชา">อาคาร 26 คณะวิทยาศาสตร์ ศรีราชา</option>
              <option value="อาคาร 15 ปฏิบัติการวิทยาศาสตร์และเทคโนโลยี">อาคาร 15 ปฏิบัติการวิทยาศาสตร์และเทคโนโลยี</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="ความจุ (จำนวนที่นั่ง)"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">สถานะการเปิดใช้งาน</label>
              <select
                className={`w-full p-4 rounded-[20px] border-2 outline-none font-bold transition-all cursor-pointer appearance-none text-sm ${
                  formData.repair ? "bg-red-50 border-red-100 text-red-600 focus:border-red-400" : "bg-gray-50 border-transparent focus:border-[#B2BB1E] focus:bg-white text-[#302782]"
                }`}
                value={formData.repair.toString()}
                onChange={(e) => setFormData({ ...formData, repair: e.target.value === "true" })}
              >
                <option value="false">✅ ใช้งานได้ปกติ</option>
                <option value="true">🛠️ งดใช้งาน (อยู่ระหว่างซ่อม)</option>
              </select>
            </div>
          </div>

          {/* Characteristics Area */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">ลักษณะห้องเรียน / รายละเอียดเพิ่มเติม</label>
            <textarea
              rows="3"
              className="w-full p-4 bg-gray-50 rounded-[24px] border-2 border-transparent focus:border-[#B2BB1E] focus:bg-white outline-none font-bold text-[#302782] resize-none transition-all placeholder:text-gray-300"
              value={formData.room_characteristics}
              onChange={(e) => setFormData({ ...formData, room_characteristics: e.target.value })}
              placeholder="ระบุรายละเอียด เช่น ห้อง Slope, มีแอร์ 2 ตัว..."
            />
          </div>

          {/* Equipment Section */}
          <div className="p-5 sm:p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
            <h4 className="font-black text-[#302782] text-sm mb-5 flex items-center gap-2 uppercase tracking-wide">
              <Monitor size={18} className="text-[#B2BB1E]" /> รายการอุปกรณ์ภายในห้อง
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <EqInput label="โปรเจกเตอร์" value={formData.equipments.projector} onChange={(v) => setFormData({ ...formData, equipments: { ...formData.equipments, projector: v }})} />
              <EqInput label="ไมโครโฟน" value={formData.equipments.microphone} onChange={(v) => setFormData({ ...formData, equipments: { ...formData.equipments, microphone: v }})} />
              <EqInput label="คอมพิวเตอร์" value={formData.equipments.computer} onChange={(v) => setFormData({ ...formData, equipments: { ...formData.equipments, computer: v }})} />
              <EqInput label="กระดาน" value={formData.equipments.whiteboard} onChange={(v) => setFormData({ ...formData, equipments: { ...formData.equipments, whiteboard: v }})} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 bg-white border-t border-gray-50 flex gap-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-[2] py-4.5"
          >
            <Save size={20} /> บันทึกข้อมูลห้อง
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onClose}
            className="flex-1 py-4.5"
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
};

// Sub-component สำหรับช่องกรอกอุปกรณ์
const EqInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-[#B2BB1E]/30">
    <span className="text-[10px] font-black text-gray-400 text-center uppercase tracking-tighter truncate">
      {label}
    </span>
    <input
      type="number"
      min="0"
      className="w-full bg-transparent text-center font-black text-lg text-[#302782] outline-none"
      value={value ?? 0}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
    />
  </div>
);

export default RoomFormModal;