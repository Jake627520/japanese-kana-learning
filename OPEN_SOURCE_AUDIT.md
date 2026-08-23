# Open Source & Compliance Audit Report

## 1. Audit Scope & Overview
This audit evaluates the open-source compliance, asset licensing, and intellectual property readiness of the Japanese Kana Learning repository for public release.

## 2. Licensing Breakdown

### 2.1 Original Source Code
- **License**: MIT License (`LICENSE`)
- **Coverage**: All project-authored React components, TypeScript utility functions, state management, and configuration files.

### 2.2 Third-Party Dependencies
- **Details**: Documented in [`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md).
- **Licenses**:
  - `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite`, `autoprefixer`, `motion`: MIT License
  - `lucide-react`: ISC License
  - `typescript`: Apache-2.0 License
- **Compliance Status**: All third-party packages are distributed under permissive open-source licenses compatible with commercial and non-commercial redistribution.

### 2.3 Assets & Media
- **Details**: Documented in [`ASSET-LICENSE.md`](./ASSET-LICENSE.md).
- **UI Icons**: Provided by `lucide-react` under the ISC License.
- **Typography**: System native font stacks.
- **Audio Assets**: 244 mp3 files are bundled (208 kana + 36 shadowing clips), generated with
  [VOICEVOX](https://voicevox.hiroshiba.jp/) using the character 四国めたん. Commercial and
  non-commercial use and in-app redistribution are permitted, **conditional on crediting
  「VOICEVOX:四国めたん」** — the credit is rendered in the site-wide footer. Per-character terms
  are independent of the engine terms; see [`ASSET-LICENSE.md`](./ASSET-LICENSE.md).
- **Audio Fallback**: Content without a pre-generated clip (example words and sentences) falls
  back to the user agent's native Web Speech API engine.

### 2.4 Educational Content
- **Linguistic Data**: Kana symbols (Hiragana/Katakana) and standard Hepburn/Nihon-shiki romanizations represent standard linguistic information.
- **Example Sentences & Explanations**: Project-authored original content created specifically for this application.
- **Proprietary Materials**: No proprietary textbook materials, copyrighted courseware, or commercial dataset contents are intentionally included.

## 3. Security & Cleanliness Audit
- **Secrets & API Keys**: Verified zero exposure of API keys, environment variables, or private credentials.
- **Legacy Framework Artifacts**: Express server files, `dotenv`, `@google/genai`, and Google AI Studio metadata (`metadata.json`, `DISABLE_HMR` flags, `.aistudio`) have been completely removed.
