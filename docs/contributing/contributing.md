# Contributing to REACH

Thank you for your interest in contributing to REACH! This guide will help you get started.

For the complete contributing guide, please see [CONTRIBUTING.md](https://github.com/tydukes/reach/blob/main/CONTRIBUTING.md) in the repository root.

## Quick Links

- [Code of Conduct](code-of-conduct.md)
- [Security Policy](security.md)
- [Development Setup](../getting-started/installation.md)
- [Architecture Overview](../architecture/overview.md)
- [**Code Style Guide**](https://tydukes.github.io/coding-style-guide/) - The Dukes Engineering Style Guide

## Code Style Standards

REACH follows **[The Dukes Engineering Style Guide](https://tydukes.github.io/coding-style-guide/)** for all code contributions.

### Key Requirements

- **TypeScript**: Add `@module:` metadata tags to all source files
- **Formatting**: Strict ESLint + Prettier enforcement
- **Type Safety**: Full TypeScript strict mode
- **Testing**: Write tests for all new functionality
- **Documentation**: Update docs when changing behavior

### Validation

All pull requests are automatically validated against the style guide in CI:

```bash
# Run style guide validation locally
uv run python scripts/validate_style_guide.py
```

For detailed language-specific guidelines, see:

- [TypeScript Guide](https://tydukes.github.io/coding-style-guide/02_language_guides/typescript/)
- [Python Guide](https://tydukes.github.io/coding-style-guide/02_language_guides/python/)
- [Metadata Schema](https://tydukes.github.io/coding-style-guide/03_metadata_schema/schema_reference/)

## Getting Started

1. Fork the repository
2. Clone your fork
3. Set up the dev container
4. Create a feature branch
5. Make your changes
6. Submit a pull request

## Development Workflow

See the [Quick Start Guide](../getting-started/quick-start.md) for detailed development instructions.

## Questions?

- [GitHub Discussions](https://github.com/tydukes/reach/discussions)
- [Issues](https://github.com/tydukes/reach/issues)
