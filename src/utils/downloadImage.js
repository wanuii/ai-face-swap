// 功能：接收一張圖片（File 或 Blob），畫上浮水印，然後輸出成一個新的 File 圖片檔案
export const downloadImage = async (imageFile, watermarkText = "AI FACE SWAP") => {
  return new Promise((resolve) => {
    const img = new Image();
    // 將 File 轉成預覽網址，並把這個 URL 給 img ，讓瀏覽器開始下載這張圖片
    img.src = URL.createObjectURL(imageFile); 
    
    // 下載完成時觸發 img.onload
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // 把原圖畫到畫布上
      ctx.drawImage(img, 0, 0);

      // 設定浮水印樣式
      ctx.font = `${img.width * 0.05}px sans-serif`;
      // 設定字體顏色與透明度
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      // 決定文字對齊方式
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      // 畫出浮水印文字
      ctx.fillText(watermarkText, img.width - 20, img.height - 20);
      // 把 Canvas 內容轉成 Blob
      canvas.toBlob((blob) => {
        const watermarkedFile = new File([blob], "watermarked_result.jpg", {
          type: "image/jpeg",
        });
        resolve(watermarkedFile); // 回傳 File
      }, "image/jpeg");
    };

  });
};
