import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Image from "@/assets/bg_img.webp";
import sample_1 from "@/assets/sample_1.webp";
import sample_2 from "@/assets/sample_2.webp";
import sample_3 from "@/assets/sample_3.webp";
import { swapFaceAPI } from "@/api/swap";
import { usePreviewUrl } from "@/hooks/usePreviewUrl"; // Hook 用來產生預覽網址
import { useFaceTemplate } from "@/hooks/useFaceTemplate";
import { useTimeoutWarning } from "@/hooks/useTimeoutWarning";
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
const preloadUrl = (url) => {
  if (url) {
    const img = new Image();
    img.src = url;
  }
};
const callSwapAndToFile = async (portraitFile, swapFile) => {
  const fd = new FormData();
  fd.append("file1", swapFile);
  fd.append("file2", portraitFile);
  const res = await swapFaceAPI(fd);
  const type = res.headers["content-type"];
  if (!type?.includes("image")) throw new Error("NOT_IMAGE");
  // 從 API 回傳的 res.data 是 Blob 格式
  // 用 new Blob([...]) 封裝，再轉成 File（這樣方便統一管理格式）
  const blob = new Blob([res.data], { type });
  return new File([blob], "result.jpg", { type: blob.type });
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(false); // 控制 loading 效果
  const [currentType, setCurrentType] = useState(null); // 控制目前開啟的對話框類型
  // 儲存目前所有圖片（預設為 sample）
  const [uploadBlocks, setUploadBlocks] = useState({
    Portrait: sample_1,
    Swap: sample_2,
    Result: sample_3,
  });

  const requestIdRef = useRef(0); // 防止多次呼叫 API 時結果覆蓋錯誤
  const currentRequestId = requestIdRef.current; // 傳給子層的 currentId
  // 所有模板圖片載入一次，等使用者開啟 UploadDialog 時，不用再重載圖片
  const initializedRef = useRef(false);

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

  const faceList = useFaceTemplate();

  const runSwap = async (portraitFile, swapFile) => {
    const thisId = ++requestIdRef.current;
    setIsLoading(true);
    clearResultPreview(); // 先清舊結果避免誤導

    try {
      const file = await callSwapAndToFile(portraitFile, swapFile);
      await setResultPreviewFile(file);

      if (thisId === requestIdRef.current) {
        setUploadBlocks((prev) => ({ ...prev, Result: file }));
        toast.success("換臉完成！");
      }
    } catch (e) {
      console.error("換臉失敗", e);
      toast.error(
        e?.message === "NOT_IMAGE"
          ? "辨識失敗，請嘗試其他圖片"
          : "換臉 API 回傳錯誤"
      );
    } finally {
      if (thisId === requestIdRef.current) setIsLoading(false);
    }
  };

  // 使用者在 UploadDialog 中確認上傳圖片
  const handleUploadConfirm = async (imageFile) => {
    // imageFile 是 File 類型
    const type = currentType; // 先保存 Dialog 類型
    setCurrentType(null); // 關閉 Dialog
    if (!type) return;

    // 更新當前方塊
    // 把剛剛上傳的圖檔 imageFile 更新進 uploadBlocks 內對應位置
    const nextBlocks = { ...uploadBlocks, [type]: imageFile };
    // 使用 props 把更新圖片傳給 ImageUploadBlock( File 類型 ) ，達成畫面同步更新
    setUploadBlocks(nextBlocks);

    // 預覽副作用收口
    if (type === "Swap") {
      clearSwapPreview();
      // 原圖會顯示在結果頁，需要呼叫 usePreviewUrl 中的 handleFileSelect 來產生 preview
      setSwapPreviewFile(imageFile);
    }
    if (type === "Portrait") {
      clearResultPreview();
    }

    const portraitFile = type === "Portrait" ? imageFile : nextBlocks.Portrait;
    const swapFile = type === "Swap" ? imageFile : nextBlocks.Swap;

    if (portraitFile && swapFile) await runSwap(portraitFile, swapFile);
  };

  // effect 1: 預載模板圖片
  useEffect(() => {
    faceList.forEach((item) => preloadUrl(item.url));
    preloadImages(faceList);
  }, [faceList]);

  // effect 2: 初始化 sample 圖片（只跑一次）
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      (async () => {
        const [portraitFile, swapFile, resultFile] = await Promise.all([
          urlToFile(sample_1, "sample_1.webp"),
          urlToFile(sample_2, "sample_2.webp"),
          urlToFile(sample_3, "sample_3.webp"),
        ]);
        setUploadBlocks({
          Portrait: portraitFile,
          Swap: swapFile,
          Result: resultFile,
        });
        setSwapPreviewFile(swapFile);
        setResultPreviewFile(resultFile);
      })();
    }
  }, [setResultPreviewFile, setSwapPreviewFile]);
  // 逾時提醒（60 秒）isLoading 為 true 時自動啟用
  useTimeoutWarning(isLoading, 90000, () => {
    toast.warning("處理時間過長，建議更換圖片或重新上傳");
  });

  return (
    <>
      <div
        id="upload-section"
        className="bg-cover w-full min-h-screen flex justify-center items-center overflow-x-hidden"
        style={{ backgroundImage: `url(${Image})` }}
      >
        <div className="flex flex-col md:flex-row lg:gap-10 md:gap-4 gap-10 items-center py-10">
          {/* 用 Object.entries(uploadBlocks) 把物件轉成陣列，讓每一個元素是 [key, value] */}
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
};

export default Index;
