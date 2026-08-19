import React, { useState } from 'react';
import { JlptTopic, JlptQuestion } from '../types';
import { ALL_N5_TOPICS_UI, getQuestionsByTopic, getOwnJlptQuestions } from '../data/jlpt';
import { recordJlptAnswer } from '../utils/jlptStorage';
import { JlptWeakPointCard } from './JlptWeakPointCard';
import { GraduationCap, BookOpen, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

export function JlptPracticeView() {
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
    const all = getOwnJlptQuestions();
    if (all.length === 0) return;

    setSelectedTopic({
      id: 'all',
      type: 'LANGUAGE',
      subject: '日本語',
      domain: '綜合演練',
      name: 'N5 綜合隨機練習',
      description: '涵蓋所有考點的原創隨機題庫練習',
      book: 'JLPT N5',
      chapter: '綜合',
      grade: 'n5',
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
          {/* Top Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                原創試題 · 零真題收錄
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                JLPT N5 知識點專項練習
              </h2>
              <p className="text-xs text-[#64748B]">
                精選 N5 核心考點，依知識點逐一突破漢字、讀音、連濁與助數詞弱點。
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartAll}
              className="px-5 py-3 bg-[#00A86B] text-white font-extrabold text-xs sm:text-sm rounded-2xl hover:bg-[#008F5B] transition-all shadow-xs cursor-pointer flex items-center gap-2 shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              隨機綜合演練 (10 題)
            </button>
          </div>

          {/* 弱點分析 */}
          <JlptWeakPointCard />

          {/* Topics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_N5_TOPICS_UI.map((topic) => {
              const count = getQuestionsByTopic(topic.id).length;

              return (
                <div
                  key={topic.id}
                  className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#00A86B]/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
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
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      count > 0
                        ? 'bg-[#F8FAFC] group-hover:bg-[#00A86B] text-[#1E293B] group-hover:text-white border border-[#E2E8F0] group-hover:border-[#00A86B]'
                        : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
