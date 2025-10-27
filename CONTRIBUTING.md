# Contributing to REACH

Thank you for your interest in contributing to REACH! We welcome contributions from everyone, especially those with lived experience with disabilities.

## 🎯 Our Mission

REACH aims to make computing accessible to everyone through AI-powered voice interfaces. Accessibility is not a feature—it's our core principle.

## 🚀 Getting Started

1. **Find an issue**: Check our [issues](https://github.com/tydukes/reach/issues) or [project board](https://github.com/tydukes/reach/projects/1)
2. **Comment on it**: Let us know you're working on it
3. **Fork the repo**: Click "Fork" button (if external contributor)
4. **Create a branch**: `git checkout -b feature/issue-NUMBER-description`
5. **Make changes**: Write code, tests, and docs
6. **Submit PR**: Push and create a Pull Request

## 📋 Development Setup

### Prerequisites

- **Docker Desktop**: Required for dev container environment
- **Visual Studio Code**: With Remote - Containers extension
- **Git**: Version control

### Option 1: Dev Container (Recommended)

The easiest way to get started is using the VSCode dev container, which provides a consistent development environment with all dependencies pre-installed.

1. **Install Prerequisites**:
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Install [Visual Studio Code](https://code.visualstudio.com/)
   - Install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Open in Dev Container**:

   ```bash
   git clone https://github.com/tydukes/reach.git
   cd reach
   code .
   ```

   - VSCode will detect the `.devcontainer` configuration
   - Click "Reopen in Container" when prompted
   - Wait for the container to build and start (first time takes 5-10 minutes)
   - Dependencies will be automatically installed via `npm install`

3. **Verify Setup**:

   ```bash
   node --version    # Should be 24.x or higher
   npm --version     # Should be 10.x or higher
   python3 --version # Should be 3.11.x or higher
   npm test          # Run tests
   ```

**What's Included in the Dev Container:**

- Node.js 24+ with npm
- Python 3.11+ for future ML tools
- Audio libraries (ALSA, PortAudio, FFmpeg) for voice processing
- Git, Zsh with Oh My Zsh
- VSCode extensions: ESLint, Prettier, TypeScript, GitLens, and more
- Pre-configured linting and formatting

### Option 2: Local Setup

If you prefer to develop locally without Docker:

1. **Install Prerequisites**:
   - Node.js 24+ from [nodejs.org](https://nodejs.org/)
   - Python 3.11+ from [python.org](https://python.org/)
   - Audio libraries for your OS:
     - **Linux**: `sudo apt-get install libasound2-dev libportaudio2 portaudio19-dev libsndfile1-dev ffmpeg`
     - **macOS**: `brew install portaudio libsndfile ffmpeg`
     - **Windows**: Install via vcpkg or chocolatey

2. **Clone and Install**:

   ```bash
   git clone https://github.com/tydukes/reach.git
   cd reach
   npm install
   npm test
   ```

## ✅ Pull Request Guidelines

- **Reference the issue**: Include "Closes #123" in PR description
- **Write tests**: All new code should have tests
- **Update docs**: If you change behavior, update documentation
- **Follow conventions**: Run `npm run lint` before committing
- **Keep it focused**: One PR per feature/fix

## 🧪 Testing

REACH uses **Vitest** for unit and integration tests, and **Playwright** for end-to-end (E2E) tests.

### Running Tests

```bash
# Unit & Integration Tests (Vitest)
npm test                 # Run all tests once
npm run test:watch       # Watch mode (re-runs on file changes)
npm run test:ui          # Interactive UI for debugging tests
npm run test:coverage    # Generate coverage report

# E2E Tests (Playwright)
npm run test:e2e         # Run E2E tests headless
npm run test:e2e:ui      # Run E2E tests with Playwright UI
npm run test:e2e:headed  # Run E2E tests with visible browser
```

### Writing Tests

#### Unit Tests

- Place test files next to the code they test: `src/module.ts` → `src/module.test.ts`
- Use descriptive test names that explain what is being tested
- Follow the Arrange-Act-Assert pattern
- Use test utilities from `@reach/core/test-utils`

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './module';

describe('myFunction', () => {
  it('should return expected value when given valid input', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

#### E2E Tests

- Place E2E tests in the `e2e/` directory at the project root
- Test complete user workflows, not individual functions
- Use Playwright's accessibility testing features
- Test with multiple browsers (Chromium, Firefox, WebKit)

Example:

```typescript
import { test, expect } from '@playwright/test';

test('user can complete voice command workflow', async ({ page }) => {
  await page.goto('/');
  await page.click('[aria-label="Start voice input"]');
  // ... test workflow
});
```

### Coverage Requirements

- **Minimum coverage**: 80% for lines, functions, branches, and statements
- Coverage reports are generated in `coverage/` directory
- CI will fail if coverage drops below thresholds
- Focus on testing critical paths and edge cases

### Test Utilities

The `@reach/core/test-utils` package provides shared testing helpers:

```typescript
import { createMockLogger, delay, createSpy } from '@reach/core/test-utils';

// Mock logger for testing
const logger = createMockLogger();
logger.info('test');
expect(logger.info).toHaveBeenCalledWith('test');

// Delay for async tests
await delay(100);

// Create function spies
const spy = createSpy((a, b) => a + b);
const result = spy(2, 3);
expect(result).toBe(5);
```

### Accessibility Testing

All tests should consider accessibility:

- Use semantic HTML selectors (`[role="button"]`, `[aria-label="..."]`)
- Test keyboard navigation in E2E tests
- Verify ARIA attributes are present and correct
- Test with screen reader announcement expectations

## 🔍 Linting and Code Quality

REACH uses **ESLint 9** with TypeScript support to maintain code quality and consistency.

### Running the Linter

```bash
npm run lint              # Lint all packages
npm run lint -w @reach/core  # Lint specific package
```

### Configuration

- **ESLint 9 Flat Config**: Uses `eslint.config.mjs` instead of `.eslintrc.json`
- **TypeScript ESLint v8**: Type-aware linting with TypeScript support
- **Strict Rules**: Enforces best practices and catches common errors

### Common Lint Rules

- **No Unused Variables**: Variables with `_` prefix are allowed (e.g., `_unusedArg`)
- **Console Statements**: Only `console.warn()` and `console.error()` are allowed
- **Explicit Any**: Using `any` type triggers a warning (prefer specific types)
- **Function Return Types**: Inferred return types are allowed (no need for explicit types)

### Fixing Lint Issues

Most formatting issues can be auto-fixed:

```bash
npm run lint -- --fix     # Auto-fix issues across all packages
```

Before committing, always run the linter to catch any issues early.

## 📝 Commit Messages

Follow conventional commits:

- `feat: add voice input support`
- `fix: resolve memory leak in session manager`
- `docs: update installation guide`
- `test: add tests for guardrails`

## 🤖 AI-Assisted Development

**AI-assisted development is encouraged and embraced** on this project, especially given our accessibility focus. AI tools can help make development more accessible and productive.

### Best Practices

- **Always review AI-generated code**: Understand what the code does before committing
- **Test thoroughly**: Run tests and verify functionality works as expected
- **Check for accessibility**: Ensure AI suggestions maintain accessibility standards
- **Verify security**: Review for potential security issues or exposed credentials
- **Maintain code quality**: Ensure generated code follows project conventions and standards
- **Ask questions**: If you don't understand AI-generated code, ask for clarification or refactor it

### Using AI Tools

- **Claude Code, GitHub Copilot, Cursor**: All are great tools for this project
- **Context**: Share relevant files and project documentation with AI assistants
- **Iterative**: Work iteratively, reviewing and testing at each step
- **Human oversight**: You are responsible for all code committed, regardless of who/what wrote it

### Why We Encourage AI

- Makes coding more accessible to developers with disabilities
- Speeds up development while maintaining quality
- Helps with documentation and test generation
- Assists with accessibility best practices
- Reduces cognitive load for complex tasks

**Remember**: AI is a powerful tool, but human judgment, creativity, and oversight are irreplaceable.

## ♿ Accessibility First

When contributing UI changes:

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Ensure keyboard navigation works
- Verify WCAG 2.1 AAA compliance
- Test with high contrast mode

## 🤝 Code of Conduct

Be respectful, inclusive, and constructive. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## ❓ Questions?

- Open a [Discussion](https://github.com/tydukes/reach/discussions)
- Check existing issues and documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
