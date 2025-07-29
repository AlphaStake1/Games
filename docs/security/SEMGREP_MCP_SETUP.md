# Semgrep MCP Integration Guide

> **Privacy-First Static Analysis for Football Squares dApp**

This guide walks through setting up Semgrep MCP (Model Context Protocol) for automated security scanning of your Solana dApp without sending any code to external services.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Custom Rules](#custom-rules)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

### What is Semgrep MCP?

Semgrep MCP is a self-hosted wrapper around the open-source Semgrep static analysis engine that:

- Runs completely offline with no telemetry
- Supports Rust (Anchor), TypeScript/JavaScript, YAML, and more
- Provides REST API endpoints for programmatic scanning
- Integrates with development workflows and CI/CD pipelines

### Why Use It?

For the Football Squares dApp, Semgrep MCP provides:

- **Anchor Program Security**: Detect common Solana smart contract vulnerabilities
- **Frontend Protection**: Find XSS, injection, and wallet security issues
- **Infrastructure Security**: Scan Docker, GitHub Actions, and configuration files
- **Zero External Dependencies**: Maintains operational security and privacy

## Installation

### Prerequisites

- Docker installed and running
- Git access to semgrep/mcp repository
- Node.js/npm for optional CLI tools

### Method 1: Docker (Recommended)

```bash
# Clone the Semgrep MCP repository
git clone https://github.com/semgrep/mcp.git
cd mcp

# Build the Docker container
docker build -t semgrep-mcp .

# Verify installation
docker run --rm semgrep-mcp --version
```

### Method 2: Local Installation

```bash
# Install Semgrep locally
pip install semgrep

# Clone MCP server
git clone https://github.com/semgrep/mcp.git
cd mcp

# Install dependencies
npm install

# Start the server
npm start
```

## Configuration

### Basic Configuration

Create a configuration file at `docs/security/.semgrep.yml`:

```yaml
# Semgrep configuration for Football Squares dApp
rules:
  - p/security-audit # General security rules
  - p/rust # Rust/Anchor specific rules
  - p/typescript # TypeScript/JavaScript rules
  - p/docker # Docker security rules
  - p/secrets # Secret detection

exclude:
  - 'node_modules/'
  - 'target/'
  - 'out/'
  - 'test-ledger/'
  - '*.min.js'

severity:
  - ERROR
  - WARNING
```

### Environment Variables

Add to your `.env.local`:

```bash
# Semgrep MCP Configuration
SEMGREP_MCP_HOST=localhost
SEMGREP_MCP_PORT=8081
SEMGREP_RULES_PATH=./docs/security/rules/
SEMGREP_CONFIG_PATH=./docs/security/.semgrep.yml
```

### Project-Specific Ignore File

Create `.semgrepignore` in project root:

```gitignore
# Build artifacts
node_modules/
target/
out/
test-ledger/

# Generated files
*.generated.ts
*.d.ts

# Test files (optional - remove if you want to scan tests)
__tests__/
*.test.ts
*.test.tsx

# Vendor directories
ceramic/
helio-docs/
```

## Usage

### Command Line Scanning

```bash
# Full project scan
docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/security-audit /src

# Scan specific directories
docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/rust /src/programs/
docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/typescript /src/components/

# Scan with JSON output
docker run --rm -v $PWD:/src semgrep-mcp semgrep --json --config p/security-audit /src > security-scan.json
```

### API Usage

Start the MCP server:

```bash
docker run -d -p 8081:8081 -v $PWD:/workspace semgrep-mcp server
```

Make API requests:

```bash
# Scan endpoint
curl -X POST http://localhost:8081/scan \
  -H "Content-Type: application/json" \
  -d '{
    "path": "/workspace",
    "config": "p/security-audit",
    "format": "json"
  }'

# Health check
curl http://localhost:8081/health
```

### Integration with Development Workflow

Add to your `package.json`:

```json
{
  "scripts": {
    "security:scan": "docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/security-audit /src",
    "security:rust": "docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/rust /src/programs/",
    "security:frontend": "docker run --rm -v $PWD:/src semgrep-mcp semgrep --config p/typescript /src/components/ /src/app/",
    "security:all": "pnpm run security:scan && pnpm run security:rust && pnpm run security:frontend"
  }
}
```

## Custom Rules

### Solana-Specific Rules

Create `docs/security/rules/solana.yml`:

```yaml
rules:
  - id: missing-pda-bump-check
    pattern-either:
      - pattern: |
          let ($SEEDS, $BUMP) = Pubkey::find_program_address(&[$...], &$PROGRAM_ID);
          ...
          seeds = [$SEEDS],
          bump = $BUMP
    message: 'PDA bump should be validated against expected value'
    languages: [rust]
    severity: WARNING

  - id: unchecked-lamport-arithmetic
    pattern-either:
      - pattern: |
          $ACCOUNT.lamports() + $AMOUNT
      - pattern: |
          $ACCOUNT.lamports() - $AMOUNT
    message: 'Lamport arithmetic should use checked operations'
    languages: [rust]
    severity: ERROR

  - id: missing-authority-check
    pattern: |
      pub fn $FUNCTION(ctx: Context<$CONTEXT>) -> Result<()> {
        ...
      }
    pattern-not-inside: |
      require!($AUTHORITY_CHECK, ...);
    message: 'Function may be missing authority validation'
    languages: [rust]
    severity: WARNING
```

### Frontend Security Rules

Create `docs/security/rules/frontend.yml`:

```yaml
rules:
  - id: wallet-connection-without-validation
    pattern: |
      const { publicKey } = useWallet();
      ...
      $FUNCTION($...publicKey$...)
    pattern-not-inside: |
      if (!publicKey) return;
    message: 'Wallet public key used without null check'
    languages: [typescript, javascript]
    severity: ERROR

  - id: hardcoded-rpc-endpoint
    pattern-regex: |
      https?://[^/]*solana\.com
    message: 'Hardcoded RPC endpoint should use environment variable'
    languages: [typescript, javascript]
    severity: WARNING

  - id: dangerous-websocket-parsing
    pattern: |
      JSON.parse($WS_DATA)
    pattern-not-inside: |
      try {
        ...
        JSON.parse($WS_DATA)
        ...
      } catch (...) {
        ...
      }
    message: 'WebSocket JSON parsing should be wrapped in try-catch'
    languages: [typescript, javascript]
    severity: ERROR
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run Semgrep Security Scan
        run: |
          docker run --rm -v $PWD:/src \
            -v $PWD/docs/security/.semgrep.yml:/config.yml \
            semgrep/semgrep:latest \
            --config /config.yml \
            --json \
            --output security-results.json \
            /src

      - name: Upload Security Results
        uses: actions/upload-artifact@v3
        with:
          name: security-scan-results
          path: security-results.json

      - name: Check for Critical Issues
        run: |
          critical_count=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' security-results.json)
          if [ "$critical_count" -gt 0 ]; then
            echo "Found $critical_count critical security issues"
            exit 1
          fi
```

### Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Security scan pre-commit hook

echo "Running security scan..."

# Run Semgrep on staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(rs|ts|tsx|js|jsx|yaml|yml)$')

if [ -n "$staged_files" ]; then
  docker run --rm -v $PWD:/src semgrep-mcp semgrep \
    --config p/security-audit \
    --config docs/security/rules/ \
    --error \
    /src

  if [ $? -ne 0 ]; then
    echo "Security scan failed. Commit aborted."
    exit 1
  fi
fi

echo "Security scan passed."
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

## Troubleshooting

### Common Issues

**Docker Permission Issues**

```bash
# Fix Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

**False Positives in Anchor Macros**

```yaml
# Add to .semgrep.yml
exclude:
  - 'programs/*/src/lib.rs:*derive*'
```

**Memory Issues with Large Scans**

```bash
# Increase Docker memory limit
docker run --rm -m 4g -v $PWD:/src semgrep-mcp semgrep --config p/security-audit /src
```

### Debugging

Enable verbose output:

```bash
docker run --rm -v $PWD:/src semgrep-mcp semgrep --verbose --config p/security-audit /src
```

Check rule syntax:

```bash
docker run --rm -v $PWD:/src semgrep-mcp semgrep --validate --config docs/security/rules/
```

## Next Steps

1. **Install and test basic scanning**: Follow the installation steps above
2. **Implement custom rules**: Create Solana-specific security patterns
3. **Integrate with CI/CD**: Add automated security checks to your pipeline
4. **Monitor and refine**: Regularly review and update security rules

For detailed custom rule creation, see [Custom Security Rules](./CUSTOM_RULES.md).
For CI/CD integration examples, see [CI Security Integration](./CI_SECURITY.md).
