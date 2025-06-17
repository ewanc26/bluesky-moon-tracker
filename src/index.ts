import * as dotenv from "dotenv";
import * as process from "process";
import { postMoonPhaseToBluesky } from "./services/blueskyService";
import { getDelayUntilNextMidnightUTC } from "./utils/timeUtils";

// Load environment variables from the config.env file
dotenv.config({ path: "./src/config.env" });

async function runLoop() {
  while (true) {
    const now = new Date();
    const currentUTCHours = now.getUTCHours();
    const currentUTCMinutes = now.getUTCMinutes();

    if (currentUTCHours === 0 && currentUTCMinutes === 0) {
      console.log("It's 00:00 UTC. Posting now...");
      await postMoonPhaseToBluesky();
    } else if (currentUTCHours > 0) {
      console.log("It's already past 00:00 UTC. Posting now for today...");
      await postMoonPhaseToBluesky();
    } else {
      console.log("Waiting for 00:00 UTC to post...");
    }

    const delay = getDelayUntilNextMidnightUTC();
    const hours = Math.floor(delay / (1000 * 60 * 60));
    const minutes = Math.floor((delay % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((delay % (1000 * 60)) / 1000);

    console.log(
      `Next post scheduled in ${hours} hours, ${minutes} minutes, and ${seconds} seconds (at 00:00 UTC).`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

runLoop().catch((error) => console.error("Error in run loop:", error));
