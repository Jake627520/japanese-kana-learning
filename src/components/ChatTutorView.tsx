import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, Send, RotateCcw, Check, X, Sparkles } from 'lucide-react';
import { KanaItem, KanaType } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../data/kanaData';
import { speakJapanese } from '../utils/speech';
import { recordReviewResult } from '../utils/storage';
import { logLearningEvent } from '../utils/learningEvents';
import { loadChatTutorProgress, saveChatTutorRow } from '../lib/chatTutorProgress';
import { useI18n, localize } from '../i18n';

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

// 依作答比例挑結業評語：全對、七成以上、其他
function praiseKey(correct: number, total: number): string {
  if (total > 0 && correct === total) return 'quiz.congratsPerfect';
  if (total > 0 && correct / total >= 0.7) return 'quiz.greatJob';
  return 'quiz.keepPracticing';
}

const OPTION_KEYS: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3 };

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
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // 題目出現的時間點，用來算作答秒數給 SRS
  const quizShownAtRef = useRef(0);

  const source = kanaType === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
  const rows = useMemo(() => groupByRow(source), [source]);
  const allKana = source;

  const push = (msg: WithoutId<ChatMsg>) =>
    setMessages((m) => [...m, { ...msg, id: nextId() } as ChatMsg]);

  // 每行第一個假名的 romaji（a, ka, sa…n）就是 i18n 的鍵，平假名與片假名共用同一組介紹
  const rowIntroText = (row: KanaItem[]) =>
    `【${row[0].row}】${t(`chat.rowIntros.${row[0].romaji}`, { kana: row.map((k) => k.kana).join('・') })}`;

  const startLesson = (type: KanaType, startRow: number) => {
    const r = groupByRow(type === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA);
    const rowIdx = startRow < r.length ? startRow : 0;
    setKanaType(type);
    setScore({ correct: 0, total: 0 });
    setStage({ type: 'teaching', rowIdx, kanaIdx: 0 });
    setQuizzes([]);
    const greeting =
      rowIdx > 0
        ? t('chat.welcomeBack', { row: r[rowIdx][0].row })
        : t('chat.welcomeMsg', { script: t(type === 'hiragana' ? 'chat.scriptHiragana' : 'chat.scriptKatakana') });
    setMessages([
      { id: nextId(), role: 'sensei', kind: 'text', text: greeting },
      { id: nextId(), role: 'sensei', kind: 'text', text: rowIntroText(r[rowIdx]) },
      { id: nextId(), role: 'sensei', kind: 'kana', kana: r[rowIdx][0] },
    ]);
  };

  // 從上次存的那一行繼續
  const resumeLesson = (type: KanaType) => startLesson(type, loadChatTutorProgress()[type]);

  const restartLesson = () => {
    saveChatTutorRow(kanaType, 0);
    startLesson(kanaType, 0);
  };

  const switchKanaType = (type: KanaType) => {
    if (type !== kanaType) resumeLesson(type);
  };

  useEffect(() => {
    resumeLesson('hiragana');
    // 開啟時把焦點放進對話區，Enter 立刻就能用，不會落在剛點過的導覽按鈕上
    rootRef.current?.focus({ preventScroll: true });
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
        text: t('chat.rowQuizIntro', { row: row[0].row, count: qList.length }),
      });
      push({ role: 'sensei', kind: 'quiz', quiz: qList[0] });
      quizShownAtRef.current = Date.now();
    }
  };

  const handlePick = (pickedId: string) => {
    if (stage.type !== 'quiz' || stage.answered) return;
    const currentQ = quizzes[stage.qIdx];
    if (!currentQ) return;

    const isCorrect = pickedId === currentQ.answerId;
    const responseMs = Math.max(10, Date.now() - quizShownAtRef.current);

    // 寫回 SRS：與 QuizView 同一套記錄，熟練度、錯題本、複習排程才會跟著動。
    // 不在這裡移出錯題本：QuizView 要求連對 2 次才移出，而對話小測每個假名一輪只考一次，
    // 答對一次不足以證明弱點已克服——移出交給測驗／複習中心的連對規則。
    recordReviewResult(currentQ.answerId, isCorrect, responseMs);
    logLearningEvent({
      type: 'quiz_answer',
      source: 'chat_quiz',
      kanaId: currentQ.answerId,
      selectedKanaId: pickedId,
      correct: isCorrect,
      responseMs,
    });

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
      quizShownAtRef.current = Date.now();
    } else {
      const nextRowIdx = stage.rowIdx + 1;
      if (nextRowIdx < rows.length) {
        say(`${t('common.next')} →`);
        const nextRow = rows[nextRowIdx];
        // 整行連同小測都做完才存，回來時從下一行開頭開始
        saveChatTutorRow(kanaType, nextRowIdx);
        setStage({ type: 'teaching', rowIdx: nextRowIdx, kanaIdx: 0 });
        push({ role: 'sensei', kind: 'text', text: rowIntroText(nextRow) });
        push({ role: 'sensei', kind: 'kana', kana: nextRow[0] });
      } else {
        say(`${t('common.completed')}! 🎊`);
        // 全部學完，下次打開從頭開始
        saveChatTutorRow(kanaType, 0);
        setStage({ type: 'done' });
        push({
          role: 'sensei',
          kind: 'text',
          text: `${t(praiseKey(score.correct, score.total))} ${t('chat.doneScore', score)}`,
        });
      }
    }
  };

  const quickReplies = useMemo(() => {
    if (stage.type === 'teaching') {
      const row = rows[stage.rowIdx];
      const kana = row?.[stage.kanaIdx];
      return (
        <>
          {kana && (
            <Chip icon={<Volume2 className="w-4 h-4" />} onClick={() => speakJapanese(kana.kana)}>
              {t('common.playAudio')}
            </Chip>
          )}
          <Chip primary icon={<Send className="w-4 h-4" />} onClick={handleNext}>
            {/* 每一行（包括最後的 ん 行）教完都接小測驗，所以行尾一律是「開始測驗」 */}
            {row && stage.kanaIdx === row.length - 1 ? t('quiz.startQuiz') : t('common.next')}
          </Chip>
        </>
      );
    }
    if (stage.type === 'quiz') {
      if (!stage.answered) {
        return <span className="text-xs text-[#8F8674] px-2">{t('chat.pickHint')}</span>;
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
      <Chip primary icon={<RotateCcw className="w-4 h-4" />} onClick={restartLesson}>
        {t('common.reset')}
      </Chip>
    );
  }, [stage, rows, quizzes, kanaType, score, t]);

  // 鍵盤：1～4 選答案，Enter 執行底部主按鈕。
  // 監聽器只註冊一次，透過 ref 拿到每次 render 最新的 stage 與處理函式。
  const keyActionsRef = useRef({ pick: (_idx: number) => {}, primary: () => {} });
  keyActionsRef.current = {
    pick: (idx) => {
      if (stage.type !== 'quiz' || stage.answered) return;
      const opt = quizzes[stage.qIdx]?.options[idx];
      if (opt) handlePick(opt.id);
    },
    primary: () => {
      if (stage.type === 'teaching') handleNext();
      else if (stage.type === 'quiz') handleAdvanceQuiz();
      else restartLesson();
    },
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
        return;
      }

      const optIdx = OPTION_KEYS[e.key];
      if (optIdx !== undefined) {
        e.preventDefault();
        keyActionsRef.current.pick(optIdx);
        return;
      }

      if (e.key === 'Enter') {
        // 焦點在對話區外的按鈕或連結（例如導覽列）時，Enter 留給它自己。
        // 對話區內一律當「繼續」：剛點過發音鍵再按 Enter，使用者要的是下一步，不是重播。
        const inChat = !!target && !!rootRef.current?.contains(target);
        if (!inChat && target && (target.tagName === 'BUTTON' || target.tagName === 'A')) return;
        e.preventDefault();
        keyActionsRef.current.primary();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const totalKana = allKana.length;
  const learnedApprox =
    stage.type === 'done'
      ? totalKana
      : rows.slice(0, stage.rowIdx).reduce((n, r) => n + r.length, 0) +
        (stage.type === 'teaching' ? stage.kanaIdx + 1 : rows[stage.rowIdx]?.length ?? 0);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="bg-[#F4EEDE] border border-[#D9CDB2] rounded-3xl shadow-xs flex flex-col h-[75vh] max-h-[800px] min-h-[520px] overflow-hidden focus:outline-none"
    >
      {/* 頂部導覽 */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#ECE4D0] bg-[#F4EEDE] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#5C6B3D] text-[#F1EFE0] rounded-xl flex items-center justify-center font-bold text-sm">
            あ
          </div>
          <div>
            <div className="text-sm font-bold text-[#221F18]">{t('chat.aiTutor')}</div>
            <div className="text-[11px] text-[#6B6252]">
              {learnedApprox} / {totalKana}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#D9CDB2] p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => switchKanaType('hiragana')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                kanaType === 'hiragana' ? 'bg-[#F4EEDE] text-[#5C6B3D] shadow-xs' : 'text-[#6B6252]'
              }`}
            >
              {t('common.hiragana')}
            </button>
            <button
              onClick={() => switchKanaType('katakana')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                kanaType === 'katakana' ? 'bg-[#F4EEDE] text-[#5C6B3D] shadow-xs' : 'text-[#6B6252]'
              }`}
            >
              {t('common.katakana')}
            </button>
          </div>

          <button
            onClick={restartLesson}
            className="p-2 text-[#6B6252] hover:text-[#221F18] rounded-lg hover:bg-[#F4EEDE] transition-colors cursor-pointer"
            title={t('common.reset')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 對話串 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 bg-[#F4EEDE]">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            <MessageBubble msg={msg} stage={stage} onPick={handlePick} />
          </React.Fragment>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 底部快速回覆 */}
      <div className="flex items-center gap-2 flex-wrap px-3 sm:px-6 py-3 border-t border-[#ECE4D0] bg-[#F4EEDE] shrink-0">
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
      <div className="flex justify-end rise-in">
        <div className="max-w-[75%] bg-[#5C6B3D] text-[#F1EFE0] px-4 py-2.5 rounded-2xl rounded-br-md text-sm font-medium shadow-xs">
          {msg.kind === 'text' ? msg.text : ''}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-end rise-in">
      <div className="w-8 h-8 bg-[#5C6B3D] text-[#F1EFE0] rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mb-1">
        あ
      </div>
      <div className="max-w-[85%]">
        {msg.kind === 'text' && (
          <div className="bg-[#F4EEDE] border border-[#D9CDB2] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-[#221F18] leading-relaxed shadow-xs">
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
  const { language } = useI18n();
  const example = kana.examples?.[0];
  return (
    <div className="bg-[#F4EEDE] border border-[#D9CDB2] rounded-2xl rounded-bl-md p-4 shadow-xs w-64 max-w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => speakJapanese(kana.kana)}
          className="group relative w-20 h-20 bg-[#E6EAD5] rounded-2xl flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#5C6B3D] transition-colors"
          aria-label={`Play ${kana.romaji}`}
        >
          <span className="text-4xl font-display font-bold text-[#5C6B3D] group-hover:text-[#F1EFE0] transition-colors">
            {kana.kana}
          </span>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#F4EEDE] rounded-full flex items-center justify-center shadow-xs">
            <Volume2 className="w-3 h-3 text-[#5C6B3D]" />
          </span>
        </button>
        <div className="min-w-0">
          <div className="text-2xl font-extrabold text-[#221F18] leading-none">{kana.romaji}</div>
          <div className="text-xs text-[#8F8674] mt-1">{kana.row}・{kana.col}</div>
          {example && (
            <div className="mt-2 text-xs text-[#6B6252]">
              <button
                onClick={() => speakJapanese(example.word)}
                className="font-bold text-[#5C6B3D] cursor-pointer hover:underline"
              >
                {example.word}
              </button>
              <span className="text-[#8F8674]"> ({example.romaji})</span>
              <div className="text-[#6B6252]">{localize(example.meaning, language)}</div>
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
  const { t } = useI18n();
  const locked = quiz.pickedId !== null;
  return (
    <div className="bg-[#F4EEDE] border border-[#D9CDB2] rounded-2xl rounded-bl-md p-4 shadow-xs w-72 max-w-full">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C6B3D] mb-3">
        <Sparkles className="w-4 h-4" />
        {t('chat.whichKana', { romaji: quiz.prompt })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quiz.options.map((opt, i) => {
          const isAnswer = opt.id === quiz.answerId;
          const isPicked = opt.id === quiz.pickedId;
          let cls = 'border-[#D9CDB2] bg-[#F4EEDE] text-[#221F18] hover:border-[#5C6B3D] hover:bg-[#E6EAD5]';
          // 鎖定後：正解脈衝、選錯左右晃——不只靠顏色區分對錯
          if (locked && isAnswer) cls = 'border-[#5C6B3D] bg-[#E6EAD5] text-[#5C6B3D] feedback-correct';
          else if (locked && isPicked && !isAnswer) cls = 'border-[#CAA096] bg-[#EFDBD5] text-[#A6443A] feedback-wrong';
          else if (locked) cls = 'border-[#ECE4D0] bg-[#F4EEDE] text-[#8F8674]';
          return (
            <button
              key={opt.id}
              disabled={locked}
              onClick={() => onPick(opt.id)}
              aria-keyshortcuts={String(i + 1)}
              className={`relative flex items-center justify-center h-14 rounded-xl border-2 text-2xl font-display font-bold transition-all ${cls} ${
                locked ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {!locked && (
                <span className="absolute top-1 left-1.5 text-[10px] font-sans font-bold text-[#8F8674]" aria-hidden="true">
                  {i + 1}
                </span>
              )}
              {opt.kana}
              {locked && isAnswer && (
                <Check className="absolute top-1 right-1 w-4 h-4 text-[#5C6B3D]" />
              )}
              {locked && isPicked && !isAnswer && (
                <X className="absolute top-1 right-1 w-4 h-4 text-[#A6443A]" />
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
          ? 'bg-[#5C6B3D] text-[#F1EFE0] shadow-xs hover:bg-[#47552F]'
          : 'bg-[#ECE4D0] text-[#6B6252] hover:bg-[#D9CDB2]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
