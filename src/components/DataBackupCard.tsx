import React, { useRef, useState } from 'react';
import { Download, Upload, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportAllProgressData, validateAndImportProgressData } from '../utils/dataPortability';

export function DataBackupCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExport = () => {
    try {
      exportAllProgressData();
      setFeedback({ type: 'success', message: '已成功匯出進度備份檔案！' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', message: '匯出備份失敗，請重試。' });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        setFeedback({ type: 'error', message: '讀取檔案失敗。' });
        return;
      }

      const result = validateAndImportProgressData(content);
      if (result.success) {
        setFeedback({ type: 'success', message: '進度還原成功！正在重新載入...' });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setFeedback({ type: 'error', message: result.message });
        setTimeout(() => setFeedback(null), 5000);
      }
    };

    reader.onerror = () => {
      setFeedback({ type: 'error', message: '無法讀取該檔案。' });
      setTimeout(() => setFeedback(null), 4000);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#00A86B]" />
          <h3 className="text-base font-extrabold text-[#1E293B]">學習進度備份與還原</h3>
        </div>
        <p className="text-xs text-[#64748B]">
          支援將假名熟練度、SRS 複習週期與 JLPT 答題紀錄匯出為 JSON 備份，隨時隨地安全還原。
        </p>

        {feedback && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold mt-2 ${
              feedback.type === 'success'
                ? 'bg-[#E6F8F2] text-[#00A86B]'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            {feedback.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleExport}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FAFBFB] hover:bg-slate-50 border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#00A86B]" />
          匯出進度
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          匯入還原
        </button>
      </div>
    </div>
  );
}
