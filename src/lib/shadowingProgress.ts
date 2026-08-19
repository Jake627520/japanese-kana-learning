import { SHADOWING_SENTENCES, ShadowingSentence } from '../data/shadowing';

const STORAGE_KEY = 'shadowing-progress-v1';

export interface ShadowingProgress {
  /** YYYY-MM-DD（local） */
  date: string;
  /** 今日推薦的 3 個 sentence id */
  todayIds: string[];
  /** id → 今日已完成完整迴圈次數（到「對照」算 1 次） */
  practiceCount: Record<string, number>;
  /** 使用者手動標記「這句 OK」的 id 列表（可跨日保留） */
  markedOk: string[];
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadRaw(): ShadowingProgress | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    return JSON.parse(s) as ShadowingProgress;
  } catch {
    return null;
  }
}

function save(p: ShadowingProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch (e) {
    console.error('Failed to save shadowing progress', e);
  }
}

/** 穩定洗牌（用 date 當 seed 的確定性抽題：每天固定同一組） */
function pickTodayIds(date: string, n = 3): string[] {
  const ids = SHADOWING_SENTENCES.map((s) => s.id);
  let seed = 0;
  for (let i = 0; i < date.length; i++) seed += date.charCodeAt(i);
  const rotated = [...ids.slice(seed % ids.length), ...ids.slice(0, seed % ids.length)];
  const arr = [...rotated];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (seed + i * 17) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

export function getShadowingProgress(): ShadowingProgress {
  const date = todayKey();
  const raw = loadRaw();
  if (raw && raw.date === date && Array.isArray(raw.todayIds) && raw.todayIds.length > 0) {
    return {
      date,
      todayIds: raw.todayIds,
      practiceCount: raw.practiceCount ?? {},
      markedOk: Array.isArray(raw.markedOk) ? raw.markedOk : [],
    };
  }
  // 新的一天：重抽 todayIds，保留 markedOk，practiceCount 歸零
  const next: ShadowingProgress = {
    date,
    todayIds: pickTodayIds(date, 3),
    practiceCount: {},
    markedOk: Array.isArray(raw?.markedOk) ? raw.markedOk : [],
  };
  save(next);
  return next;
}

export function incrementPractice(id: string): ShadowingProgress {
  const p = getShadowingProgress();
  p.practiceCount[id] = (p.practiceCount[id] ?? 0) + 1;
  save(p);
  return p;
}

export function toggleMarkedOk(id: string): ShadowingProgress {
  const p = getShadowingProgress();
  if (p.markedOk.includes(id)) {
    p.markedOk = p.markedOk.filter((x) => x !== id);
  } else {
    p.markedOk = [...p.markedOk, id];
  }
  save(p);
  return p;
}

export function getTodaySentences(): ShadowingSentence[] {
  const p = getShadowingProgress();
  return p.todayIds
    .map((id) => SHADOWING_SENTENCES.find((s) => s.id === id))
    .filter((x): x is ShadowingSentence => !!x);
}
