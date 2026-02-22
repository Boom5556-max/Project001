import React, { useState } from "react";
// ✨ เพิ่ม Check และ AlertCircle เข้ามาใช้งานกับ Popup
import { X, Save, UserCheck, ChevronDown, Check, AlertCircle } from "lucide-react";
import Button from "../common/Button.jsx";

// ✨ รับ showAlert ผ่าน props
const UserFormModal = ({ user, onClose, onSave, showAlert }) => {
  const [formData, setFormData] = useState({
    user_id: user?.user_id || "",
    title: user?.title || "",
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    role: user?.role || "teacher",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSave(formData.user_id, formData);
    
    // ✨ เปลี่ยนจาก alert() เป็น showAlert()
    if (result.success) {
      onClose();
      showAlert(
        "บันทึกข้อมูลสำเร็จ",
        <Check size={50} className="text-green-500" />,
        null,
        false
      );
    } else {
      showAlert(
        "เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกข้อมูลได้"),
        <AlertCircle size={50} className="text-red-500" />,
        null,
        false
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 font-sans">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#FFFFFF] w-full max-w-lg rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] border border-white flex flex-col max-h-[95vh]"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#302782] mb-1">
              {user ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
            </h2>
            <p className="text-xs md:text-sm font-medium text-gray-400">กรุณาระบุข้อมูลรายละเอียดให้ครบถ้วน</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2.5 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow mb-6">
          {/* User ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-500 ml-1">รหัสประจำตัว (User ID)</label>
            <input 
              disabled={!!user}
              className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all disabled:opacity-50 placeholder:text-gray-300 text-sm md:text-base" 
              value={formData.user_id} 
              onChange={e => setFormData({...formData, user_id: e.target.value})} 
              placeholder="ตัวอย่างเช่น T001 หรือ S001"
              required 
            />
          </div>

          {/* Title & Name Group */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4 flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-500 ml-1">คำนำหน้า</label>
              <div className="relative">
                <select 
                  className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] font-bold text-[#302782] cursor-pointer appearance-none transition-all text-sm md:text-base" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                >
                  <option value="">เลือก</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                  <option value="ดร.">ดร.</option>
                  <option value="ผศ.ดร.">ผศ.ดร.</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="col-span-8 flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-500 ml-1">ชื่อ</label>
              <input 
                className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all text-sm md:text-base" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Surname */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-500 ml-1">นามสกุล</label>
            <input 
              className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all text-sm md:text-base" 
              value={formData.surname} 
              onChange={e => setFormData({...formData, surname: e.target.value})} 
              required 
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-500 ml-1">อีเมลติดต่อ</label>
            <input 
              type="email" 
              className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all text-sm md:text-base" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="example@ku.th"
              required 
            />
          </div>

          {/* Role selection */}
          <div className="flex flex-col gap-1.5 pb-2">
            <label className="text-[13px] font-bold text-gray-500 ml-1">สิทธิ์การใช้งานระบบ (Role)</label>
            <div className="relative">
              <select 
                className="w-full p-3 md:p-3.5 bg-gray-50 border border-gray-200 rounded-[16px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] font-bold text-[#302782] appearance-none cursor-pointer transition-all text-sm md:text-base" 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="teacher">อาจารย์ (Teacher)</option>
                <option value="staff">เจ้าหน้าที่ (Staff)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex-shrink-0">
          <Button 
            type="submit" 
            className="w-full bg-[#302782] text-[#FFFFFF] py-4 rounded-[18px] font-bold text-lg shadow-lg shadow-[#302782]/20 hover:bg-opacity-90 transition-all border-none flex items-center justify-center gap-2"
          >
            <Save size={20} /> {user ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูลผู้ใช้งาน'}
          </Button>
        </div>
      </form>

    </div>
  );
};

export default UserFormModal;