// 用途：自動將圖片來源（File 或 URL 字串）轉換為可用於 <img src="..."> 的網址。
// 功能：當傳入的 imageSrc 發生變化時，自動判斷型別並轉換為可預覽的網址（Object URL 或原始 URL 字串），同時自動釋放不再使用的 Object URL 以節省記憶體。
// 適合用於只想單純顯示圖片預覽、來源可能是 File 或 URL 字串的情境（例如 ResultDialog、圖片列表等）。

import { useEffect, useState } from "react";

export function useAutoPreviewUrl(input) {
  const [previewUrl, setPreviewUrl] = useState(() => {
    if (!input) return null;
    if (typeof input === "string") return input; // 直接使用字串網址
    if (input instanceof File) return URL.createObjectURL(input);
    return null;
  });

  useEffect(() => {
    if (!input) {
      setPreviewUrl(null);
      return;
    }

    if (typeof input === "string") {
      setPreviewUrl(input);
      return;
    }

    if (input instanceof File) {
      const objectUrl = URL.createObjectURL(input);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // 清理記憶體
    }
  }, [input]);

  return {
    previewUrl,
    file: input instanceof File ? input : null,
  };
}
