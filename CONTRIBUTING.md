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
- Node.js 20+
- Docker Desktop (for dev container)
- Git

### Quick Start
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
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📝 Commit Messages

Follow conventional commits:
- `feat: add voice input support`
- `fix: resolve memory leak in session manager`
- `docs: update installation guide`
- `test: add tests for guardrails`

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

