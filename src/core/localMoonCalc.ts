/**
 * Local moon phase calculation using the Meeus synodic period algorithm.
 * No network dependency — pure math fallback.
 *
 * Accuracy: ±1 day for phase boundaries, ±5% for illumination.
 * Good enough for a bot that posts once daily.
 */

const SYNODIC_PERIOD = 29.530588853;
const KNOWN_NEW_MOON_JD = 2451550.1; // 6 Jan 2000 18:14 UTC

function dateToJulianDay(date: Date): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}

function getMoonAge(julianDay: number): number {
  const age = ((julianDay - KNOWN_NEW_MOON_JD) / SYNODIC_PERIOD) % 1.0;
  return age < 0 ? age + 1 : age;
}

function ageToPhaseName(age: number): string {
  if (age < 0.0625 || age >= 0.9375) return "New Moon";
  if (age < 0.1875) return "Waxing Crescent";
  if (age < 0.3125) return "First Quarter";
  if (age < 0.4375) return "Waxing Gibbous";
  if (age < 0.5625) return "Full Moon";
  if (age < 0.6875) return "Waning Gibbous";
  if (age < 0.8125) return "Last Quarter";
  return "Waning Crescent";
}

function ageToIllumination(age: number): number {
  return (1 - Math.cos(2 * Math.PI * age)) / 2;
}

export interface LocalMoonPhaseResult {
  Phase: string;
  Illumination: number;
  age: number;
}

/**
 * Calculate the current moon phase locally.
 * @param date - Date to calculate for (defaults to now)
 * @returns Phase name, illumination (0–1), and normalised moon age
 */
export function calculateMoonPhase(
  date: Date = new Date(),
): LocalMoonPhaseResult {
  const jd = dateToJulianDay(date);
  const age = getMoonAge(jd);
  const phase = ageToPhaseName(age);
  const illumination = ageToIllumination(age);

  return {
    Phase: phase,
    Illumination: Math.round(illumination * 1000) / 1000,
    age,
  };
}
