import React, { useState } from "react";
import {
  X,
  User,
  Calendar,
  Timer,
  Clock,
  Edit3,
  Trash2,
  Save,
  MessageSquare,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNotificationLogic } from "../hooks/useNotificationLogic.js";
import {
  BookingCard,
  SectionTitle,
} from "../components/ืืืืืnotification/NotificationComponents.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/common/Button.jsx";

const Notification = () => {
  const {
    pendingRequests,
    approvedRequests,
    historyRequests,
    userRole,
    selectedBooking,
    setSelectedBooking,
    handleUpdateStatus,
    handleUpdateBooking,
    handleCancelBooking,
    getFullName,
  } = useNotificationLogic();

  const [activeTab, setActiveTab] = useState("current");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    purpose: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  // --- Logic สำหรับแยกประเภทข้อมูลของ Staff ---
  const staffApproved = historyRequests.filter(
    (req) => req.status?.toLowerCase() === "approved",
  );
  const staffRejected = historyRequests.filter(
    (req) => req.status?.toLowerCase() === "rejected",
  );

  const startEditing = () => {
    if (!selectedBooking.date) return;

    // สร้างก้อนวันที่ และบวกเพิ่มไป 7 ชั่วโมงเพื่อให้ข้ามพ้นขีดจำกัด Timezone
    const dateObj = new Date(selectedBooking.date);
    dateObj.setHours(dateObj.getHours() + 7);

    // ดึงค่า YYYY-MM-DD แบบปลอดภัย
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    setEditForm({
      purpose: selectedBooking.purpose || "",
      date: formattedDate,
      start_time: selectedBooking.start_time?.slice(0, 5) || "",
      end_time: selectedBooking.end_time?.slice(0, 5) || "",
    });
    setIsEditing(true);
  };
  const handleSave = async () => {
    await handleUpdateBooking(selectedBooking.booking_id, editForm);
    setIsEditing(false);
  };

  const closeOverlay = () => {
    setSelectedBooking(null);
    setIsEditing(false);
  };

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans relative">
      <Navbar />

      {/* --- 🔘 Tab Switcher (เฉพาะ Teacher) --- */}
      {userRole === "teacher" && (
        <div className="flex px-6 pt-4 gap-2">
          <button
            onClick={() => {
              setActiveTab("current");
              setSelectedBooking(null);
            }}
            className={`flex-1 py-4 rounded-t-[30px] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "current"
                ? "bg-white text-[#2D2D86]"
                : "text-white/50 hover:text-white"
            }`}
          >
            การจองของฉัน
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              setSelectedBooking(null);
            }}
            className={`flex-1 py-4 rounded-t-[30px] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === "history"
                ? "bg-white text-[#2D2D86]"
                : "text-white/50 hover:text-white"
            }`}
          >
            ประวัติการจอง
          </button>
        </div>
      )}

      {/* --- 📄 Main Content --- */}
      <div
        className={`flex-grow overflow-y-auto bg-white p-6 shadow-2xl pt-8 pb-24 ${userRole === "staff" ? "rounded-t-[50px] mt-4" : "rounded-tr-[50px]"}`}
      >
        {/* 🟢 VIEW: STAFF (แบ่ง 3 ส่วนชัดเจน) */}
        {userRole === "staff" ? (
          <div className="animate-in fade-in duration-500 space-y-12">
            {/* ส่วนที่ 1: รออนุมัติ */}
            <section>
              <SectionTitle
                title="รออนุมัติ"
                icon={Clock}
                colorClass="text-[#B4C424]"
              />
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((req) => (
                    <BookingCard
                      key={req.booking_id}
                      req={req}
                      variant="pending"
                      getFullName={getFullName}
                      onClick={setSelectedBooking}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-300 py-4 italic text-sm">
                    ไม่มีรายการรออนุมัติ
                  </p>
                )}
              </div>
            </section>

            {/* ส่วนที่ 2: อนุมัติแล้ว */}
            <section>
              <SectionTitle
                title="อนุมัติแล้ว"
                icon={CheckCircle}
                colorClass="text-emerald-500"
              />
              <div className="space-y-3">
                {staffApproved.length > 0 ? (
                  staffApproved.map((req) => (
                    <BookingCard
                      key={req.booking_id}
                      req={req}
                      variant="approved"
                      getFullName={getFullName}
                      onClick={setSelectedBooking}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-300 py-4 italic text-sm">
                    ไม่มีรายการที่อนุมัติ
                  </p>
                )}
              </div>
            </section>

            {/* ส่วนที่ 3: ไม่อนุมัติ */}
            <section>
              <SectionTitle
                title="ไม่อนุมัติ"
                icon={XCircle}
                colorClass="text-red-500"
              />
              <div className="space-y-3 opacity-80">
                {staffRejected.length > 0 ? (
                  staffRejected.map((req) => (
                    <BookingCard
                      key={req.booking_id}
                      req={req}
                      variant="rejected"
                      getFullName={getFullName}
                      onClick={setSelectedBooking}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-300 py-4 italic text-sm">
                    ไม่มีรายการที่ถูกปฏิเสธ
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* 🔵 VIEW: TEACHER (แบบเดิมแยก Tab) */
          <div className="animate-in fade-in duration-500">
            {activeTab === "current" ? (
              <>
                <section className="mb-10">
                  <SectionTitle
                    title="รออนุมัติ"
                    icon={Clock}
                    colorClass="text-[#B4C424]"
                  />
                  <div className="space-y-4">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((req) => (
                        <BookingCard
                          key={req.booking_id}
                          req={req}
                          variant="pending"
                          getFullName={getFullName}
                          onClick={setSelectedBooking}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-300 py-4 italic text-sm">
                        ไม่มีรายการรออนุมัติ
                      </p>
                    )}
                  </div>
                </section>
                <section>
                  <SectionTitle
                    title="อนุมัติแล้ว"
                    icon={Calendar}
                    colorClass="text-emerald-500"
                  />
                  <div className="space-y-3">
                    {approvedRequests.map((req) => (
                      <BookingCard
                        key={req.booking_id}
                        req={req}
                        variant="approved"
                        getFullName={getFullName}
                        onClick={setSelectedBooking}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="animate-in fade-in duration-500">
                <SectionTitle
                  title="ประวัติการจองของฉัน"
                  icon={History}
                  colorClass="text-gray-400"
                />
                <div className="space-y-3 opacity-80">
                  {historyRequests.length > 0 ? (
                    historyRequests.map((req) => {
                      const variant =
                        req.status?.toLowerCase() === "approved"
                          ? "approved"
                          : "rejected";
                      return (
                        <BookingCard
                          key={req.booking_id}
                          req={req}
                          variant={variant}
                          getFullName={getFullName}
                          onClick={setSelectedBooking}
                        />
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-300 py-10 italic text-sm">
                      ไม่มีประวัติการจอง
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- 🛡️ Modal Details & Actions --- */}
      {selectedBooking && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-4xl font-black text-[#2D2D86] italic uppercase leading-tight">
                ห้อง {selectedBooking.room_id}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeOverlay}
                className="bg-gray-50 text-gray-400"
              >
                <X size={24} />
              </Button>
            </div>

            <p className="text-[#B4C424] font-black uppercase tracking-widest text-[10px] mb-8">
              {isEditing
                ? "📝 แก้ไขข้อมูล"
                : selectedBooking.status !== "pending"
                  ? `🏁 สถานะ: ${selectedBooking.status === "approved" ? "อนุมัติแล้ว" : "ไม่อนุมัติ"}`
                  : userRole === "staff"
                    ? "🛡️ การจัดการโดยเจ้าหน้าที่"
                    : "🔍 รายละเอียดการจอง"}
            </p>

            <div className="space-y-4 mb-10">
              <DetailItem
                icon={User}
                label="ผู้ขอใช้ห้อง"
                value={getFullName(selectedBooking)}
              />
              {isEditing ? (
                <div className="space-y-4 p-5 bg-blue-50/50 rounded-[35px] border-2 border-blue-100">
                  <EditField
                    label="จุดประสงค์"
                    value={editForm.purpose}
                    onChange={(v) => setEditForm({ ...editForm, purpose: v })}
                  />
                  <EditField
                    label="วันที่"
                    type="date"
                    value={editForm.date}
                    onChange={(v) => setEditForm({ ...editForm, date: v })}
                  />
                  <div className="flex gap-3">
                    <EditField
                      label="เริ่ม"
                      type="time"
                      value={editForm.start_time}
                      onChange={(v) =>
                        setEditForm({ ...editForm, start_time: v })
                      }
                    />
                    <EditField
                      label="สิ้นสุด"
                      type="time"
                      value={editForm.end_time}
                      onChange={(v) =>
                        setEditForm({ ...editForm, end_time: v })
                      }
                    />
                  </div>
                </div>
              ) : (
                <>
                  <DetailItem
                    icon={MessageSquare}
                    label="จุดประสงค์"
                    value={selectedBooking.purpose || "ใช้เพื่อการเรียนการสอน"}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="วันที่ใช้งาน"
                    value={formatThaiDate(selectedBooking.date)}
                  />
                  <DetailItem
                    icon={Timer}
                    label="ช่วงเวลา"
                    value={`${selectedBooking.start_time?.slice(0, 5)} - ${selectedBooking.end_time?.slice(0, 5)} น.`}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-grow bg-emerald-500 text-white"
                    onClick={handleSave}
                  >
                    <Save size={20} className="mr-2" /> บันทึก
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-grow"
                    onClick={() => setIsEditing(false)}
                  >
                    ยกเลิก
                  </Button>
                </div>
              ) : (
                <>
                  {/* ปุ่มสำหรับ STAFF */}
                  {userRole === "staff" &&
                    (selectedBooking.status === "pending" ? (
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          className="flex-grow py-4 bg-emerald-500 text-white font-bold rounded-2xl"
                          onClick={() =>
                            handleUpdateStatus(
                              selectedBooking.booking_id,
                              "approved",
                            )
                          }
                        >
                          <CheckCircle size={20} className="mr-2" /> อนุมัติ
                        </Button>
                        <Button
                          variant="danger"
                          className="flex-grow py-4 font-bold rounded-2xl"
                          onClick={() =>
                            handleUpdateStatus(
                              selectedBooking.booking_id,
                              "rejected",
                            )
                          }
                        >
                          <XCircle size={20} className="mr-2" /> ไม่อนุมัติ
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-2xl text-center border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold text-xs uppercase italic">
                          ดำเนินการเสร็จสิ้น
                        </p>
                      </div>
                    ))}

                  {/* ปุ่มสำหรับ TEACHER (เหมือนเดิม) */}
                  {userRole === "teacher" && activeTab === "current" && (
                    <>
                      {selectedBooking.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            className="w-full border-2 border-[#2D2D86] text-[#2D2D86] font-bold py-4 rounded-2xl"
                            onClick={startEditing}
                          >
                            <Edit3 size={18} className="mr-2 inline" />{" "}
                            แก้ไขข้อมูลคำขอ
                          </Button>
                          <Button
                            variant="danger"
                            className="w-full py-4 rounded-2xl"
                            onClick={() =>
                              handleCancelBooking(selectedBooking.booking_id)
                            }
                          >
                            <Trash2 size={18} className="mr-2 inline" />{" "}
                            ยกเลิกคำขอ
                          </Button>
                        </>
                      )}
                      {selectedBooking.status === "approved" && (
                        <Button
                          variant="danger"
                          className="w-full py-4 rounded-2xl"
                          onClick={() =>
                            handleCancelBooking(selectedBooking.booking_id)
                          }
                        >
                          <Trash2 size={18} className="mr-2 inline" /> งดใช้ห้อง
                          (Cancel)
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helpers (DetailItem, EditField, formatThaiDate เหมือนเดิม) ---
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
    <div className="bg-white p-3 rounded-2xl text-[#2D2D86] shadow-sm">
      <Icon size={18} />
    </div>
    <div className="flex-grow">
      <p className="text-gray-400 text-[10px] font-bold uppercase">{label}</p>
      <p className="text-[#2D2D86] font-black text-lg leading-tight">{value}</p>
    </div>
  </div>
);

const EditField = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1 w-full">
    <p className="text-blue-600 text-[10px] font-black ml-3 uppercase">
      {label}
    </p>
    <input
      type={type}
      className="w-full p-3 rounded-2xl border border-blue-100 text-[#2D2D86] font-bold outline-none bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const formatThaiDate = (dateStr) => {
  if (!dateStr) return "---";

  // สร้างก้อนวันที่ และบวกเพิ่มไป 7 ชั่วโมงเหมือนกัน
  const dateObj = new Date(dateStr);
  dateObj.setHours(dateObj.getHours() + 7);

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const day = dateObj.getDate();
  const month = thaiMonths[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543;

  return `${day} ${month} ${year}`;
};

export default Notification;
