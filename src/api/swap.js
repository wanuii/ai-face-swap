import { axiosInstance } from "./axios";

export const swapFaceAPI = (formData) => {
  return axiosInstance.post("/process-images/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};