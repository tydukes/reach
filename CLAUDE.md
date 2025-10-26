# REACH - Project Context for AI Assistants

## Project Overview

**REACH** (Responsive Empowering Accessible Computing Helper) is an AI-powered accessibility framework designed to empower users with disabilities to interact with computers through natural conversation. The project is voice-first, privacy-focused, and features autonomous AI agents.

**Mission**: Create a truly accessible computing environment where anyone, regardless of physical ability, can accomplish any task through natural conversation with AI agents that understand, learn, and act autonomously.

## Current Status

- **Version**: 0.1.0 (MVP in development)
- **Phase**: M1: Foundation & Project Setup
- **Repository**: https://github.com/tydukes/reach
- **License**: MIT

## Architecture

### Monorepo Structure

This project uses npm workspaces with TypeScript. The monorepo contains the following packages:

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
├── CONTRIBUTING.md    # Contribution guidelines
├── CODE_OF_CONDUCT.md # Community standards
├── SECURITY.md        # Security policies
└── CHANGELOG.md       # Version history
```

### Package Responsibilities

- **@reach/core**: Foundation package with shared types, interfaces, and utilities. All other packages depend on this.
- **@reach/cli**: Terminal-based interface for REACH. Provides command-line access to AI agents.
- **@reach/electron**: Desktop GUI built with Electron. Provides a visual interface wrapping core functionality.
- **@reach/voice**: Handles voice input (Speech-to-Text) and output (Text-to-Speech) with audio processing.
- **@reach/memory**: Manages user context, conversation history, and adaptive learning patterns.
- **@reach/mcp-client**: Integrates with Model Context Protocol for AI agent orchestration.

## Technical Requirements

### Prerequisites

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Docker Desktop**: For dev container environment
- **TypeScript**: 5.9.3 (managed via package.json)
- **Python**: 3.11+ (for future AI/ML tooling)

### System Dependencies

- Audio libraries (for voice package)
- System-level dependencies will be managed via Docker dev container

## Development Workflow

### Build Commands

```bash
# Install dependencies
npm install

# Build all packages (respects dependency order)
npm run build

# Build specific package
npm run build:core

# Run tests
npm run test

# Lint code
npm run lint

# Type checking
npm run typecheck

# Clean build artifacts
npm run clean
```

### Build Order

The build system respects package dependencies:
1. `@reach/core` (foundation, no dependencies)
2. All other packages (depend on core)

### Branch Naming Convention

Follow this pattern: `feature/issue-NUMBER-brief-description`

Example: `feature/issue-6-docker-devcontainer-setup`

## Coding Standards

### Commit Messages

Follow conventional commits:
- `feat: add voice input support`
- `fix: resolve memory leak in session manager`
- `docs: update installation guide`
- `test: add tests for guardrails`
- `chore: update dependencies`

### Pull Request Guidelines

- Reference the issue: Include "Closes #123" in PR description
- Write tests for all new code
- Update documentation when changing behavior
- Run `npm run lint` before committing
- Keep PRs focused on a single feature/fix

### Accessibility First

This is a core principle, not an afterthought:
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure keyboard navigation works
- Verify WCAG 2.1 AAA compliance
- Test with high contrast mode
- Consider users with motor, visual, auditory, and cognitive disabilities

## Development Roadmap

- **M1**: Foundation & Project Setup (Weeks 1-2) - Current phase
- **M2**: Core CLI & MCP Integration (Weeks 3-5)
- **M3**: Memory & Context System (Weeks 6-8)
- **M4**: Voice Input/Output Pipeline (Weeks 9-11)
- **M5**: Electron GUI & Integration (Weeks 12-15)
- **M6**: Polish, Testing & MVP Release (Weeks 16-20)

## Testing Strategy

- Unit tests for all packages
- Integration tests for inter-package communication
- E2E tests for complete workflows
- Accessibility testing with assistive technologies
- Performance benchmarks for voice processing

## Privacy & Security

- **Local-first**: Process data locally when possible
- **Encrypted storage**: All user data encrypted at rest
- **Minimal telemetry**: Only collect essential, anonymized metrics with user consent
- **Security policy**: See SECURITY.md for vulnerability reporting

## Key Design Principles

1. **Accessibility is not optional**: Every feature must be accessible
2. **Privacy by design**: User data stays local and encrypted
3. **Autonomous agents**: Minimize user effort through intelligent automation
4. **Natural interaction**: Conversational interface, not command-based
5. **Extensible architecture**: Plugin system for community contributions
6. **Progressive enhancement**: Work with or without advanced features

## Common Patterns

### TypeScript Configuration

All packages use similar TypeScript configurations:
- ES modules (`"type": "module"` in package.json)
- Strict mode enabled
- Target: ES2022
- Module resolution: Node16 or bundler

### Package Dependencies

- All packages depend on `@reach/core`
- Use workspace protocol: `"@reach/core": "*"`
- External dependencies should be carefully evaluated for accessibility and privacy

## When Working on Issues

1. Check the issue for acceptance criteria and dependencies
2. Create a feature branch following naming conventions
3. Review related packages and their interactions
4. Consider accessibility implications
5. Write tests alongside implementation
6. Update documentation
7. Test with assistive technologies if UI-related
8. Submit PR with "Closes #N" in description

## Resources

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Project Board](https://github.com/tydukes/reach/projects/2)
- [Discussions](https://github.com/tydukes/reach/discussions)

## Notes for AI Assistants

- Always consider accessibility in your suggestions
- Reference the monorepo structure when proposing changes
- Respect the privacy-first architecture
- Follow conventional commit standards
- Test commands in the dev container environment
- Consider the build order when modifying packages
- Think about users with disabilities in every decision
