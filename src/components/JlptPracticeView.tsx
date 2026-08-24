import React, { useState } from 'react';
import { JlptTopic, JlptQuestion, JlptGrade } from '../types';
import {
  AVAILABLE_LEVELS,
  getTopicsByLevel,
  getQuestionsByTopic,
  getOwnJlptQuestionsByLevel,
} from '../data/jlpt';
import { recordJlptAnswer } from '../utils/jlptStorage';
import { JlptWeakPointCard } from './JlptWeakPointCard';
import { GraduationCap, BookOpen, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

// 每個級別的說明文字。N3 的知識點在知識庫已經備妥，但原創題還沒寫完，
// 所以 AVAILABLE_LEVELS 目前只有 n5／n4——列出點不進去的級別比不列更糟。
const LEVEL_BLURB: Record<string, string> = {
  n5: '精選 N5 核心考點，依知識點逐一突破漢字、讀音、連濁與助數詞弱點。',
  n4: 'N4 新增用法題與使役、受身、授受方向等文法，並含兩組読解短文。每個知識點 3 題。',
};

// 領域配色：綠＝文字語彙、藍＝文法、琥珀＝読解。只用三種，避免變成調色盤。
const DOMAIN_STYLE: Record<string, { band: string; tint: string; fg: string }> = {
  '文字・語彙': { band: 'from-[#00A86B] to-[#34D399]', tint: 'bg-[#E6F8F2]', fg: 'text-[#00875A]' },
  文法: { band: 'from-blue-500 to-blue-300', tint: 'bg-blue-50', fg: 'text-blue-600' },
  読解: { band: 'from-amber-500 to-amber-300', tint: 'bg-amber-50', fg: 'text-amber-700' },
};
const DOMAIN_FALLBACK = { band: 'from-slate-400 to-slate-300', tint: 'bg-[#F1F5F9]', fg: 'text-[#64748B]' };

export function JlptPracticeView() {
  const [level, setLevel] = useState<JlptGrade>('n5');
  const [selectedTopic, setSelectedTopic] = useState<JlptTopic | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<JlptQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Start practicing a specific topic
  const handleStartTopic = (topic: JlptTopic) => {
    const questions = getQuestionsByTopic(topic.id);
    if (questions.length === 0) return;

    setSelectedTopic(topic);
    setQuizQuestions([...questions].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  // Start all-topics random quiz
  const handleStartAll = () => {
    const all = getOwnJlptQuestionsByLevel(level);
    if (all.length === 0) return;

    const label = level.toUpperCase();
    setSelectedTopic({
      id: 'all',
      type: 'LANGUAGE',
      subject: '日本語',
      domain: '綜合演練',
      name: `${label} 綜合隨機練習`,
      description: '涵蓋所有考點的原創隨機題庫練習',
      book: `JLPT ${label}`,
      chapter: '綜合',
      grade: level,
      evidence: [],
    });
    setQuizQuestions([...all].sort(() => 0.5 - Math.random()).slice(0, 10));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const currentQ = quizQuestions[currentIndex];
    const isCorrect = String(optionIndex + 1) === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (selectedTopic) {
      recordJlptAnswer(currentQ.id, selectedTopic.id, optionIndex, isCorrect);
    }
  };

  // Move to next question or complete
  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  // Exit practice back to topic list
  const handleBackToList = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
    setIsCompleted(false);
  };

  // Current Question
  const currentQ = quizQuestions[currentIndex];

  // 目前級別的知識點與題數。coverage 是「已經有題目的知識點比例」，
  // 不是使用者的作答進度——那是弱點分析卡的事。
  const topics = getTopicsByLevel(level);
  const levelQuestionCount = getOwnJlptQuestionsByLevel(level).length;
  const topicsWithQuestions = topics.filter((t) => getQuestionsByTopic(t.id).length > 0).length;
  const levelCoverage = topics.length > 0 ? Math.round((topicsWithQuestions / topics.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Practice in progress */}
      {selectedTopic && !isCompleted && currentQ && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#64748B] hover:text-[#1E293B] bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              知識點列表
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
                {selectedTopic.name}
              </span>
              <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
                得分：{score}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
            <span>題目 {currentIndex + 1} / {quizQuestions.length}</span>
            <span>{Math.round(((currentIndex + 1) / quizQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A86B] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="p-6 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9] space-y-2">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                問題
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-[#1E293B] leading-relaxed">
                {currentQ.stem}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((optionText, idx) => {
                const optNum = String(idx + 1);
                const isSelected = selectedOption === idx;
                const isCorrect = optNum === currentQ.answer;

                let btnStyle = 'bg-white border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50';
                let numBadgeStyle = 'bg-[#F1F5F9] text-[#64748B]';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#E6F8F2] border-[#00A86B] text-[#00A86B] font-extrabold';
                    numBadgeStyle = 'bg-[#00A86B] text-white';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#FEE2E2] border-[#EF4444] text-[#EF4444] font-extrabold';
                    numBadgeStyle = 'bg-[#EF4444] text-white';
                  } else {
                    btnStyle = 'bg-white border-[#E2E8F0] text-[#94A3B8] opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${numBadgeStyle}`}>
                        {idx + 1}
                      </span>
                      <span className="text-base font-bold">{optionText}</span>
                    </div>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next */}
            {isAnswered && (
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-1.5">
                  <div className="text-xs font-extrabold text-[#1E293B] flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#00A86B]" />
                    題目解析
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    {currentQ.explain}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3.5 bg-[#00A86B] text-white font-extrabold text-sm rounded-2xl hover:bg-[#008F5B] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {currentIndex + 1 < quizQuestions.length ? '下一題' : '查看測驗結果'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Summary */}
      {selectedTopic && isCompleted && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-6">
            <div className="w-16 h-16 bg-[#E6F8F2] text-[#00A86B] rounded-3xl flex items-center justify-center mx-auto shadow-xs">
              <GraduationCap className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-[#1E293B]">練習完成！</h3>
              <p className="text-xs text-[#64748B]">
                【{selectedTopic.name}】考點演練已完成。
              </p>
            </div>

            <div className="bg-[#FAFBFB] p-6 rounded-2xl border border-[#F1F5F9] inline-block w-full">
              <div className="text-4xl font-extrabold text-[#00A86B] mb-1">
                {score} / {quizQuestions.length}
              </div>
              <div className="text-xs font-bold text-[#64748B]">
                正確率：{Math.round((score / quizQuestions.length) * 100)}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleStartTopic(selectedTopic)}
                className="flex-1 py-3.5 bg-[#F1F5F9] text-[#1E293B] font-extrabold text-xs rounded-2xl hover:bg-[#E2E8F0] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                再練一次
              </button>
              <button
                type="button"
                onClick={handleBackToList}
                className="flex-1 py-3.5 bg-[#00A86B] text-white font-extrabold text-xs rounded-2xl hover:bg-[#008F5B] transition-all shadow-xs cursor-pointer"
              >
                返回知識點列表
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topic List View (Default) */}
      {!selectedTopic && (
        <div className="space-y-6">
          {/* Top Banner：加入 N5／N4 分級切換 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] elev-2 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  原創試題 · 零真題收錄
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                  JLPT {level.toUpperCase()} 知識點專項練習
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-lg">
                  {LEVEL_BLURB[level]}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartAll}
                disabled={levelQuestionCount === 0}
                className={`px-5 py-3 font-extrabold text-xs sm:text-sm rounded-2xl btn-lift cursor-pointer flex items-center gap-2 shrink-0 ${
                  levelQuestionCount > 0
                    ? 'bg-[#00A86B] text-white hover:bg-[#008F5B] elev-green'
                    : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                隨機綜合演練 (10 題)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* 分級切換：沿用站上既有的分段控制樣式（濁音／拗音、平／片假名同一套） */}
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl w-fit">
                {AVAILABLE_LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setLevel(lv)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                      level === lv
                        ? 'bg-white text-[#00A86B] elev-1'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    {lv.toUpperCase()}
                  </button>
                ))}
                <span
                  title="N3 題庫建置中"
                  className="px-4 py-1.5 text-xs sm:text-sm font-extrabold rounded-lg text-[#CBD5E1] cursor-not-allowed select-none"
                >
                  N3
                </span>
              </div>

              {/* 級別總覽：不用進到每張卡就知道這一級有多少題 */}
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00A86B] to-[#34D399] transition-[width] duration-700 ease-out"
                    style={{ width: `${levelCoverage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#64748B] whitespace-nowrap">
                  {topics.length} 個知識點 · {levelQuestionCount} 題
                </span>
              </div>
            </div>
          </div>

          {/* 弱點分析 */}
          <JlptWeakPointCard />

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((topic, i) => {
              const count = getQuestionsByTopic(topic.id).length;
              const style = DOMAIN_STYLE[topic.domain] ?? DOMAIN_FALLBACK;

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-[#E2E8F0] elev-1 card-lift rise-in overflow-hidden flex flex-col group"
                  style={{ ['--stagger' as string]: `${Math.min(i, 7) * 40}ms` }}
                >
                  <div aria-hidden className={`h-1 bg-gradient-to-r ${style.band}`} />
                  <div className="p-5 flex flex-col justify-between gap-4 flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${style.tint} ${style.fg}`}>
                          {topic.domain} · {topic.chapter}
                        </span>
                        <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-2.5 py-0.5 rounded-full">
                          {count} 題
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#1E293B] group-hover:text-[#00A86B] transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={count === 0}
                      onClick={() => handleStartTopic(topic)}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        count > 0
                          ? 'bg-[#F8FAFC] group-hover:bg-[#00A86B] text-[#1E293B] group-hover:text-white border border-[#E2E8F0] group-hover:border-[#00A86B] cursor-pointer'
                          : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed'
                      }`}
                    >
                      {count > 0 ? (
                        <>
                          開始練習
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        '尚無題目'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
