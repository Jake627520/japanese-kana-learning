---
name: antigravity-notebooklm
description: 在 AntiGravity 連接 NotebookLM MCP 與研究筆記。當使用者說「連接 NotebookLM」「設定 NotebookLM」「NotebookLM 筆記」時載入。
---

# 連接 NotebookLM（AntiGravity 專屬指南）

## 適用情境
- 串接 NotebookLM 的筆記本進行知識檢索、文獻總結與問答。
- 透過 `notebooklm-mcp-cli` 本地 MCP Server 進行查詢。

## macOS / Linux 安裝與設定步驟

### 1. 安裝 CLI 工具
建議使用 `uv` 進行隔離安裝：
```bash
uv tool install notebooklm-mcp-cli
nlm --version
```
或使用 pip：
```bash
pip install notebooklm-mcp-cli
nlm --version
```

### 2. 登入 Google 帳號 (OAuth)
```bash
nlm login
```
> **注意**：指令會開啟瀏覽器進行 Google OAuth 授權，請選取正確帳號完成登入。若需更換帳號，可先執行 `nlm logout`。

### 3. 連線診斷與驗證
```bash
nlm doctor
nlm list
```

### 4. 註冊 MCP Server
在 Antigravity 的 MCP 設定中加入：
```json
{
  "notebooklm": {
    "type": "local",
    "command": ["nlm", "mcp"],
    "enabled": true
  }
}
```

## 安全守則
1. **嚴禁複製 Cookie/Token**：一律走標準瀏覽器 OAuth。
2. **筆記本清單防洩漏**：不要將 `notebooks.json`、筆記本 ID 清單或研究產物 commit 到公開 Git 儲存庫。
