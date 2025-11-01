import { RequestHandler } from "express";

interface NetflixAPIResponse {
  status: string;
  title: string;
  year: string;
  d_lang: string;
  type: string;
  runtime: string;
  match: string;
  hdsd: string;
  genre: string;
  cast: string;
  short_cast: string;
  creator: string;
  director: string;
  writer: string;
  desc: string;
  m_desc: string;
  m_reason: string;
  ua: string;
  thismovieis: string;
  season?: Array<{
    s: string;
    id: string;
    ep: string;
    sele: string;
  }>;
  oin?: string;
}

interface NetflixResponse {
  title: string;
  year: string;
  language: string;
  category: "Movie" | "Series";
  genre: string;
  cast: string;
  description: string;
  rating: string;
  match: string;
  runtime: string;
  quality: string;
  creator?: string;
  director?: string;
  seasons?: number;
  contentWarning?: string;
}

export const handleNetflix: RequestHandler = async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid ID" });
  }

  try {
    const response = await fetch(`https://net20.cc/post.php?id=${encodeURIComponent(id)}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from Netflix API" });
    }

    let jsonData: any;
    try {
      jsonData = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return res.status(500).json({ error: "Invalid response format from API" });
    }

    // Check if we have valid data (status should be "y" or data should have title)
    if (!jsonData || (!jsonData.title && jsonData.status !== "y")) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Determine if it's a movie or series based on season array
    const isSeriesData = Array.isArray(jsonData.season) && jsonData.season.length > 0;
    const category = isSeriesData ? "Series" : "Movie";

    // Parse genre - it comes as HTML encoded string
    const genre = jsonData.genre
      ? jsonData.genre.replace(/&amp;/g, "&").replace(/&quot;/g, '"')
      : "Unknown";

    // Get first cast member or use short_cast
    const castList = jsonData.short_cast || jsonData.cast || "Unknown";

    const result: NetflixResponse = {
      title: jsonData.title || "Unknown",
      year: jsonData.year || "Unknown",
      language: jsonData.d_lang || "Unknown",
      category,
      genre,
      cast: castList,
      description: jsonData.desc || "No description available",
      rating: jsonData.ua || "Not rated",
      match: jsonData.match || "N/A",
      runtime: jsonData.runtime || "Unknown",
      quality: jsonData.hdsd || "Unknown",
      creator: jsonData.creator || undefined,
      director: jsonData.director || undefined,
      seasons: isSeriesData ? jsonData.season?.length : undefined,
      contentWarning: jsonData.m_reason || undefined,
    };

    res.json(result);
  } catch (error) {
    console.error("Netflix API error:", error);
    res.status(500).json({ error: "Failed to fetch data. Please try again." });
  }
};
