# @reach/voice

Voice input/output processing module handling Speech-to-Text (STT) and Text-to-Speech (TTS).

## Overview

The voice package is the cornerstone of REACH's voice-first interface, providing:

- Local speech-to-text conversion
- Natural text-to-speech synthesis
- Audio input/output management
- Noise cancellation and audio enhancement

## Installation

```bash
npm install @reach/voice
```

## Architecture

```
┌─────────────────────────────────────┐
│         Voice Package               │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │  Audio Input │  │ Audio Output│ │
│  │  (Microphone)│  │  (Speakers) │ │
│  └──────┬───────┘  └──────▲──────┘ │
│         │                 │         │
│  ┌──────▼───────┐  ┌──────┴──────┐ │
│  │  STT Engine  │  │  TTS Engine │ │
│  │   (Local)    │  │   (Local)   │ │
│  └──────┬───────┘  └──────▲──────┘ │
│         │                 │         │
│  ┌──────▼─────────────────┴──────┐ │
│  │      Voice Processing API     │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Privacy

All voice processing happens **locally** on the user's machine:

- No cloud services required
- Audio data never leaves the device
- Models run entirely offline
- Maximum privacy protection

## Status

🚧 **Planned for M4** - Voice Input/Output Pipeline (Weeks 9-11)

## Package Information

- **Version**: 0.1.0 (MVP)
- **License**: MIT
- **Dependencies**: `@reach/core`, FFmpeg, PortAudio, ALSA
- **Location**: `packages/voice/`

## Supported Platforms

- **Windows**: WASAPI audio API
- **macOS**: CoreAudio
- **Linux**: ALSA, PulseAudio

## Next Steps

- [Memory Package](memory.md) - Context management
- [Architecture Overview](../architecture/overview.md) - System design
- [Contributing](../contributing/contributing.md) - Help build REACH
