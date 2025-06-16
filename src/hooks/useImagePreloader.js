// 用途：在顯示圖片前預載入圖片，以避免畫面出現「閃爍」、「圖片出現一半」等問題
// 功能：預先載入一組圖片 URL，當所有圖片都成功載入後，回傳 true，否則為 false。
import { useEffect, useState } from "react";

/**
 * @param {string[] | null[]} imageUrls - 要預載入的圖片網址陣列
 * @returns {boolean} allImagesLoaded - 是否所有圖片都已載入完成
 */
export const useImagePreloader = (imageUrls) => {
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      setAllLoaded(true);
      return;
    }

    let isCancelled = false;
    let loadedCount = 0;

    setAllLoaded(false); // 重設 loading 狀態

    imageUrls.forEach((url) => {
      if (!url) return;

      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount += 1;
        if (!isCancelled && loadedCount === imageUrls.length) {
          setAllLoaded(true);
        }
      };
      img.src = url;
    });

    return () => {
      isCancelled = true;
    };
  }, [imageUrls]);

  return allLoaded;
};
