import { Buffer } from "buffer";
import { parse } from "url";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  const BACKEND_BASE_URL = process.env.SWAP_API_BASE_URL;

  try {
    const { pathname } = parse(req.url);
    const backendPath = pathname.replace(/^\/api\/swap-face/, "");

    const targetUrl = `${BACKEND_BASE_URL}${backendPath}`;
    console.log("🧪 Proxying to:", targetUrl);

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"],
      },
      body: req.body,
    });

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", "inline; filename=swapped.jpg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("🔥 Proxy error:", err.message);
    res.status(500).json({ error: "Proxy failed", message: err.message });
  }
}
