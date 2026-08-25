import { JlptTopic } from '../../types';

// N3 知識點 1–10：推量、複合動詞、句型基準與因果關係。
// 定義取自 nihongo-tiku 的知識圖譜，每個節點的 description 與 evidence
// 都是出題的依據——題目要能驗證 evidence 描述的那個行為。
//
// 注意：節點 id 一律照知識圖譜原樣（含 jpg_n3-to-tomonin、jpg_n3-ni-kareshite
// 這兩個拼寫不精確的 id）。id 是跨 repo 的連結鍵，為了好看去改會讓兩邊對不上。
export const N3_TOPICS_BATCH1: JlptTopic[] = [
  { id: 'jpg_n3-wake-ga-nai', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜わけがない（強烈否定推測）', book: 'JLPT N3', chapter: '推量與否定', grade: 'n3',
    description: '根據常理或客觀事實判斷「絕不可能」。接續：動詞・い形容詞辭書形＋わけがない、な形容詞＋な、名詞＋の。最容易混的是 わけではない（並非完全…，部分否定），差一個字意思差很多。',
    evidence: ['能根據前提事實判斷強烈否定推測', '能區分 わけがない（絕不可能）與 わけではない（並非完全）'] },
  { id: 'jpg_n3-ni-chigainai', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜に違いない（確定推測）', book: 'JLPT N3', chapter: '推量與確定', grade: 'n3',
    description: '根據跡象或證據做出「一定是這樣」的推測。接續普通形，な形容詞與名詞直接接。確信度比 だろう 高、比 かもしれない 高很多。',
    evidence: ['能根據現場跡象選出に違いない', '知道確信度 に違いない ＞ だろう ＞ かもしれない'] },
  { id: 'jpg_n3-kiru', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜切る（徹底完成／到極限）', book: 'JLPT N3', chapter: '複合動詞', grade: 'n3',
    description: '接動詞ます形語幹，表示「完全做完、一點不剩」或「到達極限」。與〜終わる 的差別不在文法而在語感：終わる 只是動作結束，切る 帶著「撐完了」的完遂感。',
    evidence: ['能用ます形語幹＋切る表達完遂', '能說出〜切る與〜終わる的語感差異'] },
  { id: 'jpg_n3-naosu', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜直す（重新再做）', book: 'JLPT N3', chapter: '複合動詞', grade: 'n3',
    description: '接動詞ます形語幹，表示修正先前不完美的結果並重做一次（書き直す・考え直す）。重點是「先前那次不夠好」這個前提。',
    evidence: ['能用ます形語幹＋直す表達修正重做', '能區分〜直す（重做）與〜終わる（做完）'] },
  { id: 'jpg_n3-osore-ga-aru', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜恐れがある（恐怕有…的風險）', book: 'JLPT N3', chapter: '警告與推量', grade: 'n3',
    description: '新聞與正式警告的用語，表示擔心發生壞事。接續：動詞辭書形／名詞＋の＋恐れがある。只用於負面事件——用在好事上是錯的，這是最常見的誤用。',
    evidence: ['能辨識新聞式的正式警告口氣', '知道恐れがある不能用於正面事件'] },
  { id: 'jpg_n3-ni-sotte', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜に沿って（順著／依照）', book: 'JLPT N3', chapter: '句型與基準', grade: 'n3',
    description: '接名詞。既可沿著實體（川に沿って歩く），也可依照方針（計画に沿って進める）——同一個詞從空間延伸到抽象，不是兩個要分開背的用法。',
    evidence: ['能用於地理沿線與抽象方針兩種語境', '不會和に対して／に関して混用'] },
  { id: 'jpg_n3-ni-kanshite', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜に関して（關於）', book: 'JLPT N3', chapter: '話題與主題', grade: 'n3',
    description: '正式語氣的「關於某主題」。修飾名詞時要變成「に関する＋名詞」。比 について 正式，多用於調查、研究、會議。',
    evidence: ['修飾名詞時能正確用に関する', '知道に関して與について的體裁差異'] },
  { id: 'jpg_n3-to-tomonin', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜とともに（隨著／一同）', book: 'JLPT N3', chapter: '時間與變化', grade: 'n3',
    description: '接名詞或動詞辭書形。兩種用法：與人一同（家族とともに），以及隨著前者變化後者也變（時代が変わるとともに）。',
    evidence: ['能理解伴隨變化的用法', '能區分共同行動與伴隨變化'] },
  { id: 'jpg_n3-tame-ni', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜ために（原因・理由）', book: 'JLPT N3', chapter: '因果關係', grade: 'n3',
    description: '書面語的客觀原因，後半句多是非意志的結果（事故のために電車が止まった）。與表示目的的ために是同一個形式——靠後半句是不是說話者的意志來分辨。',
    evidence: ['能判斷後半句為非意志結果時ために表原因', '能區分原因用法與目的用法'] },
  { id: 'jpg_n3-okage-de', type: 'grammar', subject: '日本語', domain: '文法',
    name: '〜おかげで（多虧）', book: 'JLPT N3', chapter: '因果關係', grade: 'n3',
    description: '帶來好結果的原因或恩惠。接續：普通形／名詞＋の＋おかげで。與せいで（壞結果、帶抱怨）是成對的一組，方向相反。',
    evidence: ['能識別帶來正面結果的因果', '能區分おかげで（正面）與せいで（負面）'] },
];
