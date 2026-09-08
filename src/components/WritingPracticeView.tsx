import React, { useEffect, useRef, useState } from 'react';
import { KanaItem } from '../types';
import { HIRAGANA_DATA } from '../data/kanaData';
import { HIRAGANA_STROKES } from '../data/strokeData';
import { getStoredProgress, toggleKanaMastered } from '../utils/storage';
import { logLearningEvent } from '../utils/learningEvents';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';
import {
  Eraser, Volume2, Check, ChevronLeft, ChevronRight, PenLine, Eye, EyeOff,
} from 'lucide-react';

interface Props {
  initialKanaId?: string | null;
  onProgressChange?: () => void;
}

export function WritingPracticeView({ initialKanaId, onProgressChange }: Props) {
  const { t } = useI18n();
  const list: KanaItem[] = HIRAGANA_DATA;
  const [index, setIndex] = useState(() => {
    if (initialKanaId) {
      const idx = HIRAGANA_DATA.findIndex((k) => k.id === initialKanaId);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [showTrace, setShowTrace] = useState(true);
  const [masteredIds, setMasteredIds] = useState<string[]>(
    () => getStoredProgress().masteredKanaIds,
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    if (initialKanaId) {
      const idx = list.findIndex((k) => k.id === initialKanaId);
      if (idx >= 0) {
        setIndex(idx);
      }
    }
  }, [initialKanaId, list]);

  const kana = list[index] || list[0];
  const guide = HIRAGANA_STROKES[kana.id];
  const isMastered = masteredIds.includes(kana.id);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);

    ctx.strokeStyle = '#D9CDB2';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showTrace) {
      ctx.fillStyle = '#E6EAD5';
      ctx.font = `${Math.floor(canvas.height * 0.72)}px "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(kana.kana, canvas.width / 2, canvas.height / 2 + canvas.height * 0.02);
    }
  }, [kana.id, showTrace]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    setHasInk(true);
    const p = pos(e);
    ctx.strokeStyle = '#221F18';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const clearInk = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);

    ctx.strokeStyle = '#D9CDB2';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showTrace) {
      ctx.fillStyle = '#E6EAD5';
      ctx.font = `${Math.floor(canvas.height * 0.72)}px "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(kana.kana, canvas.width / 2, canvas.height / 2 + canvas.height * 0.02);
    }
  };

  const handleMastered = () => {
    const updated = toggleKanaMastered(kana.id);
    logLearningEvent({
      type: 'writing_complete',
      source: 'writing_view',
      kanaId: kana.id,
    });
    setMasteredIds(updated.masteredKanaIds);
    onProgressChange?.();
  };

  const goTo = (i: number) => {
    if (i < 0 || i >= list.length) return;
    setIndex(i);
  };

  return (
    <div className="space-y-6">
      {/* 標題 */}
      <div className="bg-[#F4EEDE] p-5 sm:p-6 rounded-3xl border border-[#D9CDB2] shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6EAD5] text-[#5C6B3D] rounded-full text-xs font-bold mb-1">
            <PenLine className="w-3.5 h-3.5" />
            {t('writing.title')}
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#221F18]">
            {t('writing.title')}
          </h2>
          <p className="text-xs text-[#6B6252] mt-0.5">
            {t('writing.subtitle')}
          </p>
        </div>
      </div>

      {/* 兩欄：左筆順、右手寫區 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：示範與筆順 */}
        <div className="bg-[#F4EEDE] p-5 sm:p-6 rounded-3xl border border-[#D9CDB2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#221F18]">{t('writing.strokeOrderTitle')}</span>
            <button
              onClick={() => speakJapanese(kana.kana)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#5C6B3D] bg-[#E6EAD5] rounded-lg hover:bg-[#DBE1C8] cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> {t('common.playAudio')}
            </button>
          </div>

          <div className="flex items-center justify-center p-8 bg-[#F4EEDE] rounded-2xl border border-[#ECE4D0]">
            <div className="text-center space-y-2">
              <div className="text-7xl font-extrabold text-[#221F18]">{kana.kana}</div>
              <div className="text-sm font-extrabold text-[#5C6B3D] uppercase tracking-wider">
                {kana.romaji}
              </div>
            </div>
          </div>

          {guide && (
            <div className="space-y-2 pt-2 border-t border-[#ECE4D0]">
              <div className="text-xs font-extrabold text-[#5C6B3D]">
                {guide.count}
              </div>
              <ol className="space-y-1.5">
                {guide.steps.map((s, i) => (
                  <li key={i} className="text-xs text-[#221F18] leading-relaxed">{s}</li>
                ))}
              </ol>
              {guide.note && (
                <p className="text-[11px] text-[#7A5320] bg-[#EFE3C9] rounded-lg px-3 py-2 leading-relaxed">
                  {guide.note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 右：手寫區 */}
        <div className="bg-[#F4EEDE] p-5 sm:p-6 rounded-3xl border border-[#D9CDB2] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#221F18]">{t('writing.title')}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTrace((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#221F18] bg-[#F4EEDE] border border-[#D9CDB2] rounded-lg hover:bg-[#F0E9D8] cursor-pointer"
              >
                {showTrace ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showTrace ? t('writing.hideStroke') : t('writing.showStroke')}
              </button>
              <button
                onClick={clearInk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#221F18] bg-[#F4EEDE] border border-[#D9CDB2] rounded-lg hover:bg-[#F0E9D8] cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" /> {t('writing.clearCanvas')}
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={480}
            height={480}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-[#D9CDB2] touch-none cursor-crosshair bg-[#F4EEDE]"
          />

          <button
            onClick={handleMastered}
            disabled={!hasInk && !isMastered}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-extrabold text-sm rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isMastered
                ? 'bg-[#E6EAD5] text-[#5C6B3D] border border-[#5C6B3D]/30'
                : 'bg-[#5C6B3D] text-[#F1EFE0] hover:bg-[#47552F]'
            }`}
          >
            <Check className="w-4 h-4" />
            {isMastered ? t('study.unmarkMastered') : t('study.markMastered')}
          </button>
        </div>
      </div>

      {/* 上下一字 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#221F18] bg-[#F4EEDE] border border-[#D9CDB2] rounded-xl hover:bg-[#F0E9D8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> {t('common.previous')}
        </button>
        <span className="text-xs text-[#6B6252] font-semibold">
          {index + 1} / {list.length}
        </span>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === list.length - 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#221F18] bg-[#F4EEDE] border border-[#D9CDB2] rounded-xl hover:bg-[#F0E9D8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {t('common.next')} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
