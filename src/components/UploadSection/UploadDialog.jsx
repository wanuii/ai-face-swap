import { Modal, Upload, message, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Dragger } = Upload;

function UploadDialog({ open, onClose, blockType, onConfirm }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleClose = () => {
    setPreviewUrl(null); // 清空圖片
    onClose();
  };
  const handleConfirm = () => {
    if (previewUrl) {
      onConfirm(previewUrl); // ✅ 把圖片送出給父元件
      setPreviewUrl(null); // 清除預覽（可選）
    } else {
      message.warning("請先上傳圖片");
    }
  };
  const draggerProps = {
    name: "file",
    multiple: false,
    showUploadList: false, // ❗️不顯示底下檔案列表
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("只能上傳圖片檔案");
        return false;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result); // ✅ 顯示 base64 預覽
      };
      reader.readAsDataURL(file);
      return false; // ❗️阻止自動上傳
    },
    onDrop(e) {
      console.log("拖曳檔案：", e.dataTransfer.files);
    },
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={800}>
      <div className="flex sm:flex-row flex-col">
        {/* 左側：上傳區塊 */}
        <div className="sm:w-1/2 flex flex-col items-center gap-5">
          <p className="text-xl">File Upload</p>
          <div className="w-full h-full max-w-[300px] max-h-[300px] mx-auto gap-5 flex flex-col">
            <Dragger
              {...draggerProps}
              className="w-[300px] h-[240px] p-0 flex items-center justify-center bg-gray-50"
            >
              {previewUrl ? (
                <div className="w-[260px] h-[200px] flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="預覽圖"
                    className="w-auto h-full object-contain pointer-events-none"
                  />
                </div>
              ) : (
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">點擊或拖曳圖片到這裡上傳</p>
                </>
              )}
            </Dragger>
            <Button type="primary" className="h-14" onClick={handleConfirm}>
              確定
            </Button>
          </div>
        </div>
        {/* 中線 */}
        {/* 垂直線：只在寬螢幕顯示 */}
        <div className="hidden sm:block w-px bg-gray-300 mx-2" />
        {/* 水平線：只在窄螢幕顯示 */}
        <div className="block sm:hidden h-px bg-gray-300 my-4 w-full" />
        {/* 右側：預留說明或其他設定 */}
        <div className="sm:w-1/2 pl-2">
          <p className="text-xl">選擇模板</p>
        </div>
      </div>
    </Modal>
  );
}

export default UploadDialog;
