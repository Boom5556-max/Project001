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
import BookingRoom from './pages/Booking';
import RoomResults from './pages/RoomResults'; 

// 🚩 เพิ่มหน้า Users เข้ามา
import Users from './pages/Users'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room-results" element={<RoomResults />} />

        {/* 🚩 เพิ่ม Route สำหรับจัดการผู้ใช้ (เฉพาะ Staff) */}
        <Route path="/users" element={<Users />} />

        <Route path="/bookingRoom/:id" element={<BookingRoom />} />
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