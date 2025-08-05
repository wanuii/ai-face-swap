import { Buffer } from "buffer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST is allowed" });
  }

  const BACKEND_BASE_URL = process.env.SWAP_API_BASE_URL;

  try {
    const targetUrl = `${BACKEND_BASE_URL}/process-images/`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"],
      },
      body: req,
      duplex: "half",
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: "Backend failed", message: text });
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", message: err.message });
  }
}
