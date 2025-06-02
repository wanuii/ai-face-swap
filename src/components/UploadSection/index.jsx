import { useState } from "react";
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
  const [currentType, setCurrentType] = useState(null);

  const [uploadBlocks, setUploadBlocks] = useState([
    {
      imageSrc: sample_1,
      blockType: "Portrait",
      onClick: () => setCurrentType("Portrait"),
    },
    {
      imageSrc: sample_2,
      blockType: "Swap",
      onClick: () => setCurrentType("Swap"),
    },
    {
      imageSrc: sample_3,
      blockType: "Result",
      onClick: () => setCurrentType("Result"),
    },
  ]);

  // ✅ 換臉函式：接收兩張圖，自行組 FormData 並呼叫 API
  const runSwap = async (portraitImage, swapImage) => {
    try {
      const formData = new FormData();

      // 根據後端要求：file1 = 模板，file2 = 使用者照
      formData.append("file1", await urlToFile(swapImage, "swap.jpg"));
      formData.append("file2", await urlToFile(portraitImage, "portrait.jpg"));

      const res = await swapFaceAPI(formData);
      if (!res.ok) throw new Error("換臉 API 回傳錯誤");
      const contentType = res.headers.get("Content-Type");
      if (!contentType?.includes("image")) {
        const err = await res.json();
        toast.error(err.error);
        return;
      }
      const blob = await res.blob();
      console.log("blob", blob);
      const outputUrl = URL.createObjectURL(blob);
      console.log("outputUrl", outputUrl);
      // ✅ 更新 Result 區塊
      setUploadBlocks((prev) =>
        prev.map((block) =>
          block.blockType === "Result"
            ? { ...block, imageSrc: outputUrl }
            : block
        )
      );
    } catch (err) {
      console.error("換臉失敗", err);
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
          {uploadBlocks.map((block, index) => (
            <ImageUploadBlock
              key={index}
              imageSrc={block.imageSrc}
              blockType={block.blockType}
              onViewClick={block.onClick}
            />
          ))}
        </div>
      </div>

      {/* 上傳 Modal */}
      <UploadDialog
        open={currentType === "Portrait" || currentType === "Swap"}
        onClose={() => setCurrentType(null)}
        blockType={currentType}
        onConfirm={(imageData) => {
          const isPortrait = currentType === "Portrait";
          const isSwap = currentType === "Swap";

          // ✅ 更新對應圖片區塊
          const updatedBlocks = uploadBlocks.map((block) =>
            block.blockType === currentType
              ? { ...block, imageSrc: imageData }
              : block
          );

          setUploadBlocks(updatedBlocks);
          setCurrentType(null);

          // ✅ 呼叫換臉（圖片順序：portrait 是使用者照、swap 是模板）
          const portraitImage = isPortrait
            ? imageData
            : uploadBlocks.find((b) => b.blockType === "Portrait")?.imageSrc;
          const swapImage = isSwap
            ? imageData
            : uploadBlocks.find((b) => b.blockType === "Swap")?.imageSrc;
          // ✅ 換臉觸發邏輯：確認兩張圖都有，就執行
          if (portraitImage && swapImage) {
            runSwap(portraitImage, swapImage);
          }
        }}
      />

      {/* 查看結果 Modal */}
      <ResultDialog
        open={currentType === "Result"}
        onClose={() => setCurrentType(null)}
        imageSrc={{
          resultImage: uploadBlocks.find((b) => b.blockType === "Result")
            ?.imageSrc,
          swapImage: uploadBlocks.find((b) => b.blockType === "Swap")?.imageSrc,
        }}
      />
      <Toaster position="top-center" />
    </>
  );
}

export default Index;
