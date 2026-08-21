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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
