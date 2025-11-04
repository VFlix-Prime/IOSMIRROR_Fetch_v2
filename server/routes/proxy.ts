import { RequestHandler } from "express";
import { getPrimeToken } from "./cookie";

const PROXY_BASE_URL = "https://iosmirror.vflix.life/api/stream-proxy";
const NETFLIX_BASE_URL = "https://net51.cc/hls";
const DEFAULT_REFERER = "https://net51.cc";

export const handleProxy: RequestHandler = async (req, res) => {
  try {
    const { service, id } = req.query;

    // Validate inputs
    if (!service || !id) {
      return res.status(400).json({
        success: false,
        error: "Missing service or id parameter. Usage: /api/proxy?service=netflix&id=70270776",
      });
    }

    // Construct the target URL based on service
    let targetUrl: string;

    if (service === "netflix") {
      targetUrl = `${NETFLIX_BASE_URL}/${id}.m3u8`;
    } else {
      return res.status(400).json({
        success: false,
        error: `Unsupported service: ${service}. Currently supported: netflix`,
      });
    }

    // Get the prime token (contains 'in=...' format)
    const primeToken = await getPrimeToken();
    if (!primeToken) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch prime token",
      });
    }

    // Construct the referer header value
    const referer = req.query.referer || DEFAULT_REFERER;

    // Build the full proxy URL
    const encodedUrl = encodeURIComponent(
      `${targetUrl}?${primeToken}&referer=${encodeURIComponent(String(referer))}`,
    );
    const proxyUrl = `${PROXY_BASE_URL}?url=${encodedUrl}`;

    res.json({
      success: true,
      proxyUrl,
      targetUrl,
      primeToken,
      referer,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate proxy URL",
    });
  }
};
