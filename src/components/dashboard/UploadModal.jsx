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
        setSummary({ total: result.total_rows_excel || 0 });
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm font-sans">
      {/* ปรับขนาด Modal ให้กระชับขึ้น */}
      <div className={`bg-white w-full ${step === 'preview' ? 'max-w-4xl' : 'max-w-md'} rounded-[32px] p-6 md:p-8 relative shadow-2xl transition-all duration-300 border border-white/20`}>
        
        <button onClick={handleClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
          <X size={18} />
        </button>

        <header className="mb-6">
          <h2 className="text-xl font-bold text-[#302782]">
            {step === "preview" ? "ตรวจสอบตารางเรียน" : "นำเข้าตารางเรียน"}
          </h2>
          <p className="text-xs font-medium text-gray-400">
            {step === "preview" ? "ตรวจสอบความถูกต้องก่อนบันทึกเข้าสู่ระบบ" : "อัปโหลดไฟล์ Excel เข้าสู่ระบบ"}
          </p>
        </header>

        {step === "upload" && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[24px] p-8 md:p-12 bg-gray-50/50">
            <input type="file" id="file-upload" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} disabled={isProcessing} />
            <label htmlFor="file-upload" className={`cursor-pointer bg-[#302782] text-white px-8 py-3.5 rounded-[16px] font-bold text-base flex items-center gap-2 shadow-lg transition-all ${isProcessing ? "opacity-50" : "hover:scale-105 active:scale-95"}`}>
              {isProcessing ? <><Loader2 className="animate-spin" size={20} /> กำลังตรวจสอบ...</> : <><FilePlus size={20} /> เลือกไฟล์</>}
            </label>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-6">
            {/* Stats - ปรับให้เล็กลง */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="ในไฟล์" value={summary.total} color="text-[#302782]" />
              <StatCard label="ผ่านเกณฑ์" value={validData.length} color="text-[#B2BB1E]" />
              <StatCard label="มีปัญหา" value={invalidData.length} color="text-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* รายการที่ถูกต้อง */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-[#B2BB1E] text-xs flex items-center gap-1.5 px-1">
                  <CheckCircle2 size={16}/> รายการที่ถูกต้อง ({validData.length})
                </h3>
                <div className="h-[280px] overflow-y-auto border border-gray-100 rounded-2xl bg-white shadow-sm custom-scrollbar">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0 font-bold border-b z-10">
                      <tr>
                        <th className="p-3">วิชา/เวลา</th>
                        <th className="p-3">ห้อง</th>
                        <th className="p-3 text-center">ลบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {validData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-[#302782] block truncate w-40">{item.subject_name}</span>
                            <span className="text-[9px] text-gray-500 block">{item.date} ({item.start_time}-{item.end_time})</span>
                            <span className="text-[9px] text-[#B2BB1E] font-bold">ผู้สอน: {item.teacher_name}</span>
                          </td>
                          <td className="p-3 font-bold text-gray-600">{item.room_id}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => removeRow(idx)} className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors">
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
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-red-500 text-xs flex items-center gap-1.5 px-1">
                  <AlertCircle size={16}/> รายการที่มีปัญหา ({invalidData.length})
                </h3>
                <div className="h-[280px] overflow-y-auto border border-red-50 rounded-2xl bg-red-50/10 shadow-sm custom-scrollbar">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-red-50 text-red-700 sticky top-0 font-bold border-b z-10">
                      <tr>
                        <th className="p-3 w-12 text-center">แถว</th>
                        <th className="p-3">สาเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invalidData.map((item, idx) => (
                        <tr key={idx} className="bg-white/60 text-[11px]">
                          <td className="p-3 font-bold text-gray-400 text-center">{item.row}</td>
                          <td className="p-3">
                            <span className="font-bold text-[#302782] block">{item.room || 'ไม่ระบุห้อง'}</span>
                            <span className="text-red-600 leading-tight block">{item.message}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Buttons - ปรับขนาดปุ่ม */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button onClick={() => setStep("upload")} variant="danger" className="flex-1 py-3 rounded-[14px] font-bold text-sm">
                ยกเลิก
              </Button>
              <Button onClick={handleConfirmImport} disabled={isProcessing || validData.length === 0} 
                className="flex-[2] bg-[#B2BB1E] text-white py-3 rounded-[14px] font-bold text-sm shadow-lg flex items-center justify-center gap-2">
                {isProcessing ? <><Loader2 className="animate-spin" size={18} /> บันทึก...</> : <><Send size={18}/> บันทึก {validData.length} รายการ</>}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#B2BB1E]/10 text-[#B2BB1E] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[#302782] mb-2">บันทึกสำเร็จ!</h3>
            <p className="text-base font-medium text-gray-400">ข้อมูลตารางเรียนเข้าสู่ระบบเรียบร้อยแล้ว</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ปรับ StatCard ให้กะทัดรัด
const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 text-center shadow-sm">
    <p className="text-[8px] uppercase tracking-wider font-bold text-gray-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default UploadModal;