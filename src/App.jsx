import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';

// 🚩 นำเข้าหน้าสแกนทั้ง 2 แบบ
import QrFirstpage from './pages/QrFirstpage'; // แบบ 1: หน้าแรกก่อน Login
import QRScanner from './pages/QRScanner';     // แบบ 2: หน้าสแกนหลัง Login แล้ว (มี Navbar)

import Notification from './pages/Notification';
import RoomStatus from './pages/RoomStatus';
import Calendar from './pages/Calendar';
import RoomDetail from './pages/RoomDetail';
import BookingRoom from './pages/Booking';
import RoomResults from './pages/RoomResults'; 
import Users from './pages/Users'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🚩 ตั้งให้หน้าสแกน QR เป็นหน้าแรกสุด (Landing Page) */}
        <Route path="/" element={<QrFirstpage />} />
        
        {/* 🚩 หน้า Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* 🚩 หน้าสแกน QR สำหรับคนที่ Login แล้ว (ช่วยแก้ Error "No routes matched") */}
        <Route path="/scanner" element={<QRScanner />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room-results" element={<RoomResults />} />

        {/* 🚩 Route สำหรับจัดการผู้ใช้ (เฉพาะ Staff) */}
        <Route path="/users" element={<Users />} />

        <Route path="/bookingRoom/:id" element={<BookingRoom />} />
        <Route path="/calendar/" element={<Calendar />} />
        <Route path="/calendar/:id" element={<Calendar />} />
        <Route path="/notification" element={<Notification />} />
        
        {/* 🚩 หลังจากสแกน QR สำเร็จ ระบบจะเด้งมาหน้านี้ตาม Logic ที่น้องเขียนไว้ */}
        <Route path="/room-status/:id" element={<RoomStatus />} />
        
        <Route path="/room-detail/:id" element={<RoomDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;