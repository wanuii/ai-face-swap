# AI 換臉網站（AI Face Swapping Website）

這是一個基於 **React**、**Vite** 和 **TailwindCSS** 打造的 AI 換臉網頁應用程式。
使用者可上傳人像與範本圖片，後端 API 將處理並回傳已換臉的圖片結果。

---

## 🚀 功能特色

- 🖼️ 圖像上傳與預覽 UI，簡單直覺
- ⚡ 使用 Vite 快速建構與熱更新
- 🤖 與後端 AI API 串接，支援圖片換臉
- 📥 支援下載結果圖（含浮水印）
- 🌄 內建範本圖片可立即體驗
- 🧩 模組化元件與自訂 Hook 管理
- 📱 響應式設計與動畫效果加持

---

## 🛠️ 技術棧

- [React 19](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Ant Design 5](https://ant.design/)
- [React Icons](https://react-icons.github.io/)
- [Sonner](https://sonner.emilkowal.ski/) – 提示訊息系統

---

## 🧩 自訂 Hook 一覽

| Hook 名稱           | 功能說明                                                  |
| ------------------- | --------------------------------------------------------- |
| `usePreviewUrl`     | 將 `File` 轉成可用於 `<img>` 的預覽網址，並管理記憶體釋放 |
| `useAutoPreviewUrl` | 自動處理 File 或 URL 字串來源，產生預覽圖                 |
| `useLoadingTimer`   | 當正在換臉時，每秒記錄等待秒數，可顯示在 UI 上            |
| `useFaceTemplate`   | 動態讀取 `/assets/templates` 中所有範本圖片，供使用者選擇 |

---

## 🌐 API 串接說明

本專案透過 AI 換臉後端 API 執行圖片處理，使用 `multipart/form-data` 格式上傳兩張圖片（原圖與範本），並回傳處理後的圖片 Blob。

伺服器 API 基底網址設定於 `.env` 檔案中（例如：`VITE_API_BASE=https://your-api.com`）。

由於本專案作為作品集用途，已將 `.env` 檔案排除在 GitHub 中，請自行建立對應的 API 或與作者聯繫以了解串接方式。

---

## 📦 安裝步驟

```bash
git clone https://github.com/wanuii/ai-face-swap.git
cd ai-face-swap
npm install
```

---

## ▶️ 啟動方式

```bash
npm run dev
```
