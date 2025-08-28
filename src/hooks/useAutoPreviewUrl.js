// 用途：自動將圖片來源（File 或 URL 字串）轉換為可用於 <img src="..."> 的網址。
// 功能：當傳入的 imageSrc 發生變化時，自動判斷型別並轉換為可預覽的網址（Object URL 或原始 URL 字串），同時自動釋放不再使用的 Object URL 以節省記憶體。
// 適合用於只想單純顯示圖片預覽、來源可能是 File 或 URL 字串的情境（例如 ResultDialog、圖片列表等）。

import { useEffect, useState } from "react";

export const useAutoPreviewUrl = (input) => {
const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!input) {
      setPreviewUrl(null);
      return;
    }
    // 字串 URL 直接用
    if (typeof input === "string") {
      setPreviewUrl(input);
      return;
    }

    // File/Blob 產生 object URL
    if (input instanceof File) {
      const objectUrl = URL.createObjectURL(input);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // 依賴變動/卸載時釋放這個 URL，清理記憶體
    }

    // 其他型別：保險
    setPreviewUrl(null);
  }, [input]);

  return {
    previewUrl,
    file: input instanceof File ? input : null,
  };
}
