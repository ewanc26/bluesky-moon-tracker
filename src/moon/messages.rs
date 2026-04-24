//! Moon phase message generation — template-based with optional Ollama fallback.

use rand::prelude::IndexedRandom;
use rand::Rng;
use rand::seq::SliceRandom;

use super::constants::{
    BRITISH_REFERENCES, LYCANTHROPIC_PHRASES, MESSAGE_CONFIG, MONTH_FLAIRS, MONTH_NAMES,
    PRIDE_REFERENCES, MoonPhase, PHASE_CONFIG,
};

#[derive(Debug)]
pub struct MoonMessage {
    pub message: String,
    pub hashtag: String,
    pub source: String,
}

fn get_base_message(phase: MoonPhase, illumination: f64) -> String {
    let illum = format!("{:.1}", illumination * 100.0);
    let config = &PHASE_CONFIG[&phase];
    let mut rng = rand::rng();

    let base = match phase {
        MoonPhase::NewMoon => format!("It's a New Moon, barely a whisper! Illumination: {illum}%."),
        MoonPhase::WaxingCrescent => format!("Look up! Waxing Crescent, brighter at {illum}%."),
        MoonPhase::FirstQuarter => format!("Halfway to full! First Quarter moon {illum}% lit."),
        MoonPhase::WaxingGibbous => format!("Waxing Gibbous almost full, glowing at {illum}%!"),
        MoonPhase::FullMoon => format!("By Jove, a magnificent Full Moon! {illum}% light."),
        MoonPhase::WaningGibbous => format!("Waning Gibbous gracefully fading, {illum}% illuminated."),
        MoonPhase::LastQuarter => format!("Last Quarter moon, {illum}% visible!"),
        MoonPhase::WaningCrescent => format!("Waning Crescent, tiny sliver, {illum}% lit."),
    };

    let lycanthropic = LYCANTHROPIC_PHRASES
        .choose(&mut rng)
        .expect("LYCANTHROPIC_PHRASES is non-empty");

    format!("{} {} {}", config.emoji, base, lycanthropic)
}

fn get_additional_messages(month_index: usize) -> Vec<String> {
    let mut rng = rand::rng();
    let month_name = MONTH_NAMES[month_index];
    let mut extras: Vec<String> = Vec::new();

    // Month-specific flair
    if rng.random::<f64>() < MESSAGE_CONFIG.month_flair_chance {
        if let Some(flairs) = MONTH_FLAIRS.get(month_name) {
            if let Some(flair) = flairs.choose(&mut rng) {
                extras.push((*flair).to_string());
            }
        }
    }

    // British reference
    if rng.random::<f64>() < MESSAGE_CONFIG.british_reference_chance {
        if let Some(brit) = BRITISH_REFERENCES.choose(&mut rng) {
            extras.push((*brit).to_string());
        }
    }

    // Pride reference for June
    if month_name == "June" && rng.random::<f64>() < MESSAGE_CONFIG.pride_reference_chance_june {
        if let Some(pride) = PRIDE_REFERENCES.choose(&mut rng) {
            extras.push((*pride).to_string());
        }
    }

    // Fisher-Yates shuffle
    extras.shuffle(&mut rng);
    extras
}

/// UTF-8-safe truncation: never split a multi-byte character.
fn truncate_message(message: &str, max: usize) -> String {
    if message.len() <= max {
        return message.to_string();
    }
    let suffix = MESSAGE_CONFIG.truncate_suffix;
    let target = max.saturating_sub(suffix.len());
    // Find the last char boundary that fits
    let mut end = 0;
    for (i, _) in message.char_indices() {
        if i > target {
            break;
        }
        end = i;
    }
    let mut truncated = message[..end].to_string();
    truncated.push_str(suffix);
    truncated
}

fn generate_template_message(phase: MoonPhase, illumination: f64, month_index: usize) -> MoonMessage {
    let config = &PHASE_CONFIG[&phase];
    let base = get_base_message(phase, illumination);
    let extras = get_additional_messages(month_index);

    let mut parts: Vec<String> = vec![base];
    parts.extend(extras);
    parts.push(config.hashtag.to_string());

    let full = parts.join(" ");
    let truncated = truncate_message(&full, MESSAGE_CONFIG.max_length);

    MoonMessage {
        message: truncated,
        hashtag: config.hashtag.to_string(),
        source: "template".to_string(),
    }
}

// --- Ollama integration ---

