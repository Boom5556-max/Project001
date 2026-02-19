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
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8F9FA] p-6 pb-24 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="none" onClick={() => navigate(-1)} className="text-[#B4C424] bg-transparent shadow-none border-none">
              <ChevronLeft size={28} />
            </Button>
            <h1 className="text-3xl font-black text-[#2D2D86] italic uppercase tracking-tighter">User Management</h1>
          </div>
          <Button onClick={() => openModal()} className="bg-[#B4C424] text-white rounded-full px-6 py-3 flex items-center gap-2 font-bold shadow-lg border-none">
            <Plus size={20} /> เพิ่มผู้ใช้ใหม่
          </Button>
        </div>

        {/* User List */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#B4C424] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((u) => (
                <div key={u.user_id} className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#2D2D86] rounded-[24px] flex items-center justify-center text-[#B4C424] shadow-lg">
                      <UserCog size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#B4C424]">{u.title}</span>
                        <h3 className="text-xl font-black text-[#2D2D86] italic uppercase leading-none">{u.name} {u.surname}</h3>
                      </div>
                      <p className="text-gray-400 font-bold text-xs flex items-center gap-1 mt-1.5"><Mail size={12}/> {u.email}</p>
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[9px] bg-blue-50 text-blue-500 font-black uppercase tracking-widest">{u.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(u)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-amber-500 transition-all border-none"><Edit3 size={22} /></button>
                    <button onClick={() => handleDelete(u.user_id)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all border-none"><Trash2 size={22} /></button>
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
    </>
  );
};

export default Users;