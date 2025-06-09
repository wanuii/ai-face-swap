import { Modal, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import { usePreviewUrl } from "@/hooks/usePreviewUrl";
import { useFaceTemplate } from "@/hooks/useFaceTemplate";
import { toast } from "sonner";

const { Dragger } = Upload;
function UploadDialog({ open, onClose, onConfirm }) {
  const confirmLockRef = useRef(false); // 是否正在處理中
  const { previewUrl, selectedFile, handleFileSelect, handleReset } =
    usePreviewUrl();
  const faceList = useFaceTemplate(); // 使用共用模板 hook

  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState(null); // 記住被選的模板圖

  const handleClose = () => {
    handleReset();
    setSelectedTemplateUrl(null);
    onClose();
  };

  const handleConfirm = () => {
    if (confirmLockRef.current) return; // 阻止重複點擊
    confirmLockRef.current = true;
    try {
      if (selectedFile) {
        onConfirm(selectedFile); // ✅ 執行換圖
        handleReset(); // ✅ 關 Dialog
      } else if (selectedTemplateUrl) {
        fetch(selectedTemplateUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "template.jpg", { type: blob.type });
            onConfirm(file);
            setSelectedTemplateUrl(null);
          });
      } else {
        toast.error("請先上傳圖片或選擇模板");
      }
    } finally {
      setTimeout(() => {
        confirmLockRef.current = false; // 解鎖（過 1 秒才可再次點擊）
      }, 1000);
    }
  };

  const draggerProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.error("只能上傳圖片檔案");
        return false;
      }
      handleFileSelect(file);
      setSelectedTemplateUrl(null); // 上傳後取消模板圖
      return false;
    },
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
    >
      <div className="flex sm:flex-row flex-col">
        {/* 左：預覽區 */}
        <div className="sm:w-1/2 flex flex-col items-center gap-5">
          <p className="text-xl">File Upload</p>
          <div className="w-full h-full max-w-[300px] max-h-[300px] mx-auto gap-5 flex flex-col items-center justify-center">
            <Dragger
              {...draggerProps}
              className="w-[250px] h-[250px] bg-gray-50"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="預覽圖"
                  className="w-[220px] h-[195px] object-contain pointer-events-none"
                />
              ) : selectedTemplateUrl ? (
                <img
                  src={selectedTemplateUrl}
                  alt="模板預覽"
                  className="w-[220px] h-[195px] object-contain pointer-events-none"
                />
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text text-sm text-gray-600">
                    點擊或拖曳圖片到這裡上傳
                  </p>
                </div>
              )}
            </Dragger>
            <Button
              type="primary"
              className="h-14 w-[250px]"
              onClick={handleConfirm}
            >
              確定
            </Button>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="hidden sm:block w-px bg-gray-300 mx-2" />
        <div className="block sm:hidden h-px bg-gray-300 my-4 w-full" />

        {/* 右：模板選擇區 */}
        <div className="sm:w-1/2 pl-2">
          <p className="text-xl">選擇模板</p>
          <div className="w-full bg-slate-100 rounded-md mt-5 p-2">
            <p>模板圖片來自 Pexels ，僅供測試</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 p-1 place-items-center gap-2 mt-2 max-h-[270px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {faceList.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`face-${i}`}
                  className={`w-[85px] h-[85px] object-cover rounded-sm cursor-pointer hover:scale-105 transition ${
                    selectedTemplateUrl === img ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => {
                    setSelectedTemplateUrl(img);
                    handleReset(); // ✅ 點選模板就清除上傳圖預覽
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UploadDialog;
