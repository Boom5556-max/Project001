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

// 🚩 1. Import หน้า RoomResults เข้ามา
import RoomResults from './pages/RoomResults'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        
        {/* 🚩 2. เพิ่ม Route สำหรับหน้าผลการค้นหา */}
        <Route path="/room-results" element={<RoomResults />} />

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