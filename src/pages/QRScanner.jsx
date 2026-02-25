import React, { useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button.jsx";
import { useQRScannerLogic } from "../hooks/useQRScannerLogic.js";
import { SuccessOverlay, LoadingOverlay, CameraErrorOverlay } from "../components/qrscan/ScannerOverlays.jsx";

const QRScanner = () => {
  const [activeTab, setActiveTab] = useState("camera");
  const { 
    errorMsg, scanResult, isScanningFile, 
    handleFileChange, setScanResult, setErrorMsg 
  } = useQRScannerLogic(activeTab);

  return (
    // ใช้ fixed inset-0 แทน h-screen เพื่อความนิ่งของ UI บนมือถือ
    <div className="fixed inset-0 bg-[#302782] flex flex-col font-sans overflow-hidden">
      <Navbar />
      
      {/* ส่วนเนื้อหาหลัก: ปรับมุมโค้งและระยะ padding ตามขนาดจอ */}
      <div className="flex-grow bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] p-4 sm:p-8 flex flex-col items-center shadow-2xl relative transition-all duration-500">
        
        {/* Tab Switcher: ปรับกว้างขึ้นในมือถือให้กดง่าย */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 sm:mb-10 w-full max-w-[300px] shadow-sm">
          <TabButton 
            active={activeTab === "camera"} 
            onClick={() => { setActiveTab("camera"); setScanResult(""); }}
            icon={<Camera size={16} />}
            label="กล้องถ่ายรูป"
          />
          <TabButton 
            active={activeTab === "file"} 
            onClick={() => { setActiveTab("file"); setScanResult(""); setErrorMsg(""); }}
            icon={<ImageIcon size={16} />}
            label="คลังภาพ"
          />
        </div>

        {/* Scanner Container: จัดการสัดส่วนให้พอดีกับพื้นที่ที่เหลือ */}
        <div className="w-full flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-sm">
            <div className="relative w-full aspect-square bg-black rounded-[40px] sm:rounded-[50px] overflow-hidden shadow-2xl border-[4px] sm:border-[6px] border-[#FFFFFF]">
              
              {activeTab === "camera" ? (
                <div className="w-full h-full relative">
                  {/* ID "reader" คือจุดที่ Library QR จะเข้ามา Render */}
                  <div id="reader" className="w-full h-full object-cover"></div>
                  {errorMsg && <CameraErrorOverlay message={errorMsg} />}
                </div>
              ) : (
                <GalleryUpload onFileChange={handleFileChange} disabled={isScanningFile} />
              )}

              {/* Overlays: มั่นใจว่าอยู่หน้าสุดเสมอ */}
              {scanResult && <SuccessOverlay />}
              {isScanningFile && <LoadingOverlay />}
            </div>
            
            {/* คำแนะนำเพิ่มเติมใต้กล่องสแกน */}
            <p className="text-center mt-6 text-gray-400 text-xs sm:text-sm font-medium animate-pulse">
              {activeTab === "camera" ? "วาง QR Code ให้อยู่ในกรอบ" : "เลือกรูปภาพที่มี QR Code"}
            </p>
          </div>
        </div>
        
        {/* Safe Area สำหรับมือถือที่มี Notch ด้านล่าง */}
        <div className="h-6 sm:h-0"></div>
      </div>
    </div>
  );
};

// --- UI Helpers ---

const TabButton = ({ active, onClick, icon, label }) => (
  <Button
    variant={active ? "secondary" : "ghost"}
    size="none"
    onClick={onClick}
    className={`flex-1 py-3 sm:py-3.5 rounded-xl text-[11px] sm:text-xs font-bold gap-2 transition-all duration-200 ${
      active 
        ? "bg-white shadow-md text-[#302782]" 
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const GalleryUpload = ({ onFileChange, disabled }) => (
  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
    <div className="bg-[#B2BB1E]/10 group-hover:bg-[#B2BB1E]/20 p-6 sm:p-8 rounded-full mb-4 transition-all transform group-active:scale-95">
      <ImageIcon size={48} className="text-[#302782] sm:w-[56px] sm:h-[56px]" />
    </div>
    <div className="text-center px-4">
      <p className="text-[#302782] font-bold text-sm sm:text-base">อัปโหลดรูปภาพ</p>
      <p className="text-gray-400 text-[10px] sm:text-xs mt-1">รองรับ JPG, PNG</p>
    </div>
    <input 
      type="file" 
      className="hidden" 
      accept="image/*" 
      onChange={onFileChange} 
      disabled={disabled} 
    />
  </label>
);

export default QRScanner;