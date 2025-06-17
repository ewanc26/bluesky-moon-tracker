import { BskyAgent } from "@atproto/api";
import * as dotenv from "dotenv"; // Import dotenv for loading environment variables
import * as process from "process"; // Import process for accessing environment variables
import axios from "axios"; // Import axios for making HTTP requests

// Load environment variables from the config.env file
dotenv.config({ path: "./src/config.env" });

// Create a Bluesky Agent
const pdsUrl = process.env.BLUESKY_PDS_URL || "https://bsky.social";
const agent = new BskyAgent({
  service: pdsUrl,
});

/**
 * Fetches the current moon phase data from the farmsense.net API.
 * @returns A Promise that resolves to the moon phase data object, or null if an error occurs.
 */
async function getMoonPhase(): Promise<any | null> {
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



// Main function for generating and posting wolf noise strings
async function main() {
  console.log("Main function called.");

  // Check for empty environment variables and abort if needed
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.error(
      "Missing required environment variables: BLUESKY_USERNAME and BLUESKY_PASSWORD.\nAborting script."
    );
    process.exit(1);
  }

  console.log("Environment variables loaded successfully.");

  try {
    // Login to Bluesky
    await agent.login({
      identifier: process.env.BLUESKY_USERNAME!,
      password: process.env.BLUESKY_PASSWORD!,
    });
    console.log("Logged in to Bluesky.");

    // Get moon phase data
    const moonPhaseData = await getMoonPhase();

    if (moonPhaseData) {
      const postText = getPlayfulMoonMessage(
        moonPhaseData.Phase,
        moonPhaseData.Illumination * 100,
        new Date().getMonth()
      );

      // Post the moon phase information to Bluesky
      await agent.post({
        text: postText,
        langs: ["en"],
        createdAt: new Date().toISOString(),
      });
      console.log("Just posted:", postText);
    } else {
      console.log("Could not retrieve moon phase data to post.");
    }
  } catch (error) {
    console.error("Error during posting:", error);
  }
}

/**
 * Generates a playful message about the moon phase and illumination, considering the month.
 * @param phase The name of the moon phase (e.g., "New Moon", "Full Moon").
 * @param illumination The illumination percentage of the moon (0-100).
 * @param monthIndex The 0-indexed month (0 for January, 11 for December).
 * @returns A playful string describing the moon, limited to 300 characters.
 */
