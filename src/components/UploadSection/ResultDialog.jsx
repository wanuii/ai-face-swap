import { Modal, Button } from "antd";
import { downloadImage } from "@/utils/downloadImage";
import { useAutoPreviewUrl } from "@/hooks/useAutoPreviewUrl";
import ShareButtons from "@/components/ShareButtons";
import { toast } from "sonner";

const ResultDialog = ({ open, onClose, imageSrc }) => {
  const swapPreview = useAutoPreviewUrl(imageSrc?.swapImage);
  const resultPreview = useAutoPreviewUrl(imageSrc?.resultImage);
  const imageList = [
    { src: swapPreview?.previewUrl ?? null, alt: "原圖" },
    { src: resultPreview?.previewUrl ?? null, alt: "結果圖片" },
  ];
  const handleDownload = async () => {
    if (!resultPreview?.file) return;

    try {
      const watermarked = await downloadImage(resultPreview.file);
      const url = URL.createObjectURL(watermarked);

      // 嘗試使用 a.download 下載
      const link = document.createElement("a");
      link.href = url;
      link.download = "AI_Face_Swap.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 撤銷 Blob URL
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("下載失敗，嘗試打開新視窗作為備案", error);
      // fallback：打開新頁面讓使用者長按另存圖片
      const fallbackUrl = URL.createObjectURL(resultPreview.file);
      window.open(fallbackUrl, "_blank");
      toast.info(
        "⚠️ 您的瀏覽器不支援自動下載，請在新頁面長按圖片並選擇「儲存圖片」。"
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={730}
      className="custom-result-modal"
      centered
    >
      <div className="flex flex-col justify-center items-center sm:flex-row gap-5 my-8">
        {imageList.map((item, index) => (
          <div
            key={index}
            className="w-[250px] h-[250px] flex items-center justify-center border-4 border-white"
          >
            {item.src ? (
              <img
                src={item.src}
                alt={item.alt}
                className="w-auto h-full object-contain"
              />
            ) : (
              <span className="text-gray-500">無預覽圖片</span>
            )}
          </div>
        ))}

        <div className="flex flex-col justify-between mx-5">
          <div className="flex flex-col justify-center items-center h-[200px]">
            <p>完成!!</p>
            <p>AI 換臉</p>
          </div>
          <Button
            type="primary"
            className="h-11 w-24 rounded-full"
            onClick={handleDownload}
          >
            下載
          </Button>
          <div className="flex gap-4 mt-4">
            <ShareButtons color="text-white" message="快來看看這張AI換臉圖！" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResultDialog;
