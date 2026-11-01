import React from 'react';

// 空狀態。改版前這幾處只有一句白話文，畫面會突然空掉——
// 但空狀態是最常被看到的畫面之一（進度良好的使用者天天看到），不該是最草率的。
//
// 插圖刻意用線稿自己畫，不用 emoji 也不拿圖示湊：
// 2px 綠線＋淡綠實心，和站上 lucide 圖示的筆觸一致，縮放與換色都不會走樣。

type Art = 'calendar' | 'target' | 'chart' | 'page';

const ART: Record<Art, React.ReactNode> = {
  // 今天的複習都完成了：日曆＋打勾
  calendar: (
    <>
      <rect className="fill-[color:var(--moss-93)]" x="22" y="32" width="76" height="60" rx="9" />
      <rect x="22" y="32" width="76" height="60" rx="9" />
      <path d="M22 50h76" />
      <path d="M42 22v14M78 22v14" />
      <path d="M46 70l9 9 19-19" />
      <path className="stroke-[color:var(--moss-79)]" d="M14 60h-6M112 60h6M18 40l-5-4M102 40l5-4" />
    </>
  ),
  // 還沒有弱點假名：靶心正中
  target: (
    <>
      <circle className="fill-[color:var(--moss-93)]" cx="58" cy="56" r="30" />
      <circle cx="58" cy="56" r="30" />
      <circle cx="58" cy="56" r="18" />
      <circle className="fill-[color:var(--moss-50)]" cx="58" cy="56" r="6" />
      <path d="M84 30l-20 20" />
      <path d="M84 30l3-9 9-3-3 9z" />
      <path className="stroke-[color:var(--moss-79)]" d="M20 86h14M96 92h10" />
    </>
  ),
  // 資料還不夠：矮長條＋打勾
  chart: (
    <>
      <path d="M24 88h74" />
      <rect className="fill-[color:var(--moss-93)]" x="34" y="66" width="14" height="22" rx="4" />
      <rect x="34" y="66" width="14" height="22" rx="4" />
      <rect className="fill-[color:var(--moss-93)]" x="54" y="74" width="14" height="14" rx="4" />
      <rect x="54" y="74" width="14" height="14" rx="4" />
      <rect className="stroke-[color:var(--moss-79)]" x="74" y="80" width="14" height="8" rx="4" />
      <path className="stroke-[color:var(--moss-79)]" strokeDasharray="4 5" d="M30 52h62" />
      <circle className="fill-[color:var(--moss-93)]" cx="82" cy="34" r="16" />
      <circle cx="82" cy="34" r="16" />
      <path d="M75 34l5 5 10-10" />
    </>
  ),
  // 還沒有題目：空白稿紙＋鉛筆
  page: (
    <>
      <path className="fill-[color:var(--moss-93)]" d="M32 20h34l22 22v46a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" />
      <path d="M32 20h34l22 22v46a6 6 0 0 1-6 6H32a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" />
      <path d="M66 20v16a6 6 0 0 0 6 6h16" />
      <path className="stroke-[color:var(--moss-79)]" strokeDasharray="4 6" d="M40 58h34M40 70h24" />
      <path d="M96 62l8 8-22 22-10 2 2-10z" />
    </>
  ),
};

interface EmptyStateProps {
  art: Art;
  title: string;
  body: string;
  /** 空狀態一定要給一個明確的下一步，不然使用者只會愣在原地 */
  actions?: React.ReactNode;
  /** 塞在既有卡片裡時關掉外框，避免卡中卡 */
  bare?: boolean;
}

export function EmptyState({ art, title, body, actions, bare = false }: EmptyStateProps) {
  return (
    <div
      className={
        bare
          ? 'py-4 flex flex-col items-center gap-4 text-center'
          : 'bg-[color:var(--paper-bg)] rounded-3xl border border-[color:var(--paper-85)] elev-1 p-8 flex flex-col items-center gap-4 text-center'
      }
    >
      <div className="w-[120px] h-[108px] flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--moss-93)_0%,transparent_68%)]">
        <svg
          width="112"
          height="100"
          viewBox="0 0 120 108"
          fill="none"
          style={{ stroke: 'var(--moss-50)' }}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {ART[art]}
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-display font-bold text-[color:var(--ink-24)]">{title}</h3>
        <p className="text-xs text-[color:var(--ink-50)] leading-relaxed max-w-xs mx-auto">{body}</p>
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2.5">{actions}</div>}
    </div>
  );
}
