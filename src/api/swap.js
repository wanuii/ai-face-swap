import { axiosInstance } from "./axios";

const isProd = import.meta.env.MODE === "production";

export const swapFaceAPI = (formData) => {
  const path = isProd ? "/" : "/process-images/";
  return axiosInstance.post(path, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
