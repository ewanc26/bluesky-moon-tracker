import * as process from "process";
import { postMoonPhaseToBluesky } from "./services/blueskyService";
import { getDelayUntilNextMidnightUTC } from "./utils/timeUtils";
import { getPlayfulMoonMessage } from "./utils/moonPhaseUtils";
import * as dotenv from "dotenv";

// Load environment variables from the config.env file
dotenv.config({ path: "./src/config.env" });

const DEBUG_MODE = process.env.DEBUG_MODE === "true";

async function debugLoop() {
  const phases = [
    "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
    "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  for (const month of months) {
    const monthIndex = months.indexOf(month);
    for (const phase of phases) {
      const illumination = Math.random() * 100; // Random illumination for debug
      const message = getPlayfulMoonMessage(phase, illumination, monthIndex);
      console.log(`[DEBUG] Moon Message (Phase: ${phase}, Month: ${month}, Length: ${message.length}):\n${message}\n`);
    }
  }
}

async function runLoop() {
  if (DEBUG_MODE) {
    console.log("Starting in DEBUG MODE. Messages will be logged to console.");
    debugLoop();
    return; // Exit runLoop as debugLoop handles logging
  }

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
