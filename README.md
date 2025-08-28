# AI 換臉網站（AI Face Swapping Website）

這是一個基於 **React**、**Vite** 和 **TailwindCSS** 打造的 AI 換臉網頁應用程式。
使用者可上傳人像與範本圖片，後端 API 將處理並回傳已換臉的圖片結果。

---

## ✨ 功能特色

- 換臉結果預覽：彈窗顯示原圖與換臉後對比，可直接下載
- 浮水印加上：下載前自動加上自訂浮水印
- 圖片預先載入：避免畫面閃爍，優化體驗
- Loading 計時器：換臉處理期間顯示等待秒數
- 社群分享按鈕：支援 Facebook、Instagram、Twitter
- API 隱藏優化：透過 Vercel serverless function 隱藏後端真實 URL，避免前端暴露機密

---

## 🛠️ 技術棧

| 類別      | 使用技術                                                          |
| --------- | ----------------------------------------------------------------- |
| 前端框架  | React 19                                                          |
| UI 框架   | Ant Design、React Icons                                           |
| 狀態管理  | React Hooks (`useState`, `useEffect` 等)                          |
| 樣式工具  | Tailwind CSS、客製化 CSS 動畫                                     |
| 資料串接  | RESTful API（透過 Vercel Serverless Function proxy 隱藏後端 URL） |
| 自訂 Hook | 圖片預覽、圖片載入偵測、Loading 秒數計時等                        |
| 開發工具  | Vite、ESLint、Prettier、React Strict Mode                         |
| 部署平台  | Vercel（含 `/api/swap-face.js` proxy API 與環境變數）             |

---

## 🧩 自訂 Hook 一覽

| Hook 名稱           | 功能說明                                                  |
| ------------------- | --------------------------------------------------------- |
| `usePreviewUrl`     | 將 `File` 轉成可用於 `<img>` 的預覽網址，並管理記憶體釋放 |
| `useAutoPreviewUrl` | 自動處理 File 或 URL 字串來源，產生預覽圖                 |
| `useLoadingTimer`   | 當正在換臉時，每秒記錄等待秒數，可顯示在 UI 上            |
| `useFaceTemplate`   | 動態讀取 `/assets/templates` 中所有範本圖片，供使用者選擇 |
| `useImagePreloader` | 接收一組圖片 URL，預先載入圖片並回傳載入完成狀態          |
| `useTimeoutWarning` | 設定時間後觸發提示或回呼，用於 API 或操作逾時提醒         |

---

## 🌐 API 串接說明

本專案透過 AI 換臉後端 API 執行圖片處理，使用 `multipart/form-data` 格式上傳兩張圖片（原圖與範本），並回傳處理後的圖片 Blob。

伺服器 API 基底網址設定於 `.env` 檔案中（例如：`VITE_API_BASE=https://your-api.com`）。

由於本專案作為作品集用途，已將 `.env` 檔案排除在 GitHub 中，請自行建立對應的 API 或與作者聯繫以了解串接方式。

---

## ⚙️ 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/wanuii/ai-face-swap.git

# 2. 進入目錄
cd ai-face-swap

# 3. 安裝依賴
npm install
```

---

## ▶️ 啟動方式

```bash
npm run dev
```

---

## 網頁展示

<https://ai-face-swap-ebon.vercel.app/>
