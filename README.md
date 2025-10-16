# The Dojo - 專案協作平台

這是一個使用 React 和 Firebase 建立的專案管理與即時協作平台。使用者可以建立專案、指派成員、並在專案頁面中進行即時留言討論。

## ✨ 主要功能

- **使用者認證**: 完整的註冊、登入、登出流程。
- **儀表板 (Dashboard)**: 總覽所有專案，並提供強大的篩選功能 (全部、我的專案、依分類)。
- **專案管理**: 建立、查看、指派成員、設定截止日期。
- **即時留言**: 在專案詳情頁中，成員可以進行即時的文字交流。
- **線上狀態**: 側邊欄會即時顯示目前所有使用者的上線狀態。
- **全中文化介面**: 為中文使用者提供友善的操作體驗。

## 🛠️ 技術棧

- **前端**: React, React Router
- **後端與資料庫**: Firebase (Firestore, Authentication, Storage)
- **樣式**: CSS
- **工具**: `date-fns` (日期格式化), `react-select` (下拉選單)

## 🚀 快速開始

### 1. 環境準備

- 確認您已安裝 Node.js (建議 v16 或以上版本)。
- 建立一個您自己的 Firebase 專案，並啟用 **Authentication**, **Firestore**, 和 **Storage** 服務。

### 2. 安裝

```bash
# 1. Clone 或下載此專案到您的電腦
# git clone https://github.com/mtc98/chat.git
# cd chat

# 2. 安裝所有依賴套件
npm install
