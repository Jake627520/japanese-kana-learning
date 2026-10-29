import { describe, it, expect } from 'vitest';
import { getOwnJlptQuestions } from './jlpt';
import { LANGUAGES } from '../i18n';
import { JLPT_EXPLANATIONS } from '../test/jlptExplanations';


// withShuffledOptions 會打亂選項順序，所以解說裡的「選 2」「option 3」指到的
// 是資料裡的原始位置，不是學習者畫面上的位置。解說必須引用選項內容。
const OPTION_NUMBER_REFS: RegExp[] = [
  /[選选]\s*[項项]?\s*[1-4](?![\d,])/,
  /(?:^|[，、；。：>・])\s*[1-4]\s+(?=[「\u4e00-\u9fff])/,
  /\b(?:option|choice)\s+[1-4]\b/i,
  /\banswer is [1-4]\b/i,
  /\b(?:opción|la)\s+[1-4]\b/i,
  /(?<![\d,.N])[1-4]\s*(?:번(?!\s*째)|은|는|예요)/,
];

const findOptionNumberRef = (text: string) =>
  OPTION_NUMBER_REFS.map((re) => text.match(re)?.[0]).find((m) => m !== undefined);

describe('JLPT 解說不以編號指稱選項', () => {
  it('能抓到以編號指稱選項的寫法，但放過量詞、價格與時間', () => {
    const flagged = [
      '「や」代表非窮盡列舉，故選 4。',
      '选项 1 连接形容词，违背词性规则',
      '語法正確。1 連接形容詞違背詞性規則',
      '<br>・3 「大概兩小時吧」是推測',
      '另外三句都同方向：2 兩個優點',
      'Option 1 links a noun to an adjective.',
      'The answer is 2.',
      'Por eso la respuesta es la 4.',
      '2번과 3번은 장점 두 개',
      '그래서 정답은 4예요.',
      '1은 형용사와 이어져',
    ];
    const allowed = [
      '1本＝いっぽん、3本＝さんぼん',
      'A は 2,000＋500＝<b>2,500円</b>',
      '<b>3時に 始まります</b>',
      'N5 常考活用形，N4 常考',
      'N5는 활용형을 자주 묻고, N4는',
      '「泣く」는 1그룹（5단）동사',
      'スケジュル만 4박(ス・ケ・ジュ・ル)이고',
      'Group 1 → あ-row',
      '<b>(1) who does the action? (2) is the sentence a request?</b>',
    ];
    for (const text of flagged) expect(findOptionNumberRef(text), text).toBeDefined();
    for (const text of allowed) expect(findOptionNumberRef(text), text).toBeUndefined();
  });

  it('所有題目、所有語言的解說都引用選項內容而非編號', () => {
    const offenders = getOwnJlptQuestions().flatMap((q) =>
      LANGUAGES.flatMap((lang) => {
        const hit = findOptionNumberRef(JLPT_EXPLANATIONS[lang][q.id]);
        return hit === undefined ? [] : [`${q.id} [${lang}] ${hit}`];
      }),
    );
    expect(offenders).toEqual([]);
  });
});
