import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Send, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { KanaItem, KanaType } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { speakJapanese } from '../utils/speech';

// ── 資料：把假名依「行」分組，維持資料原始順序 ──
function groupByRow(data: KanaItem[]): KanaItem[][] {
  const order: string[] = [];
  const map = new Map<string, KanaItem[]>();
  for (const k of data) {
    if (!map.has(k.row)) {
      map.set(k.row, []);
      order.push(k.row);
    }
    map.get(k.row)!.push(k);
  }
  return order.map((r) => map.get(r)!);
}

// ── 對話訊息模型 ──
type QuizState = {
  prompt: string;          // 要找的羅馬拼音
  answerId: string;        // 正解 kana id
  options: KanaItem[];     // 選項
  pickedId: string | null; // 使用者選的
};

type ChatMsg =
  | { id: number; role: 'sensei' | 'user'; kind: 'text'; text: string }
  | { id: number; role: 'sensei'; kind: 'kana'; kana: KanaItem }
  | { id: number; role: 'sensei'; kind: 'quiz'; quiz: QuizState };

// 教學階段狀態機
type Stage =
  | { type: 'teaching'; rowIdx: number; kanaIdx: number }
  | { type: 'quiz'; rowIdx: number; qIdx: number; total: number; answered: boolean }
  | { type: 'done' };

// 讓 Omit 在 discriminated union 上逐一分配，保留各分支的專屬欄位
type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

let MSG_SEQ = 0;
const nextId = () => ++MSG_SEQ;

