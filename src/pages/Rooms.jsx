import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Monitor,
  Computer,
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
              false,
            );
          } else {
            showAlert(
              "ลบห้องเรียนสำเร็จ",
              <Check size={50} className="text-green-500" />,
              null,
              false,
            );
          }
        }, 150);
      },
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
                {/* ส่ง room data เข้าไป Logic การแสดงผลสีเทาจะอยู่ใน RoomCard */}
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

// --- Sub-Component: Modal Form ---
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
        <Check size={50} className="text-green-500" />,
        null,
        false,
      );
    } else {
      showAlert(
        "เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกข้อมูลได้"),
        <AlertCircle size={50} className="text-red-500" />,
        null,
        false,
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] w-full max-w-2xl rounded-[32px] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 md:p-8 pb-4 bg-white z-10 border-b border-gray-50">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#302782]">
              {room ? "แก้ไขข้อมูลห้องเรียน" : "เพิ่มห้องเรียนใหม่"}
            </h2>
            <div className="h-1 w-12 bg-[#B2BB1E] mt-1 rounded-full"></div>{" "}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 ml-1">
                รหัสห้องเรียน
              </label>
              <input
                disabled={!!room}
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] disabled:opacity-50 text-sm"
                value={formData.room_id}
                onChange={(e) =>
                  setFormData({ ...formData, room_id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 ml-1">
                ประเภทห้อง
              </label>
              <input
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] text-sm"
                value={formData.room_type}
                onChange={(e) =>
                  setFormData({ ...formData, room_type: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-gray-500 ml-1">
                อาคาร
              </label>
              <select
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] cursor-pointer appearance-none text-sm"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              >
                <option value="อาคาร 26 คณะวิทยาศาสตร์ ศรีราชา">
                  อาคาร 26 คณะวิทยาศาสตร์ ศรีราชา
                </option>
                <option value="อาคาร 15 ปฏิบัติการวิทยาศาสตร์และเทคโนโลยี">
                  อาคาร 15 ปฏิบัติการวิทยาศาสตร์และเทคโนโลยี
                </option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 ml-1">
              ความจุ (คน)
            </label>
            <input
              type="number"
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] text-sm"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 ml-1">
              สถานะห้อง
            </label>
            <select
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] cursor-pointer appearance-none text-sm"
              value={formData.repair.toString()}
              onChange={(e) =>
                setFormData({ ...formData, repair: e.target.value === "true" })
              }
            >
              <option value="false">ใช้งานได้ปกติ</option>
              <option value="true">งดใช้งาน (อยู่ระหว่างซ่อม)</option>
            </select>
          </div>

          <div className="space-y-1 mb-4">
            <label className="text-[11px] font-bold text-gray-500 ml-1">
              ลักษณะห้องเรียน
            </label>
            <textarea
              rows="2"
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#B2BB1E] outline-none font-medium text-[#302782] resize-none text-sm"
              value={formData.room_characteristics}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  room_characteristics: e.target.value,
                })
              }
              placeholder="รายละเอียดเพิ่มเติมของห้อง..."
            />
          </div>

          <div className="mb-2 p-4 bg-gray-50/50 rounded-[24px] border border-gray-100">
            <h4 className="font-bold text-[#302782] text-sm mb-4 flex items-center gap-2">
              <Monitor size={16} /> จัดการอุปกรณ์
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <EqInput
                label="โปรเจกเตอร์"
                value={formData.equipments.projector}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    equipments: { ...formData.equipments, projector: v },
                  })
                }
              />
              <EqInput
                label="ไมโครโฟน"
                value={formData.equipments.microphone}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    equipments: { ...formData.equipments, microphone: v },
                  })
                }
              />
              <EqInput
                label="คอมฯ"
                value={formData.equipments.computer}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    equipments: { ...formData.equipments, computer: v },
                  })
                }
              />
              <EqInput
                label="กระดาน"
                value={formData.equipments.whiteboard}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    equipments: { ...formData.equipments, whiteboard: v },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 pt-4 bg-white border-t border-gray-50">
          <Button
            type="submit"
            className="w-full bg-[#B2BB1E] text-[#FFFFFF] py-4 rounded-[20px] font-bold text-base shadow-lg hover:shadow-[#B2BB1E]/20 transition-all active:scale-[0.98]"
          >
            <Save className="mr-2 inline" size={20} /> บันทึกข้อมูล
          </Button>
        </div>
      </form>
    </div>
  );
};

const EqInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-gray-400 text-center truncate">
      {label}
    </span>
    <input
      type="number"
      min="0"
      className="w-full p-2 bg-[#FFFFFF] rounded-xl border border-gray-200 text-center font-bold text-[#302782] focus:border-[#B2BB1E] outline-none text-sm shadow-sm"
      value={value ?? 0}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
    />
  </div>
);

export default Rooms;
