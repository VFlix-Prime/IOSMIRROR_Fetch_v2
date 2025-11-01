import * as fs from "fs";
import * as path from "path";

export interface AppSettings {
  defaultBaseFolder: string;
}

const DATA_DIR = path.join(process.cwd(), "server", "data");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS: AppSettings = {
  defaultBaseFolder: path.join(process.cwd(), "OTT"),
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getSettings(): AppSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      // Basic shape validation and fallback
      if (
        parsed &&
        typeof parsed === "object" &&
        typeof parsed.defaultBaseFolder === "string" &&
        parsed.defaultBaseFolder.length > 0
      ) {
        return parsed as AppSettings;
      }
    }
  } catch (e) {
    // ignore and fall back to default
  }
  return { ...DEFAULT_SETTINGS };
}

export function setSettings(next: AppSettings): AppSettings {
  const toWrite: AppSettings = {
    defaultBaseFolder:
      next.defaultBaseFolder && next.defaultBaseFolder.trim().length > 0
        ? path.resolve(next.defaultBaseFolder.trim())
        : DEFAULT_SETTINGS.defaultBaseFolder,
  };
  ensureDataDir();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(toWrite, null, 2), "utf-8");
  return toWrite;
}
