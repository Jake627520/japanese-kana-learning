---
name: antigravity-github
description: 在 AntiGravity 連接 GitHub CLI 與安全協作。當使用者說「連接 GitHub」「設定 GitHub」「GitHub CLI」時載入。
---

# 連接 GitHub（AntiGravity 專屬指南）

## 適用情境
- 檢查 GitHub 認證狀態、管理 Issue 與 Pull Request。
- 安全提交與遠端推送規範。

## macOS 設定步驟

### 1. 檢查 GitHub CLI 登入狀態
```bash
gh auth status
```

### 2. 登入 GitHub (Web OAuth)
```bash
gh auth login --web --git-protocol https
```

### 3. 設定 Git 使用者資訊
```bash
git config --global user.name "你的名字"
git config --global user.email "your-email@example.com"
```
*(若不想公開個人信箱，可使用 GitHub 提供之 `@users.noreply.github.com`)*

## 安全規範
1. **Token 保護**：嚴禁將 GitHub Personal Access Token 寫入 Markdown、設定檔或 repo。
2. **差異審查**：每次 commit 前務必先執行 `git diff` 審查變更，避免使用無差別的 `git add .`。