#[derive(serde::Deserialize)]
struct OllamaResponse {
    response: String,
}

fn build_ollama_prompt(phase: &str, illumination: f64, month_name: &str, hashtag: &str) -> String {
    let illum_pct = format!("{:.1}", illumination * 100.0);
    format!(
        r#"You are a moon phase bot with a lycanthropic, pagan, British personality. Write a short Bluesky post about the current moon phase.

Current moon phase: {phase}
Illumination: {illum_pct}%
Month: {month_name}

Style guidelines:
- Lycanthropic/werewolf energy — howls, lunar pull, inner beast, the wild
- British English — colour, centre, bloody hell, cuppa, innit, cracking
- Pagan undertones — lunar energy, the Wheel, moon's watchful eye
- Short and punchy — under 280 characters
- Include the hashtag {hashtag}
- One emoji maximum (the moon phase emoji)
- No hashtags other than {hashtag}
- Do NOT use quotation marks around the post
- Write ONLY the post text, nothing else

Write the post now:"#
    )
}

async fn generate_with_ollama(
    client: &reqwest::Client,
    model: &str,
    url: &str,
    timeout_ms: u64,
    phase: &str,
    illumination: f64,
    month_name: &str,
    hashtag: &str,
) -> Option<String> {
    let prompt = build_ollama_prompt(phase, illumination, month_name, hashtag);
    let endpoint = format!("{url}/api/generate");

    println!("[Ollama] Generating post with model: {model}");

    let body = serde_json::json!({
        "model": model,
        "prompt": prompt,
        "stream": false,
        "options": {
            "temperature": 0.9,
            "num_predict": 150
        }
    });

    let resp = client
        .post(&endpoint)
        .json(&body)
        .timeout(std::time::Duration::from_millis(timeout_ms))
        .header("Content-Type", "application/json")
        .send()
        .await
        .ok()?;

    let result: OllamaResponse = resp.json().await.ok()?;

    let mut text = result.response.trim().to_string();
    if text.is_empty() {
        eprintln!("[Ollama] Empty response from model");
        return None;
    }

    // Strip surrounding quotes
    if text.starts_with('"') && text.ends_with('"') && text.len() > 1 {
        text = text[1..text.len() - 1].to_string();
    }

    // Enforce character limit
    if text.len() > 300 {
        text = truncate_message(&text, 300);
    }

    println!("[Ollama] Generated: {text}");
    Some(text)
}

/// Generate a moon phase message. Tries Ollama first (if configured), falls back to templates.
pub async fn generate_message(
    phase: MoonPhase,
    illumination: f64,
    month_index: usize,
    ollama_model: Option<&str>,
    ollama_url: Option<&str>,
    ollama_timeout: Option<u64>,
    http_client: &reqwest::Client,
) -> MoonMessage {
    if month_index > 11 {
        panic!("Invalid month index: {month_index}. Must be between 0 and 11.");
    }

    let config = &PHASE_CONFIG[&phase];
    let month_name = MONTH_NAMES[month_index];

    // Try Ollama first if enabled
    if let Some(model) = ollama_model {
        let url = ollama_url.unwrap_or("http://localhost:11434");
        let timeout = ollama_timeout.unwrap_or(30_000);

        if let Some(text) = generate_with_ollama(
            http_client,
            model,
            url,
            timeout,
            phase.name(),
            illumination,
            month_name,
            config.hashtag,
        )
        .await
        {
            return MoonMessage {
                message: text,
                hashtag: config.hashtag.to_string(),
                source: "ollama".to_string(),
            };
        }
        println!("[Ollama] Generation failed, falling back to templates");
    }

    generate_template_message(phase, illumination, month_index)
}

/// Debug mode: generate sample messages for every phase × month combination.
pub fn generate_debug_messages() -> Vec<(MoonPhase, usize, MoonMessage)> {
    let mut results = Vec::new();
    let mut rng = rand::rng();

    for (month_idx, &month_name) in MONTH_NAMES.iter().enumerate() {
        println!("\n--- {} ---", month_name.to_uppercase());
        for phase in MoonPhase::ALL {
            let illumination = rng.random::<f64>();
            let msg = generate_template_message(phase, illumination, month_idx);
            println!("Phase: {}", phase.name());
            println!("Message: {}", msg.message);
            println!("Length: {} characters", msg.message.len());
            println!("---");
            results.push((phase, month_idx, msg));
        }
    }

    results
}
