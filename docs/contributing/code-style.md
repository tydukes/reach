# Code Style Guide

REACH follows [**The Dukes Engineering Style Guide**](https://tydukes.github.io/coding-style-guide/), a comprehensive set of standards for DevOps and software engineering.

## Overview

The style guide defines consistent, secure, and AI-optimized standards for:

- TypeScript and JavaScript
- Python
- Shell scripts (Bash)
- YAML and JSON
- Documentation (Markdown)

## Key Principles

### 1. Strict Formatting

All code must pass automated formatting checks:

- **ESLint** for TypeScript/JavaScript
- **Prettier** for code formatting
- **Black** for Python
- **markdownlint** for documentation

### 2. AI-Friendly Metadata

Source files should include metadata tags for improved AI understanding:

```typescript
// @module: core-types
/**
 * Core type definitions for REACH
 */
export interface User {
  id: string;
  name: string;
}
```

### 3. Type Safety

TypeScript must be configured with strict mode:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Validation

All PRs are automatically validated against the style guide in CI. You can run validation locally:

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Run validation
uv run python scripts/validate_style_guide.py
```

## Language-Specific Guidelines

### TypeScript

- Add `@module:` tags to all source files
- Use strict type checking
- Export explicit types for public APIs
- Write TSDoc comments for public functions

Example:

```typescript
// @module: voice-processor

/**
 * Process audio input for speech recognition.
 *
 * @param audio - Raw audio buffer
 * @returns Transcribed text
 */
export async function processAudio(audio: AudioBuffer): Promise<string> {
  // Implementation
}
```

### Python

- Follow PEP 8 style guide
- Use Black for formatting
- Add type hints for function signatures
- Include module docstrings

Example:

```python
# @module: validation

"""Validation utilities for REACH."""

def validate_input(data: dict) -> bool:
    """
    Validate input data structure.

    Args:
        data: Input data dictionary

    Returns:
        True if valid, False otherwise
    """
    # Implementation
```

### Markdown

- Use markdownlint for consistency
- Maximum line length: 120 characters
- Include proper heading hierarchy
- Add code language specifiers to fenced code blocks

## Pre-commit Hooks

Install pre-commit hooks to automatically validate code before commits:

```bash
# Install pre-commit
uv run pre-commit install

# Run manually
uv run pre-commit run --all-files
```

## Resources

- [**The Dukes Engineering Style Guide**](https://tydukes.github.io/coding-style-guide/)
- [TypeScript Guide](https://tydukes.github.io/coding-style-guide/02_language_guides/typescript/)
- [Python Guide](https://tydukes.github.io/coding-style-guide/02_language_guides/python/)
- [Metadata Schema](https://tydukes.github.io/coding-style-guide/03_metadata_schema/schema_reference/)

## Questions?

If you're unsure about code style requirements, check the style guide documentation or ask in the PR discussion.
