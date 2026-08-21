import React, { useEffect, useRef, useState } from 'react';
import { KanaItem } from '../types';
import { HIRAGANA_DATA } from '../data/kanaData';
import { HIRAGANA_STROKES } from '../data/strokeData';
import { getStoredProgress, toggleKanaMastered } from '../utils/storage';
import { speakJapanese } from '../utils/speech';
import {
  Eraser, Volume2, Check, ChevronLeft, ChevronRight, PenLine, Eye, EyeOff,
} from 'lucide-react';

// 書寫練習：描紅 + 手寫 + 自我判斷。
//
// 刻意不做自動判分：手寫相似度判斷做不準（同一個字寫得歪一點就可能被判錯），
// 而錯誤的回饋比沒有回饋更傷——這與 shadowing 不做發音評分是同一個理由。
// 改成給描紅參考與筆順要點，由學習者自己比對後按「寫對了 / 再練一次」。
//
// 進度重用既有的 masteredKanaIds，不另立一套 storage：書寫練會了就是「這個假名
// 掌握了」，和圖表／卡片的掌握狀態是同一件事，分開存只會讓兩邊數字打架。

interface Props {
  onProgressChange?: () => void;
}

export function WritingPracticeView({ onProgressChange }: Props) {
  const list: KanaItem[] = HIRAGANA_DATA;
  const [index, setIndex] = useState(0);
  const [showTrace, setShowTrace] = useState(true);
  const [masteredIds, setMasteredIds] = useState<string[]>(
    () => getStoredProgress().masteredKanaIds,
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  const kana = list[index];
  const guide = HIRAGANA_STROKES[kana.id];
  const isMastered = masteredIds.includes(kana.id);

  // 每次換字或切換描紅都重畫底層（描紅字 + 十字參考線）
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);

    // 十字參考線：讓初學者抓得到字的中心與比例
    ctx.strokeStyle = '#E2E8F0';
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
      ctx.fillStyle = '#E8F5EE';
      ctx.font = `${Math.floor(canvas.height * 0.72)}px "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(kana.kana, canvas.width / 2, canvas.height / 2 + canvas.height * 0.02);
    }
  }, [kana.id, showTrace]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    // canvas 內部解析度與 CSS 顯示大小可能不同，要換算，否則筆跡會偏移
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
    ctx.strokeStyle = '#1E293B';
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

  const end = () => { drawingRef.current = false; };

  const clearInk = () => {
    // 用重設 key 的方式重畫底圖：直接清掉會連描紅一起清掉
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    ctx.strokeStyle = '#E2E8F0';
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
      ctx.fillStyle = '#E8F5EE';
      ctx.font = `${Math.floor(canvas.height * 0.72)}px "Hiragino Sans", "Yu Gothic", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(kana.kana, canvas.width / 2, canvas.height / 2 + canvas.height * 0.02);
    }
  };

  const goTo = (i: number) => {
    setIndex(Math.max(0, Math.min(list.length - 1, i)));
  };

  const handleMastered = () => {
    const updated = toggleKanaMastered(kana.id);
    setMasteredIds(updated.masteredKanaIds);
    onProgressChange?.();
    if (!isMastered && index < list.length - 1) {
      setTimeout(() => goTo(index + 1), 250);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
          <PenLine className="w-3.5 h-3.5" />
          書寫練習
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">看筆順 → 描紅 → 自己寫</h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          寫得出來和認得出來是兩種能力。這裡不自動評分——照筆順寫完，自己和上方的字比對，再決定要不要標記為已掌握。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左：字 + 筆順 */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-[#1E293B] leading-none">{kana.kana}</span>
              <span className="text-sm text-[#64748B] font-bold">{kana.romaji}</span>
            </div>
            <button
              onClick={() => speakJapanese(kana.kana)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" /> 發音
            </button>
          </div>

          {guide && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-[#00A86B]">
                共 {guide.count} 畫
              </div>
              <ol className="space-y-1.5">
                {guide.steps.map((s, i) => (
                  <li key={i} className="text-xs text-[#1E293B] leading-relaxed">{s}</li>
                ))}
              </ol>
              {guide.note && (
                <p className="text-[11px] text-[#92400E] bg-[#FEF3C7] rounded-lg px-3 py-2 leading-relaxed">
                  {guide.note}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 右：手寫區 */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#1E293B]">在這裡寫</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTrace((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                {showTrace ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showTrace ? '關閉描紅' : '顯示描紅'}
              </button>
              <button
                onClick={clearInk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" /> 清除
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
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-[#E2E8F0] touch-none cursor-crosshair bg-white"
          />

          <button
            onClick={handleMastered}
            disabled={!hasInk && !isMastered}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 font-extrabold text-sm rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isMastered
                ? 'bg-[#E6F8F2] text-[#00A86B] border border-[#00A86B]/30'
                : 'bg-[#00A86B] text-white hover:bg-[#008F5B]'
            }`}
          >
            <Check className="w-4 h-4" />
            {isMastered ? '已標記為掌握（點此取消）' : '寫對了，標記為已掌握'}
          </button>
        </div>
      </div>

      {/* 上下一字 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> 上一個
        </button>
        <span className="text-xs text-[#64748B] font-semibold">
          {index + 1} / {list.length} 　已掌握 {masteredIds.filter((id) => id.startsWith('h_')).length} / {list.length}
        </span>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === list.length - 1}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          下一個 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
