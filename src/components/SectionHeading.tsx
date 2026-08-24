import React from 'react';

// 區段標題：改版前所有卡片平鋪、間距一律 24px，整頁像一條沒有段落的長文。
// 這條標題線負責把畫面切成可掃視的群組——群組內緊（12px）、群組間鬆（28px）。
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2.5">
      <span className="text-[13px] font-extrabold text-[#1E293B] tracking-tight">{children}</span>
      <span className="flex-1 h-px bg-gradient-to-r from-[#E2E8F0] to-transparent" />
    </div>
  );
}
