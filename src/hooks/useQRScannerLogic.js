import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";

export const useQRScannerLogic = (activeTab) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [isScanningFile, setIsScanningFile] = useState(false);
  const qrScannerRef = useRef(null);

  const extractRoomId = (text) => {
    try {
      if (text.startsWith("http")) {
        const url = new URL(text);
        const pathParts = url.pathname.split("/").filter((p) => p !== "");
        return pathParts[pathParts.length - 1];
      }
      return text.trim();
    } catch (e) {
      return text.trim();
    }
  };

  const handleProcessScan = useCallback((decodedText) => {
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
  }, [navigate]);

  // สแกนจากไฟล์รูปภาพโดยใช้ jsQR
  const scanWithJsQR = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxSide = 800;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSide) { height *= maxSide / width; width = maxSide; }
          } else {
            if (height > maxSide) { width *= maxSide / height; height = maxSide; }
          }
          canvas.width = width; canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) resolve(code.data);
          else reject("ไม่พบ QR Code");
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (activeTab === "camera") {
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
            () => {} // ignore video frame failures
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
      if (qrScannerRef.current?.isScanning) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, [activeTab, handleProcessScan]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanningFile(true);
    try {
      const decodedText = await scanWithJsQR(file);
      handleProcessScan(decodedText);
    } catch (err) {
      alert("ยังไม่พบ QR Code: แนะนำให้ซูมรูป QR ให้ใหญ่ขึ้นแล้วแคปหน้าจอใหม่ครับ");
    } finally {
      setIsScanningFile(false);
      e.target.value = null;
    }
  };

  return { errorMsg, scanResult, isScanningFile, handleFileChange, setScanResult, setErrorMsg };
};