// 從一「行」裡挑出小測題目（最多 3 題，選項含其他行干擾）
function buildQuizzes(row: KanaItem[], allKana: KanaItem[]): QuizState[] {
  const picks = shuffle(row).slice(0, Math.min(3, row.length));
  return picks.map((target) => {
    const distractors = shuffle(allKana.filter((k) => k.id !== target.id)).slice(0, 3);
    const options = shuffle([target, ...distractors]);
    return { prompt: target.romaji, answerId: target.id, options, pickedId: null };
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROW_INTROS: Record<string, string> = {
  'あ行': 'あ行是所有音的基礎，全部都是母音喔！先把這 5 個念熟，後面就簡單了 💪',
  'か行': 'か行是「K + 母音」，注意 か・き・く・け・こ 的節奏～',
  'さ行': 'さ行是「S 音」，其中 し 唸作「shi」不是「si」，要特別記住！',
  'た行': 'た行有兩個特別的：ち 唸「chi」、つ 唸「tsu」，其他照規則走。',
  'な行': 'な行是「N 音」，發音柔和，像在哼歌一樣～',
  'は行': 'は行是「H 音」，但 ふ 的音介於 hu / fu 之間，聽聽看！',
  'ま行': 'ま行是「M 音」，閉嘴發聲，很好記！',
  'や行': 'や行只有 3 個：や・ゆ・よ，是半母音，常用在拗音裡。',
  'ら行': 'ら行是「R 音」，其實比較接近輕彈的「L/D」，多聽幾次就抓到了。',
  'わ行': 'わ行剩下 わ 和 を，を 幾乎只當助詞用，唸法同 お。',
  'ん行': '最後的 ん 是唯一的「鼻音」，不能單獨開頭，放在字尾收音用。',
};

interface ChatTutorViewProps {
  onProgressChange?: () => void;
}

export function ChatTutorView({ onProgressChange }: ChatTutorViewProps) {
  const [kanaType, setKanaType] = useState<KanaType>('hiragana');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [stage, setStage] = useState<Stage>({ type: 'teaching', rowIdx: 0, kanaIdx: 0 });
  const [quizzes, setQuizzes] = useState<QuizState[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const source = kanaType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  const rows = useMemo(() => groupByRow(source), [source]);
  const allKana = source;

  const push = (msg: WithoutId<ChatMsg>) =>
    setMessages((m) => [...m, { ...msg, id: nextId() } as ChatMsg]);

  // 初始化 / 切換假名種類時重來
  const resetLesson = (type: KanaType) => {
    const src = type === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const grouped = groupByRow(src);
    setMessages([]);
    setScore({ correct: 0, total: 0 });
    setQuizzes([]);
    setStage({ type: 'teaching', rowIdx: 0, kanaIdx: 0 });
    // 開場白 + 第一行介紹 + 第一個假名
    const first = grouped[0];
    setTimeout(() => {
      setMessages([
        {
          id: nextId(),
          role: 'sensei',
          kind: 'text',
          text: `你好，我是あ老師！👋 我會用聊天的方式，一行一行帶你把${type === 'hiragana' ? '平假名' : '片假名'}學起來。準備好就開始囉～`,
        },
        { id: nextId(), role: 'sensei', kind: 'text', text: `【${first[0].row}】${ROW_INTROS[first[0].row] ?? ''}` },
        { id: nextId(), role: 'sensei', kind: 'kana', kana: first[0] },
      ]);
    }, 0);
  };

  useEffect(() => {
    resetLesson(kanaType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanaType]);

  // 自動捲到底
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  // 使用者說了一句話（右側泡泡）
  const say = (text: string) => push({ role: 'user', kind: 'text', text });

  // 前進到下一個假名 / 進入小測
  const handleNext = () => {
    if (stage.type !== 'teaching') return;
    say('下一個 →');
    const row = rows[stage.rowIdx];
    const nextKanaIdx = stage.kanaIdx + 1;

    if (nextKanaIdx < row.length) {
      setStage({ type: 'teaching', rowIdx: stage.rowIdx, kanaIdx: nextKanaIdx });
      push({ role: 'sensei', kind: 'kana', kana: row[nextKanaIdx] });
    } else {
      // 本行教完 → 出小測
      const qs = buildQuizzes(row, allKana);
      setQuizzes(qs);
      setStage({ type: 'quiz', rowIdx: stage.rowIdx, qIdx: 0, total: qs.length, answered: false });
      push({ role: 'sensei', kind: 'text', text: `${row[0].row}學完了！來個小測驗，共 ${qs.length} 題 ✏️` });
      push({ role: 'sensei', kind: 'quiz', quiz: qs[0] });
    }
  };

  // 使用者在小測中選了答案
  const handlePick = (optId: string) => {
    if (stage.type !== 'quiz' || stage.answered) return;
    const q = quizzes[stage.qIdx];
    const correct = optId === q.answerId;
    const answer = q.options.find((o) => o.id === q.answerId)!;

    // 更新該題訊息的 pickedId（鎖定選項並顯示對錯）
    setMessages((m) =>
      m.map((msg) =>
        msg.kind === 'quiz' && msg.quiz === q ? { ...msg, quiz: { ...q, pickedId: optId } } : msg,
      ),
    );
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setStage({ ...stage, answered: true });

    push({
      role: 'sensei',
      kind: 'text',
      text: correct
        ? `答對了！「${answer.kana}」就是 ${answer.romaji} 🎉`
        : `再想想～ ${answer.romaji} 是「${answer.kana}」。沒關係，記起來就好！`,
    });
    onProgressChange?.();
  };

  // 小測下一題 / 下一行
  const handleAdvanceQuiz = () => {
    if (stage.type !== 'quiz' || !stage.answered) return;
    const nextQ = stage.qIdx + 1;
    if (nextQ < stage.total) {
      say('下一題');
      setStage({ ...stage, qIdx: nextQ, answered: false });
      push({ role: 'sensei', kind: 'quiz', quiz: quizzes[nextQ] });
    } else {
      // 進入下一行
      const nextRowIdx = stage.rowIdx + 1;
      if (nextRowIdx < rows.length) {
        say('進入下一行 →');
        const nextRow = rows[nextRowIdx];
        setStage({ type: 'teaching', rowIdx: nextRowIdx, kanaIdx: 0 });
        push({ role: 'sensei', kind: 'text', text: `【${nextRow[0].row}】${ROW_INTROS[nextRow[0].row] ?? ''}` });
        push({ role: 'sensei', kind: 'kana', kana: nextRow[0] });
      } else {
        say('完成！🎊');
        setStage({ type: 'done' });
        push({
          role: 'sensei',
          kind: 'text',
          text: `太棒了，全部學完了！🎊 小測共答對 ${score.correct}／${score.total} 題。想再練習可以點「重新開始」，或去「綜合測驗」驗收成果！`,
        });
      }
    }
  };

  // 依階段決定底部快速回覆
  const quickReplies = useMemo(() => {
    if (stage.type === 'teaching') {
      const row = rows[stage.rowIdx];
      const kana = row?.[stage.kanaIdx];
      const isLast = stage.rowIdx === rows.length - 1 && stage.kanaIdx === row.length - 1;
      return (
        <>
          {kana && (
            <Chip icon={<Volume2 className="w-4 h-4" />} onClick={() => speakJapanese(kana.kana)}>
              再聽一次
            </Chip>
          )}
          <Chip primary icon={<Send className="w-4 h-4" />} onClick={handleNext}>
            {row && stage.kanaIdx === row.length - 1 ? (isLast ? '完成' : '本行學完，來測驗') : '下一個'}
          </Chip>
        </>
      );
    }
    if (stage.type === 'quiz') {
      if (!stage.answered) {
        return <span className="text-xs text-[#94A3B8] px-2">👆 點上方選項作答</span>;
      }
      const isLastQuiz = stage.qIdx === stage.total - 1;
      const isLastRow = stage.rowIdx === rows.length - 1;
      return (
        <Chip primary icon={<Send className="w-4 h-4" />} onClick={handleAdvanceQuiz}>
          {isLastQuiz ? (isLastRow ? '看成果' : '進入下一行') : '下一題'}
        </Chip>
      );
    }
    return (
      <Chip primary icon={<RotateCcw className="w-4 h-4" />} onClick={() => resetLesson(kanaType)}>
        重新開始
      </Chip>
    );
  }, [stage, rows, quizzes, kanaType, score]);

  const totalKana = allKana.length;
  const learnedApprox =
    stage.type === 'done'
      ? totalKana
      : stage.type === 'quiz'
      ? rows.slice(0, stage.rowIdx + 1).reduce((n, r) => n + r.length, 0)
      : rows.slice(0, stage.rowIdx).reduce((n, r) => n + r.length, 0) +
        (stage.type === 'teaching' ? stage.kanaIdx + 1 : 0);
  const progressPct = Math.round((learnedApprox / totalKana) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] bg-white border border-[#E2E8F0] rounded-3xl shadow-xs overflow-hidden">
      {/* 頂部標題列 */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#F1F5F9] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 bg-[#00A86B] text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0">
            あ
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-[#1E293B] leading-tight truncate">あ老師・對話教室</h2>
            <p className="text-xs text-[#64748B] truncate">聊天式互動，一行一行帶你學五十音</p>
          </div>
        </div>
        {/* 假名種類切換 */}
        <div className="flex bg-[#F1F5F9] rounded-full p-1 shrink-0">
          {(['hiragana', 'katakana'] as KanaType[]).map((t) => (
            <button
              key={t}
              onClick={() => setKanaType(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                kanaType === t ? 'bg-[#00A86B] text-white shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {t === 'hiragana' ? 'ひらがな' : 'カタカナ'}
            </button>
          ))}
        </div>
      </div>

      {/* 進度條 */}
      <div className="px-4 sm:px-6 py-2 border-b border-[#F1F5F9] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A86B] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#64748B] shrink-0">
            {learnedApprox}/{totalKana}
          </span>
        </div>
      </div>

      {/* 對話串 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 bg-[#F8FAF8]">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <MessageBubble msg={msg} stage={stage} onPick={handlePick} />
          </React.Fragment>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 底部快速回覆 */}
      <div className="flex items-center gap-2 flex-wrap px-3 sm:px-6 py-3 border-t border-[#F1F5F9] bg-white shrink-0">
        {quickReplies}
      </div>
    </div>
  );
}

// ── 單則訊息泡泡 ──
function MessageBubble({
  msg,
  stage,
  onPick,
}: {
  msg: ChatMsg;
  stage: Stage;
  onPick: (id: string) => void;
}) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end animate-[fadeIn_0.25s_ease]">
        <div className="max-w-[75%] bg-[#00A86B] text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm font-medium shadow-xs">
          {msg.kind === 'text' ? msg.text : ''}
        </div>
      </div>
    );
  }

  // sensei 側：頭像 + 內容
  return (
    <div className="flex gap-2.5 items-end animate-[fadeIn_0.25s_ease]">
      <div className="w-8 h-8 bg-[#00A86B] text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mb-1">
        あ
      </div>
      <div className="max-w-[85%]">
        {msg.kind === 'text' && (
          <div className="bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-[#2D3436] leading-relaxed shadow-xs">
            {msg.text}
          </div>
        )}
        {msg.kind === 'kana' && <KanaCard kana={msg.kana} />}
        {msg.kind === 'quiz' && <QuizCard quiz={msg.quiz} stage={stage} onPick={onPick} />}
      </div>
    </div>
  );
}

// ── 假名教學卡（內嵌於對話） ──
function KanaCard({ kana }: { kana: KanaItem }) {
  const example = kana.examples?.[0];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md p-4 shadow-xs w-64 max-w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => speakJapanese(kana.kana)}
          className="group relative w-20 h-20 bg-[#E6F8F2] rounded-2xl flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#00A86B] transition-colors"
          aria-label={`播放 ${kana.romaji} 發音`}
        >
          <span className="text-4xl font-extrabold text-[#00A86B] group-hover:text-white transition-colors">
            {kana.kana}
          </span>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-xs">
            <Volume2 className="w-3 h-3 text-[#00A86B]" />
          </span>
        </button>
        <div className="min-w-0">
          <div className="text-2xl font-extrabold text-[#1E293B] leading-none">{kana.romaji}</div>
          <div className="text-xs text-[#94A3B8] mt-1">{kana.row}・{kana.col}</div>
          {example && (
            <div className="mt-2 text-xs text-[#64748B]">
              <button
                onClick={() => speakJapanese(example.word)}
                className="font-bold text-[#00A86B] cursor-pointer hover:underline"
              >
                {example.word}
              </button>
              <span className="text-[#94A3B8]">（{example.romaji}）</span>
              <div className="text-[#64748B]">{example.meaning}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 小測卡 ──
function QuizCard({
  quiz,
  stage,
  onPick,
}: {
  quiz: QuizState;
  stage: Stage;
  onPick: (id: string) => void;
}) {
  const locked = quiz.pickedId !== null;
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md p-4 shadow-xs w-72 max-w-full">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#00A86B] mb-3">
        <Sparkles className="w-4 h-4" />
        哪一個是「{quiz.prompt}」？
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quiz.options.map((opt) => {
          const isAnswer = opt.id === quiz.answerId;
          const isPicked = opt.id === quiz.pickedId;
          let cls = 'border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#00A86B] hover:bg-[#E6F8F2]';
          if (locked && isAnswer) cls = 'border-[#00A86B] bg-[#E6F8F2] text-[#00A86B]';
          else if (locked && isPicked && !isAnswer) cls = 'border-red-300 bg-red-50 text-red-500';
          else if (locked) cls = 'border-[#F1F5F9] bg-[#FAFBFB] text-[#94A3B8]';
          return (
            <button
              key={opt.id}
              disabled={locked}
              onClick={() => onPick(opt.id)}
              className={`relative flex items-center justify-center h-14 rounded-xl border-2 text-2xl font-extrabold transition-all ${cls} ${
                locked ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {opt.kana}
              {locked && isAnswer && (
                <Check className="absolute top-1 right-1 w-4 h-4 text-[#00A86B]" />
              )}
              {locked && isPicked && !isAnswer && (
                <X className="absolute top-1 right-1 w-4 h-4 text-red-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 快速回覆按鈕 ──
function Chip({
  children,
  onClick,
  primary,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
        primary
          ? 'bg-[#00A86B] text-white shadow-xs hover:bg-[#00915C]'
          : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
