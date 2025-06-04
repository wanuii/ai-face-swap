// utils/image.js
export const downloadImage = async (imageFile, watermarkText = "AI FACE SWAP") => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // 畫原始圖片
      ctx.drawImage(img, 0, 0);

      // 設定浮水印樣式
      ctx.font = `${img.width * 0.05}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(watermarkText, img.width - 20, img.height - 20);

      canvas.toBlob((blob) => {
        const watermarkedFile = new File([blob], "watermarked_result.jpg", {
          type: "image/jpeg",
        });
        resolve(watermarkedFile);
      }, "image/jpeg");
    };

    img.src = URL.createObjectURL(imageFile);
  });
};
