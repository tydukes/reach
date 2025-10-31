# Installation

## Prerequisites

Before installing REACH, ensure you have the following:

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Docker Desktop**: For dev container environment (recommended)
- **Python**: 3.11+ (for future AI/ML tooling)

## Development Environment Setup

The recommended way to develop REACH is using the VSCode dev container, which provides a consistent, reproducible environment with all dependencies pre-installed.

### Using Dev Container (Recommended)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tydukes/reach.git
   cd reach
   ```

2. **Open in VSCode:**

   ```bash
   code .
   ```

3. **Reopen in Container:**
   - Click "Reopen in Container" when prompted
   - Or press `Cmd+Shift+P` and select "Dev Containers: Reopen in Container"
   - Wait for the container to build (first time takes 5-10 minutes)

4. **Verify installation:**

   ```bash
   node --version   # Should be 24.x
   npm --version    # Should be 11.x
   python3 --version # Should be 3.11.x
   ```

### Manual Setup (Without Dev Container)

If you prefer not to use the dev container:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build all packages:**

   ```bash
   npm run build
   ```

3. **Verify the build:**

   ```bash
   npm run typecheck
   npm run lint
   npm run test
   ```

## What's in the Dev Container?

The dev container includes:

- Node.js 24.10.0 with npm 11.6.2
- Python 3.11.2 for future ML tools
- FFmpeg 5.1.7 with full audio library support (ALSA, PortAudio, libsndfile)
- Pre-configured VSCode extensions (ESLint, Prettier, TypeScript, GitLens)
- Git, Zsh with Oh My Zsh
- Claude Code CLI for AI-assisted development

## Next Steps

- [Quick Start Guide](quick-start.md) - Get started building with REACH
- [Architecture Overview](../architecture/overview.md) - Understand the system design
- [Contributing Guide](../contributing/contributing.md) - Learn how to contribute
