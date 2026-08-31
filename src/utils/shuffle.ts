import { JlptQuestion } from '../types';

// Fisher-Yates。
//
// 為什麼不用 [...xs].sort(() => 0.5 - Math.random())：那個寫法很常見但並不均勻——
// 比較函式不是一致的排序關係，結果分布取決於引擎的排序演算法，某些位置會明顯
// 比其他位置更容易被選中。出題用的洗牌不均勻，等於在題目裡埋了可被利用的規律。
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// 打亂選項並同步搬移 answer。
//
// 為什麼需要這支：題庫裡 280 題有 222 題的正解寫在第 1 個位置（N4/N3 那 180 題
// 更是 178 題都在第 1 位），而畫面一律照原順序渲染選項——使用者每題點第一個
// 就有九成以上的正確率，整個題庫等於沒有鑑別力。
//
// 選擇在這裡打亂而不是去改資料裡的 answer，有兩個理由：
//   1. 這是一勞永逸的：日後新增的題目就算又寫成全部 answer '1'，也不會重現。
//   2. 同一題重練時選項順序會變，記「位置」沒有用，只能記內容。
//
// 打亂後 jlptStorage 記的 selectedOption 只剩「當下畫面上的第幾個」的意義；
// 該欄位目前只寫不讀，正確與否由 isCorrect 決定，所以不影響任何統計。
export function withShuffledOptions(q: JlptQuestion): JlptQuestion {
  const correctIndex = Number(q.answer) - 1;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= q.options.length) {
    // 資料有問題時原樣回傳，不要把壞資料變成看起來正常的題目
    return q;
  }
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    answer: String(order.indexOf(correctIndex) + 1),
  };
}
