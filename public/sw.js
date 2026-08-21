// Service worker：讓五十音在通勤、沒網路時也能練。
//
// 為什麼不寫死要快取的檔案清單：Vite 產出的 JS/CSS 檔名帶 build hash
// （index-CCHaDl0G.js），每次改版都會變，寫死的清單改版後就會指向不存在的舊檔。
// 改成安裝時只預快取入口頁，其餘資產「用到才存」(runtime caching)。
//
// 兩種策略分開用，因為它們要的東西相反：
//   HTML  → network-first：新版上線時要馬上拿到新的入口頁，離線才退回快取
//   靜態資產 → cache-first：檔名帶 hash，內容不可能變，命中快取就是最快且省流量
//
// 版本號變更時舊快取整批清掉；改版後想強制更新快取就把 VERSION +1。

const VERSION = 'v1';
const CACHE = `kana-${VERSION}`;
const ENTRY = '/japanese-kana-learning/';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([ENTRY])).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 只管自己網域下的資源；外部請求（若有）一律直接放行
  if (url.origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // network-first：有網路就拿新版入口頁，離線退回快取
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(ENTRY, copy));
          return res;
        })
        .catch(() => caches.match(ENTRY).then((hit) => hit || caches.match(req))),
    );
    return;
  }

  // cache-first：hash 檔名的靜態資產
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // 只快取成功的同源回應，避免把錯誤頁存起來
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    }),
  );
});
