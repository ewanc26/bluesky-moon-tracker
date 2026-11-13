# AGENTS.md

Guidance for AI coding agents working in **bluesky-moon-tracker**.

## Project overview

a moon tracking bot for Bluesky

- Language: Rust
- Default branch: main

## Working rules

- Inspect the README, manifests, CI workflows, and nearby code before editing.
- Preserve existing architecture, naming, formatting, and error-handling conventions.
- Use project scripts for validation; never claim checks you did not run.
- Keep changes scoped and update tests or documentation when behavior changes.
- Use feature branches and pull requests.
- Treat generated files, credentials, deployment configuration, and release metadata as sensitive.

## File naming

Source files are named `<scope>/<atom>.<ext>`. The directory is the scope: the module, feature or layer the code belongs to. The file name is one atom: one concept, named in lowercase words joined by `_`. Use the language's own extension: `.c` and `.h` for C, `.cpp` and `.hpp` for C++, and the usual one for other languages. Pair an interface with its implementation under the same atom name (`scope/atom.h` with `scope/atom.c`). Avoid catch-all names such as `utils`, `misc`, `common2` or `helpers_final`.

Apply this to new files, and to a file you are already restructuring. Don't rename existing files only to satisfy it.

## Recent history

Update config.yml issue template

<!-- allowed-agents -->
## Allowed agents

Only **Claude** (Anthropic) and **Mistral** (Mistral AI) may be used as coding agents in this repository. This rule supersedes any earlier agent-attribution guidance in this file.

- Agent-assisted commits must credit only one of those agents:
  - `Co-Authored-By: Claude <noreply@anthropic.com>`
  - `Co-Authored-By: Mistral Vibe <vibe@mistral.ai>`
- Allowed agent footers are `🤖 Generated with [Claude Code](https://claude.com/claude-code)` and `🤖 Generated with [Mistral Vibe](https://mistral.ai)`.
- Do not add `Co-Authored-By:` trailers, `Generated with` footers, author names, or committer identities for any other agent or AI tool.
- Do not credit another agent in commit metadata.
