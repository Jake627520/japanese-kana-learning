import React from 'react';

// 題目解說裡的簡易排版。
//
// 為什麼需要這支：解說本文寫成含 <b>／<u>／<br> 的字串（280 題裡有 180 題用到），
// 但 React 會把字串當純文字轉義，結果使用者看到的是螢幕上一堆 <b> 標籤。
//
// 為什麼不用 dangerouslySetInnerHTML：那會把「這串字能不能執行」交給資料來源決定。
// 目前解說全是自己寫的，但題庫本來就是會擴充的東西——哪天從外部匯入一批題目，
// 這裡就成了注入點。白名單解析器讓「最壞情況」停在「標籤原樣顯示」，而不是執行。
//
// 白名單以外的任何東西（<script>、<img>、屬性、未知標籤）都不解析，原樣當文字輸出。

type Tag = 'b' | 'u';

interface Frame {
  tag: Tag | null;
  children: React.ReactNode[];
}

const TOKEN = /<(\/?)(b|u)>|<br\s*\/?>/gi;

function parseRich(text: string): React.ReactNode[] {
  const stack: Frame[] = [{ tag: null, children: [] }];
  const top = () => stack[stack.length - 1];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;

  const close = () => {
    const frame = stack.pop();
    if (!frame) return;
    top().children.push(
      React.createElement(frame.tag === 'u' ? 'u' : 'b', { key: key++ }, ...frame.children)
    );
  };

  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text)) !== null) {
    const chunk = text.slice(last, m.index);
    if (chunk) top().children.push(chunk);
    last = TOKEN.lastIndex;

    if (!m[2]) {
      top().children.push(React.createElement('br', { key: key++ }));
    } else if (!m[1]) {
      stack.push({ tag: m[2].toLowerCase() as Tag, children: [] });
    } else if (stack.length > 1) {
      close();
    }
    // 多餘的結束標籤（stack 只剩根層）直接忽略，不讓它把根層彈掉
  }

  const tail = text.slice(last);
  if (tail) top().children.push(tail);

  // 有開沒關的標籤在這裡收尾，避免內容整段消失
  while (stack.length > 1) close();

  return stack[0].children;
}

export function RichText({ text }: { text: string }) {
  return <>{parseRich(text)}</>;
}
