//! Local moon phase calculation using the Meeus synodic period algorithm.
//! No network dependency — pure math fallback.
//!
//! Accuracy: ±1 day for phase boundaries, ±5% for illumination.
//! Good enough for a bot that posts once daily.

use chrono::{Datelike, Timelike};

use super::constants::MoonPhase;

const SYNODIC_PERIOD: f64 = 29.530588853;
const KNOWN_NEW_MOON_JD: f64 = 2451550.1; // 6 Jan 2000 18:14 UTC

fn date_to_julian_day(date: &chrono::DateTime<chrono::Utc>) -> f64 {
    let mut year = date.year() as f64;
    let mut month = date.month() as i32;
    let day = date.day() as f64
        + (date.hour() as f64 + date.minute() as f64 / 60.0) / 24.0;

    if month <= 2 {
        year -= 1.0;
        month += 12;
    }

    let a = (year / 100.0).floor();
    let b = 2.0 - a + (a / 4.0).floor();

    (365.25_f64 * (year + 4716.0)).floor()
        + (30.6001_f64 * (month as f64 + 1.0)).floor()
        + day
        + b
        - 1524.5
}

fn get_moon_age(julian_day: f64) -> f64 {
    let age = ((julian_day - KNOWN_NEW_MOON_JD) / SYNODIC_PERIOD) % 1.0;
    if age < 0.0 { age + 1.0 } else { age }
}

fn age_to_phase(age: f64) -> MoonPhase {
    if age < 0.0625 || age >= 0.9375 {
        MoonPhase::NewMoon
    } else if age < 0.1875 {
        MoonPhase::WaxingCrescent
    } else if age < 0.3125 {
        MoonPhase::FirstQuarter
    } else if age < 0.4375 {
        MoonPhase::WaxingGibbous
    } else if age < 0.5625 {
        MoonPhase::FullMoon
    } else if age < 0.6875 {
        MoonPhase::WaningGibbous
    } else if age < 0.8125 {
        MoonPhase::LastQuarter
    } else {
        MoonPhase::WaningCrescent
    }
}

fn age_to_illumination(age: f64) -> f64 {
    (1.0 - (2.0 * std::f64::consts::PI * age).cos()) / 2.0
}

pub struct LocalMoonResult {
    pub phase: MoonPhase,
    pub illumination: f64,
    pub age: f64,
}

/// Calculate the current moon phase locally.
pub fn calculate_moon_phase(date: Option<&chrono::DateTime<chrono::Utc>>) -> LocalMoonResult {
    let now = date.cloned().unwrap_or_else(chrono::Utc::now);
    let jd = date_to_julian_day(&now);
    let age = get_moon_age(jd);
    let phase = age_to_phase(age);
    let illumination = age_to_illumination(age);

    LocalMoonResult {
        phase,
        illumination: (illumination * 1000.0).round() / 1000.0,
        age,
    }
}
