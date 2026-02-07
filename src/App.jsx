import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import QRScanner from './pages/QRScanner';
import Notification from './pages/Notification';
import RoomStatus from './pages/RoomStatus';
import Calendar from './pages/Calendar';
import RoomDetail from './pages/RoomDetail';
import BookingRoom
from './pages/Booking';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรกที่เจอคือ Login */}
        <Route path="/" element={<LoginPage />} />
        {/* หน้าอื่นๆ เมื่อ Login เข้ามาแล้ว */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/bookingRoom/:id" element={< BookingRoom/>} />
        <Route path="/calendar/" element={<Calendar />} />
        <Route path="/calendar/:id" element={<Calendar />} />
        <Route path="/scanner" element={<QRScanner />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/room-status/:id" element={<RoomStatus />} />
         <Route path="/room-detail/:id" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;