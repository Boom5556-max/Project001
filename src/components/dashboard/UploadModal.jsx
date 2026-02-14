import React, { useState } from "react";
import { X, CheckCircle2, Loader2, FilePlus, AlertCircle, Trash2, Send } from "lucide-react";
import { API_BASE_URL } from "../../api/config.js";
import Button from "../common/Button.jsx";

const UploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("upload"); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [validData, setValidData] = useState([]); 
  const [invalidData, setInvalidData] = useState([]); 
  const [summary, setSummary] = useState({ total: 0 });

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("upload");
    setValidData([]);
    setInvalidData([]);
    setIsProcessing(false);
    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/schedules/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ ปรับให้ตรงกับ Backend: ใช้ previewData และ errors
        setValidData(result.previewData || []); 
        setInvalidData(result.errors || []);
        setSummary({ total: result.total || 0 });
        setStep("preview");
      } else {
        throw new Error(result.message || "ไม่สามารถอ่านไฟล์ได้");
      }
    } catch (error) {
      alert(`❌ ข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsProcessing(false);
      e.target.value = null;
    }
  };

  const removeRow = (index) => {
    setValidData(validData.filter((_, i) => i !== index));
  };

  const handleConfirmImport = async () => {
    if (validData.length === 0) return alert("ไม่มีข้อมูลที่สามารถนำเข้าได้");

    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/schedules/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ schedules: validData }),
      });

      if (response.ok) {
        setStep("success");
        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 2000);
      } else {
        const err = await response.json();
        throw new Error(err.message || "บันทึกล้มเหลว");
      }
    } catch (error) {
      alert(`❌ เกิดข้อผิดพลาดขณะบันทึก: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2D2D86]/20 backdrop-blur-sm">
      <div className={`bg-white w-full ${step === 'preview' ? 'max-w-5xl' : 'max-w-md'} rounded-[32px] p-8 relative shadow-2xl transition-all duration-500`}>
        
        <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-5 right-5 text-gray-400 hover:bg-red-50">
          <X size={24} />
        </Button>

        <h2 className="text-2xl font-black text-[#2D2D86] mb-6 italic uppercase tracking-tighter flex items-center gap-2">
          {step === "preview" ? "Verify Schedule Data" : "Import Schedule"}
        </h2>

        {step === "upload" && (
          <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[32px] p-12 bg-gray-50/30">
            <input type="file" id="file-upload" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={isProcessing} />
            <label htmlFor="file-upload" className={`cursor-pointer bg-[#2D2D86] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${isProcessing ? "opacity-50" : "hover:scale-105 active:scale-95"}`}>
              {isProcessing ? <><Loader2 className="animate-spin" /> กำลังตรวจสอบ...</> : <><FilePlus /> เลือกไฟล์ตารางเรียน</>}
            </label>
            <p className="mt-4 text-xs text-gray-400 italic">ระบบจะเช็คเวลาชนกับตารางสอนและรายการจองก่อนบันทึก</p>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="ในไฟล์ทั้งหมด" value={summary.total} color="text-gray-600" />
              <StatCard label="ผ่านเกณฑ์" value={validData.length} color="text-emerald-600" />
              <StatCard label="พบปัญหา" value={invalidData.length} color="text-red-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* รายการที่พร้อมนำเข้า */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-600 flex items-center gap-2 px-2 text-sm uppercase italic">
                  <CheckCircle2 size={16}/> รายการที่พร้อมบันทึก
                </h3>
                <div className="max-h-[300px] overflow-y-auto border rounded-2xl bg-white shadow-sm overflow-hidden custom-scrollbar">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-emerald-50 text-emerald-700 sticky top-0 font-bold uppercase">
                      <tr>
                        <th className="p-3">วิชา</th>
                        <th className="p-3">ห้อง</th>
                        <th className="p-3">เวลา (เริ่ม-จบ)</th>
                        <th className="p-3 text-center">ลบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {validData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-semibold text-[#2D2D86]">{item.subject_name}</td>
                          <td className="p-3">{item.room_id}</td>
                          {/* ✅ แก้ชื่อ field ให้ตรงกับ Backend (start_time / end_time) */}
                          <td className="p-3 text-gray-500 font-mono">{item.start_time} - {item.end_time}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => removeRow(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* รายการที่มีปัญหา */}
              <div className="space-y-3">
                <h3 className="font-bold text-red-500 flex items-center gap-2 px-2 text-sm uppercase italic">
                  <AlertCircle size={16}/> รายการที่ติดปัญหา (จะถูกข้าม)
                </h3>
                <div className="max-h-[300px] overflow-y-auto border rounded-2xl bg-gray-50/50 overflow-hidden custom-scrollbar">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-red-50 text-red-700 sticky top-0 font-bold uppercase">
                      <tr>
                        <th className="p-3">แถว</th>
                        <th className="p-3">สาเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invalidData.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-bold text-gray-400">{item.row}</td>
                          <td className="p-3 text-red-600 leading-tight">
                             <span className="font-bold text-[#2D2D86] block mb-1">{item.room}</span>
                             {item.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Button onClick={() => setStep("upload")} variant="outline" className="flex-1 py-4 rounded-xl font-bold uppercase italic border-gray-200">
                ยกเลิก
              </Button>
              <Button onClick={handleConfirmImport} disabled={isProcessing || validData.length === 0} 
                className="flex-[2] bg-[#B4C424] hover:bg-[#a3b120] text-[#2D2D86] py-4 rounded-xl font-black uppercase italic shadow-lg shadow-[#B4C424]/20 flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 className="animate-spin" /> : <><Send size={18}/> ยืนยันการนำเข้า {validData.length} รายการ</>}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-12 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-[#2D2D86] italic uppercase">บันทึกเรียบร้อย!</h3>
            <p className="text-gray-500 mt-2">ตารางเรียนถูกนำเข้าสู่ระบบแล้ว</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

export default UploadModal;