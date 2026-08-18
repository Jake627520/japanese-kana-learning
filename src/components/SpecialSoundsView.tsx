import React from 'react';
import { Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { speakJapanese } from '../utils/speech';

export function SpecialSoundsView() {
  const handlePlay = (text: string) => {
    speakJapanese(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
        <h2 className="text-xl font-extrabold text-[#1E293B]">特殊音規則</h2>
        <p className="text-xs text-[#64748B] mt-1">
          促音（っ）與長音是日語發音的重要規則。理解後，讀音與拼寫會更準確。
        </p>
      </div>

      {/* 促音 Section */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="bg-[#FEF3C7] px-6 py-4 border-b border-[#FDE68A]">
          <h3 className="text-base font-extrabold text-[#92400E] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            促音（そくおん）— っ / ッ
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#334155] leading-relaxed">
              促音用小寫的 <strong className="text-[#00A86B]">っ</strong>（平假名）或 <strong className="text-[#00A86B]">ッ</strong>（片假名）表示。
              發音時在該處<strong>短暫停頓</strong>（約半拍），再接下一個子音。
            </p>
            <div className="flex items-start gap-2 bg-[#FFFBEB] p-3 rounded-xl text-xs text-[#92400E]">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>促音不會單獨出現，一定接在後面還有假名。常見於「雙子音」的感覺，例如 kk、ss、tt、pp。</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-3">常見例子</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { word: 'がっこう', romaji: 'gakkou', meaning: '學校', note: 'っ + こ → kk' },
                { word: 'きっぷ', romaji: 'kippu', meaning: '車票', note: 'っ + ぷ → pp' },
                { word: 'ざっし', romaji: 'zasshi', meaning: '雜誌', note: 'っ + し → ssh' },
                { word: 'みっつ', romaji: 'mittsu', meaning: '三個', note: 'っ + つ → tts' },
                { word: 'ベッド', romaji: 'beddo', meaning: '床', note: 'ッ + ド（片假名）' },
                { word: 'カップ', romaji: 'kappu', meaning: '杯子', note: 'ッ + プ（片假名）' },
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
                    title="聽發音"
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
          <h3 className="text-base font-extrabold text-[#1E40AF] flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            長音（ちょうおん）— 母音延長
          </h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-[#334155] leading-relaxed">
              長音是把母音<strong>拉長約一倍</strong>（約兩拍）。平假名與片假名的寫法略有不同。
            </p>
          </div>

          {/* 平假名長音規則 */}
          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2">平假名長音寫法</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC]">
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">母音行</th>
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">延長方式</th>
                    <th className="text-left p-2.5 font-bold text-[#64748B] border border-[#E2E8F0]">例子</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">あ段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「あ」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">おかあさん（okāsan）媽媽</td>
                  </tr>
                  <tr className="bg-[#FAFBFB]">
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">い段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「い」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">おにいさん（oniisan）哥哥</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">う段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「う」</td>
                    <td className="p-2.5 border border-[#E2E8F0]">くうこう（kūkō）機場</td>
                  </tr>
                  <tr className="bg-[#FAFBFB]">
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">え段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「い」（少數加「え」）</td>
                    <td className="p-2.5 border border-[#E2E8F0]">せんせい（sensei）老師</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E2E8F0] font-bold">お段</td>
                    <td className="p-2.5 border border-[#E2E8F0]">加「う」（少數加「お」）</td>
                    <td className="p-2.5 border border-[#E2E8F0]">とうきょう（Tōkyō）東京</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 片假名長音 */}
          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2">片假名長音寫法</h4>
            <p className="text-xs text-[#64748B] mb-3">
              片假名統一使用長音符號 <strong className="text-[#00A86B]">ー</strong>（橫線）延長前一個母音。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { word: 'コーヒー', romaji: 'kōhī', meaning: '咖啡' },
                { word: 'スーパー', romaji: 'sūpā', meaning: '超市' },
                { word: 'ゲーム', romaji: 'gēmu', meaning: '遊戲' },
                { word: 'タクシー', romaji: 'takushī', meaning: '計程車' },
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
                    <div className="text-xs text-[#64748B] mt-0.5">{item.meaning}</div>
                  </div>
                  <button
                    onClick={() => handlePlay(item.word)}
                    className="p-2 text-[#64748B] hover:text-[#00A86B] hover:bg-[#E6F8F2] rounded-xl transition-colors cursor-pointer"
                    title="聽發音"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 小提醒 */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-3xl p-5 text-sm text-[#166534]">
        <div className="font-extrabold mb-1 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          學習小提醒
        </div>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>促音是「停頓」，長音是「拉長」，兩者不要搞混。</li>
          <li>寫羅馬字時，促音常寫成雙子音（kk、ss、tt、pp），長音可用 ā ī ū ē ō 或 aa ii uu ee oo。</li>
          <li>多聽多念例子，比死背規則更有效。</li>
        </ul>
      </div>
    </div>
  );
}
