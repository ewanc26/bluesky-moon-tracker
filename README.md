# Bluesky Moon Tracker

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

***This repository is available on [GitHub](https://github.com/ewanc26/bluesky-moon-tracker) and [Tangled](https://tangled.sh/did:plc:ofrbh253gwicbkc5nktqepol/bluesky-moon-tracker). GitHub is the primary version, and the Tangled version is a mirror.***

Bluesky Moon Tracker is a simple script designed to periodically post the current moon phase on Bluesky. The bot fetches moon phase data from the Farmsense APIThe bot posts playful messages daily at 00:00 UTC, tailored to the lunar phase and current month, with a slightly lycanthropic touch, British references, and occasional Pride references in June.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/ewanc26/bluesky-moon-tracker.git
   cd bluesky-moon-tracker
   ```

2. **Initialize and Install Dependencies:**

   ```sh
   npm run dev:init
   ```

## Configuration

1. **Create a Configuration File:**

   Create a file named `config.env` in the `src` directory with the following contents:

   ```ini
   BLUESKY_USERNAME="your_bluesky_username"
   BLUESKY_PASSWORD="your_bluesky_password"
   BLUESKY_PDS_URL="https://bsky.social" # Optional: Your PDS URL if not using bsky.social
   DEBUG_MODE="false" # Set to "true" to enable debug logging of moon messages
   ```

2. **Fill in Your Bluesky Credentials:**

   Replace `your_bluesky_username` and `your_bluesky_password` with your actual Bluesky account credentials.

## Usage

To run the bot, use the following command:

```bash
npm run dev:start
```

This command will start the bot, which will post the current moon phase daily at 00:00 UTC. If the current time is past 00:00 UTC, it will post immediately and then schedule the next post for 00:00 UTC the following day.

### Debug Mode

When `DEBUG_MODE` is set to `true` in `config.env`:

- If `BLUESKY_USERNAME` and `BLUESKY_PASSWORD` are provided, the bot will attempt to post to Bluesky immediately upon starting.
- If Bluesky credentials are not provided, the bot will log all possible combinations of moon phase messages to the console, demonstrating message generation without making actual posts.

This is useful for testing the full posting functionality or just the message generation.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure that your code follows the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License. Please take a look at the [LICENSE](LICENSE) file for more details.

## Project Structure

```plaintext
bluesky-moon-tracker/
│
├── src/
│   ├── config.env                # Environment configuration file
│   ├── index.ts                  # Main script for the bot, orchestrates the bot's operations
│   ├── services/
│   │   ├── blueskyService.ts     # Handles Bluesky login and posting
│   │   └── moonPhaseService.ts   # Fetches moon phase data from the API
│   ├── core/
│   │   ├── moonPhaseConstants.ts
│   │   ├── moonPhaseMessages.ts     # Generates playful moon messages
│   │   └── timeUtils.ts          # Utility functions for time calculations
│
├── package.json                  # Node.js project metadata and dependencies
└── README.md                     # This README file
```

## Explanation of Files

### `src/config.env`

This file stores the Bluesky credentials required to log in and post. Please make sure you keep this file secure and do not share it publicly.

### `src/index.ts`

This is the main script that orchestrates the bot's functionality, including loading environment variables and scheduling daily posts.

### `src/services/blueskyService.ts`

This file handles the authentication with Bluesky and the actual posting of messages.

### `src/services/moonPhaseService.ts`

This file is responsible for fetching the current moon phase data from the Farmsense API.

### `src/core/moonPhaseConstants.ts`

This file contains constants related to moon phases, such as emojis and hashtags.

### `src/core/moonPhaseMessages.ts`

This file contains the logic for generating the playful moon phase messages, including the various phrases and conditional flair.

### `src/core/timeUtils.ts`

This file provides utility functions related to time calculations, specifically for scheduling the daily posts.
