export interface MoonPhaseData {
  Phase: string;
  Illumination: number;
  Error?: string;
}

export interface MoonMessage {
  message: string;
  hashtag: string;
}

export interface BlueskyPost {
  [key: string]: any; // Add string index signature
  text: string;
  facets?: any[];
  langs: string[];
  createdAt: string;
}
