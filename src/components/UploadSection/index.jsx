import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Image from "@/assets/bg_img.webp";
import sample_1 from "@/assets/sample_1.webp";
import sample_2 from "@/assets/sample_2.webp";
import sample_3 from "@/assets/sample_3.webp";
import { swapFaceAPI } from "@/api/swap";
import { usePreviewUrl } from "@/hooks/usePreviewUrl"; // Hook 用來產生預覽網址
import { useFaceTemplate } from "@/hooks/useFaceTemplate";
import { preloadImages } from "@/utils/image";
import ImageUploadBlock from "./ImageUploadBlock";
import UploadDialog from "./UploadDialog";
import ResultDialog from "./ResultDialog";

// 工具函式：將 URL 轉成 File
const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

function Index() {
  const [isLoading, setIsLoading] = useState(false); // 控制 loading 效果
  const [currentType, setCurrentType] = useState(null); // 控制目前開啟的對話框類型
  const requestIdRef = useRef(0); // 防止多次呼叫 API 時結果覆蓋錯誤
  // 傳給子層的 currentId
  const currentRequestId = requestIdRef.current;
  // Hook 處理結果圖預覽
  const {
    // previewUrl: resultPreviewUrl,
    selectedFile: resultFile, // 取得實際的 File
    handleFileSelect: setResultPreviewFile,
    handleReset: clearResultPreview,
  } = usePreviewUrl();

  // Hook 處理原圖預覽
  const {
    previewUrl: swapPreviewUrl,
    handleFileSelect: setSwapPreviewFile,
    handleReset: clearSwapPreview,
  } = usePreviewUrl();

  // 儲存目前所有圖片（預設為 sample）
  const [uploadBlocks, setUploadBlocks] = useState({
    Portrait: sample_1,
    Swap: sample_2,
    Result: sample_3,
  });

  const faceList = useFaceTemplate();
  // 所有模板圖片載入一次，等使用者開啟 UploadDialog 時，不用再重載圖片
  useEffect(() => {
    const preload = (url) => {
      // 防止 undefined 被 preload
      if (!url) return;
      // 手動建立圖片元素，但不插入到 DOM 中
      const img = new window.Image();
      img.src = url;
    };
    // 事先讓瀏覽器載入一次每張模板圖 ➜ 瀏覽器會把它快取下來
    faceList.forEach((item) => preload(item.url));
  }, [faceList]);

  useEffect(() => {
    preloadImages(faceList); // 預先載入所有模板圖片
    // 載入初始三張圖片並建立 preview
    (async () => {
      const portraitFile = await urlToFile(sample_1, "sample_1.webp");
      const swapFile = await urlToFile(sample_2, "sample_2.webp");
      const resultFile = await urlToFile(sample_3, "sample_3.webp");

      setUploadBlocks({
        Portrait: portraitFile,
        Swap: swapFile,
        Result: resultFile,
      });
      // 一開始就產生原圖與結果圖的預覽網址
      setSwapPreviewFile(swapFile);
      setResultPreviewFile(resultFile);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 在換臉超過一定時間時提示
  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        toast.warning("處理時間過長，建議更換圖片或重新整理");
      }, 60000); // 60 秒提示
    }
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // 呼叫換臉 API 並處理結果圖
  const runSwap = async (portraitFile, swapFile) => {
    // 用 thisRequestId 來追蹤這筆請求是不是最新的那一筆
    const thisRequestId = ++requestIdRef.current;
    setIsLoading(true);
    // 清掉舊的結果 preview（避免記憶體浪費 & 準備放新圖）
    clearResultPreview();
    try {
      const formData = new FormData();
      formData.append("file1", swapFile);
      formData.append("file2", portraitFile);

      const res = await swapFaceAPI(formData);
      const contentType = res.headers["content-type"];
      if (!contentType?.includes("image")) {
        toast.error("辨識失敗，請嘗試其他圖片");
        return;
      }
      // 從 API 回傳的 res.data 是 Blob 格式
      // 用 new Blob([...]) 封裝，再轉成 File（這樣方便統一管理格式）
      const blob = new Blob([res.data], { type: contentType });
      const file = new File([blob], "result.jpg", { type: blob.type });

      // 更新 preview hook
      // 傳入自訂的 usePreviewUrl() 裡的 setResultPreviewFile() → 建立預覽網址顯示在 UI
      await setResultPreviewFile(file);
      if (thisRequestId === requestIdRef.current) {
        setUploadBlocks((prev) => ({ ...prev, Result: file }));
        setIsLoading(false); // 圖片載入完成才結束 loading
        toast.success("換臉完成！");
      }
    } catch (err) {
      console.error("換臉失敗", err);
      toast.error("換臉 API 回傳錯誤");
    }
  };

  // 使用者在 UploadDialog 中確認上傳圖片
  const handleUploadConfirm = async (imageFile) => {
    // imageFile 是 File 類型
    const type = currentType; // 先保存 Dialog 類型
    setCurrentType(null); // 關閉 Dialog

    if (!type) return;
    // 換新圖前，清除舊預覽
    if (type === "Swap") clearSwapPreview();
    // 為了避免因圖片改變，API重新觸發，先清掉結果
    if (type === "Portrait") clearResultPreview();
    // 把剛剛上傳的圖檔 imageFile 更新進 uploadBlocks 內對應位置
    const updated = { ...uploadBlocks, [type]: imageFile };
    // 使用 props 把更新圖片傳給 ImageUploadBlock( File 類型 ) ，達成畫面同步更新
    setUploadBlocks(updated);
    if (type === "Swap") {
      // 原圖會顯示在結果頁，需要呼叫 usePreviewUrl 中的 handleFileSelect 來產生 preview
      setSwapPreviewFile(imageFile);
    }

    const portraitFile = type === "Portrait" ? imageFile : updated.Portrait;
    const swapFile = type === "Swap" ? imageFile : updated.Swap;

    if (portraitFile && swapFile) {
      await runSwap(portraitFile, swapFile);
    }
  };

  return (
    <>
      <div
        id="upload-section"
        className="bg-cover w-full min-h-screen flex justify-center items-center overflow-x-hidden"
        style={{ backgroundImage: `url(${Image})` }}
      >
        <div className="flex flex-col md:flex-row lg:gap-10 md:gap-4 gap-10 items-center py-10">
          {Object.entries(uploadBlocks).map(([type, src]) => (
            <ImageUploadBlock
              key={type}
              imageSrc={src}
              blockType={type}
              onViewClick={() => setCurrentType(type)}
              loading={type === "Result" && isLoading}
              loadingKey={type === "Result" ? currentRequestId : null}
            />
          ))}
        </div>
      </div>

      <UploadDialog
        open={currentType === "Portrait" || currentType === "Swap"}
        onClose={() => setCurrentType(null)}
        onConfirm={handleUploadConfirm}
      />
      <ResultDialog
        open={currentType === "Result"}
        onClose={() => setCurrentType(null)}
        imageSrc={{
          resultImage: resultFile, // File 物件
          swapImage: swapPreviewUrl, // 字串 URL
        }}
      />
    </>
  );
}

export default Index;
