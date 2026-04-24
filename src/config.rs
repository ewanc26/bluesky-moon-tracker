//! Environment configuration.

#[derive(Debug)]
pub struct Config {
    pub bluesky_username: Option<String>,
    pub bluesky_password: Option<String>,
    pub bluesky_pds_url: String,
    pub debug_mode: bool,
    pub ollama_model: Option<String>,
    pub ollama_url: Option<String>,
    pub ollama_timeout: u64,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            bluesky_username: std::env::var("BLUESKY_USERNAME").ok(),
            bluesky_password: std::env::var("BLUESKY_PASSWORD").ok(),
            bluesky_pds_url: std::env::var("BLUESKY_PDS_URL")
                .unwrap_or_else(|_| "https://bsky.social".to_string()),
            debug_mode: std::env::var("DEBUG_MODE").unwrap_or_default() == "true",
            ollama_model: std::env::var("OLLAMA_MODEL").ok(),
            ollama_url: std::env::var("OLLAMA_URL")
                .ok()
                .or_else(|| Some("http://localhost:11434".to_string())),
            ollama_timeout: std::env::var("OLLAMA_TIMEOUT")
                .ok()
                .and_then(|s| s.parse().ok())
                .unwrap_or(30_000),
        }
    }

    pub fn has_credentials(&self) -> bool {
        self.bluesky_username.is_some() && self.bluesky_password.is_some()
    }
}
