import axios from "axios";

const isProd = import.meta.env.MODE === "production";

export const axiosInstance = axios.create({
  baseURL: isProd
    ? "/api/swap-face/process-images"
    : import.meta.env.VITE_API_BASE,
  responseType: "blob",
});
