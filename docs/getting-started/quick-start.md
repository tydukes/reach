# Quick Start

This guide will help you get up and running with REACH development quickly.

## Prerequisites

Ensure you've completed the [Installation](installation.md) steps before proceeding.

## Project Structure

REACH is organized as a monorepo using npm workspaces:

```
reach/
├── packages/
│   ├── core/          # Core types, interfaces, and shared utilities
│   ├── cli/           # Command-line interface
│   ├── electron/      # Desktop GUI application
│   ├── voice/         # Voice input/output processing (STT/TTS)
│   ├── memory/        # Memory and context management system
│   └── mcp-client/    # Model Context Protocol client integration
├── .devcontainer/     # VSCode dev container configuration
└── docs/              # Documentation (this site)
```

## Building the Project

Build all packages in dependency order:

```bash
npm run build
```

Build a specific package:

```bash
npm run build:core
```

## Running Tests

Run all tests:

```bash
npm run test
```

Run tests for a specific package:

```bash
npm run test -w @reach/core
```

## Linting and Type Checking

Run ESLint:

```bash
npm run lint
```

Run TypeScript type checking:

```bash
npm run typecheck
```

## Code Style Validation

REACH follows [The Dukes Engineering Style Guide](https://tydukes.github.io/coding-style-guide/). Validate your code:

```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Run style guide validation
uv run python scripts/validate_style_guide.py
```

This checks for required metadata tags and proper code structure.

## Development Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/issue-NUMBER-brief-description
   ```

2. **Make your changes:**
   - Follow the [Contributing Guide](../contributing/contributing.md)
   - Write tests for new functionality
   - Update documentation as needed

3. **Run checks before committing:**

   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

4. **Commit with conventional commit format:**

   ```bash
   git commit -m "feat: add voice input support"
   ```

5. **Push and create a pull request:**

   ```bash
   git push -u origin feature/issue-NUMBER-brief-description
   ```

## Common Tasks

### Adding a New Package

```bash
mkdir packages/my-new-package
cd packages/my-new-package
npm init -y
# Edit package.json to add dependencies on @reach/core
```

### Installing Dependencies

```bash
# Install in root for all packages
npm install

# Install in specific package
npm install <package-name> -w @reach/my-package
```

### Cleaning Build Artifacts

```bash
npm run clean
```

## Next Steps

- [Architecture Overview](../architecture/overview.md) - Understand the system design
- [Core Package](../packages/core.md) - Learn about shared types and utilities
- [Contributing Guide](../contributing/contributing.md) - Detailed contribution guidelines
