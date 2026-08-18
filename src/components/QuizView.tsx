import React, { useState, useEffect } from 'react';
import { KanaItem, QuizQuestion } from '../types';
import { removeKanaFromWrong, recordReviewResult } from '../utils/storage';
import { speakJapanese } from '../utils/speech';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

interface QuizViewProps {
  allKana: KanaItem[];
  masteredIds?: string[];
  customPool?: KanaItem[];
  isReviewMode?: boolean;
  onProgressChange: () => void;
  onFinish: () => void;
}

export function QuizView({
  allKana,
  customPool,
  isReviewMode = false,
  onProgressChange,
  onFinish,
}: QuizViewProps) {
  const pool = customPool && customPool.length > 0 ? customPool : allKana;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputRomaji, setInputRomaji] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [correctStreakMap, setCorrectStreakMap] = useState<Record<string, number>>({});

  // Generate Questions
  const generateQuiz = () => {
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledPool.slice(0, Math.min(10, shuffledPool.length));

    const generated: QuizQuestion[] = selectedItems.map((item) => {
      const questionTypes: QuizQuestion['type'][] = [
        'kana-to-romaji',
        'audio-to-kana',
        'input-romaji',
      ];
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      // Pick 3 wrong option distractor items from allKana prioritized by same kana type and category
      const sameTypeAndCatPool = allKana.filter(
        (k) => k.type === item.type && (k.category || 'basic') === (item.category || 'basic') && k.id !== item.id
      );
      const sameTypePool = allKana.filter((k) => k.type === item.type && k.id !== item.id);
      const distractorPool = sameTypeAndCatPool.length >= 3
        ? sameTypeAndCatPool
        : sameTypePool.length >= 3
        ? sameTypePool
        : allKana.filter((k) => k.id !== item.id);

      const distractors = distractorPool
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [
        { label: type === 'kana-to-romaji' ? item.romaji : item.kana, isCorrect: true, kana: item },
        ...distractors.map((d) => ({
          label: type === 'kana-to-romaji' ? d.romaji : d.kana,
          isCorrect: false,
          kana: d,
        })),
      ].sort(() => 0.5 - Math.random());

      return {
        type,
        targetKana: item,
        options,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setIsAnswered(false);
    setIsCompleted(false);
    setSelectedOption(null);
    setInputRomaji('');
  };

  useEffect(() => {
    generateQuiz();
  }, [pool.length]);

  const currentQ = questions[currentIndex];

  const handleAnswerResult = (targetKana: KanaItem, isCorrect: boolean) => {
    // Record SRS Result ONCE per answer
    recordReviewResult(targetKana.id, isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);

      if (isReviewMode) {
        const streak = (correctStreakMap[targetKana.id] || 0) + 1;
        setCorrectStreakMap((prev) => ({ ...prev, [targetKana.id]: streak }));

        if (streak >= 2) {
          removeKanaFromWrong(targetKana.id);
          setFeedbackNote('🎉 連續答對 2 次，成功克服此弱點！');
        } else {
          setFeedbackNote('✓ 答對了！再確認一次即可克服。');
        }
      } else {
        removeKanaFromWrong(targetKana.id);
        setFeedbackNote('');
      }
    } else {
      if (isReviewMode) {
        setCorrectStreakMap((prev) => ({ ...prev, [targetKana.id]: 0 }));
        setFeedbackNote('✗ 答錯了，請繼續加油！');
      } else {
        setFeedbackNote('');
      }
    }

    speakJapanese(targetKana.kana);
    onProgressChange();
  };

  const handleSelectOption = (label: string, isCorrect: boolean) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(label);
    setIsAnswered(true);
    handleAnswerResult(currentQ.targetKana, isCorrect);
  };

  const handleSubmitInput = () => {
    if (isAnswered || !currentQ) return;
    const isCorrect = inputRomaji.trim().toLowerCase() === currentQ.targetKana.romaji.toLowerCase();
    setIsAnswered(true);
    handleAnswerResult(currentQ.targetKana, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setInputRomaji('');
      setFeedbackNote('');
    } else {
      setIsCompleted(true);
    }
  };

  if (!currentQ && !isCompleted) {
    return <div className="p-8 text-center text-[#64748B]">正在載入測驗題目...</div>;
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-6">
        <div className="w-16 h-16 bg-[#E6F8F2] text-[#00A86B] rounded-2xl flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E293B]">測驗完成！</h2>
          <p className="text-xs text-[#64748B] mt-1">恭喜完成本次測驗，系統已自動排程 SRS 複習。</p>
        </div>

        <div className="p-4 bg-[#FAFBFB] rounded-2xl border border-[#E2E8F0]">
          <div className="text-xs font-bold text-[#64748B]">本次得分</div>
          <div className="text-3xl font-extrabold text-[#00A86B] mt-1">
            {score} / {questions.length}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={generateQuiz}
            className="flex-1 py-3 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            再測驗一次
          </button>
          <button
            onClick={onFinish}
            className="flex-1 py-3 bg-[#00A86B] text-white font-bold text-xs rounded-xl hover:bg-[#008F5B] transition-all cursor-pointer"
          >
            返回學習總覽
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
        <span>
          題目 {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-[#00A86B]">得分：{score}</span>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="text-center py-6 bg-[#FAFBFB] rounded-2xl border border-[#F1F5F9] space-y-3">
          <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
            {currentQ.type === 'kana-to-romaji'
              ? '看假名選羅馬字'
              : currentQ.type === 'audio-to-kana'
              ? '聽發音選假名'
              : '輸入對應羅馬字'}
          </span>

          {currentQ.type === 'audio-to-kana' ? (
            <button
              onClick={() => speakJapanese(currentQ.targetKana.kana)}
              className="p-4 bg-[#00A86B] text-white rounded-2xl shadow-xs hover:bg-[#008F5B] transition-all cursor-pointer mx-auto block"
            >
              <Volume2 className="w-8 h-8" />
            </button>
          ) : (
            <div className="text-6xl font-extrabold text-[#1E293B]">{currentQ.targetKana.kana}</div>
          )}
        </div>

        {/* Answer Area */}
        {currentQ.type === 'input-romaji' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={inputRomaji}
              disabled={isAnswered}
              onChange={(e) => setInputRomaji(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleSubmitInput()}
              placeholder="請輸入羅馬拼音 (例如: a, ka)..."
              className="w-full px-4 py-3 bg-[#FAFBFB] border border-[#E2E8F0] rounded-2xl text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#00A86B]"
            />
            {!isAnswered && (
              <button
                onClick={handleSubmitInput}
                className="w-full py-3 bg-[#00A86B] text-white font-bold text-xs rounded-2xl hover:bg-[#008F5B] cursor-pointer"
              >
                確認送出
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt.label;

              let btnStyle = 'bg-[#FAFBFB] border-[#E2E8F0] text-[#1E293B] hover:border-[#00A86B]';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-[#E6F8F2] border-[#00A86B] text-[#00A86B] font-extrabold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-50 border-red-400 text-red-600 font-extrabold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.label, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`p-4 border rounded-2xl text-lg font-bold transition-all cursor-pointer ${btnStyle}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Message */}
        {isAnswered && (
          <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
            {feedbackNote && (
              <div className="text-xs font-bold text-[#00A86B] text-center">{feedbackNote}</div>
            )}
            <button
              onClick={handleNext}
              className="w-full py-3 bg-[#00A86B] text-white font-bold text-xs rounded-2xl hover:bg-[#008F5B] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              下一題
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
