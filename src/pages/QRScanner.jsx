import React, { useState, useEffect, useRef } from 'react';
import { Home, Calendar, Bell, QrCode, Loader2, Image as ImageIcon, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr"; // นำเข้า jsQR

const QRScanner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('camera');
  const [errorMsg, setErrorMsg] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [isScanningFile, setIsScanningFile] = useState(false);
  const qrScannerRef = useRef(null);

  const extractRoomId = (text) => {
    try {
      if (text.startsWith('http')) {
        const url = new URL(text);
        const pathParts = url.pathname.split('/').filter(part => part !== "");
        return pathParts[pathParts.length - 1];
      }
      return text.trim();
    } catch (e) {
      return text.trim();
    }
  };

  const handleProcessScan = (decodedText) => {
    const roomId = extractRoomId(decodedText);
    setScanResult(decodedText);
    if (navigator.vibrate) navigator.vibrate(100);

    setTimeout(() => {
      if (roomId) {
        navigate(`/room-status/${roomId}`);
      } else {
        alert("ข้อมูล QR ไม่ถูกต้อง");
        setScanResult("");
      }
    }, 1500);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      const scanner = new Html5Qrcode("reader");
      qrScannerRef.current = scanner;

      const startCamera = async () => {
        try {
          await scanner.start(
            { facingMode: "environment" },
            { fps: 20, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            (decodedText) => {
              handleProcessScan(decodedText);
              scanner.stop().catch(() => {});
            },
            () => {} 
          );
          setErrorMsg("");
        } catch (err) {
          setErrorMsg(err.toString().includes("NotAllowedError") 
            ? "ถูกปฏิเสธการเข้าถึงกล้อง" 
            : "ไม่สามารถเปิดกล้องได้");
        }
      };
      startCamera();
    }

    return () => {
      if (qrScannerRef.current && qrScannerRef.current.isScanning) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, [activeTab]);

  // ฟังก์ชันใหม่: ใช้ jsQR สแกนพิกเซลจากรูปภาพโดยตรง
  const scanWithJsQR = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 1. จำกัดขนาดรูปไม่ให้เกิน 800px เพื่อความเร็ว (ลดภาระ CPU)
          const maxSide = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSide) {
              height *= maxSide / width;
              width = maxSide;
            }
          } else {
            if (height > maxSide) {
              width *= maxSide / height;
              height = maxSide;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // 2. วาดรูปแบบลดความละเอียดลงมา
          ctx.drawImage(img, 0, 0, width, height);
          
          // 3. ดึงข้อมูลพิกเซลไปสแกน
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            resolve(code.data);
          } else {
            reject("ไม่พบ QR Code");
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanningFile(true);
    
    try {
      // ใช้ jsQR สแกน (แม่นยำกว่าสำหรับรูป Static)
      const decodedText = await scanWithJsQR(file);
      handleProcessScan(decodedText);
    } catch (err) {
      console.log("Scan failed:", err);
      alert("ยังไม่พบ QR Code: แนะนำให้ซูมรูป QR ในแกลเลอรี่ให้ใหญ่ขึ้นแล้วแคปหน้าจอใหม่ครับ");
    } finally {
      setIsScanningFile(false);
      e.target.value = null;
    }
  };

  return (
    <div className="h-screen bg-[#2D2D86] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="w-full px-6 py-4 flex justify-between items-center z-50">
        <div className="flex flex-col cursor-pointer" onClick={() => navigate('/dashboard')}>
          <h1 className="text-white text-xl font-bold leading-none">SCI <span className="text-[#B4C424]">KU</span></h1>
          <p className="text-white text-[8px] tracking-[0.2em] opacity-70 uppercase">Faculty of Science</p>
        </div>
        <div className="flex gap-5 text-white/70">
          <button onClick={() => navigate('/dashboard')}><Home size={22} /></button>
          <button onClick={() => navigate('/calendar')}><Calendar size={22} /></button>
          <button onClick={() => navigate('/notification')}><Bell size={22} /></button>
          <button onClick={() => { setScanResult(""); setActiveTab('camera'); setErrorMsg(""); }} className="text-[#B4C424]"><QrCode size={22} /></button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-white rounded-t-[50px] p-6 flex flex-col items-center shadow-2xl relative">
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 w-full max-w-[280px]">
          <button 
            onClick={() => { setActiveTab('camera'); setScanResult(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'camera' ? 'bg-[#2D2D86] text-white shadow-lg' : 'text-gray-400'}`}
          >
            <Camera size={14} /> CAMERA
          </button>
          <button 
            onClick={() => { setActiveTab('file'); setScanResult(""); setErrorMsg(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all ${activeTab === 'file' ? 'bg-[#2D2D86] text-white shadow-lg' : 'text-gray-400'}`}
          >
            <ImageIcon size={14} /> GALLERY
          </button>
        </div>

        {/* Scanner Box */}
        <div className="w-full max-w-sm">
          <div className="relative w-full aspect-square bg-black rounded-[50px] overflow-hidden shadow-2xl border-[6px] border-white">
            
            {activeTab === 'camera' ? (
              <div className="w-full h-full relative">
                <div id="reader" className="w-full h-full"></div>
                {errorMsg && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 p-8 text-center z-10">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-white text-sm font-bold mb-6 leading-relaxed">{errorMsg}</p>
                    <button onClick={() => window.location.reload()} className="bg-white text-[#2D2D86] font-black text-[10px] px-6 py-3 rounded-xl flex items-center gap-2 uppercase">
                      <RefreshCw size={14} /> Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group">
                <div className="bg-[#B4C424]/20 p-8 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon size={56} className="text-[#2D2D86]" />
                </div>
                <p className="text-[#2D2D86] font-black text-sm uppercase">Upload QR Photo</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isScanningFile} />
              </label>
            )}

            {/* Overlay States */}
            {scanResult && (
              <div className="absolute inset-0 bg-[#B4C424] flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in zoom-in">
                <div className="bg-white p-5 rounded-full mb-4 text-[#2D2D86] shadow-2xl animate-bounce">
                  <QrCode size={50} />
                </div>
                <h3 className="text-[#2D2D86] font-black text-3xl italic uppercase">Verified!</h3>
              </div>
            )}

            {isScanningFile && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white z-30">
                <Loader2 className="animate-spin mb-3 text-[#B4C424]" size={40} />
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-60">Scanning...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default QRScanner;