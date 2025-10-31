# @reach/electron

Cross-platform desktop GUI application built with Electron.

## Overview

The Electron package provides a visual interface for REACH, offering:

- Native desktop application feel
- Cross-platform support (Windows, macOS, Linux)
- System tray integration
- Voice input visualization
- Accessible UI components

## Installation

Download the appropriate installer for your platform:

- **Windows**: `REACH-Setup-0.1.0.exe`
- **macOS**: `REACH-0.1.0.dmg`
- **Linux**: `reach-0.1.0.AppImage`

## Features

- Voice input with visual feedback
- Conversation history viewer
- System settings and preferences
- Notification center
- Keyboard shortcuts for all actions

## Status

🚧 **Planned for M5** - Electron GUI & Integration (Weeks 12-15)

## Package Information

- **Version**: 0.1.0 (MVP)
- **License**: MIT
- **Dependencies**: `@reach/core`, `@reach/cli`, `@reach/voice`, `@reach/memory`
- **Location**: `packages/electron/`

## Accessibility

The Electron GUI is designed with accessibility as the highest priority:

- Full keyboard navigation
- Screen reader support (NVDA, JAWS, VoiceOver)
- High contrast themes
- Customizable text sizes
- Voice-first interaction model

## Next Steps

- [Voice Package](voice.md) - Speech processing
- [Architecture Overview](../architecture/overview.md) - System design
- [Contributing](../contributing/contributing.md) - Help build REACH
