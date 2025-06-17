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
): { message: string; hashtag: string } {
  const illuminationFixed = illumination.toFixed(1);
  const currentMonth = monthNames[monthIndex];

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  let baseMessage = `The moon is a ${phase} today, shining at ${illuminationFixed}%!`;
  let emoji = '';
  let hashtag = '#MoonPhase';

  // Determine emoji and specific hashtag based on phase
  switch (phase) {
    case "New Moon":
      emoji = '🌑';
      hashtag = '#NewMoon';
      baseMessage = `It's a New Moon, barely a whisper! Illumination: ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Crescent":
      emoji = '🌒';
      hashtag = '#WaxingCrescent';
      baseMessage = `Look up! Waxing Crescent, brighter at ${illuminationFixed}%. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "First Quarter":
      emoji = '🌓';
      hashtag = '#FirstQuarter';
      baseMessage = `Halfway to full! First Quarter moon ${illuminationFixed}% lit. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waxing Gibbous":
      emoji = '🌔';
      hashtag = '#WaxingGibbous';
      baseMessage = `Waxing Gibbous almost full, glowing at ${illuminationFixed}%! ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Full Moon":
      emoji = '🌕';
      hashtag = '#FullMoon';
      baseMessage = `By Jove, a magnificent Full Moon! ${illuminationFixed}% light. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Gibbous":
      emoji = '🌖';
      hashtag = '#WaningGibbous';
      baseMessage = `Waning Gibbous gracefully fading, ${illuminationFixed}% illuminated. ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Last Quarter":
      emoji = '🌗';
      hashtag = '#LastQuarter';
      baseMessage = `Last Quarter moon, ${illuminationFixed}% visible! ${getRandomElement(lycanthropicPhrases)}`;
      break;
    case "Waning Crescent":
      emoji = '🌘';
      hashtag = '#WaningCrescent';
      baseMessage = `Waning Crescent, tiny sliver, ${illuminationFixed}% lit. ${getRandomElement(lycanthropicPhrases)}`;
      break;
  }

  // Prepend emoji to the base message
  baseMessage = `${emoji} ${baseMessage}`;

  // Ensure baseMessage ends with a space for proper concatenation
  baseMessage += ' ';

  let additionalMessageParts: string[] = [];

  // Add month-specific flair with a 50% chance
  if (Math.random() < 0.5 && monthFlairs[currentMonth]) { // 50% chance to add month flair
    additionalMessageParts.push(getRandomElement(monthFlairs[currentMonth]));
  }

  // Add a British reference with a 50% chance
  if (Math.random() < 0.5) { // 50% chance to add British reference
    additionalMessageParts.push(getRandomElement(britishReferences));
  }

  // Add a Pride reference for June with a 70% chance
  if (currentMonth === "June" && Math.random() < 0.7) { // 70% chance to add a Pride reference in June
    additionalMessageParts.push(getRandomElement(prideReferences));
  }

  // Join additional parts with a space, if any exist
  // Randomise the order of additional message parts
  for (let i = additionalMessageParts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [additionalMessageParts[i], additionalMessageParts[j]] = [additionalMessageParts[j], additionalMessageParts[i]];
  }

  let finalMessage = `${baseMessage}${additionalMessageParts.join(' ')}`;

  // Append hashtag to the end of the message
  finalMessage = `${finalMessage} ${hashtag}`;

  // Ensure message is within 300 characters
  if (finalMessage.length > 300) {
    finalMessage = finalMessage.substring(0, 297) + "...";
  }

   return { message: finalMessage, hashtag: hashtag };
}