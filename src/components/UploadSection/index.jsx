import { useState, useRef, useEffect } from "react";
import Image from "@/assets/bg_img.webp";
import sample_1 from "@/assets/sample_1.webp";
import sample_2 from "@/assets/sample_2.webp";
import sample_3 from "@/assets/sample_3.webp";
import ImageUploadBlock from "./ImageUploadBlock";
import UploadDialog from "./UploadDialog";
import ResultDialog from "./ResultDialog";
import { swapFaceAPI } from "@/api/swap";
import { toast } from "sonner";
import { usePreviewUrl } from "@/hooks/usePreviewUrl"; // Hook 用來產生預覽網址
import { preloadImages } from "@/utils/image";
import { useFaceTemplate } from "@/hooks/useFaceTemplate";

// 工具函式：將 URL 轉成 File
const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

function Index() {
  const faceList = useFaceTemplate();
  const [isLoading, setIsLoading] = useState(false); // 控制 loading 效果
  const [currentType, setCurrentType] = useState(null); // 控制目前開啟的對話框類型
  const requestIdRef = useRef(0); // 防止多次呼叫 API 時結果覆蓋錯誤

  // Hook 處理結果圖預覽
  const {
    previewUrl: resultPreviewUrl,
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

  useEffect(() => {
    preloadImages(faceList); // ✅ 提前預載所有 template 圖片

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

  // 呼叫換臉 API 並處理結果圖
  const runSwap = async (portraitFile, swapFile) => {
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

      const blob = new Blob([res.data], { type: contentType });
      const file = new File([blob], "result.jpg", { type: blob.type });

      // 更新 preview hook
      setResultPreviewFile(file);

      if (thisRequestId === requestIdRef.current) {
        setUploadBlocks((prev) => ({ ...prev, Result: file }));
        setIsLoading(false);
      }
    } catch (err) {
      console.error("換臉失敗", err);
      toast.error("換臉 API 回傳錯誤");
    }
  };

  // 使用者在 UploadDialog 中確認上傳圖片
  const handleUploadConfirm = (imageFile) => {
    if (!currentType) return;
    // 換新圖前，清除舊預覽
    if (currentType === "Swap") clearSwapPreview();
    if (currentType === "Portrait") clearResultPreview(); // 為了避免因圖片改變，API重新觸發，先清掉結果
    const updated = { ...uploadBlocks, [currentType]: imageFile };
    setUploadBlocks(updated);
    setCurrentType(null);

    // 若是原圖，就同步更新 preview
    if (currentType === "Swap") {
      setSwapPreviewFile(imageFile);
    }

    const portraitFile =
      currentType === "Portrait" ? imageFile : updated.Portrait;
    const swapFile = currentType === "Swap" ? imageFile : updated.Swap;

    if (portraitFile && swapFile) {
      runSwap(portraitFile, swapFile);
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
            />
          ))}
        </div>
      </div>

      <UploadDialog
        open={currentType === "Portrait" || currentType === "Swap"}
        onClose={() => setCurrentType(null)}
        blockType={currentType}
        onConfirm={handleUploadConfirm}
      />

      <ResultDialog
        open={currentType === "Result"}
        onClose={() => {
          setCurrentType(null);
        }}
        imageSrc={{
          resultImage: {
            file: resultFile, // 原始 File
            url: resultPreviewUrl, // 預覽網址
          },
          swapImage: {
            url: swapPreviewUrl,
          },
        }}
      />
    </>
  );
}

export default Index;
