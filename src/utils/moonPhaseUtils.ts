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
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[monthIndex];

  const lycanthropicPhrases = [
    "Awooo!",
    "Call of the wild is strong tonight.",
    "Feel the lunar pull?",
    "Unleash your inner beast!",
    "Howl at the moon!",
    "Night is young, moon is bright.",
    "Beware the moon, lads.", // hehehe, aawil reference lol
    "Proper lunar spectacle.",
    "Moon's got a hold on me.",
    "Lunar madness is upon us."
  ];

  const britishReferences = [
    "Fancy a cuppa under its glow?",
    "Right then, moonlit stroll.",
    "Bloody hell, what a moon!",
    "Keep calm and howl on.",
    "Cheerio, moon!",
    "Spot of bother? Blame the moon.",
    "British as full moon over Stonehenge.",
    "Cracking view, innit?",
    "Bit of moonlight, eh?"
  ];

  const prideReferences = [
    "Love wins, even under the moon!",
    "Shine bright, shine proud!",
    "Moonbeams & rainbows for all!",
    "Celebrate love in every phase!",
    "Proud under the lunar glow!",
    "Queer joy, moonlit sky!"
  ];

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

  // Add month-specific flair with British references
  let monthFlair = "";
  switch (currentMonth) {
    case "January":
      monthFlair = ` Frosty start to lunar year! ${getRandomElement(britishReferences)}`;
      break;
    case "February":
      monthFlair = ` Love in the air, so is the moon! ${getRandomElement(britishReferences)}`;
      break;
    case "March":
      monthFlair = ` Spring is here, moon is blooming! ${getRandomElement(britishReferences)}`;
      break;
    case "April":
      monthFlair = ` April showers bring lunar powers! ${getRandomElement(britishReferences)}`;
      break;
    case "May":
      monthFlair = ` May the moon be with you! ${getRandomElement(britishReferences)}`;
      break;
    case "June":
      monthFlair = ` Summer nights & moonlit delights! ${getRandomElement(britishReferences)}`;
      // Add a Pride reference for June
      if (Math.random() < 0.7) { // 70% chance to add a Pride reference in June
        monthFlair += ` ${getRandomElement(prideReferences)}`;
      }
      break;
    case "July":
      monthFlair = ` Hot summer, cool moon! ${getRandomElement(britishReferences)}`;
      break;
    case "August":
      monthFlair = ` Starry August night, moon our guide! ${getRandomElement(britishReferences)}`;
      break;
    case "September":
      monthFlair = ` Autumn leaves & moonlit dreams! ${getRandomElement(britishReferences)}`;
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