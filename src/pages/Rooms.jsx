import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react"; // เอา icon ที่ไม่ใช้ในหน้านี้ออกไปบ้างแล้ว
import { useNavigate } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomCard from "../components/rooms/RoomCard";
import ActionModal from "../components/common/ActionModal";
import RoomFormModal from "../components/rooms/RoomFormModal"; // ✨ ดึง Component ที่เราแยกมาใช้งาน

const Rooms = () => {
  const navigate = useNavigate();
  const { rooms, isLoading, addRoom, updateRoom, deleteRoom } = useRooms();

  const [userRole, setUserRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    icon: null,
    onConfirm: null,
    showConfirm: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded?.role?.toLowerCase().trim() || "student");
      } catch (err) {
        console.error("Token Decode Error:", err);
      }
    }
  }, []);

  const openModal = (room = null) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const showAlert = (title, icon, onConfirm = null, showConfirm = true) => {
    setAlertConfig({
      isOpen: true,
      title,
      icon,
      onConfirm:
        onConfirm ||
        (() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))),
      showConfirm,
    });
  };

  const handleDelete = async (roomId) => {
    showAlert(
      `คุณแน่ใจหรือไม่ที่จะลบห้อง ${roomId}?`,
      <Trash2 size={50} className="text-red-500" />,
      async () => {
        const result = await deleteRoom(roomId);
        setAlertConfig((prev) => ({ ...prev, isOpen: false }));

        setTimeout(() => {
          if (!result.success) {
            showAlert(
              "ลบไม่สำเร็จ: " + result.message,
              <AlertCircle size={50} className="text-red-500" />,
              null,
              false
            );
          } else {
            showAlert(
              "ลบห้องเรียนสำเร็จ",
              <Check size={50} className="text-green-500" />,
              null,
              false
            );
          }
        }, 150);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="p-6 pb-24 flex-grow max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="none"
              onClick={() => navigate(-1)}
              className="text-[#B2BB1E] p-0 bg-transparent"
            >
              <ChevronLeft size={28} />
            </Button>
            <h1 className="text-3xl font-bold text-[#302782]">ห้องเรียน</h1>
          </div>

          {userRole === "staff" && (
            <Button
              onClick={() => openModal()}
              className="bg-[#B2BB1E] text-[#FFFFFF] rounded-2xl px-6 py-3 flex items-center gap-2 font-bold shadow-sm"
            >
              <Plus size={20} /> เพิ่มห้อง
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#302782] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold">กำลังดึงข้อมูลห้อง...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {rooms.map((room) => (
              <div key={room.room_id} className="relative group">
                <RoomCard room={room} />

                {userRole === "staff" && (
                  <div className="RoomCard top-6 right-6 flex gap-3 z-10">
                    <button
                      onClick={() => openModal(room)}
                      className="p-3 bg-[#FFFFFF] shadow-sm rounded-2xl text-gray-500 hover:text-[#302782] transition-colors border border-gray-200"
                      title="แก้ไข"
                    >
                      <Edit3 size={24} />
                    </button>

                    <button
                      onClick={() => handleDelete(room.room_id)}
                      className="p-3 bg-[#FFFFFF] shadow-sm rounded-2xl text-gray-500 hover:text-red-600 transition-colors border border-gray-200"
                      title="ลบ"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✨ เรียกใช้งาน Component ที่นำเข้ามา */}
      {isModalOpen && (
        <RoomFormModal
          room={editingRoom}
          onClose={() => setIsModalOpen(false)}
          onSave={editingRoom ? updateRoom : addRoom}
          showAlert={showAlert}
        />
      )}

      {alertConfig.isOpen && (
        <ActionModal
          icon={alertConfig.icon}
          title={alertConfig.title}
          showConfirm={alertConfig.showConfirm}
          onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </div>
  );
};

export default Rooms;