function getPlayfulMoonMessage(
  phase: string,
  illumination: number,
  monthIndex: number
): string {
  const illuminationFixed = illumination.toFixed(1);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[monthIndex];

  const lycanthropicPhrases = [
    "Awooo!",
    "The call of the wild is strong tonight.",
    "Feel the lunar pull?",
    "Unleash your inner beast!",
    "Howl at the moon!",
    "The night is young, and the moon is bright.",
    "Beware the moon, lads.", // hehehe, aawil reference lol
    "A proper lunar spectacle."
  ];

  const britishReferences = [
    "Fancy a cuppa under its glow?",
    "Right then, time for a moonlit stroll.",
    "Bloody hell, what a moon!",
    "Keep calm and howl on.",
    "Cheerio, moon!",
    "Spot of bother? Blame the moon.",
    "As British as a full moon over Stonehenge."
  ];

  const prideReferences = [
    "Love wins, even under the moon!",
    "Shine bright, shine proud!",
    "Moonbeams and rainbows for all!",
    "Celebrate love in every phase!"
  ];

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  let baseMessage = `The moon is a ${phase} today, shining at ${illuminationFixed}%!`;

  // Add playful remarks based on phase with a lycanthropic touch
  switch (phase) {
    case "New Moon":
      baseMessage = `It's a New Moon, barely a whisper in the sky! Time for fresh starts and hidden lunar adventures. Illumination: ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Crescent":
      baseMessage = `Look up! The moon is a slender Waxing Crescent, growing brighter at ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "First Quarter":
      baseMessage = `Halfway to full! The First Quarter moon is ${illuminationFixed}% lit and ready for its close-up. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Gibbous":
      baseMessage = `The Waxing Gibbous is almost full, glowing at ${illuminationFixed}%! Get ready for a proper lunar spectacle. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Full Moon":
      baseMessage = `By Jove, it's a magnificent Full Moon! Bathed in ${illuminationFixed}% light, it's truly a sight to behold. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Gibbous":
      baseMessage = `The Waning Gibbous is gracefully fading, still ${illuminationFixed}% illuminated. Enjoy its gentle glow. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Last Quarter":
      baseMessage = `It's the Last Quarter moon, ${illuminationFixed}% visible! A perfect time for reflection. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Crescent":
      baseMessage = `The Waning Crescent is a tiny sliver, ${illuminationFixed}% lit. Almost time for a new lunar cycle! ${getRandomElement(lycanthropicPhrases)}`;
      break;
  }

  // Add month-specific flair with British references
  let monthFlair = "";
  switch (currentMonth) {
    case "January":
      monthFlair = ` A frosty start to the lunar year! ${getRandomElement(britishReferences)}`;
      break;
    case "February":
      monthFlair = ` Love is in the air, and so is the moon! ${getRandomElement(britishReferences)}`;
      break;
    case "March":
      monthFlair = ` Spring is here, and the moon is blooming! ${getRandomElement(britishReferences)}`;
      break;
    case "April":
      monthFlair = ` April showers bring lunar powers! ${getRandomElement(britishReferences)}`;
      break;
    case "May":
      monthFlair = ` May the moon be with you! ${getRandomElement(britishReferences)}`;
      break;
    case "June":
      monthFlair = ` Summer nights and moonlit delights! ${getRandomElement(britishReferences)}`;
      // Add a Pride reference for June
      if (Math.random() < 0.7) { // 70% chance to add a Pride reference in June
        monthFlair += ` ${getRandomElement(prideReferences)}`;
      }
      break;
    case "July":
      monthFlair = ` Hot summer, cool moon! ${getRandomElement(britishReferences)}`;
      break;
    case "August":
      monthFlair = ` A starry August night with the moon as our guide! ${getRandomElement(britishReferences)}`;
      break;
    case "September":
      monthFlair = ` Autumn leaves and moonlit dreams! ${getRandomElement(britishReferences)}`;
      break;
    case "October":
      monthFlair = ` Spooky season moon vibes! ${getRandomElement(britishReferences)}`;
      break;
    case "November":
      monthFlair = ` Giving thanks for this beautiful moon! ${getRandomElement(britishReferences)}`;
      break;
    case "December":
      monthFlair = ` Winter wonderland, moon shining bright! ${getRandomElement(britishReferences)}`;
      break;
  }

  let finalMessage = `${baseMessage}${monthFlair}`;

  // Ensure message is within 300 characters
  if (finalMessage.length > 300) {
    finalMessage = finalMessage.substring(0, 297) + "...";
  }

   return finalMessage;
}

/**
 * Calculates the delay until the next 00:00 UTC.
 * @returns The delay in milliseconds.
 */
function getDelayUntilNextMidnightUTC(): number {
  const now = new Date();
  const nextMidnightUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return nextMidnightUTC.getTime() - now.getTime();
}

// Function to run the main function in a loop, posting daily at 00:00 UTC
async function runLoop() {
  while (true) {
    // Run main immediately if it's past midnight UTC or very close to it
    const now = new Date();
    const currentUTCHours = now.getUTCHours();
    const currentUTCMinutes = now.getUTCMinutes();

    // If current time is after 00:00 UTC (e.g., 00:01 UTC) or exactly 00:00 UTC
    if (currentUTCHours === 0 && currentUTCMinutes === 0) {
      console.log("It's 00:00 UTC. Posting now...");
      await main();
    } else if (currentUTCHours > 0) {
      // If it's already past 00:00 UTC for today, post and then schedule for next 00:00 UTC
      console.log("It's already past 00:00 UTC. Posting now for today...");
      await main();
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

// Start the loop
runLoop().catch((error) => console.error("Error in run loop:", error));
