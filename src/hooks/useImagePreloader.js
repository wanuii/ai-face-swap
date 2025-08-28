// 用途：在顯示圖片前預載入圖片，以避免畫面出現「閃爍」、「圖片出現一半」等問題
// 功能：預先載入一組圖片 URL，全部載入完成後回傳 true。
import { useEffect, useState } from "react";

export const useImagePreloader = (imageUrls) => {
  // allLoaded: 是否全部圖片都載入完成
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    // 確保傳入的是陣列，並且過濾掉 null/undefined/空字串等無效 URL
    const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];

    // 如果沒有需要預載的圖片，直接視為已載入完成
    if (urls.length === 0) {
      setAllLoaded(true);
      return;
    }

    let cancel = false;   // 用來標記這次 effect 是否已經過期或被取消
    let loaded = 0;       // 記錄目前已載入完成的圖片數量
    const imgs = [];      // 存放建立的 Image 物件，方便之後 cleanup

    // 每次 imageUrls 變化時，先把狀態重設成 false
    setAllLoaded(false);

    // handler：每張圖載入成功或失敗時都會呼叫
    const handler = () => {
      loaded += 1; // 成功或失敗都計數
      // 如果沒有被取消，且已載入數量等於總數 → 表示都完成了
      if (!cancel && loaded === urls.length) {
        setAllLoaded(true);
      }
    };

    // 逐一建立 Image 物件來預載圖片
    urls.forEach((url) => {
      const img = new Image();
      imgs.push(img);

      // 不論成功或失敗，都呼叫同一個 handler
      img.onload = handler;
      img.onerror = handler;

      // 開始載入圖片
      img.src = url;
    });

    // cleanup：當元件卸載或 imageUrls 改變時執行
    return () => {
      cancel = true; // 這批請求過期了，回來也不能更新 state
      imgs.forEach((img) => {
        // 清掉事件監聽，避免記憶體洩漏
        img.onload = img.onerror = null;
        // 嘗試中止下載，讓瀏覽器釋放資源
        img.src = "";
      });
    };
  }, [imageUrls]);

  return allLoaded;
};