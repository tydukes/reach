# @reach/cli

Terminal-based interface providing command-line access to REACH AI agents.

## Overview

The CLI package offers a text-based interface for interacting with REACH, ideal for:

- Terminal users and developers
- Scripting and automation
- Headless server environments
- Power users who prefer keyboard-only interfaces

## Installation

```bash
npm install -g @reach/cli
```

## Usage

```bash
# Start interactive session
reach

# Execute one-off command
reach "Send email to John about meeting"

# Show help
reach --help
```

## Features

- Interactive conversation mode
- Command history and autocomplete
- Configurable output formatting
- Session persistence

## Status

🚧 **Planned for M2** - Core CLI & MCP Integration (Weeks 3-5)

## Package Information

- **Version**: 0.1.0 (MVP)
- **License**: MIT
- **Dependencies**: `@reach/core`, `@reach/mcp-client`
- **Location**: `packages/cli/`

## Next Steps

- [Electron Package](electron.md) - Desktop GUI
- [MCP Client](mcp-client.md) - AI agent orchestration
- [Contributing](../contributing/contributing.md) - Help build REACH
