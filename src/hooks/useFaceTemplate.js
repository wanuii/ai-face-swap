// 用途：讀取所有模板圖片的網址清單
// 功能：使用 import.meta.glob() 讀取 /assets/templates/*.jpg 中的所有圖片路徑，並回傳圖片清單，給模板選擇器顯示。
export const useFaceTemplate = () => {
    const faceImages = import.meta.glob("@/assets/templates/*.jpg", { eager: true });
    const faceList = Object.values(faceImages).map((img) => img.default);
    return faceList;
  };