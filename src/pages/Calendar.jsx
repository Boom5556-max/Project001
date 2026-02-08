import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCalendarData } from "../hooks/useCalendarData";
import Navbar from "../components/layout/Navbar.jsx";
import RoomSelector from "../components/calendar/RoomSelector";
import CalendarView from "../components/calendar/CalendarView";
import EventModal from "../components/calendar/EventModal";

const Calendar = () => {
  const { id } = useParams();
  const { rooms, selectedRoom, setSelectedRoom, events, isLoading } =
    useCalendarData(id);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative">
      <Navbar />
      <div className="p-4 flex-grow flex flex-col overflow-hidden">
        <RoomSelector
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelect={setSelectedRoom}
        />
        <CalendarView
          events={events}
          onEventClick={(info) => {
            setSelectedEvent(info.event);
            setShowModal(true);
          }}
        />
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => {
          setShowModal(false); // ปิด Modal
          setSelectedEvent(null); // 🚩 ล้างข้อมูล Event ทิ้ง (เพื่อให้ if (!event) return null ทำงาน)
        }}
      />
    </div>
  );
};

export default Calendar;
