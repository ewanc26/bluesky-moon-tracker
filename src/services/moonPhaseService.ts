import axios from "axios";
import { calculateMoonPhase } from "../core/localMoonCalc";
import type { MoonPhaseData, MoonPhaseSource } from "../types/moonPhase";

const TIMEOUT_MS = 10000;

// --- Skytime API ---

async function fetchSkytime(): Promise<MoonPhaseData | null> {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;

    const url = `https://skytime.live/api/v1/moon-phases?year=${year}&month=${month}`;
    console.log(`[Skytime] Fetching from: ${url}`);

    const response = await axios.get<any>(url, {
      timeout: TIMEOUT_MS,
      headers: { "User-Agent": "MoonPhaseBot/1.0" },
    });

    const data = response.data?.data;
    if (!data) {
      console.error("[Skytime] No data field in response");
      return null;
    }

    // Skytime returns an array of daily entries — find today
    const today = now.toISOString().slice(0, 10);
    const todayEntry = Array.isArray(data)
      ? data.find(
          (entry: any) => entry.date === today || entry.calendar_date === today,
        )
      : null;

    if (!todayEntry) {
      console.error("[Skytime] No entry for today in response");
      return null;
    }

    const phase = todayEntry.phase_name || todayEntry.phase;
    const illumination = todayEntry.illumination;

    if (typeof phase !== "string" || phase.length === 0) {
      console.error("[Skytime] Invalid phase in response:", todayEntry);
      return null;
    }

    // Normalise illumination to 0–1 range
    let illum: number;
    if (typeof illumination === "number") {
      illum = illumination > 1 ? illumination / 100 : illumination;
    } else {
      console.error("[Skytime] Invalid illumination:", illumination);
      return null;
    }

    console.log(`[Skytime] Success: ${phase} (${(illum * 100).toFixed(1)}%)`);
    return { Phase: phase, Illumination: illum, source: "skytime" };
  } catch (error: any) {
    console.error(`[Skytime] Failed: ${error.message}`);
    return null;
  }
}

// --- Farmsense API ---

async function fetchFarmsense(): Promise<MoonPhaseData | null> {
  try {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const timestamp = Math.floor(now.getTime() / 1000);

    const url = `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`;
    console.log(`[Farmsense] Fetching from: ${url}`);

    const response = await axios.get(url, {
      timeout: TIMEOUT_MS,
      headers: { "User-Agent": "MoonPhaseBot/1.0" },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.error("[Farmsense] Unexpected response format");
      return null;
    }

    const moonData = response.data[0];

    if (
      !moonData ||
      typeof moonData.Phase !== "string" ||
      moonData.Phase.length === 0 ||
      typeof moonData.Illumination !== "number" ||
      moonData.Illumination < 0 ||
      moonData.Illumination > 1
    ) {
      console.error("[Farmsense] Invalid data structure:", moonData);
      return null;
    }

    console.log(
      `[Farmsense] Success: ${moonData.Phase} (${(moonData.Illumination * 100).toFixed(1)}%)`,
    );
    return {
      Phase: moonData.Phase,
      Illumination: moonData.Illumination,
      source: "farmsense",
    };
  } catch (error: any) {
    console.error(`[Farmsense] Failed: ${error.message}`);
    return null;
  }
}

// --- Local calculation fallback ---

function fetchLocal(): MoonPhaseData {
  const result = calculateMoonPhase();
  console.log(
    `[Local] Calculated: ${result.Phase} (${(result.Illumination * 100).toFixed(1)}%)`,
  );
  return {
    Phase: result.Phase,
    Illumination: result.Illumination,
    source: "local",
  };
}

// --- Main service ---

export class MoonPhaseService {
  /**
   * Try each source in order: Skytime → Farmsense → Local calculation.
   * Returns the first successful result.
   */
  public async getMoonPhase(): Promise<MoonPhaseData> {
    const sources: {
      name: MoonPhaseSource;
      fetch: () => Promise<MoonPhaseData | null>;
    }[] = [
      { name: "skytime", fetch: fetchSkytime },
      { name: "farmsense", fetch: fetchFarmsense },
    ];

    for (const source of sources) {
      const result = await source.fetch();
      if (result) {
        return result;
      }
      console.log(`[${source.name}] Failed, trying next source...`);
    }

    console.log("[Fallback] All APIs failed, using local calculation");
    return fetchLocal();
  }
}

export async function getMoonPhase(): Promise<MoonPhaseData> {
  const service = new MoonPhaseService();
  return service.getMoonPhase();
}
