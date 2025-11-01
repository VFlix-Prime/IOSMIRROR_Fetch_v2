import { RequestHandler } from "express";

interface NetflixAPIResponse {
  title: string;
  year: number | string;
  lang: Array<{ l: string } | string>;
  episodes?: any[];
  season?: string;
}

interface NetflixResponse {
  title: string;
  year: string;
  languages: string;
  category: "Movie" | "Series";
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

    const jsonData: NetflixAPIResponse = await response.json();

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

    const result: NetflixResponse = {
      title: jsonData.title || "Unknown",
      year: (jsonData.year || "Unknown").toString(),
      languages: languages || "Unknown",
      category,
    };

    res.json(result);
  } catch (error) {
    console.error("Netflix API error:", error);
    res.status(500).json({ error: "Failed to fetch data. Please try again." });
  }
};
