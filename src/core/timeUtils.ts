/**
 * Calculates the delay until the next 00:00 UTC.
 * @returns The delay in milliseconds.
 */
export function getDelayUntilNextMidnightUTC(): number {
  const now = new Date();
  const nextMidnightUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return nextMidnightUTC.getTime() - now.getTime();
}