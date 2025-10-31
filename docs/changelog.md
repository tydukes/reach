# Changelog

All notable changes to REACH will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure with monorepo setup
- Dev container configuration for consistent development environment
- ESLint 9 with TypeScript support
- MkDocs documentation site with Material theme
- Pre-commit hooks for code quality
- GitHub Actions CI/CD workflows
- Security scanning (CodeQL, Snyk, Socket.dev)
- Dependabot configuration for automated updates

### Changed

- Migrated to ESLint 9 flat config format

### Fixed

- Dev container user conflict (GID 1000)
- Docker base image tag for Node.js 24

## [0.1.0] - TBD

### Planned

Initial MVP release with:

- Core library package
- CLI interface
- Basic MCP integration
- Memory and context management
- Voice input/output pipeline
- Electron GUI

[Unreleased]: https://github.com/tydukes/reach/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tydukes/reach/releases/tag/v0.1.0
