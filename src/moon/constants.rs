use std::collections::HashMap;

/// The 8 canonical lunar phases.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum MoonPhase {
    NewMoon,
    WaxingCrescent,
    FirstQuarter,
    WaxingGibbous,
    FullMoon,
    WaningGibbous,
    LastQuarter,
    WaningCrescent,
}

impl MoonPhase {
    pub const ALL: [MoonPhase; 8] = [
        MoonPhase::NewMoon,
        MoonPhase::WaxingCrescent,
        MoonPhase::FirstQuarter,
        MoonPhase::WaxingGibbous,
        MoonPhase::FullMoon,
        MoonPhase::WaningGibbous,
        MoonPhase::LastQuarter,
        MoonPhase::WaningCrescent,
    ];

    pub fn name(&self) -> &'static str {
        match self {
            MoonPhase::NewMoon => "New Moon",
            MoonPhase::WaxingCrescent => "Waxing Crescent",
            MoonPhase::FirstQuarter => "First Quarter",
            MoonPhase::WaxingGibbous => "Waxing Gibbous",
            MoonPhase::FullMoon => "Full Moon",
            MoonPhase::WaningGibbous => "Waning Gibbous",
            MoonPhase::LastQuarter => "Last Quarter",
            MoonPhase::WaningCrescent => "Waning Crescent",
        }
    }

    pub fn emoji(&self) -> &'static str {
        PHASE_CONFIG[self].emoji
    }

    pub fn hashtag(&self) -> &'static str {
        PHASE_CONFIG[self].hashtag
    }

    /// Normalise a raw phase string (from an API or alias) into a canonical phase.
    pub fn from_str_loose(raw: &str) -> Result<MoonPhase, String> {
        // Direct canonical match
        for phase in Self::ALL {
            if phase.name().eq_ignore_ascii_case(raw) {
                return Ok(phase);
            }
        }
        // Alias match
        let upper = raw.to_uppercase();
        for (alias, canonical) in PHASE_ALIASES.iter() {
            if alias.eq_ignore_ascii_case(raw) || alias.to_uppercase() == upper {
                return Ok(*canonical);
            }
        }
        Err(format!(
            "Unknown moon phase: \"{}\". Supported phases: {}",
            raw,
            Self::ALL
                .iter()
                .map(|p| p.name())
                .collect::<Vec<_>>()
                .join(", ")
        ))
    }
}

pub const MONTH_NAMES: [&str; 12] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/// Alias → canonical phase mapping.
pub static PHASE_ALIASES: &[(&str, MoonPhase)] = &[
    ("Dark Moon", MoonPhase::NewMoon),
    ("New", MoonPhase::NewMoon),
    ("Waxing", MoonPhase::WaxingCrescent),
    ("Full", MoonPhase::FullMoon),
    ("Waning", MoonPhase::WaningCrescent),
    ("First", MoonPhase::FirstQuarter),
    ("1st Quarter", MoonPhase::FirstQuarter),
    ("Last", MoonPhase::LastQuarter),
    ("Third Quarter", MoonPhase::LastQuarter),
    ("Half Moon", MoonPhase::FirstQuarter),
    ("2nd Quarter", MoonPhase::FullMoon),
    ("4th Quarter", MoonPhase::NewMoon),
    ("Wolf Moon", MoonPhase::FullMoon),
    ("Snow Moon", MoonPhase::FullMoon),
    ("Worm Moon", MoonPhase::FullMoon),
    ("Pink Moon", MoonPhase::FullMoon),
    ("Flower Moon", MoonPhase::FullMoon),
    ("Strawberry Moon", MoonPhase::FullMoon),
    ("Buck Moon", MoonPhase::FullMoon),
    ("Sturgeon Moon", MoonPhase::FullMoon),
    ("Harvest Moon", MoonPhase::FullMoon),
    ("Hunter's Moon", MoonPhase::FullMoon),
    ("Beaver Moon", MoonPhase::FullMoon),
    ("Cold Moon", MoonPhase::FullMoon),
];

pub struct PhaseConfig {
    pub emoji: &'static str,
    pub hashtag: &'static str,
}

use std::sync::LazyLock;

