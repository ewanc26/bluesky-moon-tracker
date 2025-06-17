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
    "Lunar madness is upon us.",
    "The moon calls to the wild within.",
    "Under the moon's watchful eye.",
    "Embrace the lunar energy.",
    "Lost in the moon's embrace.",
    "The night belongs to the moon."
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
    "Bit of moonlight, eh?",
    "Proper smashing lunar display.",
    "Absolutely brilliant, this moon.",
    "A right good show from the heavens.",
    "Stiff upper lip, even under a full moon.",
    "Mind the gap, and the moon's glow."
  ];

  const prideReferences = [
    "Love wins, even under the moon!",
    "Shine bright, shine proud!",
    "Moonbeams & rainbows for all!",
    "Celebrate love in every phase!",
    "Proud under the lunar glow!",
    "Queer joy, moonlit sky!",
    "Love is love, under any moon.",
    "Our love shines as bright as the moon.",
    "United under the lunar rainbow.",
    "Freedom to love, illuminated by the moon."
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
  const monthFlairs: { [key: string]: string[] } = {
    "January": [
      `Frosty start to lunar year! ${getRandomElement(britishReferences)}`,
      `New year, new moon, same great British charm! ${getRandomElement(britishReferences)}`,
      `Chilly nights, bright moon. ${getRandomElement(britishReferences)}`,
      `The Wolf Moon howls! ${getRandomElement(britishReferences)}`
    ],
    "February": [
      `Love in the air, so is the moon! ${getRandomElement(britishReferences)}`,
      `A romantic moon for the shortest month. ${getRandomElement(britishReferences)}`,
      `Cupid's arrow, guided by moonlight. ${getRandomElement(britishReferences)}`,
      `The Snow Moon blankets the sky! ${getRandomElement(britishReferences)}`
    ],
    "March": [
      `Spring is here, moon is blooming! ${getRandomElement(britishReferences)}`,
      `As March roars in, the moon glows on. ${getRandomElement(britishReferences)}`,
      `New beginnings under the vernal moon. ${getRandomElement(britishReferences)}`,
      `The Worm Moon signals new life! ${getRandomElement(britishReferences)}`
    ],
    "April": [
      `April showers bring lunar powers! ${getRandomElement(britishReferences)}`,
      `Don't let the rain obscure this lovely moon! ${getRandomElement(britishReferences)}`,
      `Spring has truly sprung, and so has the moon! ${getRandomElement(britishReferences)}`,
      `The Pink Moon is a sight to behold! ${getRandomElement(britishReferences)}`
    ],
    "May": [
      `May the moon be with you! ${getRandomElement(britishReferences)}`,
      `A blooming good moon for May! ${getRandomElement(britishReferences)}`,
      `Longer days, beautiful moonlit nights. ${getRandomElement(britishReferences)}`,
      `The Flower Moon is in full bloom! ${getRandomElement(britishReferences)}`
    ],
    "June": [
      `Summer nights & moonlit delights! ${getRandomElement(britishReferences)}`,
      `June's moon, perfect for long evenings. ${getRandomElement(britishReferences)}`,
      `The summer solstice moon is here! ${getRandomElement(britishReferences)}`,
      `The Strawberry Moon ripens! ${getRandomElement(britishReferences)}`
    ],
    "July": [
      `Hot summer, cool moon! ${getRandomElement(britishReferences)}`,
      `July's moon, a real scorcher! ${getRandomElement(britishReferences)}`,
      `Midsummer moon, shining bright. ${getRandomElement(britishReferences)}`,
      `The Buck Moon is majestic! ${getRandomElement(britishReferences)}`
    ],
    "August": [
      `Starry August night, moon our guide! ${getRandomElement(britishReferences)}`,
      `August's moon, a late summer treat. ${getRandomElement(britishReferences)}`,
      `Harvest moon on the horizon! ${getRandomElement(britishReferences)}`,
      `The Sturgeon Moon swims into view! ${getRandomElement(britishReferences)}`
    ],
    "September": [
      `Autumn leaves & moonlit dreams! ${getRandomElement(britishReferences)}`,
      `September's moon, a touch of autumn. ${getRandomElement(britishReferences)}`,
      `Crisp air, clear moon. ${getRandomElement(britishReferences)}`,
      `The Harvest Moon brings abundance! ${getRandomElement(britishReferences)}`
    ],
    "October": [
      `Spooky season moon vibes! ${getRandomElement(britishReferences)}`,
      `October's moon, perfect for ghostly tales. ${getRandomElement(britishReferences)}`,
      `A hauntingly beautiful moon! ${getRandomElement(britishReferences)}`,
      `The Hunter's Moon guides the way! ${getRandomElement(britishReferences)}`
    ],
    "November": [
      `Giving thanks for this beautiful moon! ${getRandomElement(britishReferences)}`,
      `November's moon, a prelude to winter. ${getRandomElement(britishReferences)}`,
      `Chilly nights, warm moonlit thoughts. ${getRandomElement(britishReferences)}`,
      `The Beaver Moon builds its presence! ${getRandomElement(britishReferences)}`
    ],
    "December": [
      `Winter wonderland, moon shining bright! ${getRandomElement(britishReferences)}`,
      `December's moon, festive and bright. ${getRandomElement(britishReferences)}`,
      `A truly magical moon for the holidays! ${getRandomElement(britishReferences)}`,
      `The Cold Moon brings winter's embrace! ${getRandomElement(britishReferences)}`
    ]
  };

  if (monthFlairs[currentMonth]) {
    monthFlair = getRandomElement(monthFlairs[currentMonth]);
  }

  // Add a Pride reference for June
  if (currentMonth === "June" && Math.random() < 0.7) { // 70% chance to add a Pride reference in June
    monthFlair += ` ${getRandomElement(prideReferences)}`;
  }

  let finalMessage = `${baseMessage}${monthFlair}`;

  // Ensure message is within 300 characters
  if (finalMessage.length > 300) {
    finalMessage = finalMessage.substring(0, 297) + "...";
  }

   return finalMessage;
}