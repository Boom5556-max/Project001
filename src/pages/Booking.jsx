import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const BookingRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [isRoomBusy, setIsRoomBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  

  const [formData, setFormData] = useState({
    room_id: id || "", // ปรับชื่อให้ตรงกับ Backend (room_id)
    date: "",
    start_time: "", // ปรับชื่อให้ตรงกับ Backend (start_time)
    end_time: "", // ปรับชื่อให้ตรงกับ Backend (end_time)
    purpose: "",
  });

  // 1. ดึงรายชื่อห้องทั้งหมด (ใส่ Header ngrok ด้วย)
  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const response = await fetch(
          "https://dave-unincited-ariyah.ngrok-free.dev/rooms/",
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        const data = await response.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchAllRooms();
  }, []);

  // 2. ฟังก์ชันส่งข้อมูลการจอง
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowStatus(false);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // 🌟 2. ถอดรหัส JWT ด้วย library (แม่นยำกว่า atob)
      const decoded = jwtDecode(token);
      const userRole = decoded?.role?.toLowerCase().trim() || "student";

      // 🌟 3. เลือก Endpoint ตาม Role จาก Token
      let endpoint = "https://dave-unincited-ariyah.ngrok-free.dev/bookings";
      if (userRole === "teacher") endpoint += "/teacher";
      if (userRole === "staff") endpoint += "/staff";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRoomBusy(false);
        setServerMessage(
          userRole === "staff"
            ? "✅ จองสำเร็จ (อนุมัติทันทีสำหรับ Staff)"
            : "✅ ส่งคำขอจองสำเร็จ"
        );
        setShowStatus(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setIsRoomBusy(true);
        setShowStatus(true);
        setServerMessage(data.message || "ห้องไม่ว่างในช่วงเวลานี้");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setServerMessage("เกิดข้อผิดพลาดในการส่งข้อมูล");
      setShowStatus(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans text-[#2D2D86]">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative border border-gray-100">
        {/* Header */}
        <div className="p-8 pb-2 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold italic">
            <span className="text-[#B4C424]">Book</span>{" "}
            <span className="text-gray-400 font-normal">a room</span>
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white rounded-full p-1 hover:rotate-90 transition-transform shadow-md"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* เลือกห้อง */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              เลือกห้อง
            </label>
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
                <option value="" disabled>
                  กรุณาเลือกห้อง
                </option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.room_type} | {r.room_id}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* วันที่ */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              วันที่
            </label>
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
          </div>

          {/* เวลา */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
                เริ่ม
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none font-medium shadow-inner"
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
                สิ้นสุด
              </label>
              <input
                type="time"
                required
                value={formData.end_time}
                className="w-full bg-gray-50 rounded-2xl py-4 px-4 outline-none font-medium shadow-inner"
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
            </div>
          </div>

          {/* วัตถุประสงค์ */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              วัตถุประสงค์
            </label>
            <textarea
              rows="3"
              placeholder="ระบุวัตถุประสงค์การใช้ห้อง..."
              required
              className="w-full bg-gray-50 border-none rounded-3xl py-4 px-4 outline-none focus:ring-2 focus:ring-[#B4C424] text-gray-600 resize-none font-medium shadow-inner"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            ></textarea>
          </div>

          {/* ปุ่มส่งคำขอ */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2D2D86] text-white py-4 rounded-2xl text-xl font-black shadow-lg active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 hover:brightness-110 disabled:bg-gray-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              "ส่งคำขอจอง"
            )}
          </button>

          {/* แสดงสถานะห้อง */}
          {showStatus && (
            <div className="mt-2 p-4 rounded-3xl bg-gray-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-800 font-bold">สถานะการจอง</span>
                <div
                  className={`${isRoomBusy ? "bg-red-500" : "bg-green-500"} text-white px-4 py-1 rounded-full font-bold text-xs uppercase shadow-sm`}
                >
                  {isRoomBusy ? "ไม่ว่าง" : "ว่าง"}
                </div>
              </div>
              <p
                className={`text-sm font-bold text-center ${isRoomBusy ? "text-red-500" : "text-green-600"}`}
              >
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
