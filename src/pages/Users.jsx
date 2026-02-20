import React, { useState } from "react";
import { ChevronLeft, Plus, Edit3, Trash2, UserCog, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import UserFormModal from "../components/user/UserFormModal.jsx"; // 🚩 Import Logic จากไฟล์ใหม่

const Users = () => {
  const navigate = useNavigate();
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้รายนี้?`)) {
      const result = await deleteUser(userId);
      if (!result.success) alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="p-6 pb-24 flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="none" onClick={() => navigate(-1)} className="text-[#B2BB1E] bg-transparent shadow-none border-none">
              <ChevronLeft size={28} />
            </Button>
            <h1 className="text-3xl font-bold text-[#302782]">จัดการผู้ใช้งาน</h1>
          </div>
          <Button onClick={() => openModal()} className="bg-[#B2BB1E] text-[#FFFFFF] rounded-2xl px-6 py-3 flex items-center gap-2 font-bold shadow-sm border-none hover:bg-opacity-90 transition-colors">
            <Plus size={20} /> เพิ่มผู้ใช้ใหม่
          </Button>
        </div>

        {/* User List */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#302782] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold">กำลังดึงข้อมูลผู้ใช้งาน...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((u) => (
                <div key={u.user_id} className="bg-[#FFFFFF] p-6 rounded-[35px] shadow-sm border border-gray-100 flex justify-between items-center transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-[#302782] border border-gray-100">
                      <UserCog size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500">{u.title}</span>
                        <h3 className="text-xl font-bold text-[#302782] leading-none">{u.name} {u.surname}</h3>
                      </div>
                      <p className="text-gray-500 font-medium text-xs flex items-center gap-1 mt-1.5">
                        <Mail size={12}/> {u.email}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] bg-gray-100 text-[#302782] font-bold">
                        {u.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(u)} className="p-3 bg-[#FFFFFF] border border-gray-200 rounded-2xl text-gray-400 hover:text-[#302782] transition-colors" title="แก้ไข">
                      <Edit3 size={22} />
                    </button>
                    <button onClick={() => handleDelete(u.user_id)} className="p-3 bg-[#FFFFFF] border border-gray-200 rounded-2xl text-gray-400 hover:text-gray-600 transition-colors" title="ลบ">
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <UserFormModal 
          user={editingUser} 
          onClose={() => setIsModalOpen(false)} 
          onSave={editingUser ? updateUser : addUser}
        />
      )}
    </div>
  );
};

export default Users;