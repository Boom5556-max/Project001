import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";
import RoomCard from "../components/rooms/RoomCard";
import ActionModal from "../components/common/ActionModal";
import RoomFormModal from "../components/rooms/RoomFormModal";

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
    singleButton: false,
    variant: "primary",
    showBg: true
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

  const showAlert = (title, icon, onConfirm = null, showConfirm = true, singleButton = false, variant = "primary", showBg = true) => {
    setAlertConfig({
      isOpen: true,
      title,
      icon,
      onConfirm: onConfirm || (() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))),
      showConfirm,
      singleButton,
      variant,
      showBg,
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
            showAlert("ลบไม่สำเร็จ: " + result.message, null, null, false, true, "danger", false);
          } else {
            showAlert("ลบห้องเรียนสำเร็จ", null, null, false, true, "primary", false);
          }
        }, 150);
      },
      true, false, "danger", true
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="p-4 sm:p-6 md:p-10 pb-24 flex-grow max-w-7xl mx-auto w-full">
        
        {/* Header Section: ปรับให้ Stack ในมือถือจอเล็กมาก */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="none"
              onClick={() => navigate(-1)}
              className="text-[#B2BB1E] p-1 bg-transparent hover:scale-110 transition-transform"
            >
              <ChevronLeft size={32} />
            </Button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#302782]">ห้องเรียน</h1>
          </div>

          {userRole === "staff" && (
            <Button
              onClick={() => openModal()}
              className="w-full sm:w-auto bg-[#B2BB1E] text-white rounded-2xl px-6 py-3.5 flex items-center justify-center gap-2 font-black shadow-lg hover:bg-[#302782] transition-all active:scale-95"
            >
              <Plus size={20} /> เพิ่มห้องเรียน
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-[#302782] border-t-[#B2BB1E] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold animate-pulse">กำลังดึงข้อมูลห้อง...</p>
          </div>
        ) : (
          /* Room Grid: ปรับจำนวน Column ตามขนาดหน้าจอ */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8">
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.room_id} className="relative group bg-white rounded-[35px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* ตัว RoomCard เดิม */}
                  <RoomCard room={room} />

                  {/* Staff Actions Overlay: ปรับให้ Responsive */}
                  {userRole === "staff" && (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 sm:gap-3 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); openModal(room); }}
                        className="p-2.5 sm:p-3 bg-white/90 backdrop-blur-md shadow-md rounded-xl sm:rounded-2xl text-gray-500 hover:text-[#302782] hover:bg-white transition-all border border-gray-100 active:scale-90"
                        title="แก้ไข"
                      >
                        <Edit3 size={20} className="sm:w-6 sm:h-6" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(room.room_id); }}
                        className="p-2.5 sm:p-3 bg-white/90 backdrop-blur-md shadow-md rounded-xl sm:rounded-2xl text-gray-500 hover:text-red-600 hover:bg-white transition-all border border-gray-100 active:scale-90"
                        title="ลบ"
                      >
                        <Trash2 size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                <AlertCircle size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-400 font-bold">ไม่พบข้อมูลห้องเรียน</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
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
          singleButton={alertConfig.singleButton}
          variant={alertConfig.variant}
          buttonText="ตกลง"
          onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={alertConfig.onConfirm}
          showBg={alertConfig.showBg}
        />
      )}
    </div>
  );
};

export default Rooms;