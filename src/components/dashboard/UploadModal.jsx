import React, { useState } from "react";
import { X, CheckCircle2, Loader2, FilePlus } from "lucide-react";
import { API_BASE_URL } from "../../api/config.js";
import Button from "../common/Button.jsx";

const UploadModal = ({ isOpen, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file); // ⚠️ ต้องตรงกับชื่อ field ใน Backend

    try {
      const response = await fetch(`${API_BASE_URL}/schedule/import`, {
        method: "POST",
        headers: {
          // ❌ ห้ามใส่ Content-Type: application/json เมื่อส่ง FormData
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // แสดงความสำเร็จสักพักแล้วรีโหลดข้อมูล
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`❌ การอัปโหลดล้มเหลว: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] p-8 relative shadow-2xl border border-white/20">
        
        {/* ปุ่มปิด (กากบาท) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-transparent"
        >
          <X size={24} />
        </Button>

        <h2 className="text-2xl font-black text-[#2D2D86] mb-6 italic tracking-tighter uppercase">
          Upload Schedule
        </h2>

        <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-50 rounded-[32px] p-10 bg-gray-50/50">
          {isSuccess ? (
            <div className="text-center animate-bounce">
              <CheckCircle2 size={64} className="text-[#B4C424] mx-auto" />
              <p className="mt-4 font-bold text-[#2D2D86]">อัปโหลดสำเร็จ!</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer bg-[#2D2D86] text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 
                  ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    กำลังประมวลผล...
                  </>
                ) : (
                  <>
                    <FilePlus size={20} />
                    เลือกไฟล์จากเครื่อง
                  </>
                )}
              </label>
              <p className="mt-4 text-xs text-gray-400 font-medium italic">
                รองรับไฟล์ Excel และ CSV
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;