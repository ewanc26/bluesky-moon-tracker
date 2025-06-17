import { BskyAgent } from "@atproto/api";
import * as process from "process";
import { getMoonPhase } from "./moonPhaseService";
import { getPlayfulMoonMessage } from "../core/moonPhaseMessages";

export async function postMoonPhaseToBluesky() {
  console.log("Attempting to post moon phase to Bluesky.");

  // Check for empty environment variables and abort if needed
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.error(
      "Missing required environment variables: BLUESKY_USERNAME and BLUESKY_PASSWORD.\nAborting script."
    );
    process.exit(1);
  }

  const pdsUrl = process.env.BLUESKY_PDS_URL || "https://bsky.social";
  const agent = new BskyAgent({ service: pdsUrl });

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
    console.error("Error during Bluesky posting process:", error);
  }
}