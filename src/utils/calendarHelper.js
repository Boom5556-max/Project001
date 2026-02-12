export const formatCalendarEvents = (bookingsData, schedulesData) => {
  const formatThaiDate = (dateStr) => {
    if (!dateStr || dateStr === "Invalid Date") return "ไม่ระบุวันที่";
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const [y, m, day] = dateStr.split("-");
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
  };

  const processItem = (item, type) => {
    const d = new Date(item.date || item.booking_date || item.schedule_date);
    const rawDate = !isNaN(d.getTime()) ? d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }) : "Invalid Date";

    const isScheduleType = type === "schedule";
    
    // 1. เช็คสถานะการงดใช้ห้อง
    const isClosed = isScheduleType && (item.temporarily_closed === true || item.temporarily_closed === 1 || item.temporarily_closed === "1");

    // 🚩 2. จัดการชื่อที่จะโชว์ (Title)
    // ถ้าเป็น Schedule และถูกปิด ให้เติม (งดใช้ห้อง) ข้างหน้าชื่อวิชา
    const originalTitle = type === "booking" ? item.purpose : item.subject_name;
    const displayTitle = isClosed ? `(งดใช้ห้อง) ${originalTitle}` : originalTitle;

    return {
      id: type === "booking" ? item.booking_id : item.schedule_id,
      title: displayTitle, // 🚩 ใช้ชื่อที่ปรุงเสร็จแล้วตรงนี้
      start: `${rawDate}T${item.start_time || "00:00:00"}`,
      end: `${rawDate}T${item.end_time || "00:00:00"}`,
      
      extendedProps: {
        type: type,
        isSchedule: isScheduleType,
        fullDate: formatThaiDate(rawDate),
        temporarily_closed: isClosed,
        teacher: `${item.teacher_name || ""} ${item.teacher_surname || ""}`.trim() || "ไม่ระบุอาจารย์",
        startTime: (item.start_time || "00:00").substring(0, 5),
        endTime: (item.end_time || "00:00").substring(0, 5),
      },

      // 3. ปรับสีให้เข้ากับสถานะงดใช้ห้อง
      backgroundColor: isClosed ? "#fee2e2" : (type === "booking" ? "#2D2D86" : "#1e40af"),
      borderColor: isClosed ? "#ef4444" : (type === "booking" ? "#B4C424" : "#3b82f6"),
      textColor: isClosed ? "#ef4444" : "#ffffff", // ถ้างดใช้ห้องให้ตัวหนังสือออกสีแดง
    };
  };

  const bookingEvents = (Array.isArray(bookingsData) ? bookingsData : []).map(b => processItem(b, "booking"));
  const scheduleEvents = (Array.isArray(schedulesData) ? schedulesData : []).map(s => processItem(s, "schedule"));

  return [...bookingEvents, ...scheduleEvents];
};