import React, { useState } from "react";
import { X, Save } from "lucide-react";
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#2D2D86]/60 backdrop-blur-md p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-lg rounded-[45px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-[#2D2D86] italic uppercase tracking-tighter">
            {user ? 'Edit User' : 'New User'}
          </h2>
          <button type="button" onClick={onClose} className="p-3 bg-gray-100 rounded-full text-gray-400 hover:rotate-90 transition-all border-none">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5 mb-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">User ID (รหัสผู้ใช้)</label>
            <input 
              disabled={!!user}
              className="w-full p-4 bg-gray-50 rounded-[20px] border-2 border-transparent focus:border-[#B4C424] outline-none font-bold text-gray-700 transition-all disabled:opacity-50" 
              value={formData.user_id} 
              onChange={e => setFormData({...formData, user_id: e.target.value})} 
              placeholder="เช่น T001"
              required 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1 col-span-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Title</label>
              <select className="w-full p-4 bg-gray-50 rounded-[20px] border-none font-bold text-gray-700 cursor-pointer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}>
                <option value="">เลือก</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Name</label>
              <input className="w-full p-4 bg-gray-50 rounded-[20px] border-none font-bold text-gray-700" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Surname</label>
            <input className="w-full p-4 bg-gray-50 rounded-[20px] border-none font-bold text-gray-700" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email</label>
            <input type="email" className="w-full p-4 bg-gray-50 rounded-[20px] border-none font-bold text-gray-700" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Role (สิทธิ์)</label>
            <select className="w-full p-4 bg-gray-50 rounded-[20px] border-none font-bold text-[#2D2D86] appearance-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#2D2D86] text-white py-5 rounded-[25px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase italic tracking-tighter border-none">
          <Save className="mr-2 inline" size={24} /> Confirm & Save
        </Button>
      </form>
    </div>
  );
};

export default UserFormModal;