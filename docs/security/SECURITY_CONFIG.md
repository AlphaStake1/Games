# Security Configuration & Troubleshooting

> **Configuration Management and Issue Resolution for Semgrep MCP**

This document provides comprehensive configuration options, troubleshooting guidance, and operational best practices for maintaining security scanning in the Football Squares dApp.

## Table of Contents

- [Configuration Management](#configuration-management)
- [Rule Configuration](#rule-configuration)
- [Environment Setup](#environment-setup)
- [Performance Tuning](#performance-tuning)
- [Common Issues](#common-issues)
- [Debugging Guide](#debugging-guide)
- [Maintenance Tasks](#maintenance-tasks)

## Configuration Management

### Main Configuration File

Create `docs/security/.semgrep.yml`:

```yaml
# Semgrep configuration for Football Squares dApp
# Updated: 2024-01-26

# Rule sources - ordered by priority
rules:
  # Custom dApp-specific rules (highest priority)
  - docs/security/rules/anchor-critical.yml
  - docs/security/rules/squares-specific.yml
  - docs/security/rules/web3-frontend.yml
  - docs/security/rules/react-security.yml

  # Community rulesets
  - p/security-audit # General security patterns
  - p/rust # Rust-specific rules
  - p/typescript # TypeScript/JavaScript rules
  - p/docker # Docker security
  - p/secrets # Secret detection
  - p/ci # CI/CD security

# Global exclusions
exclude:
  # Build artifacts
  - 'node_modules/'
  - 'target/'
  - 'out/'
  - 'test-ledger/'
  - '*.min.js'
  - '*.generated.*'

  # Documentation and assets
  - 'docs/'
  - 'README.md'
  - '*.md'
  - 'public/assets/'
  - 'Assets/'

  # Development files
  - '*.log'
  - '.env*'
  - '*.tmp'
  - '.git/'

  # Known false positives
  - 'components/ui/*.tsx' # shadcn/ui components
  - 'lib/utils.ts' # Utility functions

# Path-specific inclusions (override excludes)
include:
  - 'programs/**/*.rs' # Always scan Anchor programs
  - 'agents/**/*.ts' # Always scan agent code
  - 'scripts/**/*.ts' # Always scan automation scripts

# Severity filtering
severity:
  - ERROR
  - WARNING
  # INFO excluded by default to reduce noise

# Output configuration
output:
  format: json
  destination: stdout

# Performance settings
max_memory: 2048 # MB
timeout: 300 # seconds
jobs: 4 # parallel jobs

# Metrics and telemetry (disabled for privacy)
metrics: false
anonymous_telemetry: false
```

### Environment-Specific Configurations

#### Development Configuration

Create `docs/security/.semgrep.dev.yml`:

```yaml
extends: docs/security/.semgrep.yml

# More permissive for development
severity:
  - ERROR
  - WARNING
  - INFO

# Additional development rules
rules:
  - p/performance
  - p/correctness

# Less strict exclusions
exclude:
  - 'node_modules/'
  - 'target/'

# Enable experimental rules
experimental: true
```

#### Production Configuration

Create `docs/security/.semgrep.prod.yml`:

```yaml
extends: docs/security/.semgrep.yml

# Strict security-only for production
severity:
  - ERROR

# Additional production security rules
rules:
  - p/owasp-top-10
  - p/cwe-top-25

# Stricter timeout for CI/CD
timeout: 600

# Enable all custom rules
include_custom_rules: true
```

### Project-Specific Ignores

Create `.semgrepignore`:

```gitignore
# Semgrep ignore patterns for Football Squares dApp

# Build and dependency directories
node_modules/
target/
.next/
out/
dist/
build/

# Test artifacts
test-ledger/
*.test.ts
*.test.tsx
__tests__/
coverage/

# Documentation
docs/
*.md
README*

# Generated files
*.generated.*
*.d.ts
*.min.js
*.bundle.js

# Asset files
public/assets/
Assets/
*.png
*.jpg
*.svg
*.ico

# Configuration files (secrets handled separately)
.env*
*.config.js
*.config.ts

# Known safe third-party code
ceramic/client.ts:1-50     # Third-party ceramic integration
helio-docs/                # External API documentation

# False positive suppressions
# Format: filename:line_number:rule_id
components/ui/chart.tsx:*:typescript.react.security.audit.react-dangerously-set-inner-html.react-dangerously-set-inner-html
lib/markdown.tsx:57:typescript.react.security.audit.react-dangerously-set-inner-html.react-dangerously-set-inner-html

# Temporary suppression for known issues
# TODO: Remove after fixing
programs/squares/src/lib.rs:200:rust.lang.security.audit.unsafe-usage
```

## Rule Configuration

### Rule Priority and Conflicts

When multiple rules match the same pattern, Semgrep uses this priority order:

1. **Custom rules** (highest priority)
2. **Explicit path includes**
3. **Community rulesets**
4. **Default exclusions** (lowest priority)

### Custom Rule Overrides

Create `docs/security/rules/overrides.yml`:

```yaml
rules:
  # Override built-in rule with custom logic
  - id: custom-missing-signer-check
    message: 'Football Squares: Account requires Signer constraint'
    languages: [rust]
    severity: ERROR
    pattern: |
      #[account(mut)]
      pub $ACCOUNT: Account<'info, $TYPE>,
    pattern-not-inside: |
      #[account(mut)]
      pub $ACCOUNT: Signer<'info>,
    metadata:
      category: security
      subcategory: access-control
      technology: [anchor, solana]
      confidence: HIGH
      impact: HIGH
      likelihood: MEDIUM
      references:
        - 'https://github.com/coral-xyz/anchor/blob/master/lang/attribute/account/src/lib.rs'
        - 'https://book.anchor-lang.com/anchor_references/account_constraints.html'

  # Suppress noisy rule for specific pattern
  - id: suppress-anchor-macro-complexity
    message: 'Anchor macro complexity suppressed for generated code'
    languages: [rust]
    severity: INFO
    pattern: |
      #[derive(Accounts)]
    metadata:
      suppress: rust.cognitive-complexity
```

### Rule Testing Configuration

Create `docs/security/rules/.semgrep-rules-test.yml`:

```yaml
# Test configuration for custom rules
test_config:
  # Test data directory
  test_data_dir: 'docs/security/tests/'

  # Test pattern matching
  pattern_tests:
    - rule_id: missing-signer-check
      should_match:
        - |
          #[account(mut)]
          pub authority: Account<'info, Authority>,
      should_not_match:
        - |
          #[account(mut)]
          pub authority: Signer<'info>,

    - rule_id: unchecked-wallet-connection
      should_match:
        - |
          const { publicKey } = useWallet();
          purchaseSquare(publicKey);
      should_not_match:
        - |
          const { publicKey } = useWallet();
          if (!publicKey) return;
          purchaseSquare(publicKey);

  # Performance benchmarks
  performance_tests:
    - name: 'Large Rust file scan'
      file_size_kb: 500
      expected_time_ms: 2000

    - name: 'TypeScript component scan'
      file_count: 100
      expected_time_ms: 5000
```

## Environment Setup

### Docker Configuration

Create `docs/security/docker-compose.semgrep.yml`:

```yaml
version: '3.8'

services:
  semgrep-scanner:
    image: semgrep/semgrep:latest
    volumes:
      - .:/src:ro
      - ./docs/security:/config:ro
      - semgrep-cache:/tmp/semgrep-cache
    environment:
      - SEMGREP_APP_TOKEN=${SEMGREP_APP_TOKEN:-}
      - SEMGREP_TIMEOUT=600
      - SEMGREP_MAX_MEMORY=4096
    command: >
      --config /config/.semgrep.yml 
      --json 
      --output /src/security-results.json
      --metrics=off
      /src
    networks:
      - security-net

  semgrep-server:
    image: semgrep/semgrep:latest
    ports:
      - '8081:8081'
    volumes:
      - .:/workspace:ro
      - ./docs/security:/config:ro
    environment:
      - SEMGREP_SERVE_PORT=8081
      - SEMGREP_SERVE_HOST=0.0.0.0
    command: --serve --config /config/.semgrep.yml
    networks:
      - security-net

volumes:
  semgrep-cache:
    driver: local

networks:
  security-net:
    driver: bridge
```

### Local Development Setup

Create `scripts/security-setup.sh`:

```bash
#!/bin/bash
set -e

echo "🔧 Setting up Semgrep MCP for Football Squares dApp..."

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git is required but not installed. Aborting." >&2; exit 1; }

# Create security directories
mkdir -p docs/security/{rules,tests,reports}

# Pull latest Semgrep image
echo "📦 Pulling Semgrep Docker image..."
docker pull semgrep/semgrep:latest

# Validate configuration
echo "🔍 Validating Semgrep configuration..."
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --validate docs/security/.semgrep.yml

# Test custom rules
echo "🧪 Testing custom security rules..."
if [ -f "docs/security/rules/anchor-critical.yml" ]; then
  docker run --rm -v $PWD:/src semgrep/semgrep:latest \
    --test docs/security/rules/anchor-critical.yml
fi

# Setup Git hooks
echo "🪝 Setting up Git hooks..."
if [ ! -f ".git/hooks/pre-commit" ]; then
  cp docs/security/templates/pre-commit .git/hooks/pre-commit
  chmod +x .git/hooks/pre-commit
  echo "✅ Pre-commit hook installed"
fi

# Create initial security baseline
echo "📊 Creating security baseline..."
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config docs/security/.semgrep.yml \
  --json \
  --output docs/security/reports/baseline.json \
  --metrics=off \
  /src

# Generate security report
echo "📋 Generating initial security report..."
python3 scripts/generate-security-report.py docs/security/reports/baseline.json

echo "✅ Semgrep MCP setup complete!"
echo ""
echo "Next steps:"
echo "1. Review docs/security/reports/baseline.json"
echo "2. Customize rules in docs/security/rules/"
echo "3. Run: npm run security:scan"
```

### IDE Integration

#### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "semgrep.enable": true,
  "semgrep.configPath": "docs/security/.semgrep.yml",
  "semgrep.onSave": true,
  "semgrep.languages": ["rust", "typescript", "javascript"],
  "semgrep.exclude": ["node_modules/**", "target/**", "out/**"],
  "files.associations": {
    "*.semgrep.yml": "yaml",
    ".semgrepignore": "ignore"
  }
}
```

#### Neovim Configuration

For Neovim users, add to your config:

```lua
-- Semgrep integration for Football Squares dApp
require('lspconfig').semgrep.setup({
  cmd = {'docker', 'run', '--rm', '-v', vim.fn.getcwd() .. ':/src', 'semgrep/semgrep:latest'},
  filetypes = {'rust', 'typescript', 'javascript'},
  root_dir = require('lspconfig.util').find_git_ancestor,
  settings = {
    configPath = 'docs/security/.semgrep.yml'
  }
})
```

## Performance Tuning

### Memory Optimization

For large codebases, tune memory usage:

```yaml
# In .semgrep.yml
performance:
  max_memory_mb: 4096
  max_target_bytes: 5000000 # 5MB per file
  timeout_threshold: 30 # seconds per rule

# Exclude large generated files
exclude:
  - '**/*.min.js'
  - '**/*.bundle.js'
  - '**/dist/**'
  - 'out/**/*.html' # Large generated HTML
```

### Parallel Processing

Configure parallel scanning:

```bash
# Use multiple CPU cores
docker run --rm \
  --cpus="4" \
  -v $PWD:/src \
  semgrep/semgrep:latest \
  --config docs/security/.semgrep.yml \
  --jobs 4 \
  /src
```

### Incremental Scanning

For CI/CD optimization:

```bash
#!/bin/bash
# Incremental scan script

# Get changed files since last scan
CHANGED_FILES=$(git diff --name-only HEAD~1 | grep -E '\.(rs|ts|tsx|js|jsx)$')

if [ -n "$CHANGED_FILES" ]; then
  echo "Scanning changed files: $CHANGED_FILES"
  docker run --rm -v $PWD:/src semgrep/semgrep:latest \
    --config docs/security/.semgrep.yml \
    --json \
    $CHANGED_FILES
else
  echo "No relevant files changed, skipping scan"
fi
```

## Common Issues

### Issue: Docker Permission Denied

**Symptoms:**

```
docker: permission denied while trying to connect to the Docker daemon socket
```

**Solutions:**

```bash
# Option 1: Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Option 2: Use sudo (not recommended for CI)
sudo docker run --rm -v $PWD:/src semgrep/semgrep:latest ...

# Option 3: Fix socket permissions (temporary)
sudo chmod 666 /var/run/docker.sock
```

### Issue: Out of Memory Errors

**Symptoms:**

```
Killed
semgrep: error: Process was killed due to excessive memory usage
```

**Solutions:**

```bash
# Increase Docker memory limit
docker run --rm -m 8g -v $PWD:/src semgrep/semgrep:latest ...

# Exclude large files
echo "**/*.min.js" >> .semgrepignore
echo "out/**" >> .semgrepignore

# Process files in batches
find . -name "*.rs" | head -50 | xargs docker run --rm -v $PWD:/src semgrep/semgrep:latest --config docs/security/.semgrep.yml
```

### Issue: False Positives

**Symptoms:**

```
Multiple warnings in generated or third-party code
```

**Solutions:**

```yaml
# In custom rules - add pattern-not-inside
rules:
  - id: my-rule
    pattern: dangerous_pattern()
    pattern-not-inside: |
      // Generated code - ignore
      ...
```

```gitignore
# In .semgrepignore - suppress by file and rule
components/ui/generated.tsx:*:rule-id
lib/third-party.ts:100-200:*
```

### Issue: Rule Conflicts

**Symptoms:**

```
Rule 'my-rule' conflicts with 'p/security-audit.rule-name'
```

**Solutions:**

```yaml
# Override conflicting rule
rules:
  - id: my-rule
    message: 'Custom implementation'
    # ... rule definition
    metadata:
      overrides: ['p/security-audit.rule-name']
```

## Debugging Guide

### Verbose Output

Enable detailed logging:

```bash
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config docs/security/.semgrep.yml \
  --verbose \
  --debug \
  /src
```

### Rule Testing

Test individual rules:

```bash
# Test specific rule
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config docs/security/rules/anchor-critical.yml \
  --test \
  docs/security/tests/

# Validate rule syntax
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --validate docs/security/rules/my-rule.yml
```

### Performance Profiling

Profile scan performance:

```bash
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config docs/security/.semgrep.yml \
  --time \
  --json \
  /src | jq '.time'
```

### Custom Debug Script

Create `scripts/debug-security.py`:

```python
#!/usr/bin/env python3
"""Debug security scanning issues"""

import json
import subprocess
import sys
from pathlib import Path

def run_semgrep_debug(config_path, target_path):
    """Run Semgrep with debug output"""
    cmd = [
        'docker', 'run', '--rm',
        '-v', f'{Path.cwd()}:/src',
        'semgrep/semgrep:latest',
        '--config', config_path,
        '--verbose',
        '--debug',
        '--json',
        target_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"❌ Semgrep failed with exit code {result.returncode}")
        print(f"STDERR: {result.stderr}")
        return None

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse JSON output: {e}")
        return None

def analyze_results(results):
    """Analyze and categorize results"""
    if not results:
        return

    by_severity = {}
    by_rule = {}

    for result in results.get('results', []):
        severity = result['extra']['severity']
        rule_id = result['check_id']

        by_severity.setdefault(severity, []).append(result)
        by_rule.setdefault(rule_id, []).append(result)

    print("📊 Results Summary:")
    for severity, items in by_severity.items():
        print(f"  {severity}: {len(items)}")

    print("\n🔍 Top Rules:")
    for rule_id, items in sorted(by_rule.items(), key=lambda x: len(x[1]), reverse=True)[:5]:
        print(f"  {rule_id}: {len(items)} findings")

if __name__ == "__main__":
    config = sys.argv[1] if len(sys.argv) > 1 else "docs/security/.semgrep.yml"
    target = sys.argv[2] if len(sys.argv) > 2 else "/src"

    print(f"🔍 Debugging Semgrep scan with config: {config}")
    results = run_semgrep_debug(config, target)
    analyze_results(results)
```

## Maintenance Tasks

### Regular Updates

Create `scripts/update-security-rules.sh`:

```bash
#!/bin/bash
# Update security rules and configurations

echo "🔄 Updating Semgrep security rules..."

# Update Semgrep image
docker pull semgrep/semgrep:latest

# Update community rulesets
docker run --rm semgrep/semgrep:latest --update

# Validate all custom rules
for rule_file in docs/security/rules/*.yml; do
  echo "Validating $rule_file..."
  docker run --rm -v $PWD:/src semgrep/semgrep:latest \
    --validate "$rule_file"
done

# Run regression tests
echo "🧪 Running security rule tests..."
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --test docs/security/rules/

echo "✅ Security rules updated and tested"
```

### Performance Monitoring

Create monitoring dashboard data:

```bash
#!/bin/bash
# Generate performance metrics

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="docs/security/reports/performance_${TIMESTAMP}.json"

echo "📈 Generating performance report..."

# Run scan with timing
time docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config docs/security/.semgrep.yml \
  --time \
  --json \
  --output "$REPORT_FILE" \
  /src

echo "Performance report saved to: $REPORT_FILE"
```

This comprehensive configuration and troubleshooting guide ensures smooth operation of Semgrep MCP security scanning for the Football Squares dApp.
