import { monthNames, lycanthropicPhrases, britishReferences, prideReferences, monthFlairs } from './moonPhaseConstants';

/**
 * Generates a playful message about the moon phase and illumination, considering the month.
 * @param phase The name of the moon phase (e.g., "New Moon", "Full Moon").
 * @param illumination The illumination percentage of the moon (0-100).
 * @param monthIndex The 0-indexed month (0 for January, 11 for December).
 * @returns A playful string describing the moon, limited to 300 characters.
 */
export function getPlayfulMoonMessage(
  phase: string,
  illumination: number,
  monthIndex: number
): string {
  const illuminationFixed = illumination.toFixed(1);
  const currentMonth = monthNames[monthIndex];

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  let baseMessage = `The moon is a ${phase} today, shining at ${illuminationFixed}%!`;

  // Add playful remarks based on phase with a lycanthropic touch
  switch (phase) {
    case "New Moon":
      baseMessage = `It's a New Moon, barely a whisper! Illumination: ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Crescent":
      baseMessage = `Look up! Waxing Crescent, brighter at ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "First Quarter":
      baseMessage = `Halfway to full! First Quarter moon ${illuminationFixed}% lit. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Gibbous":
      baseMessage = `Waxing Gibbous almost full, glowing at ${illuminationFixed}%! ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Full Moon":
      baseMessage = `By Jove, a magnificent Full Moon! ${illuminationFixed}% light. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Gibbous":
      baseMessage = `Waning Gibbous gracefully fading, ${illuminationFixed}% illuminated. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Last Quarter":
      baseMessage = `Last Quarter moon, ${illuminationFixed}% visible! ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Crescent":
      baseMessage = `Waning Crescent, tiny sliver, ${illuminationFixed}% lit. ${getRandomElement(lycanthropicPhrases)}`;
      break;
  }

  // Ensure baseMessage ends with a space for proper concatenation
  baseMessage += ' ';

  // Add month-specific flair
  let monthFlairText = "";
  if (monthFlairs[currentMonth]) {
    monthFlairText = getRandomElement(monthFlairs[currentMonth]);
  }

  // Add a British reference to the month flair
  if (monthFlairText) { // Only add if there's a base month flair
    monthFlairText += ` ${getRandomElement(britishReferences)}`;
  }

  // Add a Pride reference for June
  if (currentMonth === "June" && Math.random() < 0.7) { // 70% chance to add a Pride reference in June
    monthFlairText += ` ${getRandomElement(prideReferences)}`;
  }

  let finalMessage = `${baseMessage}${monthFlairText}`;

  // Ensure message is within 300 characters
  if (finalMessage.length > 300) {
    finalMessage = finalMessage.substring(0, 297) + "...";
  }

   return finalMessage;
}