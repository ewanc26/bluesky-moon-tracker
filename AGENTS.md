# AGENTS.md

Guidance for agents working on Bluesky Moon Tracker, a size-optimized Rust bot that posts a moon update once per day at 00:00 UTC.

## Architecture and invariants

- `src/` separates configuration, Skytime API access, local lunar fallback calculation, optional Ollama wording, AT Protocol authentication/posting, and scheduling.
- UTC is authoritative. Handle startup near midnight and clock changes without duplicate daily posts or skipping the next run.
- Skytime and Ollama are optional dependencies at runtime: local calculation and non-LLM copy must remain useful when they fail.
- Bound all HTTP calls and generated text. Validate external JSON and do not let prose generation alter factual phase data.
- Never log Bluesky credentials, tokens, or full authorization responses.
- Preserve the release profile's small-binary intent unless a measured reason justifies changing it.

## Validation

Run `cargo fmt --check`, `cargo clippy --all-targets --all-features`, `cargo test`, and `cargo build --release`. Use controlled clocks and mocked clients to test UTC rollover, delayed startup, duplicate prevention, Skytime timeout/malformed data, local calculation boundaries, Ollama disabled/failure, Bluesky failure, retry behavior, and signal shutdown. Live posting requires a dedicated test account. Keep `.env` and runtime state out of Git.
