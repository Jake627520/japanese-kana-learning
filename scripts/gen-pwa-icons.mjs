// 從 public/icon.svg 產出 PWA 需要的 PNG 圖示。
// 為什麼要 PNG：manifest 的 SVG 圖示 Chrome 認得，但 iOS 的 apple-touch-icon
// 與部分 Android 裝置需要 PNG 才會出現原生安裝／主畫面圖示。
// 產出的 PNG 直接 commit 進 public/，CI（GitHub Actions）build 時只是複製，
// 不需要在 CI 安裝 sharp——sharp 只在本機重新產圖時才用到（devDependency）。
//
// 執行：npm run gen:icons
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const rounded = readFileSync(join(PUB, 'icon.svg'));
// 滿版（去圓角）版本給 maskable 與 apple-touch-icon：這兩者的系統遮罩會自己
// 套形狀，來源必須是滿版方形，否則會出現雙重圓角或透明角。
const fullBleed = Buffer.from(rounded.toString().replace(/rx="\d+"/, 'rx="0"'));

const png = (svg, size) => sharp(svg, { density: 400 }).resize(size, size).png();

await Promise.all([
  png(rounded, 192).toFile(join(PUB, 'pwa-192.png')),
  png(rounded, 512).toFile(join(PUB, 'pwa-512.png')),
  png(fullBleed, 512).toFile(join(PUB, 'pwa-maskable-512.png')),
  png(fullBleed, 180).toFile(join(PUB, 'apple-touch-icon.png')),
]);
console.log('✔ 已產生 pwa-192 / pwa-512 / pwa-maskable-512 / apple-touch-icon');
