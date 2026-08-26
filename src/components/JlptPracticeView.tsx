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
import { RichText } from './RichText';
import { useI18n } from '../i18n';
import { GraduationCap, BookOpen, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

const DOMAIN_STYLE: Record<string, { band: string; tint: string; fg: string }> = {
  '文字・語彙': { band: 'from-[#00A86B] to-[#34D399]', tint: 'bg-[#E6F8F2]', fg: 'text-[#00875A]' },
  文法: { band: 'from-blue-500 to-blue-300', tint: 'bg-blue-50', fg: 'text-blue-600' },
  読解: { band: 'from-amber-500 to-amber-300', tint: 'bg-amber-50', fg: 'text-amber-700' },
};
const DOMAIN_FALLBACK = { band: 'from-slate-400 to-slate-300', tint: 'bg-[#F1F5F9]', fg: 'text-[#64748B]' };

export function JlptPracticeView() {
  const { t } = useI18n();
  const [level, setLevel] = useState<JlptGrade>('n5');
  const [selectedTopic, setSelectedTopic] = useState<JlptTopic | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<JlptQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    if (selectedTopic) {
      if (selectedTopic.id === 'all') {
        handleStartAll();
      } else {
        handleStartTopic(selectedTopic);
      }
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  const topics = getTopicsByLevel(level);
  const levelQuestionCount = getOwnJlptQuestionsByLevel(level).length;
  const levelCoverage = Math.min(100, Math.round((levelQuestionCount / 90) * 100));

  const currentQ = quizQuestions[currentIndex];

  return (
    <div className="space-y-6">
      {selectedTopic && currentQ ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <button
            onClick={handleBackToTopics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:text-[#1E293B] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('common.back')}
          </button>

          {!isCompleted ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs font-bold text-[#00A86B] bg-[#E6F8F2] px-3 py-1 rounded-full">
                  {selectedTopic.name}
                </span>
                <span className="text-xs font-bold text-[#64748B]">
                  {t('jlpt.questionProgress')}: {currentIndex + 1} / {quizQuestions.length}
                </span>
              </div>

              <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9]">
                <div className="text-lg font-bold text-[#1E293B] leading-relaxed">
                  <RichText text={currentQ.stem} />
                </div>
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = String(idx + 1) === currentQ.answer;

                  let btnStyle = 'bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#00A86B]';
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-[#E6F8F2] border-[#00A86B] text-[#00A86B] font-extrabold';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-50 border-red-300 text-red-600 font-extrabold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <RichText text={opt} />
                      </span>
                      {isAnswered && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-[#00A86B] shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                  <div className="p-4 bg-[#FAFBFB] rounded-2xl border border-[#E2E8F0] space-y-2">
                    <div className="text-xs font-extrabold text-[#1E293B] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#00A86B]" />
                      {t('jlpt.explainTitle')}
                    </div>
                    <div className="text-xs text-[#64748B] leading-relaxed">
                      <RichText text={currentQ.explain} />
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3.5 bg-[#00A86B] hover:bg-[#008F5B] text-white font-extrabold text-sm rounded-2xl btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
                  >
                    {currentIndex + 1 < quizQuestions.length ? t('quiz.nextQuestion') : t('quiz.finishQuiz')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F8F2] text-[#00A86B] mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-[#1E293B]">{t('quiz.resultTitle')}</h3>
                <p className="text-xs text-[#64748B] mt-1">{selectedTopic.name}</p>
              </div>

              <div className="p-6 bg-[#FAFBFB] rounded-2xl border border-[#E2E8F0] max-w-xs mx-auto space-y-2">
                <div className="text-4xl font-extrabold text-[#00A86B]">
                  {Math.round((score / quizQuestions.length) * 100)}%
                </div>
                <div className="text-xs font-bold text-[#64748B]">
                  {t('quiz.accuracy')}: {score} / {quizQuestions.length}
                </div>
              </div>

              <div className="flex gap-3 max-w-xs mx-auto">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 bg-[#FAFBFB] border border-[#E2E8F0] hover:border-[#00A86B] text-[#1E293B] font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t('quiz.restartQuiz')}
                </button>
                <button
                  onClick={handleBackToTopics}
                  className="flex-1 py-3 bg-[#00A86B] hover:bg-[#008F5B] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t('common.back')}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F2] text-[#00A86B] rounded-full text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t('jlpt.title')}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-[#1E293B]">
                  JLPT {level.toUpperCase()} {t('jlpt.topicSelect')}
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-lg">
                  {t('jlpt.subtitle')}
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
                {t('jlpt.startPractice')} (10)
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
              </div>

              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00A86B] to-[#34D399] transition-[width] duration-700 ease-out"
                    style={{ width: `${levelCoverage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#64748B] whitespace-nowrap">
                  {topics.length} · {levelQuestionCount}
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
                          {count}
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold text-[#1E293B] group-hover:text-[#00A86B] transition-colors">
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
                          {t('common.start')}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        t('common.loading')
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
