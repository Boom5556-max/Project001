import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Home, Calendar as CalendarIcon, Bell, QrCode, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const [selectedRoom, setSelectedRoom] = useState('26504');
  const navigate = useNavigate();

  const rooms = [
    { id: '26504', name: 'Computer Lab | 26504' },
    { id: '26507', name: 'Computer Lab 2 | 26507' },
    { id: '26304', name: 'Computer Lecture | 26304' },
    { id: '26305', name: 'Computer Lecture 2 | 26305' },
    { id: '26307', name: 'Computer Lecture 3 | 26307' },
  ];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      
      {/* --- Top Navigation Bar --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50 flex-none">
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/dashboard')}>
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        
        <div className="flex gap-6 text-white/80">
          <button onClick={() => navigate('/dashboard')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Home size={24} />
          </button>
          <button onClick={() => navigate('/calendar')} className="text-[#B4C424] transition-colors active:scale-90">
            <CalendarIcon size={24} />
          </button>
          <button onClick={() => navigate('/notification')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Bell size={24} />
          </button>
          <button onClick={() => navigate('/Qrscanner')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <QrCode size={24} />
          </button>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="p-4 flex-grow flex flex-col overflow-hidden bg-white">
        
        {/* ส่วนเลือกห้อง */}
        <div className="mb-3 flex items-center gap-3 flex-none">
          <div className="relative flex-grow max-w-xs">
            <select 
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg block p-2 appearance-none cursor-pointer focus:ring-1 focus:ring-[#2D2D86]"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* FullCalendar Container */}
        <div className="flex-grow bg-white border border-gray-200 rounded-xl p-2 shadow-sm overflow-hidden calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek'
            }}
            locale="th"
            height="100%"
            handleWindowResize={true}
            stickyHeaderDates={true}
            buttonText={{ today: 'วันนี้', month: 'เดือน', week: 'สัปดาห์' }}
          />
        </div>
      </div>

      {/* CSS ปรับแต่งความสวยงามของปฏิทิน */}
      <style dangerouslySetInnerHTML={{ __html: `
        .fc { font-size: 0.75rem !important; }
        .fc .fc-toolbar-title { font-size: 1rem !important; font-weight: bold; color: #2D2D86; }
        .fc .fc-button-primary { background-color: #2D2D86 !important; border-color: #2D2D86 !important; }
        .fc .fc-button-primary:hover { background-color: #B4C424 !important; border-color: #B4C424 !important; color: black !important; }
        .fc .fc-button-active { background-color: #B4C424 !important; border-color: #B4C424 !important; color: black !important; }
        .fc-day-today { background: rgba(180, 196, 36, 0.1) !important; }
        .fc-col-header-cell { background: #f9fafb; }
      `}} />
    </div>
  );
};

export default Calendar;