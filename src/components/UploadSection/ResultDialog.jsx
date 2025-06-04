import { Modal, Button } from "antd";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { downloadImage } from "@/utils/downloadImage";
const ResultDialog = ({ open, onClose, imageSrc }) => {
  const imageList = [
    { src: imageSrc.swapImage.url, alt: "原圖" },
    { src: imageSrc.resultImage.url, alt: "結果圖片" },
  ];

  const handleDownload = async () => {
    if (!imageSrc.resultImage?.file) return;

    const fileWithWatermark = await downloadImage(imageSrc.resultImage.file);
    const url = URL.createObjectURL(fileWithWatermark);

    const link = document.createElement("a");
    link.href = url;
    link.download = "face_swap_result.jpg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={730}
      className="custom-result-modal"
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
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-white text-xl" />
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://your-image-or-page-url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="text-white text-xl" />
            </a>
            <a
              href="https://twitter.com/intent/tweet?url=https://your-image-or-page-url&text=快來看看這張AI換臉圖！"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-white text-xl" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResultDialog;
