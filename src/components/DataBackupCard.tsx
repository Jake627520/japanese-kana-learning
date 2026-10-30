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
      setFeedback({ type: 'success', message: t('home.backup.exportSuccess') });
      setTimeout(() => setFeedback(null), 4000);
    } catch (e) {
      setFeedback({ type: 'error', message: t('home.backup.exportError') });
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
        // result.message 是寫死的繁中除錯訊息，畫面上一律顯示目前語言的提示
        console.warn('Backup import rejected:', result.message);
        setFeedback({ type: 'error', message: t('home.backup.importError') });
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
    <div className="bg-[color:var(--paper-bg)] p-6 rounded-3xl border border-[color:var(--paper-85)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[color:var(--moss-50)]" />
          <h3 className="text-base font-display font-bold text-[color:var(--ink-24)]">{t('home.backup.title')}</h3>
        </div>
        <p className="text-xs text-[color:var(--ink-50)]">
          {t('home.backup.desc')}
        </p>

        {feedback && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold mt-2 ${
              feedback.type === 'success'
                ? 'bg-[color:var(--moss-93)] text-[color:var(--moss-50)]'
                : 'bg-[color:var(--shu-91)] text-[color:var(--shu-52a)]'
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
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[color:var(--paper-bg)] hover:bg-[color:var(--paper-93)] border border-[color:var(--paper-85)] hover:border-[color:var(--moss-50)] text-[color:var(--ink-24)] font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4 text-[color:var(--moss-50)]" />
          {t('home.backup.btnExport')}
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="flex-1 sm:flex-none px-4 py-2.5 bg-[color:var(--moss-50)] hover:bg-[color:var(--moss-43)] text-[color:var(--paper-95)] font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          {t('home.backup.btnImport')}
        </button>
      </div>
    </div>
  );
}
