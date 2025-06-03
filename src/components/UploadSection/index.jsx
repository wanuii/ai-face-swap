import { useState, useRef } from "react";
import Image from "@/assets/bg_img.webp";
import sample_1 from "@/assets/sample_1.webp";
import sample_2 from "@/assets/sample_2.webp";
import sample_3 from "@/assets/sample_3.webp";
import ImageUploadBlock from "./ImageUploadBlock";
import UploadDialog from "./UploadDialog";
import ResultDialog from "./ResultDialog";
import { swapFaceAPI } from "@/api/swap";
import { Toaster, toast } from "sonner";

// 用 fetch(url) 拿到圖片，轉為 blob，再建立 File 給後端
const urlToFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const requestIdRef = useRef(0);

  const [uploadBlocks, setUploadBlocks] = useState({
    Portrait: sample_1,
    Swap: sample_2,
    Result: sample_3,
  });

  // 換臉函式：接收兩張圖，組成 FormData 並呼叫 API
  const runSwap = async (portraitImage, swapImage) => {
    // 為每次換臉產生唯一 requestId，並保留這次的編號做後續比對。
    const thisRequestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const formData = new FormData();
      // 根據後端要求：file1 = 模板，file2 = 使用者照
      formData.append("file1", await urlToFile(swapImage, "swap.jpg"));
      formData.append("file2", await urlToFile(portraitImage, "portrait.jpg"));

      const res = await swapFaceAPI(formData);
      const contentType = res.headers["content-type"];
      if (!contentType?.includes("image")) {
        toast.error("回傳內容非圖片");
        return;
      }
      // if (!res.ok) toast.error("換臉 API 回傳錯誤");
      // // 已經有更新的請求正在處理，這筆結果作廢
      // if (thisRequestId !== requestIdRef.current) return;

      // const contentType = res.headers.get("Content-Type");
      // if (!contentType?.includes("image")) {
      //   const err = await res.json();
      //   toast.error(err.error);
      //   return;
      // }
      const blob = new Blob([res.data], { type: contentType });
      const outputUrl = URL.createObjectURL(blob);
      // const blob = await res.blob();
      // const outputUrl = URL.createObjectURL(blob);
      if (thisRequestId === requestIdRef.current) {
        setUploadBlocks((prev) => ({ ...prev, Result: outputUrl }));
        setIsLoading(false);
      }
    } catch (err) {
      console.error("換臉失敗", err);
      toast.error("換臉 API 回傳錯誤");
    }
  };
  // 處理上傳確認邏輯，統一管理更新與換臉執行
  const handleUploadConfirm = (imageData) => {
    if (!currentType) return;

    const updated = { ...uploadBlocks, [currentType]: imageData };
    setUploadBlocks(updated);
    setCurrentType(null);

    const portraitImage =
      currentType === "Portrait" ? imageData : updated.Portrait;
    const swapImage = currentType === "Swap" ? imageData : updated.Swap;

    if (portraitImage && swapImage) {
      runSwap(portraitImage, swapImage);
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
      {/* 上傳 Modal */}
      <UploadDialog
        open={currentType === "Portrait" || currentType === "Swap"}
        onClose={() => setCurrentType(null)}
        blockType={currentType}
        onConfirm={handleUploadConfirm}
      />
      {/* 查看結果 Modal */}
      <ResultDialog
        open={currentType === "Result"}
        onClose={() => setCurrentType(null)}
        imageSrc={{
          resultImage: uploadBlocks.Result,
          swapImage: uploadBlocks.Swap,
        }}
      />
      <Toaster position="top-center" />
    </>
  );
}

export default Index;
