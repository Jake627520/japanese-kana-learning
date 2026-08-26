import React from 'react';
import { Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { speakJapanese } from '../utils/speech';
import { useI18n } from '../i18n';

export function SpecialSoundsView() {
  const { t } = useI18n();

  const handlePlay = (text: string) => {
    speakJapanese(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-display font-bold text-[#1E293B]">{t('special.title')}</h2>
        <p className="text-xs text-[#64748B] mt-1">
          {t('special.subtitle')}
        </p>
      </div>

      {/* 促音 Section */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="bg-[#FEF3C7] px-6 py-4 border-b border-[#FDE68A]">
          <h3 className="text-base font-display font-bold text-[#92400E] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('special.sokuonTab')} — っ / ッ
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#334155] leading-relaxed">
              {t('special.sokuonDesc')}
            </p>
            <div className="flex items-start gap-2 bg-[#FFFBEB] p-3 rounded-xl text-xs text-[#92400E]">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>促音不會單獨出現，一定接在後面還有假名。常見於「雙子音」的感覺，例如 kk、ss、tt、pp。</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-3">{t('special.examplesTitle')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { word: 'がっこう', romaji: 'gakkou', meaning: '學校', note: 'っ + こ → kk' },
                { word: 'きっぷ', romaji: 'kippu', meaning: '車票', note: 'っ + ぷ → pp' },
                { word: 'ざっし', romaji: 'zasshi', meaning: '雜誌', note: 'っ + し → ssh' },
                { word: 'みっつ', romaji: 'mittsu', meaning: '三個', note: 'っ + つ → tts' },
                { word: 'ベッド', romaji: 'beddo', meaning: '床', note: 'ッ + ド' },
                { word: 'カップ', romaji: 'kappu', meaning: '杯子', note: 'ッ + プ' },
              ].map((item) => (
                <div
                  key={item.word}
                  className="flex items-center justify-between gap-3 p-3 bg-[#FAFBFB] border border-[#F1F5F9] rounded-2xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-[#1E293B]">{item.word}</span>
                      <span className="text-xs font-bold text-[#00A86B] uppercase">{item.romaji}</span>
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      {item.meaning} · {item.note}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlay(item.word)}
                    className="p-2 text-[#64748B] hover:text-[#00A86B] hover:bg-[#E6F8F2] rounded-xl transition-colors cursor-pointer"
                    title={t('common.playAudio')}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 長音 Section */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="bg-[#DBEAFE] px-6 py-4 border-b border-[#BFDBFE]">
          <h3 className="text-base font-display font-bold text-[#1E40AF] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('special.chouonTab')}
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#334155] leading-relaxed">
              {t('special.chouonDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2">{t('special.rulesTitle')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">母音</th>
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">規則</th>
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">{t('special.examplesTitle')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">あ段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「あ」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">おかあさん (okaasan)</td>
                  </tr>
                  <tr className="bg-[#FAFBFB]">
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">い段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「い」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">おにいさん (oniisan)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">う段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「う」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">くうき (kuuki)</td>
                  </tr>
                  <tr className="bg-[#FAFBFB]">
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">え段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">通常加「い」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">せんせい (sensei)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">お段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">通常加「う」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">とうきょう (toukyou)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
