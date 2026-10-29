// Service worker：讓五十音在通勤、沒網路時也能練。
//
// 為什麼不寫死要快取的檔案清單：Vite 產出的 JS/CSS 檔名帶 build hash
// （index-CCHaDl0G.js），每次改版都會變，寫死的清單改版後就會指向不存在的舊檔。
// 改成安裝時只預快取入口頁，其餘資產「用到才存」(runtime caching)。
//
// ── 為什麼不是所有資源都能 cache-first ──────────────────────────
// 快取策略取決於「這個 URL 的內容會不會變」，不是「它是不是靜態檔」：
//
//   /assets/*        檔名帶 build hash，內容永遠不會變 → cache-first
//   /audio/**        內容定死（重新產生會換檔名或整批換版）→ cache-first
//   HTML             每次改版都變 → network-first
//   manifest / icon  路徑固定但內容會改 → stale-while-revalidate
//                    （先給快取讓畫面不卡，同時背景更新，下次就是新的）
//
// 之前把「所有非 HTML」一律當 cache-first，等於假設路徑固定就代表內容不變，
// 那對 manifest 與 icon 是錯的——改了永遠推不出去。
//
// ── HTML 一定要繞過瀏覽器的 HTTP 快取 ──────────────────────────
// GitHub Pages 對 HTML 回 cache-control: max-age=600。fetch() 預設會走
// HTTP 快取，所以部署後最長 10 分鐘內，「network-first」其實可能拿到快取裡的
// 舊 index.html；它指向舊的 hash 資產，而那些資產在 SW 快取裡一定命中——
// 結果是整個 app 完全是舊版，而且看起來毫無異常。
// 加上 cache: 'no-store' 才讓 network-first 名副其實。

// 改版且需要清掉舊快取時把版本號 +1。舊快取會在 activate 整批刪除——
// 之前這個數字從沒動過，所以清理邏輯從沒真正跑過，每次部署的舊 hash
// 資產都永久留著。
const VERSION = 'v2';
const CACHE = `kana-${VERSION}`;
const ENTRY = '/japanese-kana-learning/';

// 內容不可變、可以放心 cache-first 的路徑
const IMMUTABLE = [`${ENTRY}assets/`, `${ENTRY}audio/`];
const isImmutable = (url) => IMMUTABLE.some((p) => url.pathname.startsWith(p));

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

// 第一次造訪時，入口 JS/CSS 與字典 chunk 在 SW 接管頁面之前就載完了，
// 沒經過下面的 fetch handler，所以沒被快取；只造訪一次就離線會整頁空白。
// 頁面被接管後會把已載入的 URL 傳過來，這裡補存其中的不可變資產。
// 已在快取裡的跳過，所以頁面重送幾次都無害。
self.addEventListener('message', (e) => {
  if (e.data?.type !== 'cache-assets' || !Array.isArray(e.data.urls)) return;
  e.waitUntil(cacheMissing(e.data.urls));
});

async function cacheMissing(urls) {
  const cache = await caches.open(CACHE);
  await Promise.all(
    urls.map(async (raw) => {
      let url;
      try {
        url = new URL(raw);
      } catch {
        return;
      }
      if (url.origin !== self.location.origin || !isImmutable(url)) return;
      if (await cache.match(url.href, { ignoreVary: true })) return;
      try {
        const res = await fetch(url.href);
        if (res.ok && res.type === 'basic') await cache.put(url.href, res);
      } catch {
        // 離線或資產已不存在：下次頁面重送時再試
      }
    }),
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 只管自己網域下的資源；外部請求（Google Fonts 等）一律直接放行
  if (url.origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // network-first，且繞過 HTTP 快取（見上方說明）
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(ENTRY, copy));
          return res;
        })
        .catch(() => caches.match(ENTRY).then((hit) => hit || caches.match(req))),
    );
    return;
  }

  if (isImmutable(url)) {
    // cache-first：hash 檔名的資產與音檔。
    // ignoreVary：補存的那份是 SW 自己抓的，沒有頁面請求的 Origin 標頭；
    // 伺服器若回 Vary: Origin（vite preview 會），照 Vary 比對就永遠命中不了。
    // 同源、檔名帶 hash 的內容不會因這些標頭而不同，忽略是安全的。
    e.respondWith(
      caches.match(req, { ignoreVary: true }).then((hit) => {
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
    return;
  }

  // 其餘同源資源（manifest、icon 等路徑固定但內容會改的）：
  // stale-while-revalidate——先回快取不卡畫面，同時抓新版存起來供下次使用
  e.respondWith(
    caches.match(req).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    }),
  );
});
