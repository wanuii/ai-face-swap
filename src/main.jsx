import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "sonner";
import "./index.css"; // 或 './App.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" />
  </StrictMode>
);

window.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none"; // ✅ 把載入中的畫面隱藏
  }
});
