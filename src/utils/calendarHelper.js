export const formatCalendarEvents = (bookingsData, schedulesData) => {
  
  const processItem = (item, type) => {
    // 1. ดึงวันที่ออกมาให้ตรง (ล็อคที่ Timezone Bangkok)
    const d = new Date(item.date);
    // ใช้ en-CA เพื่อให้ได้รูปแบบ YYYY-MM-DD เสมอ
    const rawDate = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }); 

    // 2. จัดการเวลา (เอาแค่ HH:mm)
    const startTimeFull = item.start_time || "00:00:00";
    const endTimeFull = item.end_time || "00:00:00";
    const startTimeShort = startTimeFull.substring(0, 5);
    const endTimeShort = endTimeFull.substring(0, 5);
    // 3. รวมชื่อและนามสกุลอาจารย์
    const fullName = `${item.teacher_name || ""} ${item.teacher_surname || ""}`.trim();

    // 4. สร้างวันที่ภาษาไทยสำหรับ Modal (เลี่ยงการใช้ new Date ซ้ำซ้อน)
    const formatThaiDate = (dateStr) => {
      if (!dateStr) return "";
      const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];
      const [y, m, d] = dateStr.split("-");
      return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
    };

    return {
      id: `${type}-${item.booking_id || item.schedule_id}`,
      // 🚩 เอา [จอง] ออก เหลือแค่หัวข้อ
      title: type === 'booking' ? item.purpose : item.subject_name,
      
      // 🚩 หัวใจสำคัญ: ส่ง String แบบไม่มี "Z" ไปให้ FullCalendar
      start: `${rawDate}T${startTimeFull}`,
      end: `${rawDate}T${endTimeFull}`,
      
      extendedProps: {
        teacher: fullName || "ไม่ระบุอาจารย์",
        startTime: startTimeShort,
        endTime: endTimeShort,
        fullDate: formatThaiDate(rawDate), // ใช้ฟังก์ชันข้างบน วันจะได้ไม่เลื่อน
      },
      backgroundColor: type === 'booking' ? "#2D2D86" : "#1e3a8a",
      borderColor: type === 'booking' ? "#B4C424" : "#60a5fa",
    };
  };

  const bookingEvents = (Array.isArray(bookingsData) ? bookingsData : []).map(b => processItem(b, 'booking'));
  const scheduleEvents = (Array.isArray(schedulesData) ? schedulesData : []).map(s => processItem(s, 'schedule'));

  return [...bookingEvents, ...scheduleEvents];
};