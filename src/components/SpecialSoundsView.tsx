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
      <div className="bg-[#F4EEDE] p-6 rounded-3xl border border-[#D9CDB2] shadow-xs">
        <h2 className="text-xl font-display font-bold text-[#221F18]">{t('special.title')}</h2>
        <p className="text-xs text-[#6B6252] mt-1">
          {t('special.subtitle')}
        </p>
      </div>

      {/* 促音 Section */}
      <div className="bg-[#F4EEDE] rounded-3xl border border-[#D9CDB2] shadow-xs overflow-hidden">
        <div className="bg-[#EFE3C9] px-6 py-4 border-b border-[#E2CF97]">
          <h3 className="text-base font-display font-bold text-[#7A5320] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('special.sokuonTab')} — っ / ッ
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#3A3529] leading-relaxed">
              {t('special.sokuonDesc')}
            </p>
            <div className="flex items-start gap-2 bg-[#F3ECD6] p-3 rounded-xl text-xs text-[#7A5320]">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>促音不會單獨出現，一定接在後面還有假名。常見於「雙子音」的感覺，例如 kk、ss、tt、pp。</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#221F18] mb-3">{t('special.examplesTitle')}</h4>
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
                  className="flex items-center justify-between gap-3 p-3 bg-[#F4EEDE] border border-[#ECE4D0] rounded-2xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-[#221F18]">{item.word}</span>
                      <span className="text-xs font-bold text-[#5C6B3D] uppercase">{item.romaji}</span>
                    </div>
                    <div className="text-xs text-[#6B6252] mt-0.5">
                      {item.meaning} · {item.note}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlay(item.word)}
                    className="p-2 text-[#6B6252] hover:text-[#5C6B3D] hover:bg-[#E6EAD5] rounded-xl transition-colors cursor-pointer"
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
      <div className="bg-[#F4EEDE] rounded-3xl border border-[#D9CDB2] shadow-xs overflow-hidden">
        <div className="bg-[#DCE6EA] px-6 py-4 border-b border-[#CDD9DE]">
          <h3 className="text-base font-display font-bold text-[#2D4A5B] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('special.chouonTab')}
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#3A3529] leading-relaxed">
              {t('special.chouonDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#221F18] mb-2">{t('special.rulesTitle')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F0E9D8]">
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">母音</th>
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">規則</th>
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">{t('special.examplesTitle')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-[#D9CDB2] font-bold">あ段</td>
                    <td className="p-2.5 border border-[#D9CDB2]">加「あ」</td>
                    <td className="p-2.5 border border-[#D9CDB2]">おかあさん (okaasan)</td>
                  </tr>
                  <tr className="bg-[#F4EEDE]">
                    <td className="p-2.5 border border-[#D9CDB2] font-bold">い段</td>
                    <td className="p-2.5 border border-[#D9CDB2]">加「い」</td>
                    <td className="p-2.5 border border-[#D9CDB2]">おにいさん (oniisan)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#D9CDB2] font-bold">う段</td>
                    <td className="p-2.5 border border-[#D9CDB2]">加「う」</td>
                    <td className="p-2.5 border border-[#D9CDB2]">くうき (kuuki)</td>
                  </tr>
                  <tr className="bg-[#F4EEDE]">
                    <td className="p-2.5 border border-[#D9CDB2] font-bold">え段</td>
                    <td className="p-2.5 border border-[#D9CDB2]">通常加「い」</td>
                    <td className="p-2.5 border border-[#D9CDB2]">せんせい (sensei)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#D9CDB2] font-bold">お段</td>
                    <td className="p-2.5 border border-[#D9CDB2]">通常加「う」</td>
                    <td className="p-2.5 border border-[#D9CDB2]">とうきょう (toukyou)</td>
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
