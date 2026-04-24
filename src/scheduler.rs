//! UTC-midnight scheduler with graceful shutdown.

use chrono::Timelike;
use tokio::time::{sleep_until, Instant};

use crate::bluesky::BlueskyService;

pub struct PostScheduler {
    running: bool,
}

impl PostScheduler {
    pub fn new() -> Self {
        Self { running: false }
    }

    pub async fn start(
        &mut self,
        service: &BlueskyService,
        username: &str,
        password: &str,
    ) {
        self.running = true;
        println!("Starting moon phase post scheduler");

        while self.running {
            let now = chrono::Utc::now();

            // If it's past midnight UTC, post now for today
            if now.hour() > 0 || now.minute() > 0 {
                if now.hour() > 0 {
                    println!("It's already past 00:00 UTC. Posting now for today...");
                    match service.post_moon_phase(username, password).await {
                        Ok(()) => {}
                        Err(e) => eprintln!("Error posting: {e}"),
                    }
                } else {
                    println!("Waiting for 00:00 UTC to post...");
                }
            } else {
                // Exactly midnight
                println!("It's 00:00 UTC. Posting now...");
                match service.post_moon_phase(username, password).await {
                    Ok(()) => {}
                    Err(e) => eprintln!("Error posting: {e}"),
                }
            }

            let delay = get_delay_until_next_midnight_utc();
            let time_remaining = format_time_remaining(delay);
            println!("Next post scheduled in {time_remaining} (at 00:00 UTC).");

            // Sleep until next midnight, but check for shutdown signal
            let deadline = Instant::now() + std::time::Duration::from_millis(delay as u64);
            tokio::select! {
                _ = sleep_until(deadline) => {}
                _ = tokio::signal::ctrl_c() => {
                    println!("\nReceived SIGINT, shutting down gracefully...");
                    self.running = false;
                }
            }
        }

        println!("Scheduler stopped");
    }

    pub fn stop(&mut self) {
        self.running = false;
    }
}

/// Milliseconds until the next UTC midnight.
fn get_delay_until_next_midnight_utc() -> i64 {
    let now = chrono::Utc::now();
    let tomorrow = now.date_naive() + chrono::Duration::days(1);
    let next_midnight = tomorrow
        .and_hms_opt(0, 0, 0)
        .expect("midnight is valid")
        .and_utc();
    (next_midnight - now).num_milliseconds().max(0)
}

/// Human-readable time remaining.
fn format_time_remaining(ms: i64) -> String {
    let hours = ms / 3_600_000;
    let minutes = (ms % 3_600_000) / 60_000;
    let seconds = (ms % 60_000) / 1000;
    format!("{hours} hours, {minutes} minutes, and {seconds} seconds")
}