pub static PHASE_CONFIG: LazyLock<HashMap<MoonPhase, PhaseConfig>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert(MoonPhase::NewMoon, PhaseConfig { emoji: "\u{1F311}", hashtag: "#NewMoon" });
    m.insert(MoonPhase::WaxingCrescent, PhaseConfig { emoji: "\u{1F312}", hashtag: "#WaxingCrescent" });
    m.insert(MoonPhase::FirstQuarter, PhaseConfig { emoji: "\u{1F313}", hashtag: "#FirstQuarter" });
    m.insert(MoonPhase::WaxingGibbous, PhaseConfig { emoji: "\u{1F314}", hashtag: "#WaxingGibbous" });
    m.insert(MoonPhase::FullMoon, PhaseConfig { emoji: "\u{1F315}", hashtag: "#FullMoon" });
    m.insert(MoonPhase::WaningGibbous, PhaseConfig { emoji: "\u{1F316}", hashtag: "#WaningGibbous" });
    m.insert(MoonPhase::LastQuarter, PhaseConfig { emoji: "\u{1F317}", hashtag: "#LastQuarter" });
    m.insert(MoonPhase::WaningCrescent, PhaseConfig { emoji: "\u{1F318}", hashtag: "#WaningCrescent" });
    m
});

pub static LYCANTHROPIC_PHRASES: &[&str] = &[
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
    "The night belongs to the moon.",
];

pub static BRITISH_REFERENCES: &[&str] = &[
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
    "Mind the gap, and the moon's glow.",
];

pub static PRIDE_REFERENCES: &[&str] = &[
    "Love wins, even under the moon!",
    "Shine bright, shine proud!",
    "Moonbeams & rainbows for all!",
    "Celebrate love in every phase!",
    "Proud under the lunar glow!",
    "Queer joy, moonlit sky!",
    "Love is love, under any moon.",
    "Our love shines as bright as the moon.",
    "United under the lunar rainbow.",
    "Freedom to love, illuminated by the moon.",
];

pub static MONTH_FLAIRS: LazyLock<HashMap<&'static str, &'static [&'static str]>> = LazyLock::new(|| {
    let mut m = HashMap::new();
    m.insert("January", &[
        "Frosty start to lunar year!",
        "New year, new moon, same great British charm!",
        "Chilly nights, bright moon.",
        "The Wolf Moon howls!",
    ] as &[_]);
    m.insert("February", &[
        "Love in the air, so is the moon!",
        "A romantic moon for the shortest month.",
        "Cupid's arrow, guided by moonlight.",
        "The Snow Moon blankets the sky!",
    ] as &[_]);
    m.insert("March", &[
        "Spring is here, moon is blooming!",
        "As March roars in, the moon glows on.",
        "New beginnings under the vernal moon.",
        "The Worm Moon signals new life!",
    ] as &[_]);
    m.insert("April", &[
        "April showers bring lunar powers!",
        "Don't let the rain obscure this lovely moon!",
        "Spring has truly sprung, and so has the moon!",
        "The Pink Moon is a sight to behold!",
    ] as &[_]);
    m.insert("May", &[
        "May the moon be with you!",
        "A blooming good moon for May!",
        "Longer days, beautiful moonlit nights.",
        "The Flower Moon is in full bloom!",
    ] as &[_]);
    m.insert("June", &[
        "Summer nights & moonlit delights!",
        "June's moon, perfect for long evenings.",
        "The summer solstice moon is here!",
        "The Strawberry Moon ripens!",
    ] as &[_]);
    m.insert("July", &[
        "Hot summer, cool moon!",
        "July's moon, a real scorcher!",
        "Midsummer moon, shining bright.",
        "The Buck Moon is majestic!",
    ] as &[_]);
    m.insert("August", &[
        "Starry August night, moon our guide!",
        "August's moon, a late summer treat.",
        "Harvest moon on the horizon!",
        "The Sturgeon Moon swims into view!",
    ] as &[_]);
    m.insert("September", &[
        "Autumn leaves & moonlit dreams!",
        "September's moon, a touch of autumn.",
        "Crisp air, clear moon.",
        "The Harvest Moon brings abundance!",
    ] as &[_]);
    m.insert("October", &[
        "Spooky season moon vibes!",
        "October's moon, perfect for ghostly tales.",
        "A hauntingly beautiful moon!",
        "The Hunter's Moon guides the way!",
    ] as &[_]);
    m.insert("November", &[
        "Giving thanks for this beautiful moon!",
        "November's moon, a prelude to winter.",
        "Chilly nights, warm moonlit thoughts.",
        "The Beaver Moon builds its presence!",
    ] as &[_]);
    m.insert("December", &[
        "Winter wonderland, moon shining bright!",
        "December's moon, festive and bright.",
        "A truly magical moon for the holidays!",
        "The Cold Moon brings winter's embrace!",
    ] as &[_]);
    m
});

pub struct MessageConfig {
    pub max_length: usize,
    pub truncate_suffix: &'static str,
    pub month_flair_chance: f64,
    pub british_reference_chance: f64,
    pub pride_reference_chance_june: f64,
}

pub const MESSAGE_CONFIG: MessageConfig = MessageConfig {
    max_length: 300,
    truncate_suffix: "...",
    month_flair_chance: 0.5,
    british_reference_chance: 0.5,
    pride_reference_chance_june: 0.7,
};
