---
name: antigravity-obsidian
description: 在 AntiGravity 連接 Obsidian 本地筆記庫 (MCPVault)。當使用者說「連接 Obsidian」「設定 Obsidian」「Obsidian 筆記」時載入。
---

# 連接 Obsidian MCPVault（AntiGravity 專屬指南）

## 適用情境
- 讓 AI 直接閱讀或寫入本地 Obsidian 雙鏈筆記庫，作為專案駕駛艙、踩坑紀錄與知識庫。

## macOS 安裝與設定步驟

### 1. 確認本地 Vault 路徑
確認你的 Obsidian 筆記庫路徑（內含 `.obsidian` 資料夾），例如：
```text
/Users/<使用者名稱>/Documents/ObsidianVault
或
/Users/<使用者名稱>/Library/Mobile Documents/iCloud~md~obsidian/Documents/<Vault名稱>
```

### 2. 全域安裝 MCPVault CLI
```bash
npm install -g @bitbonsai/mcpvault
which mcpvault
```

### 3. 註冊 Obsidian MCP Server
在 Antigravity 的 MCP 設定中加入：
```json
{
  "obsidian": {
    "type": "local",
    "command": ["mcpvault", "/絕對路徑/至/你的/ObsidianVault"],
    "enabled": true
  }
}
```

### 4. 驗證連線
重啟或重新載入 MCP 服務後，執行讀取 Vault 根目錄或建立一篇測試筆記確認權限與連線。

## 安全守則
1. **路徑隔離**：確保 MCP 只綁定指定的 Vault 目錄，不賦予全系統讀寫權限。
2. **私密資料防護**：若筆記庫內含有密碼或個人隱私筆記，建議單獨建立「開發專用」或「專案工作區」Vault。
