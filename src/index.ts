import * as dotenv from "dotenv";
import { PostScheduler } from "./core/scheduler";
import { DebugMode } from "./core/debugMode";
import { postMoonPhaseToBluesky } from "./services/blueskyService";

// Load environment variables
dotenv.config({ path: "./src/config.env" });

class MoonPhaseBot {
  private readonly isDebugMode: boolean;
  private readonly hasCredentials: boolean;

  constructor() {
    this.isDebugMode = process.env.DEBUG_MODE === "true";
    this.hasCredentials = !!(process.env.BLUESKY_USERNAME && process.env.BLUESKY_PASSWORD);
  }

  public async run(): Promise<void> {
    console.log("🌙 Moon Phase Bot Starting...");
    console.log(`Debug Mode: ${this.isDebugMode ? 'ON' : 'OFF'}`);
    console.log(`Credentials Available: ${this.hasCredentials ? 'YES' : 'NO'}`);

    try {
      if (this.isDebugMode) {
        await this.runDebugMode();
      } else {
        await this.runProductionMode();
      }
    } catch (error) {
      console.error("Fatal error:", error);
      process.exit(1);
    }
  }

  private async runDebugMode(): Promise<void> {
    if (this.hasCredentials) {
      console.log("Debug mode with credentials - posting immediately...");
      await postMoonPhaseToBluesky();
    } else {
      console.log("Debug mode without credentials - generating sample messages...");
      const debugMode = new DebugMode();
      await debugMode.runDebugLoop();
    }
  }

  private async runProductionMode(): Promise<void> {
    if (!this.hasCredentials) {
      throw new Error("Production mode requires BLUESKY_USERNAME and BLUESKY_PASSWORD environment variables");
    }

    const scheduler = new PostScheduler();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log("\nReceived SIGINT, shutting down gracefully...");
      scheduler.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log("\nReceived SIGTERM, shutting down gracefully...");
      scheduler.stop();
      process.exit(0);
    });

    await scheduler.start();
  }
}

// Entry point
const bot = new MoonPhaseBot();
bot.run().catch(error => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
