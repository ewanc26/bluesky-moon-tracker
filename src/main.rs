mod bluesky;
mod config;
mod moon;
mod scheduler;

use config::Config;

#[tokio::main]
async fn main() {
    // Load .env file
    dotenvy::dotenv().ok();

    let config = Config::from_env();

    println!("\u{1F319} Moon Phase Bot Starting...");
    println!("Debug Mode: {}", if config.debug_mode { "ON" } else { "OFF" });
    println!(
        "Credentials Available: {}",
        if config.has_credentials() { "YES" } else { "NO" }
    );

    if let Some(ref model) = config.ollama_model {
        let url = config.ollama_url.as_deref().unwrap_or("http://localhost:11434");
        println!("Ollama: ENABLED (model: {model}, url: {url})");
    } else {
        println!("Ollama: DISABLED (set OLLAMA_MODEL to enable)");
    }

    if let Err(e) = run(config).await {
        eprintln!("Fatal error: {e}");
        std::process::exit(1);
    }
}

async fn run(config: Config) -> Result<(), Box<dyn std::error::Error>> {
    if config.debug_mode {
        run_debug_mode(&config).await
    } else {
        run_production_mode(&config).await
    }
}

async fn run_debug_mode(config: &Config) -> Result<(), Box<dyn std::error::Error>> {
    if config.has_credentials() {
        println!("Debug mode with credentials - posting immediately...");
        let http_client = reqwest::Client::new();
        let service = bluesky::BlueskyService::new(
            &config.bluesky_pds_url,
            http_client,
            config.ollama_model.clone(),
            config.ollama_url.clone(),
            Some(config.ollama_timeout),
        );
        service
            .post_moon_phase(
                config.bluesky_username.as_deref().unwrap(),
                config.bluesky_password.as_deref().unwrap(),
            )
            .await?;
    } else {
        println!("Debug mode without credentials - generating sample messages...");
        moon::messages::generate_debug_messages();
    }
    Ok(())
}

async fn run_production_mode(config: &Config) -> Result<(), Box<dyn std::error::Error>> {
    if !config.has_credentials() {
        return Err(
            "Production mode requires BLUESKY_USERNAME and BLUESKY_PASSWORD environment variables"
                .into(),
        );
    }

    let http_client = reqwest::Client::new();
    let service = bluesky::BlueskyService::new(
        &config.bluesky_pds_url,
        http_client,
        config.ollama_model.clone(),
        config.ollama_url.clone(),
        Some(config.ollama_timeout),
    );

    let mut scheduler = scheduler::PostScheduler::new();
    scheduler
        .start(
            &service,
            config.bluesky_username.as_deref().unwrap(),
            config.bluesky_password.as_deref().unwrap(),
        )
        .await;

    Ok(())
}
