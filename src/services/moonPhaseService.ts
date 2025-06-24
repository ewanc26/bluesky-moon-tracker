import axios from "axios";
import type { MoonPhaseData } from '../types/moonPhase';

export class MoonPhaseService {
  private readonly apiUrl = "https://api.farmsense.net/v1/moonphases/";
  private readonly timeoutMs = 10000; // 10 seconds

  private getApiUrl(timestamp: number): string {
    return `${this.apiUrl}?d=${timestamp}`;
  }

  private getCurrentMidnightTimestamp(): number {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  }

  private validateMoonPhaseData(data: any): data is MoonPhaseData {
    return (
      data &&
      typeof data.Phase === 'string' &&
      typeof data.Illumination === 'number' &&
      data.Phase.length > 0 &&
      data.Illumination >= 0 &&
      data.Illumination <= 1
    );
  }

  public async getMoonPhase(): Promise<MoonPhaseData | null> {
    try {
      const timestamp = this.getCurrentMidnightTimestamp();
      const url = this.getApiUrl(timestamp);
      
      console.log(`Fetching moon phase data from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: this.timeoutMs,
        headers: {
          'User-Agent': 'Moon Phase Bot/1.0'
        }
      });

      if (!Array.isArray(response.data)) {
        console.error("API response is not an array:", response.data);
        return null;
      }

      if (response.data.length === 0) {
        console.error("API returned empty array");
        return null;
      }

      const moonData = response.data[0];
      
      if (!this.validateMoonPhaseData(moonData)) {
        console.error("Invalid moon phase data structure:", moonData);
        return null;
      }

      console.log(`Successfully fetched moon phase: ${moonData.Phase} (${(moonData.Illumination * 100).toFixed(1)}%)`);
      return moonData;

    } catch (error) {
      if (error) {
        console.error(`API request failed: ${error.message}`);
        if (error.response) {
          console.error(`Response status: ${error.response.status}`);
          console.error(`Response data:`, error.response.data);
        }
      } else {
        console.error("Unexpected error fetching moon phase data:", error);
      }
      return null;
    }
  }
}

export async function getMoonPhase(): Promise<MoonPhaseData | null> {
  const service = new MoonPhaseService();
  return service.getMoonPhase();
}
