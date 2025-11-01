import { RequestHandler } from "express";
import { getTHash } from "./cookie";

interface AmazonPrimeAPIResponse {
  title: string;
  year: number | string;
  lang: Array<{ l: string } | string>;
  episodes?: any[];
  season?: string;
}

interface AmazonPrimeResponse {
  title: string;
  year: string;
  languages: string;
  category: "Movie" | "Series";
}

export const handleAmazonPrime: RequestHandler = async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid ID" });
  }

  try {
    // TODO: Replace with actual Amazon Prime API endpoint
    const apiEndpoint = `https://api.example.com/amazon-prime?id=${encodeURIComponent(id)}`;
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from Amazon Prime API" });
    }

    const jsonData: AmazonPrimeAPIResponse = await response.json();

    // Extract data from response
    const episodes = jsonData.episodes || [];
    const season = jsonData.season;

    // Determine if it's a movie or series
    const category =
      !episodes || (Array.isArray(episodes) && episodes[0] === null) || !season
        ? "Movie"
        : "Series";

    // Extract and format languages
    const languagesArray = jsonData.lang || [];
    const languages = Array.isArray(languagesArray)
      ? languagesArray.map((lang) => (typeof lang === "string" ? lang : lang.l || lang)).join(", ")
      : "";

    const result: AmazonPrimeResponse = {
      title: jsonData.title || "Unknown",
      year: (jsonData.year || "Unknown").toString(),
      languages: languages || "Unknown",
      category,
    };

    res.json(result);
  } catch (error) {
    console.error("Amazon Prime API error:", error);
    res.status(500).json({ error: "Failed to fetch data. Please try again." });
  }
};
