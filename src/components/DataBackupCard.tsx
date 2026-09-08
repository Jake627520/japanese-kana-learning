import React, { useRef, useState } from 'react';
import { Download, Upload, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exportAllProgressData, validateAndImportProgressData } from '../utils/dataPortability';
import { useI18n } from '../i18n';

export function DataBackupCard() {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleExport = () => {
    try {
      exportAllProgressData();
      setFeedback({ type: 'success', message: t('common.copied') });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', message: t('home.backup.importError') });
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
        setFeedback({ type: 'error', message: t('home.backup.importError') });
        return;
      }

      const result = validateAndImportProgressData(content);
      if (result.success) {
        setFeedback({ type: 'success', message: t('home.backup.importSuccess') });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setFeedback({ type: 'error', message: result.message || t('home.backup.importError') });
        setTimeout(() => setFeedback(null), 5000);
      }
    };

    reader.onerror = () => {
      setFeedback({ type: 'error', message: t('home.backup.importError') });
      setTimeout(() => setFeedback(null), 4000);
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-[#F4EEDE] p-6 rounded-3xl border border-[#D9CDB2] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#5C6B3D]" />
          <h3 className="text-base font-display font-bold text-[#221F18]">{t('home.backup.title')}</h3>
        </div>
        <p className="text-xs text-[#6B6252]">
          {t('home.backup.desc')}
        </p>

        {feedback && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold mt-2 ${
              feedback.type === 'success'
                ? 'bg-[#E6EAD5] text-[#5C6B3D]'
                : 'bg-[#EFDBD5] text-[#A6443A]'
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
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F4EEDE] hover:bg-[#F0E9D8] border border-[#D9CDB2] hover:border-[#5C6B3D] text-[#221F18] font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[#5C6B3D]" />
          {t('home.backup.btnExport')}
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#5C6B3D] hover:bg-[#47552F] text-[#F1EFE0] font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          {t('home.backup.btnImport')}
        </button>
      </div>
    </div>
  );
}
