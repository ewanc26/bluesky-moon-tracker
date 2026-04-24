export type MoonPhaseSource = "skytime" | "farmsense" | "local";

export interface MoonPhaseData {
  Phase: string;
  Illumination: number;
  Error?: string;
  source?: MoonPhaseSource;
}

export interface MoonMessage {
  message: string;
  hashtag: string;
  source?: "ollama" | "template";
}

export interface OllamaConfig {
  model: string;
  url: string;
  timeout: number;
}

export interface BlueskyPost {
  [key: string]: any; // Add string index signature
  text: string;
  facets?: any[];
  langs: string[];
  createdAt: string;
}
