import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LoadFailedScreen } from './components/LoadFailedScreen';
import { getInitialLanguage, loadBootMessages } from './i18n';
import './index.css';

// 先載入介面語言的字典再畫第一個畫面，避免閃出原始 key
loadBootMessages(getInitialLanguage()).then((messages) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>{messages ? <App messages={messages} /> : <LoadFailedScreen />}</StrictMode>,
  );
});

// 註冊 service worker：離線可用 + 可安裝到主畫面。
// 用 BASE_URL 而不是寫死路徑——這個站部署在 GitHub Pages 子路徑底下，
// 寫死 '/sw.js' 會註冊到網域根目錄，scope 對不上就完全不會生效。
//
// 只在正式版註冊。開發時 Vite 是把原始碼一個模組一個模組地送出來
// （/src/App.tsx?t=…），那些 URL 的內容每次存檔都會變，但 SW 的 cache-first
// 會把它們當成不可變資產存起來——結果是改了程式碼、重新整理，畫面還是舊的，
// 而且沒有任何錯誤訊息。沒有 ?t= 參數的模組（新增的檔案）更是永遠凍結在
// 第一次抓到的版本。
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
        .catch((err) => console.warn('SW registration failed:', err));
      // 第一次造訪時入口 JS/CSS 與字典在 SW 接管前就載完，SW 看不到也存不到；
      // 把已載入的同源 URL 交給它補存（哪些該存由 sw.js 決定）。
      // controllerchange 補上 ready 之後、接管之前才載入的資源。
      navigator.serviceWorker.ready.then((reg) => sendLoadedUrls(reg.active));
      navigator.serviceWorker.addEventListener('controllerchange', () =>
        sendLoadedUrls(navigator.serviceWorker.controller),
      );
    });
  } else {
    // 開發時主動清掉先前留下的 SW 與快取，否則之前註冊過的那一份還會繼續攔截
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
    caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
  }
}

function sendLoadedUrls(worker: ServiceWorker | null) {
  const urls = performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((url) => url.startsWith(`${location.origin}/`));
  worker?.postMessage({ type: 'cache-assets', urls: [...new Set(urls)] });
}
