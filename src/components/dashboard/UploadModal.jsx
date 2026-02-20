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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm font-sans">
      <div className={`bg-[#FFFFFF] w-full ${step === 'preview' ? 'max-w-6xl' : 'max-w-lg'} rounded-[40px] p-10 relative shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 border border-white`}>
        
        <button onClick={handleClose} className="absolute top-8 right-8 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
          <X size={20} />
        </button>

        <header className="mb-8">
          <h2 className="text-2xl font-bold text-[#302782] mb-2">
            {step === "preview" ? "ตรวจสอบข้อมูลตารางเรียน" : "นำเข้าข้อมูลตารางเรียน"}
          </h2>
          <p className="text-sm font-medium text-gray-400">
            {step === "preview" ? "กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนกดยืนยัน" : "อัปโหลดไฟล์ตารางเรียน (.xlsx, .csv) เข้าสู่ระบบ"}
          </p>
        </header>

        {step === "upload" && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px] p-16 bg-gray-50/50">
            <input type="file" id="file-upload" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={isProcessing} />
            <label htmlFor="file-upload" className={`cursor-pointer bg-[#302782] text-[#FFFFFF] px-12 py-5 rounded-[20px] font-bold text-lg flex items-center gap-3 shadow-lg shadow-[#302782]/20 transition-all ${isProcessing ? "opacity-50" : "hover:bg-opacity-90 active:transform active:scale-95"}`}>
              {isProcessing ? <><Loader2 className="animate-spin" /> กำลังตรวจสอบข้อมูล...</> : <><FilePlus size={24} /> เลือกไฟล์จากเครื่อง</>}
            </label>
            <p className="mt-6 text-sm text-gray-400 font-medium text-center max-w-xs">ระบบจะตรวจสอบการชนกันของเวลาและห้องเรียนโดยอัตโนมัติ</p>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="ข้อมูลทั้งหมดในไฟล์" value={summary.total} color="text-[#302782]" />
              <StatCard label="รายการที่ผ่านเกณฑ์" value={validData.length} color="text-[#B2BB1E]" />
              <StatCard label="พบข้อผิดพลาด" value={invalidData.length} color="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* รายการที่พร้อมนำเข้า */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-[#B2BB1E] flex items-center gap-2 px-1 text-base">
                  <CheckCircle2 size={20}/> รายการที่พร้อมบันทึก
                </h3>
                <div className="h-[350px] overflow-y-auto border border-gray-100 rounded-3xl bg-[#FFFFFF] shadow-sm custom-scrollbar">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0 font-bold border-b border-gray-100">
                      <tr>
                        <th className="p-4">รายวิชา</th>
                        <th className="p-4">ห้อง</th>
                        <th className="p-4">ช่วงเวลา</th>
                        <th className="p-4 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {validData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-bold text-[#302782]">{item.subject_name}</td>
                          <td className="p-4 font-medium text-gray-600">{item.room_id}</td>
                          <td className="p-4 text-gray-500 font-bold">{item.start_time} - {item.end_time}</td>
                          <td className="p-4 text-center">
                            <button onClick={() => removeRow(idx)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* รายการที่มีปัญหา */}
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-red-500 flex items-center gap-2 px-1 text-base">
                  <AlertCircle size={20}/> รายการที่พบปัญหา (จะถูกข้าม)
                </h3>
                <div className="h-[350px] overflow-y-auto border border-gray-100 rounded-3xl bg-gray-50/30 shadow-sm custom-scrollbar">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-red-50 text-red-700 sticky top-0 font-bold border-b border-red-100">
                      <tr>
                        <th className="p-4">แถว</th>
                        <th className="p-4">สาเหตุที่พบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invalidData.map((item, idx) => (
                        <tr key={idx} className="bg-[#FFFFFF]/50">
                          <td className="p-4 font-bold text-gray-400">{item.row}</td>
                          <td className="p-4 text-red-600 leading-relaxed">
                             <span className="font-bold text-[#302782] block mb-0.5">{item.room}</span>
                             {item.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-100">
              <Button onClick={() => setStep("upload")} variant="danger" className="flex-1 py-5 rounded-[20px] font-bold text-lg">
                ยกเลิกและย้อนกลับ
              </Button>
              <Button onClick={handleConfirmImport} disabled={isProcessing || validData.length === 0} 
                className="flex-[2] bg-[#B2BB1E] text-[#FFFFFF] py-5 rounded-[20px] font-bold text-lg shadow-lg shadow-[#B2BB1E]/20 flex items-center justify-center gap-3">
                {isProcessing ? <><Loader2 className="animate-spin" /> กำลังบันทึกข้อมูล...</> : <><Send size={22}/> ยืนยันนำเข้าข้อมูล {validData.length} รายการ</>}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#B2BB1E]/10 text-[#B2BB1E] rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-bold text-[#302782] mb-3">บันทึกสำเร็จ!</h3>
            <p className="text-lg font-medium text-gray-400">ตารางเรียนถูกนำเข้าสู่ระบบเรียบร้อยแล้ว</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-50 p-6 rounded-[28px] border border-gray-100 text-center shadow-sm">
    <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

export default UploadModal;