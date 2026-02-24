import React, { useState } from "react";
import api from "../../api/axios.js";
import {
  X,
  CheckCircle2,
  Loader2,
  FilePlus,
  AlertCircle,
  Trash2,
  Send,
} from "lucide-react";
import Button from "../common/Button.jsx";
import ActionModal from "../common/ActionModal.jsx";

const UploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("upload"); // "upload" หรือ "preview"
  const [isProcessing, setIsProcessing] = useState(false);
  const [validData, setValidData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [summary, setSummary] = useState({ total: 0 });
  const [importResult, setImportResult] = useState(null); // 'success' หรือ 'error'

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("upload");
    setValidData([]);
    setInvalidData([]);
    setIsProcessing(false);
    setImportResult(null);
    onClose();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/schedules/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const result = response.data;
      setValidData(result.previewData || []);
      setInvalidData(result.errors || []);
      setSummary({ total: result.total_rows_excel || 0 });
      setStep("preview");
    } catch (error) {
      setImportResult("error");
    } finally {
      setIsProcessing(false);
      e.target.value = null;
    }
  };

  const handleConfirmImport = async () => {
    if (validData.length === 0) return;
    setIsProcessing(true);
    try {
      await api.post("/schedules/confirm", { schedules: validData });
      setImportResult("success");
    } catch (error) {
      setImportResult("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeRow = (index) => {
    setValidData(validData.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* 1. หน้าจอหลัก: อัปโหลด และ ตรวจสอบข้อมูล */}
      {!importResult && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm font-sans">
          <div
            className={`bg-white shadow-2xl relative rounded-[40px] p-8 mx-auto border border-white/20 transition-all duration-300 ${
              step === "preview" ? "w-full max-w-4xl" : "w-full max-w-md"
            }`}
          >
            {/* ปุ่มปิด Modal */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X size={18} />
            </button>

            <header className="mb-6">
              <h2 className="text-xl font-bold text-[#302782]">
                {step === "preview" ? "ตรวจสอบตารางเรียน" : "นำเข้าตารางเรียน"}
              </h2>
              <p className="text-xs font-medium text-gray-400">
                อัปโหลดไฟล์ Excel เข้าสู่ระบบ
              </p>
            </header>

            {/* ส่วนที่ 1: หน้าเลือกไฟล์ (Upload Step) */}
            {step === "upload" ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[24px] p-12 bg-gray-50/50">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer bg-[#302782] text-white px-8 py-3.5 rounded-[16px] font-bold text-base flex items-center gap-2 shadow-lg transition-all ${
                    isProcessing ? "opacity-50" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> กำลังตรวจสอบ...
                    </>
                  ) : (
                    <>
                      <FilePlus size={20} /> เลือกไฟล์ Excel
                    </>
                  )}
                </label>
              </div>
            ) : (
              /* ส่วนที่ 2: ตาราง Preview ข้อมูล (Preview Step) */
              <div className="space-y-6">
                {/* แถวสรุปสถิติ */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="ในไฟล์" value={summary.total} color="text-[#302782]" />
                  <StatCard label="ผ่านเกณฑ์" value={validData.length} color="text-[#B2BB1E]" />
                  <StatCard label="มีปัญหา" value={invalidData.length} color="text-red-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* ตารางรายการที่ถูกต้อง */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-[#B2BB1E] text-xs flex items-center gap-1.5 px-1">
                      <CheckCircle2 size={16} /> รายการที่ถูกต้อง ({validData.length})
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
                          {validData.length > 0 ? (
                            validData.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3">
                                  <span className="font-bold text-[#302782] block truncate w-40">{item.subject_name}</span>
                                  <span className="text-[9px] text-gray-500 block">{item.date} ({item.start_time}-{item.end_time})</span>
                                </td>
                                <td className="p-3 font-bold text-gray-600">{item.room_id}</td>
                                <td className="p-3 text-center">
                                  <button onClick={() => removeRow(idx)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="3" className="p-8 text-center text-gray-400">ไม่มีข้อมูลที่ถูกต้อง</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ตารางรายการที่มีปัญหา */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-red-500 text-xs flex items-center gap-1.5 px-1">
                      <AlertCircle size={16} /> รายการที่มีปัญหา ({invalidData.length})
                    </h3>
                    <div className="h-[280px] overflow-y-auto border border-red-50 rounded-2xl bg-red-50/10 shadow-sm custom-scrollbar">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-red-50 text-red-700 sticky top-0 font-bold border-b z-10">
                          <tr>
                            <th className="p-3 w-12 text-center">แถว</th>
                            <th className="p-3">สาเหตุที่บันทึกไม่ได้</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {invalidData.length > 0 ? (
                            invalidData.map((item, idx) => (
                              <tr key={idx} className="bg-white/60 text-[11px]">
                                <td className="p-3 font-bold text-gray-400 text-center">{item.row}</td>
                                <td className="p-3">
                                  <span className="font-bold text-[#302782] block">{item.room || "ข้อมูลไม่ครบ"}</span>
                                  <span className="text-red-600 leading-tight block">{item.message}</span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="2" className="p-8 text-center text-gray-400">ยินดีด้วย! ไม่มีรายการที่ผิดพลาด</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ปุ่มควบคุมด้านล่างหน้า Preview */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => setStep("upload")}
                    variant="danger"
                    className="flex-1 py-3 rounded-[14px]"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={handleConfirmImport}
                    disabled={isProcessing || validData.length === 0}
                    className="flex-[2] bg-[#B2BB1E] text-white py-3 rounded-[14px] flex items-center justify-center gap-2 font-bold shadow-md active:scale-95 transition-all"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}{" "}
                    บันทึกข้อมูล {validData.length} รายการ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Success Pop-up (ใช้ ActionModal ปุ่มเดียว) */}
      {importResult === "success" && (
        <ActionModal
          icon={<CheckCircle2 size={56} className="text-[#B2BB1E]" />}
          title="อัปโหลดสำเร็จ!"
          singleButton={true}
          buttonText="ตกลง"
          onConfirm={() => {
            handleClose();
            window.location.reload();
          }}
        />
      )}

      {/* 3. Error Pop-up (ใช้ ActionModal ปุ่มเดียว) */}
      {importResult === "error" && (
        <ActionModal
          icon={<AlertCircle size={56} className="text-red-500" />}
          title="อัปโหลดไม่สำเร็จ"
          singleButton={true}
          buttonText="ลองใหม่อีกครั้ง"
          onConfirm={() => setImportResult(null)}
          onClose={() => setImportResult(null)}
        />
      )}
    </>
  );
};

// Component ย่อยสำหรับแสดงตัวเลขสรุป
const StatCard = ({ label, value, color }) => (
  <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 text-center shadow-sm">
    <p className="text-[8px] uppercase tracking-wider font-bold text-gray-400 mb-1">
      {label}
    </p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default UploadModal;