# AGENTS.md

Guidance for agents working on the Rust Bluesky moon-phase bot.

## Repository map

- `src/main.rs` loads configuration and dispatches debug or scheduled production mode.
- `src/config.rs` parses Bluesky, PDS, Ollama, timeout, and debug environment variables.
- `src/scheduler.rs` implements the UTC-midnight loop and Ctrl-C handling.
- `src/bluesky.rs` authenticates through `atrium-api`, generates a message, builds its hashtag facet, and creates the post record.
- `src/moon/api.rs` queries Skytime for an event dated today, then falls back to the local calculation in `calc.rs`.
- `src/moon/constants.rs` owns phase aliases, copy pools, probabilities, and message limits; `messages.rs` assembles template or Ollama text.
- `.env.example` documents runtime configuration; `flake.nix` supplies a Rust development shell.

## Current behaviour and sharp edges

- Production requires both credential variables. Debug mode posts immediately when both are present; without them it prints all 96 phase/month samples. Treat `DEBUG_MODE=true` with credentials as a live-write path.
- The scheduler has no persisted last-post date. On startup after 01:00 UTC it posts immediately, at exactly 00:00 it posts, but from 00:01 through 00:59 it waits until the next midnight. Restarts can therefore duplicate a day's post, and the early-hour branch can skip one. Do not describe it as exactly-once until state and controlled-clock tests exist.
- Skytime is only accepted when its monthly event list contains an event dated today. On most non-boundary days this may fall back to the local Meeus approximation; external illumination is normalized from percentages when greater than 1.
- Setting `OLLAMA_MODEL` allows the process to start `ollama serve`; if it did so, it attempts API shutdown and then may use `pkill -f "ollama serve"`. Changes here can affect unrelated local Ollama users.
- Template output is truncated by UTF-8 byte length to the configured 300-byte maximum. Ollama output is likewise capped at 300 bytes, despite its prompt saying 280 characters, and is not validated to contain the requested facts or hashtag. A missing hashtag simply produces no facet.
- The AT Protocol session is in memory and login occurs for every post attempt. Only Ctrl-C while the scheduler is sleeping is handled gracefully.
- Never log or commit Bluesky credentials or tokens. Keep `.env` and runtime output untracked.

## Development and validation

Run `cargo fmt --check`, `cargo clippy --all-targets --all-features`, `cargo test`, and `cargo build --release`. There are currently no checked-in tests, so add controlled-date tests for the scheduler and Skytime selection, boundary tests for phase calculations, and UTF-8/hashtag/length tests for message generation. Mock Skytime, Ollama, and AT Protocol traffic. Do not run debug mode with credentials or production mode during routine validation: both can create a real Bluesky post.
