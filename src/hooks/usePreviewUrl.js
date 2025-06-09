// 用途：將 File 物件轉換為圖片預覽網址（Object URL）
// 功能：提供 previewUrl 給 <img src="..."> 使用，當 File 變動時手動觸發生成新的網址，並自動釋放舊的網址以節省記憶體。
// 適合用於使用者主動選擇檔案（如 <input type="file">）後再進行處理的情境。

import { useEffect, useState } from "react";

export function usePreviewUrl(initialFile = null) {
  // 使用函式初始化 useState(() => ...) 避免每次 render 都跑 createObjectURL
  // 如果外部有提供 initialFile（預設為 null），會立刻建立預覽網址
  const [previewUrl, setPreviewUrl] = useState(() =>
    initialFile ? URL.createObjectURL(initialFile) : null
  );
  const [selectedFile, setSelectedFile] = useState(initialFile);
  // 元件卸載時（unmount）或 previewUrl 改變之前自動執行，釋放瀏覽器中舊的 blob URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  // 設定圖片，當使用者選擇或拖曳一張圖片後呼叫
  const handleFileSelect = (file) => {
    // 若有新的 previewUrl，清除舊的 previewUrl（避免記憶體洩漏）
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    // 產生新的 URL 預覽圖
    const objectUrl = URL.createObjectURL(file);
    // 設定新的 File 和 previewUrl
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return {
    previewUrl,         // 圖片預覽網址
    selectedFile,       // File 物件
    handleFileSelect,   // 選擇圖片時使用
    handleReset,        // 清除狀態用
  };
}
