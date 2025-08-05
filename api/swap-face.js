import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  const BACKEND_BASE_URL = process.env.SWAP_API_BASE_URL; // 不要有 / 結尾

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/process-images/`, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"], // 保持原 multipart
      },
      body: req.body,
    });

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("代理錯誤", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
