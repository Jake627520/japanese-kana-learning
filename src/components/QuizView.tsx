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
  const [quizScope, setQuizScope] = useState<'all' | 'basic' | 'dakuten' | 'handakuten' | 'youon'>('all');

  const scopedSource = customPool && customPool.length > 0 ? customPool : allKana;

  const filteredByScope = scopedSource.filter((k) => {
    if (quizScope === 'all') return true;
    if (quizScope === 'basic') {
      return (
        k.category === 'basic-hiragana' ||
        k.category === 'basic-katakana' ||
        (!k.category && (k.type === 'hiragana' || k.type === 'katakana'))
      );
    }
    return k.category === quizScope;
  });

  // 篩完為空時回退，避免無法出題
  const pool = filteredByScope.length > 0 ? filteredByScope : scopedSource;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputRomaji, setInputRomaji] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [correctStreakMap, setCorrectStreakMap] = useState<Record<string, number>>({});
  // 逐題結果。改版前完成畫面只有 score/total，答完就沒了——使用者不知道
  // 錯在哪幾個，也沒辦法接著練，SRS 在背景更新但完全感覺不到。
  const [results, setResults] = useState<{ kana: KanaItem; isCorrect: boolean }[]>([]);
  // 「再練這幾個弱點」用的題庫覆寫；null 代表照原本的範圍出題
  const [retryPool, setRetryPool] = useState<KanaItem[] | null>(null);

  // Generate Questions
  const generateQuiz = (sourcePool: KanaItem[] = pool) => {
    const shuffledPool = [...sourcePool].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledPool.slice(0, Math.min(10, shuffledPool.length));

    const generated: QuizQuestion[] = selectedItems.map((item) => {
      const questionTypes: QuizQuestion['type'][] = [
        'kana-to-romaji',
        'audio-to-kana',
        'input-romaji',
        'kana-to-kana',
      ];
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

      // ---- kana-to-kana 特殊處理：找對應的另一種假名 ----
      if (type === 'kana-to-kana') {
        const oppositeType = item.type === 'hiragana' ? 'katakana' : 'hiragana';
        // 用相同 romaji + 相反 type 找對應假名
        const counterpart = allKana.find(
          (k) => k.type === oppositeType && k.romaji === item.romaji
        );

        // 若找不到對應（極少數情況），改出 kana-to-romaji
        if (!counterpart) {
          const fallbackType: QuizQuestion['type'] = 'kana-to-romaji';
          const sameTypeAndCatPool = allKana.filter(
            (k) =>
              k.type === item.type &&
              (k.category || 'basic') === (item.category || 'basic') &&
              k.id !== item.id
          );
          const sameTypePool = allKana.filter((k) => k.type === item.type && k.id !== item.id);
          const distractorPool =
            sameTypeAndCatPool.length >= 3
              ? sameTypeAndCatPool
              : sameTypePool.length >= 3
              ? sameTypePool
              : allKana.filter((k) => k.id !== item.id);
          const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
          const options = [
            { label: item.romaji, isCorrect: true, kana: item },
            ...distractors.map((d) => ({
              label: d.romaji,
              isCorrect: false,
              kana: d,
            })),
          ].sort(() => 0.5 - Math.random());
          return { type: fallbackType, targetKana: item, options };
        }

        // 干擾選項：同為 oppositeType，優先同 category
        const sameCatOpposite = allKana.filter(
          (k) =>
            k.type === oppositeType &&
            (k.category || 'basic') === (item.category || 'basic') &&
            k.id !== counterpart.id
        );
        const allOpposite = allKana.filter(
          (k) => k.type === oppositeType && k.id !== counterpart.id
        );
        const distractorPool =
          sameCatOpposite.length >= 3
            ? sameCatOpposite
            : allOpposite.length >= 3
            ? allOpposite
            : allKana.filter((k) => k.id !== counterpart.id);
        const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);

        const options = [
          { label: counterpart.kana, isCorrect: true, kana: counterpart },
          ...distractors.map((d) => ({
            label: d.kana,
            isCorrect: false,
            kana: d,
          })),
        ].sort(() => 0.5 - Math.random());

        return {
          type: 'kana-to-kana',
          targetKana: item, // 題目顯示的是原始假名
          options,
        };
      }

      // ---- 其他題型維持原邏輯 ----
      const sameTypeAndCatPool = allKana.filter(
        (k) =>
          k.type === item.type &&
          (k.category || 'basic') === (item.category || 'basic') &&
          k.id !== item.id
      );
      const sameTypePool = allKana.filter((k) => k.type === item.type && k.id !== item.id);
      const distractorPool =
        sameTypeAndCatPool.length >= 3
          ? sameTypeAndCatPool
          : sameTypePool.length >= 3
          ? sameTypePool
          : allKana.filter((k) => k.id !== item.id);

      const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);

      const options = [
        {
          label: type === 'kana-to-romaji' ? item.romaji : item.kana,
          isCorrect: true,
          kana: item,
        },
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
    setResults([]);
    setFeedbackNote('');
  };

  useEffect(() => {
    setRetryPool(null);
    generateQuiz();
  }, [quizScope, pool.length, isReviewMode]);

  // 只練這一輪答錯的假名。去重是必要的——同一個假名在一輪裡可能出現不只一次。
  const handleRetryWeak = () => {
    const weak = results.filter((r) => !r.isCorrect).map((r) => r.kana);
    const unique = [...new Map<string, KanaItem>(weak.map((k) => [k.id, k])).values()];
    if (unique.length === 0) return;
    setRetryPool(unique);
    generateQuiz(unique);
  };

  const currentQ = questions[currentIndex];

  const handleAnswerResult = (targetKana: KanaItem, isCorrect: boolean) => {
    // Record SRS Result ONCE per answer
    recordReviewResult(targetKana.id, isCorrect);
    setResults((prev) => [...prev, { kana: targetKana, isCorrect }]);

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
    const total = results.length || questions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    // 去重：同一個假名一輪裡可能出現不只一次，弱點清單要按假名算不是按題數算
    const weakKana = [
      ...new Map<string, KanaItem>(
        results.filter((r) => !r.isCorrect).map((r) => [r.kana.id, r.kana]),
      ).values(),
    ];
    const allCorrect = weakKana.length === 0;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#E2E8F0] elev-2 overflow-hidden">
        <div aria-hidden className={`h-1 ${allCorrect ? 'bg-[#00A86B]' : 'bg-gradient-to-r from-[#00A86B] to-amber-400'}`} />
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              allCorrect ? 'bg-[#E6F8F2] text-[#00A86B]' : 'bg-amber-50 text-amber-500'
            }`}>
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-[#1E293B]">
                {allCorrect ? '全部答對！' : '測驗完成'}
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                答對的假名排到更久以後再複習，答錯的很快會再出現。
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#FAFBFB] rounded-2xl border border-[#E2E8F0] text-center space-y-3">
            <div className="text-4xl font-extrabold text-[#00A86B] leading-none">{pct}%</div>
            <div className="text-xs font-bold text-[#64748B]">
              答對 {score} / {total} 題
            </div>
            <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00A86B] transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* 逐題結果：改版前這裡什麼都沒有，使用者不知道自己錯在哪。
              點得下去可以再聽一次發音——訂正的當下聽，比回頭找有用。 */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#64748B]">本次逐題</div>
              <div className="flex flex-wrap gap-2">
                {results.map((r, i) => (
                  <button
                    key={`${r.kana.id}-${i}`}
                    type="button"
                    onClick={() => speakJapanese(r.kana.kana)}
                    title={`第 ${i + 1} 題 ${r.kana.kana}（${r.kana.romaji}）${r.isCorrect ? '答對' : '答錯'} — 點擊聽發音`}
                    className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center leading-none btn-lift cursor-pointer ${
                      r.isCorrect
                        ? 'border-[#00A86B]/40 bg-[#F0FDF4] text-[#1E293B]'
                        : 'border-red-300 bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="text-base font-extrabold">{r.kana.kana}</span>
                    <span className="text-[9px] font-bold mt-0.5">
                      {r.isCorrect ? '✓' : '✕'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!allCorrect && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
              <div className="text-xs font-extrabold text-red-700">
                本次弱點 · {weakKana.length} 個
              </div>
              <div className="flex flex-wrap gap-2">
                {weakKana.map((k) => (
                  <span
                    key={k.id}
                    className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs font-extrabold text-red-600"
                  >
                    {k.kana}
                    <span className="ml-1 font-bold text-red-400 uppercase">{k.romaji}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {/* 學習迴圈的接點：錯完可以立刻只練那幾個，不用回上一層自己想辦法 */}
            {!allCorrect && (
              <button
                onClick={handleRetryWeak}
                className="w-full py-3 bg-[#00A86B] text-white font-extrabold text-xs rounded-xl hover:bg-[#008F5B] btn-lift elev-green cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                只練這 {weakKana.length} 個弱點
              </button>
            )}
            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setRetryPool(null);
                  generateQuiz();
                }}
                className="flex-1 py-3 bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] font-bold text-xs rounded-xl hover:bg-white hover:border-[#00A86B] btn-lift cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {retryPool ? '回到完整測驗' : '再測驗一次'}
              </button>
              <button
                onClick={onFinish}
                className={`flex-1 py-3 font-bold text-xs rounded-xl btn-lift cursor-pointer ${
                  allCorrect
                    ? 'bg-[#00A86B] text-white hover:bg-[#008F5B] elev-green'
                    : 'bg-[#FAFBFB] border border-[#E2E8F0] text-[#1E293B] hover:bg-white'
                }`}
              >
                返回學習總覽
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {!isReviewMode && (
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs font-bold text-[#64748B] mb-2">出題範圍</div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: '全部' },
                { id: 'basic', label: '基本清音' },
                { id: 'dakuten', label: '濁音' },
                { id: 'handakuten', label: '半濁音' },
                { id: 'youon', label: '拗音' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setQuizScope(item.id)}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  quizScope === item.id
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
              : currentQ.type === 'kana-to-kana'
              ? currentQ.targetKana.type === 'hiragana'
                ? '看平假名選片假名'
                : '看片假名選平假名'
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
