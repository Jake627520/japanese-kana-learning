import React from 'react';
import { Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { speakJapanese } from '../utils/speech';
import { useI18n, LocalizedText } from '../i18n';

const SOKUON_EXAMPLES: { word: string; romaji: string; meaning: LocalizedText; note: string }[] = [
  { word: 'がっこう', romaji: 'gakkou', meaning: { 'zh-TW': '學校', 'zh-CN': '学校', en: 'school', ko: '학교', es: 'escuela' }, note: 'っ + こ → kk' },
  { word: 'きっぷ', romaji: 'kippu', meaning: { 'zh-TW': '車票', 'zh-CN': '车票', en: 'ticket', ko: '표 (승차권)', es: 'boleto / billete' }, note: 'っ + ぷ → pp' },
  { word: 'ざっし', romaji: 'zasshi', meaning: { 'zh-TW': '雜誌', 'zh-CN': '杂志', en: 'magazine', ko: '잡지', es: 'revista' }, note: 'っ + し → ssh' },
  { word: 'みっつ', romaji: 'mittsu', meaning: { 'zh-TW': '三個', 'zh-CN': '三个', en: 'three (things)', ko: '세 개', es: 'tres (cosas)' }, note: 'っ + つ → tts' },
  { word: 'ベッド', romaji: 'beddo', meaning: { 'zh-TW': '床', 'zh-CN': '床', en: 'bed', ko: '침대', es: 'cama' }, note: 'ッ + ド' },
  { word: 'カップ', romaji: 'kappu', meaning: { 'zh-TW': '杯子', 'zh-CN': '杯子', en: 'cup', ko: '컵', es: 'taza' }, note: 'ッ + プ' },
];

export const CHOUON_RULES: { column: string; kana: string; usually: boolean; word: string; romaji: string; meaning: LocalizedText }[] = [
  { column: 'あ段', kana: 'あ', usually: false, word: 'おかあさん', romaji: 'okaasan', meaning: { 'zh-TW': '媽媽', 'zh-CN': '妈妈', en: 'mother', ko: '어머니', es: 'madre' } },
  { column: 'い段', kana: 'い', usually: false, word: 'おにいさん', romaji: 'oniisan', meaning: { 'zh-TW': '哥哥', 'zh-CN': '哥哥', en: 'older brother', ko: '형 / 오빠', es: 'hermano mayor' } },
  { column: 'う段', kana: 'う', usually: false, word: 'くうき', romaji: 'kuuki', meaning: { 'zh-TW': '空氣', 'zh-CN': '空气', en: 'air', ko: '공기', es: 'aire' } },
  { column: 'え段', kana: 'い', usually: true, word: 'せんせい', romaji: 'sensei', meaning: { 'zh-TW': '老師', 'zh-CN': '老师', en: 'teacher', ko: '선생님', es: 'profesor / profesora' } },
  { column: 'お段', kana: 'う', usually: true, word: 'とうきょう', romaji: 'toukyou', meaning: { 'zh-TW': '東京', 'zh-CN': '东京', en: 'Tokyo', ko: '도쿄', es: 'Tokio' } },
];

// 四個詞合起來，「ー」接在 a・i・u・e・o 五種母音後面都出現過
export const KATAKANA_CHOUON_EXAMPLES: { word: string; romaji: string; meaning: LocalizedText; note: string }[] = [
  { word: 'ゲーム', romaji: 'geemu', meaning: { 'zh-TW': '遊戲', 'zh-CN': '游戏', en: 'game', ko: '게임', es: 'juego / videojuego' }, note: 'ゲー → ee' },
  { word: 'タクシー', romaji: 'takushii', meaning: { 'zh-TW': '計程車', 'zh-CN': '出租车', en: 'taxi', ko: '택시', es: 'taxi' }, note: 'シー → ii' },
  { word: 'コーヒー', romaji: 'koohii', meaning: { 'zh-TW': '咖啡', 'zh-CN': '咖啡', en: 'coffee', ko: '커피', es: 'café' }, note: 'コー → oo · ヒー → ii' },
  { word: 'スーパー', romaji: 'suupaa', meaning: { 'zh-TW': '超市', 'zh-CN': '超市', en: 'supermarket', ko: '슈퍼마켓', es: 'supermercado' }, note: 'スー → uu · パー → aa' },
];

export function SpecialSoundsView() {
  const { t, language } = useI18n();

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
              <span>{t('special.sokuonTip')}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#221F18] mb-3">{t('special.examplesTitle')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOKUON_EXAMPLES.map((item) => (
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
                      {item.meaning[language]} · {item.note}
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
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">{t('special.vowelHeader')}</th>
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">{t('special.ruleHeader')}</th>
                    <th className="text-left p-2.5 font-bold text-[#6B6252] border border-[#D9CDB2]">{t('special.examplesTitle')}</th>
                  </tr>
                </thead>
                <tbody>
                  {CHOUON_RULES.map((rule, i) => (
                    <tr key={rule.column} className={i % 2 === 1 ? 'bg-[#F4EEDE]' : undefined}>
                      <td className="p-2.5 border border-[#D9CDB2] font-bold">{rule.column}</td>
                      <td className="p-2.5 border border-[#D9CDB2]">
                        {t(rule.usually ? 'special.ruleUsuallyAdd' : 'special.ruleAdd', { kana: rule.kana })}
                      </td>
                      <td className="p-2.5 border border-[#D9CDB2]">
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            <span className="font-bold text-[#221F18]">{rule.word}</span> ({rule.romaji}) · {rule.meaning[language]}
                          </span>
                          <button
                            onClick={() => handlePlay(rule.word)}
                            className="p-1.5 text-[#6B6252] hover:text-[#5C6B3D] hover:bg-[#E6EAD5] rounded-lg transition-colors cursor-pointer shrink-0"
                            title={t('common.playAudio')}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#221F18] mb-3">{t('special.katakanaChouonTitle')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KATAKANA_CHOUON_EXAMPLES.map((item) => (
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
                      {item.meaning[language]} · {item.note}
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
    </div>
  );
}
