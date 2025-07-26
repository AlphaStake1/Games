# Security Documentation

This directory contains security-related documentation and tooling for the Football Squares dApp.

## Contents

- [Semgrep MCP Integration](./SEMGREP_MCP_SETUP.md) - Static analysis security scanning
- [Custom Security Rules](./CUSTOM_RULES.md) - Solana/dApp specific security patterns
- [CI/CD Security Integration](./CI_SECURITY.md) - Automated security checks
- [Security Configuration](./SECURITY_CONFIG.md) - Configuration and troubleshooting

## Quick Start

1. Follow the [Semgrep MCP Setup Guide](./SEMGREP_MCP_SETUP.md)
2. Review and implement [Custom Security Rules](./CUSTOM_RULES.md)
3. Integrate with CI/CD using [Security Integration Guide](./CI_SECURITY.md)

## Security Principles

- **Privacy First**: All scanning runs locally, no data sent to external services
- **Defense in Depth**: Multiple layers of security validation
- **Automated Detection**: Catch common vulnerabilities before deployment
- **Custom Rules**: dApp-specific security patterns for Solana programs
