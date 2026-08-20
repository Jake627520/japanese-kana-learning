---
name: antigravity-firebase
description: 在 AntiGravity 連接 Firebase MCP 與專案管理。當使用者說「連接 Firebase」「設定 Firebase」「Firestore MCP」時載入。
---

# 連接 Firebase（AntiGravity 專屬指南）

## 適用情境
- 串接 Firebase 專案、檢視與操作 Firestore 資料庫及 Hosting 資源。

## macOS 安裝與登入步驟

### 1. 安裝與驗證 Firebase CLI
```bash
npx -y firebase-tools@latest --version
npx -y firebase-tools@latest login
npx -y firebase-tools@latest projects:list
```

### 2. 註冊 Firebase MCP Server
在 Antigravity 的 MCP 設定中加入：
```json
{
  "firebase": {
    "type": "local",
    "command": ["npx", "-y", "firebase-tools@latest", "mcp"],
    "enabled": true
  }
}
```

## 安全守則
1. **憑證分離**：前端 config 可以公開，但 Firebase Admin SDK 私密金鑰（Service Account JSON）絕對不可 commit 到 Git。
2. **個資防護**：測試與正式資料庫中避免存放個人真實姓名與敏感機密。
