import React from 'react';
import { Home, Calendar, Bell, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const QRScanner = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden font-sans">
      
      {/* --- Top Navigation Bar (คงสไตล์เดิมไว้เป๊ะ) --- */}
      <div className="bg-[#2D2D86] w-full px-6 py-4 flex justify-between items-center shadow-lg flex-none sticky top-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-xs tracking-[0.2em]">SRC</p>
        </div>
        
        <div className="flex gap-6 text-white/80">
         <button onClick={() => navigate('/dashboard')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Home size={24} />
          </button>
          <button onClick={() => navigate('/calendar')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Calendar size={24} />
          </button>
          <button onClick={() => navigate('/notification')} className="hover:text-[#B4C424] transition-colors active:scale-90">
            <Bell size={24} />
          </button>
          <button onClick={() => navigate('/Qrscanner')} className="text-[#B4C424] transition-colors active:scale-90">
            <QrCode size={24} />
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="p-8 flex-grow flex flex-col items-center justify-start mt-8 bg-white">
        
        {/* หัวข้อหน้าจอ (Optionally added for clarity) */}
        <h2 className="text-[#2D2D86] text-3xl font-bold mb-8 self-start ml-4 border-l-8 border-[#B4C424] pl-4">
          QR Code Scanner
        </h2>

        {/* White Scanner Card */}
        <div className="w-full max-w-sm bg-gray-50 rounded-[40px] p-8 border border-gray-100 shadow-md relative">
          {/* Green Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#B4C424] rounded-t-[40px]"></div>
          
          <h2 className="text-gray-400 text-2xl mb-8 mt-4 ml-2 font-medium">Select QR Image</h2>

          {/* Upload/Drop Zone */}
          <div className="bg-gray-200/50 border-2 border-dashed border-gray-400 rounded-[30px] p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-all group shadow-inner">
            
            {/* Folder Icon SVG */}
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
              <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.47 0 0 4.47 0 10V70C0 75.53 4.47 80 10 80H90C95.53 80 100 75.53 100 70V20C100 14.47 95.53 10 90 10H50L40 0H10Z" fill="#FFD460"/>
                <rect x="15" y="25" width="70" height="40" rx="2" fill="white" fillOpacity="0.8"/>
                <rect x="25" y="35" width="50" height="4" rx="2" fill="#E5E5E5"/>
                <rect x="25" y="45" width="30" height="4" rx="2" fill="#E5E5E5"/>
              </svg>
            </div>

            <p className="text-gray-600 text-lg font-bold text-center leading-tight">
              Drag & Drop or Browse
            </p>
            <p className="text-gray-400 text-sm mt-1">
              All image types allowed.
            </p>
            
            {/* Input file ซ่อนไว้ */}
            <input type="file" className="hidden" accept="image/*" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default QRScanner;