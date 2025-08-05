import { axiosInstance } from "./axios";

export const swapFaceAPI = (formData) => {
  return axiosInstance.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
