import React, { useState, useEffect,useCallback } from "react";
import {
  Home,
  Calendar,
  Bell,
  QrCode,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Timer,
  X,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Notification = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // 1. Helper ดึงชื่อ - ปรับให้รองรับ teacher_name และ surname จาก SQL
  const getFullName = (req) => {
    if (!req) return "ไม่ระบุชื่อ";
    const firstName = req.teacher_name || req.name || req.first_name || "";
    const lastName = req.surname || req.last_name || "";
    return firstName ? `${firstName} ${lastName}`.trim() : "ไม่ระบุชื่อ";
  };

  const fetchBookings = useCallback(async () => {
  setIsLoading(true);
  const token = localStorage.getItem("token");
  
  if (!token) {
    setIsLoading(false);
    return;
  }

  try {
    // 1. Decode เพื่อเช็ก Role ก่อนยิง
    const decoded = jwtDecode(token);
    const role = decoded?.role?.toLowerCase().trim() || "student";
    setUserRole(role);

    const headers = {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // 2. แยก Logic การยิงตามสิทธิ์ใน Backend
    if (role === "teacher" || role === "staff") {
      // 🌟 สำหรับ Teacher/Staff: ยิงแยก 3 เส้นตามที่ Backend กำหนด
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings/pending", { headers }),
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings/approved", { headers }),
        fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings/rejected", { headers }),
      ]);

      const [pending, approved, rejected] = await Promise.all([
        pendingRes.ok ? pendingRes.json() : [],
        approvedRes.ok ? approvedRes.json() : [],
        rejectedRes.ok ? rejectedRes.json() : [],
      ]);

      setPendingRequests(Array.isArray(pending) ? pending : (pending.data || []));
      setApprovedRequests(Array.isArray(approved) ? approved : (approved.data || []));
      setRejectedRequests(Array.isArray(rejected) ? rejected : (rejected.data || []));

    } else {
      // 🌟 สำหรับ Student: ยิงเส้นรวม /bookings (ซึ่ง Backend มักจะกรองเฉพาะของตัวเองให้)
      const res = await fetch("https://dave-unincited-ariyah.ngrok-free.dev/bookings", { headers });
      
      if (res.ok) {
        const allData = await res.json();
        const dataArray = Array.isArray(allData) ? allData : (allData.data || []);
        
        // นักเรียนต้องมา Filter แยกสถานะเองจากก้อนเดียว
        setPendingRequests(dataArray.filter(i => i.status?.toLowerCase() === "pending"));
        setApprovedRequests(dataArray.filter(i => i.status?.toLowerCase() === "approved"));
        setRejectedRequests(dataArray.filter(i => i.status?.toLowerCase() === "rejected"));
      } else {
        console.error("Student fetch failed:", res.status);
      }
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error);
  } finally {
    setIsLoading(false);
  }
}, []);

