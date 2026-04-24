import axios from "axios";
import { spawn } from "child_process";
import type { OllamaConfig } from "../types/moonPhase";

const DEFAULT_URL = "http://localhost:11434";
const DEFAULT_TIMEOUT = 30000;
const STARTUP_TIMEOUT = 15000;

export function getOllamaConfig(): OllamaConfig | null {
  const model = process.env.OLLAMA_MODEL;
  if (!model) return null;

  return {
    model,
    url: process.env.OLLAMA_URL || DEFAULT_URL,
    timeout: parseInt(process.env.OLLAMA_TIMEOUT || "", 10) || DEFAULT_TIMEOUT,
  };
}

export function isOllamaEnabled(): boolean {
  return !!process.env.OLLAMA_MODEL;
}

/**
 * Check if the Ollama server is reachable.
 */
async function isOllamaRunning(url: string): Promise<boolean> {
  try {
    await axios.get(`${url}/api/tags`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Start Ollama in the background if it isn't already running.
 * Returns true if Ollama is available (was already running or started successfully).
 */
async function ensureOllamaRunning(url: string): Promise<boolean> {
  if (await isOllamaRunning(url)) {
    console.log("[Ollama] Server already running");
    return true;
  }

  console.log("[Ollama] Server not running — starting...");

  try {
    // Spawn `ollama serve` as a detached background process
    const child = spawn("ollama", ["serve"], {
      detached: true,
      stdio: "ignore",
    });
    child.unref();

    // Wait for the server to become reachable
    const start = Date.now();
    while (Date.now() - start < STARTUP_TIMEOUT) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (await isOllamaRunning(url)) {
        console.log("[Ollama] Server started successfully");
        return true;
      }
    }

    console.error("[Ollama] Server did not start within timeout");
    return false;
  } catch (error: any) {
    console.error(`[Ollama] Failed to start server: ${error.message}`);
    return false;
  }
}

function buildPrompt(
  phase: string,
  illumination: number,
  monthName: string,
  hashtag: string,
): string {
  const illumPct = illumination.toFixed(1);

  return `You are a moon phase bot with a lycanthropic, pagan, British personality. Write a short Bluesky post about the current moon phase.

Current moon phase: ${phase}
Illumination: ${illumPct}%
Month: ${monthName}

Style guidelines:
- Lycanthropic/werewolf energy — howls, lunar pull, inner beast, the wild
- British English — colour, centre, bloody hell, cuppa, innit, cracking
- Pagan undertones — lunar energy, the Wheel, moon's watchful eye
- Short and punchy — under 280 characters
- Include the hashtag ${hashtag}
- One emoji maximum (the moon phase emoji)
- No hashtags other than ${hashtag}
- Do NOT use quotation marks around the post
- Write ONLY the post text, nothing else

Write the post now:`;
}

export interface OllamaGenerateResult {
  response: string;
  done: boolean;
}

export async function generateWithOllama(
  phase: string,
  illumination: number,
  monthName: string,
  hashtag: string,
): Promise<string | null> {
  const config = getOllamaConfig();
  if (!config) return null;

  try {
    // Ensure Ollama is running before attempting generation
    const running = await ensureOllamaRunning(config.url);
    if (!running) {
      console.error("[Ollama] Server unavailable, falling back to templates");
      return null;
    }

    const prompt = buildPrompt(phase, illumination, monthName, hashtag);
    const url = `${config.url}/api/generate`;

    console.log(`[Ollama] Generating post with model: ${config.model}`);

    const response = await axios.post<OllamaGenerateResult>(
      url,
      {
        model: config.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.9,
          num_predict: 150,
        },
      },
      {
        timeout: config.timeout,
        headers: { "Content-Type": "application/json" },
      },
    );

    const result = response.data;

    if (!result.response || result.response.trim().length === 0) {
      console.error("[Ollama] Empty response from model");
      return null;
    }

    // Clean up the response — strip quotes, trim whitespace
    let text = result.response.trim();
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
    }

    // Enforce character limit
    if (text.length > 300) {
      text = text.substring(0, 297) + "...";
    }

    console.log(`[Ollama] Generated: ${text}`);
    return text;
  } catch (error: any) {
    console.error(`[Ollama] Generation failed: ${error.message}`);
    return null;
  }
}
