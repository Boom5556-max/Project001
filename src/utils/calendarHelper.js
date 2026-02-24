export const formatCalendarEvents = (bookingsData, schedulesData) => {
  const formatThaiDate = (dateStr) => {
    if (!dateStr || dateStr === "Invalid Date") return "ไม่ระบุวันที่";
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const [y, m, day] = dateStr.split("-");
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
  };

  const processItem = (item, type) => {
    const dateSource = item.date || item.booking_date || item.schedule_date;
    const d = new Date(dateSource);
    
    const rawDate = !isNaN(d.getTime()) 
      ? d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }) 
      : "Invalid Date";

    const isScheduleType = type === "schedule";
    
    const isClosed = isScheduleType && (
      item.temporarily_closed === true || 
      item.temporarily_closed === 1 || 
      item.temporarily_closed === "1"
    );

    // 🚩 1. จัดการชื่อที่จะโชว์: เพิ่มชื่อห้อง [Room Name] นำหน้าถ้ามีข้อมูล
    const roomPrefix = item.room_name ? `[${item.room_name}] ` : "";
    const originalTitle = type === "booking" 
      ? (item.purpose || "จองใช้ห้อง") 
      : (item.subject_name || "ตารางเรียน");

    // ถ้างดใช้ห้องให้เติมคำว่า (งดใช้ห้อง) ข้างหน้าสุด
    const displayTitle = isClosed 
      ? `(งดใช้ห้อง) ${roomPrefix}${originalTitle}` 
      : `${roomPrefix}${originalTitle}`;

    return {
      id: type === "booking" ? item.booking_id : item.schedule_id,
      title: displayTitle, 
      start: `${rawDate}T${item.start_time || "00:00:00"}`,
      end: `${rawDate}T${item.end_time || "00:00:00"}`,
      
      extendedProps: {
        type: type,
        isSchedule: isScheduleType,
        fullDate: formatThaiDate(rawDate),
        temporarily_closed: isClosed,
        teacher_id: item.teacher_id, 
        teacher: `${item.teacher_name || ""} ${item.teacher_surname || ""}`.trim() || "ไม่ระบุอาจารย์",
        startTime: String(item.start_time || "00:00").substring(0, 5),
        endTime: String(item.end_time || "00:00").substring(0, 5),
        subjectName: item.subject_name,
        purpose: item.purpose,
        room_id: item.room_id || "ไม่ระบุเลขห้อง"
      },

      // 🚩 2. ปรับสีให้แยกความต่าง (เข้ม/อ่อน)
      // การจอง (Booking) = สีม่วงเข้มหลัก [#2D2D86]
      // ตารางเรียน (Schedule) = สีน้ำเงินเข้ม [#1e40af]
      backgroundColor: isClosed 
        ? "#fee2e2" 
        : (type === "booking" ? "#2D2D86" : "#1e40af"),
      borderColor: isClosed 
        ? "#ef4444" 
        : (type === "booking" ? "#B4C424" : "#3b82f6"), // ขอบเหลืองมะนาวช่วยให้การจองเด่นขึ้น
      textColor: isClosed ? "#ef4444" : "#ffffff",
      borderWidth: isClosed ? "2px" : "1px",
    };
  };

  const bookingEvents = (Array.isArray(bookingsData) ? bookingsData : [])
    .map(b => processItem(b, "booking"))
    .filter(event => !event.start.includes("Invalid Date"));

  const scheduleEvents = (Array.isArray(schedulesData) ? schedulesData : [])
    .map(s => processItem(s, "schedule"))
    .filter(event => !event.start.includes("Invalid Date"));

  return [...bookingEvents, ...scheduleEvents];
};