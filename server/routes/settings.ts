import { RequestHandler } from "express";
import { getSettings, setSettings } from "../utils/settings";

export const handleGetSettings: RequestHandler = (_req, res) => {
  const settings = getSettings();
  res.status(200).json({ success: true, settings });
};

export const handleUpdateSettings: RequestHandler = (req, res) => {
  const { defaultBaseFolder } = req.body || {};
  if (typeof defaultBaseFolder !== "string" || defaultBaseFolder.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "defaultBaseFolder is required" });
  }

  const saved = setSettings({ defaultBaseFolder });
  res.status(200).json({ success: true, settings: saved });
};
