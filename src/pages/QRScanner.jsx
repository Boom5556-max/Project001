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
    <div className="h-screen bg-[#302782] flex flex-col overflow-hidden font-sans">
      <Navbar />
      
      <div className="flex-grow bg-[#FFFFFF] rounded-t-[50px] p-6 flex flex-col items-center shadow-2xl relative">
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-full max-w-[280px]">
          <TabButton 
            active={activeTab === "camera"} 
            onClick={() => { setActiveTab("camera"); setScanResult(""); }}
            icon={<Camera size={14} />}
            label="กล้องถ่ายรูป"
          />
          <TabButton 
            active={activeTab === "file"} 
            onClick={() => { setActiveTab("file"); setScanResult(""); setErrorMsg(""); }}
            icon={<ImageIcon size={14} />}
            label="คลังภาพ"
          />
        </div>

        {/* Scanner Box */}
        <div className="w-full max-w-sm">
          <div className="relative w-full aspect-square bg-black rounded-[50px] overflow-hidden shadow-2xl border-[6px] border-[#FFFFFF]">
            
            {activeTab === "camera" ? (
              <div className="w-full h-full relative">
                <div id="reader" className="w-full h-full"></div>
                {errorMsg && <CameraErrorOverlay message={errorMsg} />}
              </div>
            ) : (
              <GalleryUpload onFileChange={handleFileChange} disabled={isScanningFile} />
            )}

            {/* Overlays */}
            {scanResult && <SuccessOverlay />}
            {isScanningFile && <LoadingOverlay />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Small UI Helpers ---

const TabButton = ({ active, onClick, icon, label }) => (
  <Button
    variant={active ? "secondary" : "ghost"}
    size="none"
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl text-xs font-bold gap-2 ${
      active ? "shadow-lg text-[#302782]" : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const GalleryUpload = ({ onFileChange, disabled }) => (
  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-none">
    <div className="bg-[#B2BB1E]/20 p-8 rounded-full mb-4">
      <ImageIcon size={56} className="text-[#302782]" />
    </div>
    <p className="text-[#302782] font-bold text-sm">อัปโหลดรูปภาพ</p>
    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={disabled} />
  </label>
);

export default QRScanner;