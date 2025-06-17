import axios from "axios";

/**
 * Fetches the current moon phase data from the farmsense.net API.
 * @returns A Promise that resolves to the moon phase data object, or null if an error occurs.
 */
export async function getMoonPhase(): Promise<any | null> {
  try {
    // Get the current Unix timestamp for 00:00 UTC
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    const unixTimestamp = Math.floor(now.getTime() / 1000);

    const apiUrl = `https://api.farmsense.net/v1/moonphases/?d=${unixTimestamp}`;
    const response = await axios.get(apiUrl);

    // Explicitly type response.data as an array of any
    const moonData: any[] = Array.isArray(response.data) ? response.data : [];

    if (moonData && moonData.length > 0) {
      return response.data[0];
    } else {
      console.error("No moon phase data received.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching moon phase data:", error);
    return null;
  }
}