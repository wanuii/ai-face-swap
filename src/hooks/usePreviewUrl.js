// 用途：將 File 物件轉換為圖片預覽網址（Object URL）
// 功能：提供 previewUrl 給 <img src="..."> 使用，當 File 變動時自動生成新的網址，並自動釋放舊的網址以節省記憶體。
import { useEffect, useState } from "react";

export function usePreviewUrl(initialFile = null) {
  const [previewUrl, setPreviewUrl] = useState(() =>
    initialFile ? URL.createObjectURL(initialFile) : null
  );
  const [selectedFile, setSelectedFile] = useState(initialFile);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return {
    previewUrl,
    selectedFile,
    handleFileSelect,
    handleReset,
  };
}
