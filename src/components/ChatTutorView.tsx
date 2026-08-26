import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Send, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { KanaItem, KanaType } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';

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

type QuizState = {
  prompt: string;
  answerId: string;
  options: KanaItem[];
  pickedId: string | null;
};

type ChatMsg =
  | { id: number; role: 'sensei' | 'user'; kind: 'text'; text: string }
  | { id: number; role: 'sensei'; kind: 'kana'; kana: KanaItem }
  | { id: number; role: 'sensei'; kind: 'quiz'; quiz: QuizState };

type Stage =
  | { type: 'teaching'; rowIdx: number; kanaIdx: number }
  | { type: 'quiz'; rowIdx: number; qIdx: number; total: number; answered: boolean }
  | { type: 'done' };

type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

let MSG_SEQ = 0;
const nextId = () => ++MSG_SEQ;

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
  const { t } = useI18n();
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

  const resetLesson = (type: KanaType) => {
    setKanaType(type);
    setScore({ correct: 0, total: 0 });
    const s = type === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const r = groupByRow(s);
    setStage({ type: 'teaching', rowIdx: 0, kanaIdx: 0 });
    setQuizzes([]);
    setMessages([
      {
        id: nextId(),
        role: 'sensei',
        kind: 'text',
        text: t('chat.welcomeMsg'),
      },
      {
        id: nextId(),
        role: 'sensei',
        kind: 'text',
        text: `【${r[0][0].row}】${ROW_INTROS[r[0][0].row] ?? ''}`,
      },
      {
        id: nextId(),
        role: 'sensei',
        kind: 'kana',
        kana: r[0][0],
      },
    ]);
  };

  useEffect(() => {
    resetLesson('hiragana');
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const say = (text: string) => push({ role: 'user', kind: 'text', text });

  const handleNext = () => {
    if (stage.type !== 'teaching') return;
    const row = rows[stage.rowIdx];
    const isRowEnd = stage.kanaIdx + 1 >= row.length;

    if (!isRowEnd) {
      const nextIdx = stage.kanaIdx + 1;
      const kana = row[nextIdx];
      say(t('common.next'));
      setStage({ type: 'teaching', rowIdx: stage.rowIdx, kanaIdx: nextIdx });
      push({ role: 'sensei', kind: 'kana', kana });
    } else {
      say(t('quiz.startQuiz'));
      const qList = buildQuizzes(row, allKana);
      setQuizzes(qList);
      setStage({ type: 'quiz', rowIdx: stage.rowIdx, qIdx: 0, total: qList.length, answered: false });
      push({
        role: 'sensei',
        kind: 'text',
        text: `【${row[0].row}】${t('chat.title')} (${qList.length})`,
      });
      push({ role: 'sensei', kind: 'quiz', quiz: qList[0] });
    }
  };

  const handlePick = (pickedId: string) => {
    if (stage.type !== 'quiz' || stage.answered) return;
    const currentQ = quizzes[stage.qIdx];
    if (!currentQ) return;

    const isCorrect = pickedId === currentQ.answerId;
    const updatedQuiz = { ...currentQ, pickedId };
    setQuizzes((qs) => qs.map((q, i) => (i === stage.qIdx ? updatedQuiz : q)));
    setMessages((ms) =>
      ms.map((m) => (m.kind === 'quiz' && m.quiz.prompt === currentQ.prompt ? { ...m, quiz: updatedQuiz } : m))
    );

    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setStage({ ...stage, answered: true });

    const correctKana = allKana.find((k) => k.id === currentQ.answerId);
    if (isCorrect) {
      push({
        role: 'sensei',
        kind: 'text',
        text: `🎉 ${t('quiz.correct')}「${correctKana?.kana}」= ${currentQ.prompt}`,
      });
      speakJapanese(correctKana?.kana || '');
    } else {
      push({
        role: 'sensei',
        kind: 'text',
        text: `😅 ${t('quiz.incorrect')}「${correctKana?.kana}」= ${currentQ.prompt}`,
      });
      speakJapanese(correctKana?.kana || '');
    }
    onProgressChange?.();
  };

  const handleAdvanceQuiz = () => {
    if (stage.type !== 'quiz' || !stage.answered) return;
    const isLastQuizInRow = stage.qIdx + 1 >= stage.total;

    if (!isLastQuizInRow) {
      const nextQIdx = stage.qIdx + 1;
      say(t('quiz.nextQuestion'));
      setStage({ ...stage, qIdx: nextQIdx, answered: false });
      push({ role: 'sensei', kind: 'quiz', quiz: quizzes[nextQIdx] });
    } else {
      const nextRowIdx = stage.rowIdx + 1;
      if (nextRowIdx < rows.length) {
        say(`${t('common.next')} →`);
        const nextRow = rows[nextRowIdx];
        setStage({ type: 'teaching', rowIdx: nextRowIdx, kanaIdx: 0 });
        push({ role: 'sensei', kind: 'text', text: `【${nextRow[0].row}】${ROW_INTROS[nextRow[0].row] ?? ''}` });
        push({ role: 'sensei', kind: 'kana', kana: nextRow[0] });
      } else {
        say(`${t('common.completed')}! 🎊`);
        setStage({ type: 'done' });
        push({
          role: 'sensei',
          kind: 'text',
          text: `${t('quiz.congratsPerfect')} ${score.correct} / ${score.total}`,
        });
      }
    }
  };

  const quickReplies = useMemo(() => {
    if (stage.type === 'teaching') {
      const row = rows[stage.rowIdx];
      const kana = row?.[stage.kanaIdx];
      const isLast = stage.rowIdx === rows.length - 1 && stage.kanaIdx === row.length - 1;
      return (
        <>
          {kana && (
            <Chip icon={<Volume2 className="w-4 h-4" />} onClick={() => speakJapanese(kana.kana)}>
              {t('common.playAudio')}
            </Chip>
          )}
          <Chip primary icon={<Send className="w-4 h-4" />} onClick={handleNext}>
            {row && stage.kanaIdx === row.length - 1 ? (isLast ? t('common.finish') : t('quiz.startQuiz')) : t('common.next')}
          </Chip>
        </>
      );
    }
    if (stage.type === 'quiz') {
      if (!stage.answered) {
        return <span className="text-xs text-[#94A3B8] px-2">👆 {t('quiz.modeSelect')}</span>;
      }
      const isLastQuiz = stage.qIdx === stage.total - 1;
      const isLastRow = stage.rowIdx === rows.length - 1;
      return (
        <Chip primary icon={<Send className="w-4 h-4" />} onClick={handleAdvanceQuiz}>
          {isLastQuiz ? (isLastRow ? t('quiz.finishQuiz') : t('common.next')) : t('quiz.nextQuestion')}
        </Chip>
      );
    }
    return (
      <Chip primary icon={<RotateCcw className="w-4 h-4" />} onClick={() => resetLesson(kanaType)}>
        {t('common.reset')}
      </Chip>
    );
  }, [stage, rows, quizzes, kanaType, score, t]);

  const totalKana = allKana.length;
  const learnedApprox =
    stage.type === 'done'
      ? totalKana
      : rows.slice(0, stage.rowIdx).reduce((n, r) => n + r.length, 0) +
        (stage.type === 'teaching' ? stage.kanaIdx + 1 : rows[stage.rowIdx]?.length ?? 0);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-xs flex flex-col h-[75vh] max-h-[800px] min-h-[520px] overflow-hidden">
      {/* 頂部導覽 */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#F1F5F9] bg-[#FAFBFB] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#00A86B] text-white rounded-xl flex items-center justify-center font-bold text-sm">
            あ
          </div>
          <div>
            <div className="text-sm font-bold text-[#1E293B]">{t('chat.aiTutor')}</div>
            <div className="text-[11px] text-[#64748B]">
              {learnedApprox} / {totalKana}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#E2E8F0] p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => resetLesson('hiragana')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                kanaType === 'hiragana' ? 'bg-white text-[#00A86B] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {t('common.hiragana')}
            </button>
            <button
              onClick={() => resetLesson('katakana')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                kanaType === 'katakana' ? 'bg-white text-[#00A86B] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {t('common.katakana')}
            </button>
          </div>

          <button
            onClick={() => resetLesson(kanaType)}
            className="p-2 text-[#64748B] hover:text-[#1E293B] rounded-lg hover:bg-white transition-colors cursor-pointer"
            title={t('common.reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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

function KanaCard({ kana }: { kana: KanaItem }) {
  const example = kana.examples?.[0];
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md p-4 shadow-xs w-64 max-w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => speakJapanese(kana.kana)}
          className="group relative w-20 h-20 bg-[#E6F8F2] rounded-2xl flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#00A86B] transition-colors"
          aria-label={`Play ${kana.romaji}`}
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
              <span className="text-[#94A3B8]"> ({example.romaji})</span>
              <div className="text-[#64748B]">{example.meaning}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
        {quiz.prompt}
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
