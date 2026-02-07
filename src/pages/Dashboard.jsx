import React, { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Bell,
  QrCode,
  FilePlus,
  X,
  CheckCircle2,
  LayoutGrid,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [roomCount, setRoomCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0); // 🌟 สถานะรออนุมัติ
  const [approvedCount, setApprovedCount] = useState(0); // 🌟 สถานะอนุมัติแล้ว
  const [userName, setUserName] = useState("");
  



// --- 2. ภายใน Component ---
useEffect(() => {
  const token = localStorage.getItem("token");
  
  // --- ส่วนจัดการข้อมูล User จาก Token ---
  if (token) {
    try {
      // 🌟 2. ใช้ jwtDecode แทนฟังก์ชันเดิม บรรทัดเดียวจบ
      const decoded = jwtDecode(token);
      setUserRole(decoded.role ? decoded.role.toLowerCase() : "student");
      setUserName(decoded.name || decoded.username || "User");

      // แถม: เช็กวันหมดอายุเบื้องต้น (ถ้ามี exp ใน token)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("Token expired");
        // สั่ง logout หรือล้าง token ตรงนี้ได้เลย
      }

    } catch (error) {
      console.error("Invalid token format:", error);
      setUserRole("student");
    }
  } else {
    setUserRole("student");
  }

  // --- ส่วนจัดการ Fetch Data ---
  const fetchData = async () => {
    if (!token) return;

    const headers = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    };

    try {
      // ยิง API ทุกเส้นพร้อมกัน
      const [roomRes, pendingRes, approvedRes] = await Promise.all([
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/rooms", { headers }),
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings/pending", { headers }),
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings/approved", { headers }),
      ]);

      const parseCount = async (res) => {
        if (!res.ok) return 0;
        const json = await res.json();
        return Array.isArray(json) ? json.length : (json.data?.length || 0);
      };

      const [roomCount, pendingCount, approvedCount] = await Promise.all([
        parseCount(roomRes),
        parseCount(pendingRes),
        parseCount(approvedRes),
      ]);

      setRoomCount(roomCount);
      setPendingCount(pendingCount);
      setApprovedCount(approvedCount);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchData();
}, []);

const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIsUploading(true);
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file); // ⚠️ ชื่อ "file" ต้องตรงกับ upload.single('file') ใน Backend

  try {
    const response = await fetch("https://dave-unincited-ariyah.ngrok-free.dev/semesters/import", {
      method: "POST",
      headers: {
        // ❌ ห้ามใส่ Content-Type: application/json เมื่อใช้ FormData
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setIsSuccess(true);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      throw new Error(result.message || "Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert(`❌ การอัปโหลดล้มเหลว: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <h1 className="text-white text-xl font-bold leading-none">
            SCI <span className="text-[#B4C424]">KU</span>
          </h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        <div className="flex gap-6 text-white/80">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#B4C424]"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Calendar size={24} />
          </button>
          <button
            onClick={() => navigate("/notification")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <Bell size={24} />
          </button>
          <button
            onClick={() => navigate("/scanner")}
            className="hover:text-[#B4C424] transition-colors"
          >
            <QrCode size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black border-b-2 border-[#B4C424] inline-block italic">
              Dashboard
            </h2>
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Role: {userRole}
          </span>
        </div>

        {/* --- Status Cards: แสดงผลข้อมูลจริงจาก Database --- */}
        <div
          className={`grid gap-4 mb-6 ${userRole === "student" ? "grid-cols-1" : "grid-cols-3"}`}
        >
          <div className="bg-[#B4C424] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border-b-4 border-[#a3b120]">
            <p className="text-white text-[10px] font-black uppercase tracking-tighter text-center">
              ห้องทั้งหมด
            </p>
            <span className="text-white text-4xl font-black">{roomCount}</span>
          </div>

          {(userRole === "staff" || userRole === "teacher") && (
            <>
              <div className="bg-[#B4C424] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border-b-4 border-[#a3b120]">
                <p className="text-white text-[10px] font-black uppercase tracking-tighter text-center">
                  รออนุมัติ
                </p>
                <span className="text-white text-4xl font-black">
                  {pendingCount}
                </span>
              </div>
              <div className="bg-[#B4C424] rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm border-b-4 border-[#a3b120]">
                <p className="text-white text-[10px] font-black uppercase tracking-tighter text-center">
                  อนุมัติแล้ว
                </p>
                <span className="text-white text-4xl font-black">
                  {approvedCount}
                </span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => navigate("/Rooms")}
          className="w-full bg-[#2D2D86] hover:bg-[#1e1e61] text-white p-5 rounded-3xl flex items-center justify-between group transition-all shadow-xl active:scale-95 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#B4C424] p-3 rounded-2xl text-[#2D2D86]">
              <LayoutGrid size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-lg leading-none">
                ดูรายการห้องเรียน
              </p>
              <p className="text-white/50 text-[16px] mt-1 italic">
                จองห้องเรียน หรือตรวจสอบสถานะ
              </p>
            </div>
          </div>
          <ArrowRight
            className="group-hover:translate-x-2 transition-transform text-[#B4C424]"
            size={28}
          />
        </button>

        {userRole === "staff" && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-50 rounded-[32px] p-6 border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#B4C424] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#2D2D86] flex items-center gap-2">
                  <FilePlus size={20} className="text-[#B4C424]" />{" "}
                  ระบบจัดการไฟล์
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  อัปโหลดตารางเรียน (.xlsx, .csv)
                </p>
              </div>
              <FilePlus size={32} className="text-[#2D2D86] opacity-20" />
            </div>
          </div>
        )}

        {(userRole === "student" || userRole === "teacher") && (
          <div className="p-8 text-center bg-gray-50 rounded-[40px] border border-gray-100">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-[#B4C424] rotate-3">
              <CheckCircle2 size={28} />
            </div>
            <p className="text-[#2D2D86] font-bold">ระบบจองห้องเรียนออนไลน์</p>
            <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">
              Faculty of Science at Sriracha
            </p>
          </div>
        )}
      </div>

      {/* Modal คงเดิมตามที่คุณปรับแก้ไว้ล่าสุด */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 relative shadow-2xl border border-white/20">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-[#2D2D86] mb-6 italic tracking-tighter uppercase">
              Upload Schedule
            </h2>
            <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-50 rounded-[32px] p-10 bg-gray-50/50">
              {isSuccess ? (
                <div className="text-center animate-bounce">
                  <CheckCircle2 size={64} className="text-[#B4C424] mx-auto" />
                  <p className="mt-4 font-bold text-[#2D2D86]">
                    อัปโหลดสำเร็จ!
                  </p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer bg-[#2D2D86] text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />{" "}
                        กำลังประมวลผล...
                      </>
                    ) : (
                      "เลือกไฟล์จากเครื่อง"
                    )}
                  </label>
                  <p className="mt-4 text-xs text-gray-400 font-medium italic">
                    รองรับไฟล์ Excel และ CSV
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
