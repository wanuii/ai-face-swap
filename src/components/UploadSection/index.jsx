import Image from "@/assets/bg_img.webp";
import sample_1 from "@/assets/sample_1.webp";
import sample_2 from "@/assets/sample_2.webp";
import sample_3 from "@/assets/sample_3.webp";
import ImageUploadBlock from "./ImageUploadBlock"; // 圖片區塊
import UploadDialog from "./UploadDialog"; // 圖片上傳 Modal
import ResultDialog from "./ResultDialog"; // 察看結果 Modal
import { useState } from "react";

function Index() {
  const [currentType, setCurrentType] = useState(null); // null 表示 Dialog 沒打開

  const [uploadBlocks, setUploadBlocks] = useState([
    {
      imageSrc: sample_1,
      blockType: "Portrait",
      onClick: () => {
        setCurrentType("Portrait");
      },
    },
    {
      imageSrc: sample_2,
      blockType: "Swap",
      onClick: () => {
        setCurrentType("Swap");
      },
    },
    {
      imageSrc: sample_3,
      blockType: "Result",
      onClick: () => {
        setCurrentType("Result");
      },
    },
  ]);
  const swapImage = uploadBlocks.find(b => b.blockType === "Swap")?.imageSrc;
  const resultImage = uploadBlocks.find(b => b.blockType === "Result")?.imageSrc;

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
      <UploadDialog
        open={currentType === "Portrait" || currentType === "Swap"}
        onClose={() => setCurrentType(null)}
        onConfirm={(imageData) => {
          setUploadBlocks((prev) =>
            prev.map((block) =>
              block.blockType === currentType
                ? { ...block, imageSrc: imageData } // ✅ 更新對應 block
                : block
            )
          );
          setCurrentType(null); // 關閉 Modal
        }}
        blockType={currentType}
      />
      <ResultDialog
        open={currentType === "Result"}
        onClose={() => setCurrentType(null)}
        imageSrc={{ resultImage, swapImage }}
      />
    </>
  );
}

export default Index;
