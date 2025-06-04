// 用途：預先載入圖片，避免使用者點擊時才載入造成延遲
// 功能：接收一組圖片網址（string[]），透過 new Image() 建立圖片實例，觸發瀏覽器緩存機制。
export const preloadImages = (urls = []) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };