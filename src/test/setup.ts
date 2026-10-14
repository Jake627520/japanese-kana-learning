import { beforeEach } from 'vitest';

// 測試跑在 Node，沒有瀏覽器的 localStorage。
// 不引入 jsdom：程式碼只用到 localStorage 這一個瀏覽器 API，記憶體版就夠了。
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number) {
    return [...this.store.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
// 部分模組用 `typeof window === 'undefined'` 判斷是否在瀏覽器，讓它們走正常路徑
Object.defineProperty(globalThis, 'window', { value: globalThis, configurable: true });

beforeEach(() => {
  storage.clear();
});
