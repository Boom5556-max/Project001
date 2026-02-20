import React, { useState } from "react";
import { X, Save, UserCheck } from "lucide-react";
import Button from "../common/Button.jsx";

const UserFormModal = ({ user, onClose, onSave }) => {
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
    if (result.success) onClose();
    else alert(result.message);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#FFFFFF] w-full max-w-lg rounded-[40px] p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] border border-white my-auto"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-bold text-[#302782] mb-1">
              {user ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
            </h2>
            <p className="text-sm font-medium text-gray-400">กรุณาระบุข้อมูลรายละเอียดให้ครบถ้วน</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 mb-12">
          {/* User ID */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 ml-1">รหัสประจำตัว (User ID)</label>
            <input 
              disabled={!!user}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all disabled:opacity-50 placeholder:text-gray-300" 
              value={formData.user_id} 
              onChange={e => setFormData({...formData, user_id: e.target.value})} 
              placeholder="ตัวอย่างเช่น T001 หรือ S001"
              required 
            />
          </div>

          {/* Title & Name Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-500 ml-1">คำนำหน้า</label>
              <select 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] font-bold text-[#302782] cursor-pointer appearance-none transition-all" 
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
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-500 ml-1">ชื่อ</label>
              <input 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Surname */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 ml-1">นามสกุล</label>
            <input 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all" 
              value={formData.surname} 
              onChange={e => setFormData({...formData, surname: e.target.value})} 
              required 
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 ml-1">อีเมลติดต่อ</label>
            <input 
              type="email" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] focus:ring-4 focus:ring-[#B2BB1E]/10 font-bold text-[#302782] transition-all" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="example@ku.th"
              required 
            />
          </div>

          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 ml-1">สิทธิ์การใช้งานระบบ (Role)</label>
            <div className="relative">
              <select 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[18px] outline-none focus:bg-[#FFFFFF] focus:border-[#B2BB1E] font-bold text-[#302782] appearance-none cursor-pointer transition-all" 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="teacher">อาจารย์ (Teacher)</option>
                <option value="staff">เจ้าหน้าที่ (Staff)</option>
                <option value="student">นิสิต (Student)</option>
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-[#302782] text-[#FFFFFF] py-5 rounded-[20px] font-bold text-xl shadow-lg shadow-[#302782]/20 hover:bg-opacity-90 transition-all border-none"
          >
            <Save className="mr-2 inline" size={24} /> บันทึกข้อมูลผู้ใช้งาน
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserFormModal;