import { Buffer } from "buffer";
import { parse } from "url";

export default async function handler(req, res) {
  console.log("🔥 [swap-face] Handler triggered");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  const BACKEND_BASE_URL = process.env.SWAP_API_BASE_URL;

  try {
    const { pathname } = parse(req.url);
    const backendPath = pathname.replace(/^\/api\/swap-face/, "");
    const targetUrl = `${BACKEND_BASE_URL}${backendPath}`;

    console.log("➡️ Proxying to:", targetUrl);

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"],
      },
      body: req.body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Backend responded with error:", text);
      return res.status(500).json({ error: "Backend failed", message: text });
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", "inline; filename=swapped.jpg");
    res.send(Buffer.from(buffer));

    console.log("✅ Image response sent back to frontend");
  } catch (err) {
    console.error("🔥 Proxy exception:", err);
    res.status(500).json({ error: "Proxy exception", message: err.message });
  }
}
