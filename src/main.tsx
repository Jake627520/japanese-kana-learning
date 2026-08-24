import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

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
    });
  } else {
    // 開發時主動清掉先前留下的 SW 與快取，否則之前註冊過的那一份還會繼續攔截
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
    caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
  }
}
