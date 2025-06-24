import { getDelayUntilNextMidnightUTC, formatTimeRemaining, isTimeForPost, hasPassedMidnight } from './timeUtils';
import { postMoonPhaseToBluesky } from '../services/blueskyService';

export class PostScheduler {
  private isRunning = false;

  public async start(): Promise<void> {
    if (this.isRunning) {
      console.warn("Scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting moon phase post scheduler");

    while (this.isRunning) {
      try {
        if (isTimeForPost()) {
          console.log("It's 00:00 UTC. Posting now...");
          await postMoonPhaseToBluesky();
        } else if (hasPassedMidnight()) {
          console.log("It's already past 00:00 UTC. Posting now for today...");
          await postMoonPhaseToBluesky();
        } else {
          console.log("Waiting for 00:00 UTC to post...");
        }

        const delay = getDelayUntilNextMidnightUTC();
        const timeRemaining = formatTimeRemaining(delay);
        console.log(`Next post scheduled in ${timeRemaining} (at 00:00 UTC).`);

        await this.sleep(delay);
      } catch (error) {
        console.error("Error in scheduler loop:", error);
        // Wait 5 minutes before retrying
        await this.sleep(5 * 60 * 1000);
      }
    }
  }

  public stop(): void {
    this.isRunning = false;
    console.log("Scheduler stopped");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
