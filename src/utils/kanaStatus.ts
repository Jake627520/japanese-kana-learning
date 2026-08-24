import { KanaItem, UserProgress } from '../types';
import { getReviewState } from './storage';

// 假名的學習狀態。SRS 需要的資料（reviewLevel、nextReviewAt、wrongKanaIds、
// masteredKanaIds）本來就都在 localStorage 裡，只是介面上一直只用二元的
// 「已精通／未精通」在呈現——所以使用者看五十音表看不出「我哪裡還不熟」。
//
// 這支是狀態判定的唯一來源：圖表、圖例、之後的首頁都從這裡取，
// 免得各判各的，同一個假名在兩個地方顯示成不同顏色。

export type KanaStatus = 'weak' | 'due' | 'mastered' | 'learning' | 'new';

// 優先序很重要，因為一個假名可以同時符合多個條件：
//   weak     答錯過且還沒清掉——最強的訊號，蓋過其他一切
//   due      SRS 排到今天，需要現在動作；即使已標記精通也要浮上來
//   mastered 已標記精通且沒到期
//   learning 練過但還沒精通
//   new      完全沒碰過
// 「due 蓋過 mastered」是刻意的：到期的意思就是「該再確認一次」，
// 這時顯示成已掌握會讓使用者略過它，正好違背 SRS 的用意。
export function getKanaStatus(progress: UserProgress, kanaId: string): KanaStatus {
  if (progress.wrongKanaIds.includes(kanaId)) return 'weak';

  const state = getReviewState(progress, kanaId);
  if (state.nextReviewAt && new Date(state.nextReviewAt) <= new Date()) return 'due';

  if (progress.masteredKanaIds.includes(kanaId)) return 'mastered';
  if (state.reviewLevel > 0 || state.correctCount > 0 || state.wrongCount > 0) return 'learning';
  return 'new';
}

export interface KanaStatusStyle {
  label: string;
  /** 圖例與狀態點的顏色 */
  dot: string;
  /** 卡片的邊框與底色 */
  card: string;
  /** 卡片上方那條狀態帶；'new' 沒有 */
  bar: string | null;
  hint: string;
}

// 四種狀態各自的顏色都取自站上既有的用色（綠／紅／藍／琥珀），
// 沒有引入新色票——這裡要的是讓顏色變成「學習狀態的語言」，不是換配色。
export const KANA_STATUS_STYLE: Record<KanaStatus, KanaStatusStyle> = {
  weak: {
    label: '弱點',
    dot: 'bg-red-500',
    card: 'border-red-300 bg-red-50/60',
    bar: 'bg-red-500',
    hint: '答錯過，建議優先加強',
  },
  due: {
    label: '今日到期',
    dot: 'bg-amber-500',
    card: 'border-amber-300 bg-amber-50/60',
    bar: 'bg-amber-500',
    hint: 'SRS 排到今天，該再確認一次',
  },
  mastered: {
    label: '已掌握',
    dot: 'bg-[#00A86B]',
    card: 'border-[#00A86B] bg-[#F0FDF4]/60',
    bar: 'bg-[#00A86B]',
    hint: '已標記精通',
  },
  learning: {
    label: '學習中',
    dot: 'bg-blue-500',
    card: 'border-blue-200 bg-blue-50/50',
    bar: 'bg-blue-400',
    hint: '練過但還沒精通',
  },
  new: {
    label: '未學習',
    dot: 'bg-[#CBD5E1]',
    card: 'border-[#E2E8F0]',
    bar: null,
    hint: '還沒碰過',
  },
};

/** 圖例的排列順序：由「該處理」到「已完成」，和使用者的注意力順序一致 */
export const KANA_STATUS_ORDER: KanaStatus[] = ['weak', 'due', 'learning', 'mastered', 'new'];

export function countKanaStatuses(
  allKana: KanaItem[],
  progress: UserProgress
): Record<KanaStatus, number> {
  const counts: Record<KanaStatus, number> = {
    weak: 0, due: 0, mastered: 0, learning: 0, new: 0,
  };
  for (const k of allKana) counts[getKanaStatus(progress, k.id)] += 1;
  return counts;
}
