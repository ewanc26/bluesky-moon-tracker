# Bluesky Moon Tracker

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

**_This repository is available on [GitHub](https://github.com/ewanc26/bluesky-moon-tracker) and [Tangled](https://tangled.sh/did:plc:ofrbh253gwicbkc5nktqepol/bluesky-moon-tracker). GitHub is the primary version, and the Tangled version is a mirror._**

Bluesky Moon Tracker is a small Rust bot that posts the current moon phase to Bluesky once per day at 00:00 UTC. It prefers moon data from the Skytime API, falls back to a local lunar calculation when needed, and can optionally use Ollama to generate the post text.

> 🧶 Also available on [Tangled](https://tangled.org/ewancroft.uk/bluesky-moon-tracker)

## Features

- Posts once per day at 00:00 UTC with a graceful shutdown loop
- Fetches moon phase data from Skytime and falls back to a local calculation if the API is unavailable
- Optionally uses Ollama to generate the post text
- Falls back to template-based message generation if Ollama is not configured or fails
- Supports a debug mode for generating sample messages or posting immediately with credentials
- Designed to run as a background service such as a macOS launchd job

## Requirements

- Rust 2024 toolchain with `cargo`
- A Bluesky account and app password
- Optional: Ollama installed locally if you want AI-generated post text

## Configuration

Create a `.env` file in the repository root:

```ini
BLUESKY_USERNAME=your_handle.bsky.social
BLUESKY_PASSWORD=your_app_password
BLUESKY_PDS_URL=https://bsky.social
DEBUG_MODE=false
OLLAMA_MODEL=llama3.2
OLLAMA_URL=http://localhost:11434
OLLAMA_TIMEOUT=30000
```

### Environment variables

- `BLUESKY_USERNAME` / `BLUESKY_PASSWORD` — Bluesky login credentials
- `BLUESKY_PDS_URL` — optional PDS URL, defaults to `https://bsky.social`
- `DEBUG_MODE` — set to `true` to print sample messages or post immediately when credentials are present
- `OLLAMA_MODEL` — enables Ollama generation when set
- `OLLAMA_URL` — Ollama server URL, defaults to `http://localhost:11434`
- `OLLAMA_TIMEOUT` — request timeout in milliseconds, defaults to `30000`

## Usage

### Development

```sh
cargo run
```

### Release build

```sh
cargo build --release
./target/release/bluesky-moon-tracker
```

### Debug mode

Set `DEBUG_MODE=true` to run the template generator without scheduling posts. If Bluesky credentials are present, the bot posts immediately once and exits its debug flow.

## Project structure

```text
src/
├── main.rs             # Entry point, config loading, runtime mode selection
├── config.rs           # Environment parsing
├── bluesky.rs          # Bluesky login and post creation
├── scheduler.rs        # UTC-midnight scheduler
└── moon/
    ├── api.rs          # Skytime + local moon phase lookup
    ├── calc.rs         # Local lunar phase calculation
    ├── constants.rs    # Phases, aliases, and message constants
    └── messages.rs     # Template and Ollama message generation
```

## Notes

- Skytime is tried first; local phase calculation is used as a fallback.
- Ollama is optional. If it is not configured or unavailable, the bot uses template messages instead.
- The bot is intended to be run continuously as a background process or service.

## License

This project is licensed under the MIT License. Please take a look at the [LICENSE](LICENSE) file for more details.

## ☕ Support

If you found this useful, consider [buying me a ko-fi](https://ko-fi.com/ewancroft)!