useEffect(() => {
  fetchBookings();
}, [fetchBookings]);

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans relative">
      {/* --- Modal Details --- */}
      {selectedBooking && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 transition-all">
          <div className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-5xl font-black text-[#2D2D86] leading-none italic tracking-tighter uppercase">
                ห้อง {selectedBooking.room_id || "N/A"}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 bg-gray-50 rounded-full text-gray-400"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-[#B4C424] font-black uppercase tracking-[0.2em] text-xs mb-8">
              Booking Details
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="bg-white p-3 rounded-2xl text-[#2D2D86] shadow-sm">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                    ผู้ขอใช้ห้อง
                  </p>
                  <p className="text-[#2D2D86] font-black text-lg">
                    {getFullName(selectedBooking)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="bg-white p-3 rounded-2xl text-[#2D2D86] shadow-sm">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                    วันที่ใช้งาน
                  </p>
                  <p className="text-[#2D2D86] font-black text-lg">
                    {new Date(selectedBooking.date).toLocaleDateString(
                      "th-TH",
                      { dateStyle: "full" },
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <div className="bg-white p-3 rounded-2xl text-[#2D2D86] shadow-sm">
                  <Timer size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                    ช่วงเวลา
                  </p>
                  <p className="text-[#2D2D86] font-black text-lg">
                    {selectedBooking.start_time?.slice(0, 5)} -{" "}
                    {selectedBooking.end_time?.slice(0, 5)} น.
                  </p>
                </div>
              </div>
            </div>

            {(userRole === "staff") &&
              pendingRequests.some(
                (r) => r.booking_id === selectedBooking.booking_id,
              ) && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.booking_id, "approved")
                    }
                    className="flex-grow bg-[#2D2D86] text-white py-5 rounded-[25px] font-black text-sm shadow-xl active:scale-95 transition-all uppercase"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.booking_id, "rejected")
                    }
                    className="px-8 bg-red-50 text-red-500 py-5 rounded-[25px] font-black text-sm active:scale-95 transition-all uppercase"
                  >
                    Reject
                  </button>
                </div>
              )}
            <button
              onClick={() => setSelectedBooking(null)}
              className="w-full py-2 text-gray-300 font-bold text-xs uppercase tracking-[0.3em]"
            >
              Tap to dismiss
            </button>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      <div className="w-full px-6 py-6 flex justify-between items-center z-50">
        <h1 className="text-[#B4C424] text-4xl font-black italic tracking-tighter">
          Notification
        </h1>
        <div className="flex gap-5 text-white/70">
          <button onClick={() => navigate("/dashboard")}>
            <Home size={22} />
          </button>
          <button onClick={() => navigate("/calendar")}>
            <Calendar size={22} />
          </button>
          <button
            onClick={() => navigate("/notification")}
            className="text-[#B4C424]"
          >
            <Bell size={22} />
          </button>
          <button onClick={() => navigate("/scanner")}>
            <QrCode size={22} />
          </button>
        </div>
      </div>

      {/* --- List Content --- */}
      <div className="flex-grow overflow-y-auto bg-white rounded-t-[50px] p-6 shadow-2xl pt-8">
        {/* รออนุมัติ */}
        <section className="mb-10">
          <h2 className="flex items-center gap-3 mb-6 ml-2">
            <Clock size={24} className="text-[#B4C424] flex-shrink-0" />
            <span className="text-[#2D2D86] text-xl font-black uppercase leading-none">
              รออนุมัติ
            </span>
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.booking_id}
                onClick={() => setSelectedBooking(req)}
                className="group bg-white p-6 rounded-[35px] border-2 border-gray-50 shadow-sm hover:shadow-xl hover:border-[#B4C424]/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#2D2D86] text-[#B4C424] w-14 h-14 flex items-center justify-center rounded-2xl font-black text-xl italic shadow-md uppercase">
                        <Clock size={24} className="text-[#B4C424] flex-shrink-0" />
                    </div>
                    <div>
                      <h3 className="text-[#2D2D86] font-black text-lg leading-none mb-1 uppercase">
                        ห้อง {req.room_id || "---"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <User size={12} className="text-[#B4C424]" />
                        <span className="text-[11px] font-bold uppercase">
                          {getFullName(req)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-gray-300 group-hover:text-[#B4C424] transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* อนุมัติแล้ว */}
        <section className="mb-8">
          <h2 className="text-emerald-500 text-[10px] font-black uppercase mb-4 ml-4 tracking-[0.2em]">
            อนุมัติแล้ว
          </h2>
          <div className="space-y-3">
            {approvedRequests.map((req) => (
              <div
                key={req.booking_id}
                onClick={() => setSelectedBooking(req)}
                className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-[25px] border border-emerald-100 cursor-pointer group hover:bg-emerald-50 transition-all"
              >
                <div className="bg-white p-2.5 rounded-xl text-emerald-500 shadow-sm border border-emerald-50">
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-grow">
                  <p className="text-[#2D2D86] font-black text-sm uppercase">
                    ห้อง {req.room_id || "---"}
                  </p>
                  <p className="text-emerald-600/70 text-[10px] font-bold uppercase italic">
                    {getFullName(req)}
                  </p>
                </div>
                <ChevronRight size={14} className="text-emerald-200" />
              </div>
            ))}
          </div>
        </section>

        {/* ไม่อนุมัติ */}
        <section className="mb-12">
          <h2 className="text-red-400 text-[10px] font-black uppercase mb-4 ml-4 tracking-[0.2em]">
            ไม่อนุมัติ
          </h2>
          <div className="space-y-3 pb-10">
            {rejectedRequests.map((req) => (
              <div
                key={req.booking_id}
                onClick={() => setSelectedBooking(req)}
                className="flex items-center gap-4 bg-red-50 p-4 rounded-[25px] border-2 border-red-100 cursor-pointer group"
              >
                <div className="bg-white p-2.5 rounded-xl text-red-500 shadow-sm">
                  <XCircle size={18} />
                </div>
                <div className="flex-grow">
                  <p className="text-red-700 font-black text-sm leading-none mb-1 uppercase">
                    ห้อง {req.room_id || "---"}
                  </p>
                  <p className="text-red-400 text-[10px] font-bold uppercase">
                    {getFullName(req)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Notification;
