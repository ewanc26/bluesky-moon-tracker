//! Moon phase data sources: Skytime → Farmsense → Local fallback.

use super::calc;
use super::constants::MoonPhase;

const TIMEOUT_MS: u64 = 10_000;

#[derive(Debug)]
pub struct MoonPhaseData {
    pub phase: MoonPhase,
    pub illumination: f64,
    pub source: &'static str,
}

// --- Skytime API ---

async fn fetch_skytime(client: &reqwest::Client) -> Option<MoonPhaseData> {
    let now = chrono::Utc::now();
    let year = now.format("%Y").to_string();
    let month = now.format("%m").to_string();

    let url = format!("https://skytime.live/api/v1/moon-phases?year={year}&month={month}");
    println!("[Skytime] Fetching from: {url}");

    let resp = client
        .get(&url)
        .header("User-Agent", "MoonPhaseBot/1.0")
        .timeout(std::time::Duration::from_millis(TIMEOUT_MS))
        .send()
        .await
        .ok()?;

    let body: serde_json::Value = resp.json().await.ok()?;
    let data = body.get("data")?;

    let today = now.format("%Y-%m-%d").to_string();
    let entries = data.as_array()?;
    let entry = entries
        .iter()
        .find(|e| {
            e.get("date").and_then(|v| v.as_str()) == Some(&today)
                || e.get("calendar_date").and_then(|v| v.as_str()) == Some(&today)
        })?;

    let phase_str = entry
        .get("phase_name")
        .or_else(|| entry.get("phase"))
        .and_then(|v| v.as_str())?;

    if phase_str.is_empty() {
        return None;
    }

    let phase = MoonPhase::from_str_loose(phase_str).ok()?;

    let illumination = entry.get("illumination").and_then(|v| v.as_f64())?;
    let illum = if illumination > 1.0 {
        illumination / 100.0
    } else {
        illumination
    };

    println!("[Skytime] Success: {} ({:.1}%)", phase.name(), illum * 100.0);
    Some(MoonPhaseData {
        phase,
        illumination: illum,
        source: "skytime",
    })
}

// --- Farmsense API ---

async fn fetch_farmsense(client: &reqwest::Client) -> Option<MoonPhaseData> {
    let now = chrono::Utc::now();
    let timestamp = now.timestamp();

    let url = format!("https://api.farmsense.net/v1/moonphases/?d={timestamp}");
    println!("[Farmsense] Fetching from: {url}");

    let resp = client
        .get(&url)
        .header("User-Agent", "MoonPhaseBot/1.0")
        .timeout(std::time::Duration::from_millis(TIMEOUT_MS))
        .send()
        .await
        .ok()?;

    let body: Vec<serde_json::Value> = resp.json().await.ok()?;
    let moon_data = body.first()?;

    let phase_str = moon_data.get("Phase").and_then(|v| v.as_str())?;
    if phase_str.is_empty() {
        return None;
    }

    let phase = MoonPhase::from_str_loose(phase_str).ok()?;

    let illumination = moon_data.get("Illumination").and_then(|v| v.as_f64())?;
    if !(0.0..=1.0).contains(&illumination) {
        return None;
    }

    println!(
        "[Farmsense] Success: {} ({:.1}%)",
        phase.name(),
        illumination * 100.0
    );
    Some(MoonPhaseData {
        phase,
        illumination,
        source: "farmsense",
    })
}

// --- Local fallback ---

fn fetch_local() -> MoonPhaseData {
    let result = calc::calculate_moon_phase(None);
    println!(
        "[Local] Calculated: {} ({:.1}%)",
        result.phase.name(),
        result.illumination * 100.0
    );
    MoonPhaseData {
        phase: result.phase,
        illumination: result.illumination,
        source: "local",
    }
}

// --- Main service ---

/// Try each source in order: Skytime → Farmsense → Local calculation.
pub async fn get_moon_phase(client: &reqwest::Client) -> MoonPhaseData {
    if let Some(data) = fetch_skytime(client).await {
        return data;
    }
    println!("[Skytime] Failed, trying next source...");

    if let Some(data) = fetch_farmsense(client).await {
        return data;
    }
    println!("[Farmsense] Failed, trying next source...");

    println!("[Fallback] All APIs failed, using local calculation");
    fetch_local()
}
