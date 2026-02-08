# 🌙 Soul Passport - 心靈護照

> 一款結合塔羅占卜與 AI 深度解讀的療癒系 Web App

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwindcss)
![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash-4285f4?logo=google)

## ✨ 特色功能

- 🎴 **22 張大阿爾克那塔羅牌** - 正逆位解讀
- 🤖 **AI 深度解讀** - 由 Google Gemini 2.5 Flash 驅動
- 🎨 **精美分享圖** - 一鍵生成可分享的解讀結果
- 📱 **行動優先設計** - 完美適配手機與平板
- 🌈 **動態主題系統** - 根據牌面自動調整配色
- 🔒 **安全防護機制** - 過濾敏感話題（金融、生死、無關問題）

## 🎬 Demo

[在線體驗](https://你的網址.vercel.app) _(部署後更新)_

## 📸 預覽

_（上傳截圖到 GitHub 後，在這裡插入圖片連結）_

## 🚀 快速開始

### 環境需求

- Node.js 20+
- npm 或 yarn

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/你的帳號/soul-passport.git
cd soul-passport

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local，填入你的 Gemini API Key

# 4. 啟動開發伺服器
npm run dev

# 5. 開啟瀏覽器
# 訪問 http://localhost:3000
```

### 取得 Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 點擊「Create API Key」
3. 複製 API Key 並貼到 `.env.local`

## 🛠️ 技術架構

### 前端
- **框架**: Next.js 16 (App Router)
- **語言**: TypeScript 5
- **樣式**: Tailwind CSS 4
- **動畫**: Framer Motion 12
- **圖片導出**: html2canvas

### 後端
- **API**: Next.js API Routes
- **AI 模型**: Google Gemini 2.5 Flash
- **部署**: Vercel

### 專案結構

```
soul-passport/
├── app/
│   ├── api/chat/          # AI 解讀 API
│   ├── layout.tsx         # 根佈局
│   └── page.tsx           # 主頁面
├── components/
│   ├── CardLoadingOverlay.tsx
│   ├── ChatSystem.tsx
│   ├── Consentmodal.tsx
│   ├── ErrorBoundary.tsx
│   ├── FernDecorationsLayer.tsx
│   ├── Header.tsx
│   └── ResultCardExport.tsx
├── hooks/
│   ├── useAppState.ts     # 狀態機管理
│   └── useTarotReading.ts # API 呼叫邏輯
├── lib/
│   ├── tarotData.ts       # 塔羅牌資料
│   ├── tarotImagery.ts    # 視覺意象
│   └── cardthemeutils.ts  # 工具函數
└── public/
    ├── tarot/             # 塔羅牌圖片
    └── ui/                # UI 裝飾元素
```

## 🎯 核心功能說明

### 1. 智能狀態管理
使用 `useReducer` 實作有限狀態機（FSM）：
```
WELCOME → INPUT → DRAW → LOADING → RESULT
```

### 2. API 重試機制
- 30 秒超時保護
- 自動重試（指數退避）
- 優雅的錯誤處理

### 3. 效能優化
- 蕨類裝飾從 40+ 減少到 18 個（減少 55% DOM 節點）
- 延遲載入非關鍵資源
- 使用 `will-change` 優化動畫

## 📊 效能指標

- ⚡ 首屏載入：< 1 秒
- 🎨 動畫幀率：> 55 FPS
- 📦 Bundle 大小：< 500 KB
- 🌐 Lighthouse 分數：> 90

## 🔐 隱私與安全

- ✅ 不儲存使用者資料
- ✅ 敏感話題自動過濾
- ✅ API Key 環境變數保護
- ✅ 首訪免責聲明

## 🤝 貢獻指南

歡迎提交 Issue 或 Pull Request！

### Commit 規範
```
feat: 新增功能
fix: 修復 bug
refactor: 重構程式碼
perf: 效能優化
docs: 文件更新
style: 程式碼格式
```

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

- [Next.js](https://nextjs.org/) - React 框架
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI 模型
- [Framer Motion](https://www.framer.com/motion/) - 動畫庫
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📞 聯絡方式

- 網站：[soulpassport.app](https://soulpassport.app) _(部署後更新)_
- GitHub Issues: [提交問題](https://github.com/你的帳號/soul-passport/issues)

---

**Made with 💜 by Dongua**