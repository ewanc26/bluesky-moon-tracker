# Bluesky Moon Tracker

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

***This repository is available on [GitHub](https://github.com/ewanc26/bluesky-moon-tracker) and [Tangled](https://tangled.sh/did:plc:ofrbh253gwicbkc5nktqepol/bluesky-moon-tracker). GitHub is the primary version, and the Tangled version is a mirror.***

Bluesky Moon Tracker is a Rust bot that posts the current moon phase to Bluesky. It can run in a normal scheduled mode for daily posting, or in a debug mode that prints sample output or performs a one-off post when credentials are present.

## Features

- Rust implementation using Tokio for async scheduling
- Posts moon phase updates to Bluesky
- Optional Ollama integration for AI-generated post text
- Debug mode for local testing without scheduled posting
- Environment-based configuration via `.env`

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ewanc26/bluesky-moon-tracker.git
   cd bluesky-moon-tracker
   ```

2. Build the project with Cargo:

   ```sh
   cargo build --release
   ```

## Configuration

Copy the example environment file and fill in your values:

```sh
cp .env.example .env
```

Available settings:

```ini
BLUESKY_USERNAME="your_bluesky_username"
BLUESKY_PASSWORD="your_bluesky_password"
BLUESKY_PDS_URL="https://bsky.social"
DEBUG_MODE="true"

# Optional Ollama integration
# OLLAMA_MODEL=""
# OLLAMA_URL="http://localhost:11434"
# OLLAMA_TIMEOUT="30000"
```

- `DEBUG_MODE="true"` prints sample output when credentials are missing.
- `DEBUG_MODE="true"` performs an immediate test post when credentials are present.
- `DEBUG_MODE="false"` runs the normal scheduled posting mode and requires Bluesky credentials.

## Usage

Run the bot with Cargo:

```sh
cargo run
```

Or run the release binary directly:

```sh
./target/release/bluesky-moon-tracker
```

## Project structure

```text
bluesky-moon-tracker/
├── .env.example
├── Cargo.toml
├── README.md
└── src/
    ├── bluesky.rs
    ├── config.rs
    ├── main.rs
    ├── moon/
    └── scheduler.rs
```

## Development

Useful commands:

```sh
cargo fmt
cargo check
cargo test
```

## Contributing

Contributions are welcome. Please open an issue or pull request if you want to improve the bot.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
