---
name: antigravity-workflow
description: AntiGravity 開工、收工與新專案初始化標準工作流。當使用者說「開工」「收工」「新專案初始化」「工作流程」時載入。
---

# AntiGravity 開工 / 收工 / 新專案初始化工作流程

## 1. 開工流程 (Start of Work)
當使用者發出「開工」指令時，AI 代理人應執行以下順序：

1. **讀取規則檔**：檢查專案根目錄的 `ANTIGRAVITY.md`、`GEMINI.md` 或專案設定。
2. **檢查 Git 狀態**：執行 `git status` 與最近 commits（`git log -n 3 --oneline`），掌握目前分支與未提交項目。
3. **檢查筆記/駕駛艙**：若有串接 Obsidian 或專案進度文件，同步閱讀最新上下文。
4. **狀態摘要與規劃**：向使用者簡要回報目前專案狀態，並主動列出建議的下一步行動。
5. **安全原則**：開工時不自動執行無確認的 pull、commit 或 push。

---

## 2. 收工流程 (End of Work)
當使用者發出「收工」指令時，AI 代理人應嚴格依序執行：

1. **機敏資訊掃描**：
   - 檢查變更中是否包含 API key、Token、私鑰、Firebase Admin JSON、OAuth 憑證或個資。
2. **更新進度紀錄**：
   - 更新專案紀錄、完成事項、下一步計畫與踩坑備忘（如 Obsidian 專案頁面或 Walkthrough）。
3. **變更範圍審查**：
   - 執行 `git status` 與 `git diff`，確認所有變更均為本次預期修改。
   - **嚴格禁止無差別 `git add .`**，只 stage 本次任務相關檔案。
4. **產生規範化 Commit Message**：
   - 採用 Conventional Commits 格式（如 `feat(...)`, `fix(...)`, `refactor(...)`）。
   - 向使用者確認後再進行 commit / push。
5. **總結回報**：
   - 回報 Git 同步狀態與本次完成概要。

---

## 3. 新專案初始化流程 (New Project Init)
當使用者要求「新專案初始化」時：

1. **需求確認**：確認專案名稱、用途、工作目錄、是否建立 GitHub repo (public/private)、部署方式。
2. **盤點缺口**：若目錄已存在檔案，先盤點已存在與缺失清單，不覆蓋既有重要設定。
3. **建立基礎骨架**：
   - `ANTIGRAVITY.md`（專案邊界、工作規則）
   - `README.md`
   - `.gitignore`（自動排除 `.env*`, `node_modules`, `dist`, `build`, `__pycache__` 等）
   - Git 初始化（`git init`）
