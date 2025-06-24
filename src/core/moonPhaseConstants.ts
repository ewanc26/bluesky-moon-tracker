export const MOON_PHASES = [
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
  "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
] as const;

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

export const LYCANTHROPIC_PHRASES = [
  "Awooo!",
  "Call of the wild is strong tonight.",
  "Feel the lunar pull?",
  "Unleash your inner beast!",
  "Howl at the moon!",
  "Night is young, moon is bright.",
  "Beware the moon, lads.",
  "Proper lunar spectacle.",
  "Moon's got a hold on me.",
  "Lunar madness is upon us.",
  "The moon calls to the wild within.",
  "Under the moon's watchful eye.",
  "Embrace the lunar energy.",
  "Lost in the moon's embrace.",
  "The night belongs to the moon."
] as const;

export const BRITISH_REFERENCES = [
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
] as const;

export const PRIDE_REFERENCES = [
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
] as const;

export const MONTH_FLAIRS: Record<string, readonly string[]> = {
  January: [
    "Frosty start to lunar year!",
    "New year, new moon, same great British charm!",
    "Chilly nights, bright moon.",
    "The Wolf Moon howls!"
  ],
  February: [
    "Love in the air, so is the moon!",
    "A romantic moon for the shortest month.",
    "Cupid's arrow, guided by moonlight.",
    "The Snow Moon blankets the sky!"
  ],
  March: [
    "Spring is here, moon is blooming!",
    "As March roars in, the moon glows on.",
    "New beginnings under the vernal moon.",
    "The Worm Moon signals new life!"
  ],
  April: [
    "April showers bring lunar powers!",
    "Don't let the rain obscure this lovely moon!",
    "Spring has truly sprung, and so has the moon!",
    "The Pink Moon is a sight to behold!"
  ],
  May: [
    "May the moon be with you!",
    "A blooming good moon for May!",
    "Longer days, beautiful moonlit nights.",
    "The Flower Moon is in full bloom!"
  ],
  June: [
    "Summer nights & moonlit delights!",
    "June's moon, perfect for long evenings.",
    "The summer solstice moon is here!",
    "The Strawberry Moon ripens!"
  ],
  July: [
    "Hot summer, cool moon!",
    "July's moon, a real scorcher!",
    "Midsummer moon, shining bright.",
    "The Buck Moon is majestic!"
  ],
  August: [
    "Starry August night, moon our guide!",
    "August's moon, a late summer treat.",
    "Harvest moon on the horizon!",
    "The Sturgeon Moon swims into view!"
  ],
  September: [
    "Autumn leaves & moonlit dreams!",
    "September's moon, a touch of autumn.",
    "Crisp air, clear moon.",
    "The Harvest Moon brings abundance!"
  ],
  October: [
    "Spooky season moon vibes!",
    "October's moon, perfect for ghostly tales.",
    "A hauntingly beautiful moon!",
    "The Hunter's Moon guides the way!"
  ],
  November: [
    "Giving thanks for this beautiful moon!",
    "November's moon, a prelude to winter.",
    "Chilly nights, warm moonlit thoughts.",
    "The Beaver Moon builds its presence!"
  ],
  December: [
    "Winter wonderland, moon shining bright!",
    "December's moon, festive and bright.",
    "A truly magical moon for the holidays!",
    "The Cold Moon brings winter's embrace!"
  ]
} as const;

export const PHASE_CONFIG = {
  "New Moon": { emoji: "🌑", hashtag: "#NewMoon" },
  "Waxing Crescent": { emoji: "🌒", hashtag: "#WaxingCrescent" },
  "First Quarter": { emoji: "🌓", hashtag: "#FirstQuarter" },
  "Waxing Gibbous": { emoji: "🌔", hashtag: "#WaxingGibbous" },
  "Full Moon": { emoji: "🌕", hashtag: "#FullMoon" },
  "Waning Gibbous": { emoji: "🌖", hashtag: "#WaningGibbous" },
  "Last Quarter": { emoji: "🌗", hashtag: "#LastQuarter" },
  "Waning Crescent": { emoji: "🌘", hashtag: "#WaningCrescent" }
} as const;

export const MESSAGE_CONFIG = {
  MAX_LENGTH: 300,
  TRUNCATE_SUFFIX: "...",
  MONTH_FLAIR_CHANCE: 0.5,
  BRITISH_REFERENCE_CHANCE: 0.5,
  PRIDE_REFERENCE_CHANCE_JUNE: 0.7
} as const;
