# Security Policy

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please use GitHub's Security Advisory feature:
1. Go to the Security tab
2. Click "Report a vulnerability"
3. Fill out the form with details

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Automated Security Scanning

REACH employs multiple layers of automated security scanning to protect against vulnerabilities:

### Code Scanning

**CodeQL** - Semantic code analysis runs on every push and PR:

- Scans JavaScript/TypeScript code for security vulnerabilities
- Uses `security-extended` query suite for comprehensive coverage
- Results appear in GitHub Security tab
- Weekly scheduled scans on Mondays at 10:00 UTC

### Dependency Scanning

**npm audit** - Runs in CI pipeline on every commit:

- Checks for known vulnerabilities in npm dependencies
- Fails build on moderate or higher severity issues
- Part of the standard CI workflow

**Dependabot** - Automated dependency updates:

- Weekly scans for outdated dependencies
- Automatically creates PRs for security updates
- Groups minor/patch updates to reduce noise
- Configured for both npm packages and GitHub Actions

### Supply Chain Security

**Socket.dev** - Detects malicious packages and supply chain attacks:

- Analyzes package.json changes in PRs
- Detects typosquatting, hidden code, and suspicious behavior
- Comments on PRs with security findings
- Requires `SOCKET_SECURITY_API_KEY` secret (free for open source)
- **Setup**: Get API key at <https://socket.dev>

**Snyk** - Comprehensive vulnerability scanning (alternative to Socket):

- Scans for known vulnerabilities in dependencies
- Uploads results to GitHub Security tab
- Monitors project for ongoing vulnerability tracking
- Weekly scheduled scans on Mondays at 11:00 UTC
- Requires `SNYK_TOKEN` secret (free for open source)
- **Setup**: Get token at <https://snyk.io>

### Which Tool Should We Use?

**Socket.dev** is recommended for this project because:

- Focuses on supply chain security and malicious packages
- Lightweight and complements our existing npm audit
- Better at detecting novel attacks and suspicious patterns
- Free for open source with minimal setup

**Snyk** provides value if we want:

- More comprehensive vulnerability database
- Integration with IDE and local development
- Container and infrastructure-as-code scanning (future use)
- Automated fix PRs

**Recommendation**: Start with Socket.dev. Add Snyk later if we need more comprehensive coverage.

### Configuring Security Secrets

To enable Socket.dev and Snyk scanning:

1. **Socket.dev** (recommended):

   ```bash
   # Get API key from https://socket.dev
   # Add as repository secret: SOCKET_SECURITY_API_KEY
   ```

2. **Snyk** (optional):

   ```bash
   # Get token from https://snyk.io
   # Add as repository secret: SNYK_TOKEN
   ```

Go to: Settings → Secrets and variables → Actions → New repository secret

### Security Alerts

GitHub Security Alerts are enabled for:

- Dependabot alerts for vulnerable dependencies
- CodeQL findings in the Security tab
- Secret scanning (if repository is public)

Maintainers receive notifications for critical security issues.

## Security Best Practices

When contributing:

- Never commit API keys, passwords, or secrets
- Use environment variables for sensitive data
- Follow principle of least privilege
- Validate all user inputs
- Encrypt sensitive data at rest
- Review security scan results in PRs before merging
- Address security findings promptly

Thank you for helping keep REACH secure!
