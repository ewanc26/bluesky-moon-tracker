export function getDelayUntilNextMidnightUTC(): number {
  const now = new Date();
  const nextMidnightUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return nextMidnightUTC.getTime() - now.getTime();
}

export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

export function isTimeForPost(): boolean {
  const now = new Date();
  return now.getUTCHours() === 0 && now.getUTCMinutes() === 0;
}

export function hasPassedMidnight(): boolean {
  const now = new Date();
  return now.getUTCHours() > 0;
}
