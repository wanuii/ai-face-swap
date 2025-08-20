import { useState, useRef } from "react";
import { toast } from "sonner";
import { Modal, Upload, Button, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { usePreviewUrl } from "@/hooks/usePreviewUrl";
import { useFaceTemplate } from "@/hooks/useFaceTemplate";
import { useImagePreloader } from "@/hooks/useImagePreloader";

const { Dragger } = Upload;
const UploadDialog = ({ open, onClose, onConfirm }) => {
  const confirmLockRef = useRef(false); // 是否正在處理中
  const { previewUrl, selectedFile, handleFileSelect, handleReset } =
    usePreviewUrl();
  const faceList = useFaceTemplate(); // 使用共用模板 hook
  const templateReady = useImagePreloader(faceList);

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
        // 使用者「上傳圖片」，類型為 File
        onConfirm(selectedFile); // 傳 File 給 Index
        handleReset(); // 清掉預覽並關閉 Dialog
      } else if (selectedTemplateUrl) {
        // 使用者選擇模板圖片
        // selectedTemplateUrl 是圖片的 URL 字串（例如 https://images.pexels.com/photo.jpg）
        fetch(selectedTemplateUrl)
          // 用 fetch(url) 取得圖片的 blob 資料
          .then((res) => res.blob())
          .then((blob) => {
            // 再用 new File([blob], ...) 包成一個合法的 File 物件
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
    name: "file", // 表單欄位名
    multiple: false, // 禁止多選
    showUploadList: false, // 不顯示上傳列表
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toast.error("只能上傳圖片檔案");
        return false; // 阻止自動上傳
      }
      handleFileSelect(file); // 自行處理 file 存取與預覽
      setSelectedTemplateUrl(null); // 上傳後取消模板圖
      return false; // 阻止內建自動上傳行為（改用自訂邏輯）
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
            <Spin
              spinning={!templateReady}
              tip="圖片載入中..."
              wrapperClassName={
                !templateReady ? "spin-mask upload-spin-mask" : ""
              }
            >
              <div className="template-grid">
                {faceList.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`face-${i}`}
                    className={`template-image ${
                      selectedTemplateUrl === img ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedTemplateUrl(img);
                      handleReset(); // ✅ 點選模板就清除上傳圖預覽
                    }}
                  />
                ))}
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDialog;
