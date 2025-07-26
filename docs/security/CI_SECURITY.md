# CI/CD Security Integration

> **Automated Security Scanning for Football Squares dApp Pipeline**

This document provides comprehensive guidance for integrating Semgrep MCP security scanning into your continuous integration and deployment workflows.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Integration](#github-actions-integration)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Security Gates](#security-gates)
- [Reporting and Notifications](#reporting-and-notifications)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Overview

### Security-First CI/CD Philosophy

The Football Squares dApp follows a **security-first** approach where:

- No code reaches production without security validation
- Automated scanning catches issues before manual review
- Security feedback is immediate and actionable
- Privacy is maintained through self-hosted scanning

### Integration Points

| Stage            | Tool             | Purpose                    | Blocking |
| ---------------- | ---------------- | -------------------------- | -------- |
| **Pre-commit**   | Git hooks        | Catch issues before commit | Yes      |
| **Pull Request** | GitHub Actions   | Validate changes           | Yes      |
| **Main Branch**  | GitHub Actions   | Full security audit        | Yes      |
| **Deployment**   | Docker + Semgrep | Final security check       | Yes      |

## GitHub Actions Integration

### Basic Security Workflow

Create `.github/workflows/security.yml`:

```yaml
name: Security Analysis

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

env:
  SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}

jobs:
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    strategy:
      matrix:
        scan-type: [rust, typescript, docker, secrets]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Semgrep
        run: |
          docker pull semgrep/semgrep:latest
          # Verify Semgrep installation
          docker run --rm semgrep/semgrep:latest --version

      - name: Run Security Scan - ${{ matrix.scan-type }}
        run: |
          case "${{ matrix.scan-type }}" in
            rust)
              CONFIG="p/rust,docs/security/rules/anchor-critical.yml,docs/security/rules/squares-specific.yml"
              PATHS="programs/"
              ;;
            typescript)
              CONFIG="p/typescript,p/security-audit,docs/security/rules/web3-frontend.yml"
              PATHS="components/ app/ lib/ agents/"
              ;;
            docker)
              CONFIG="p/docker,docs/security/rules/docker-security.yml"
              PATHS="docker/ Dockerfile*"
              ;;
            secrets)
              CONFIG="p/secrets"
              PATHS="."
              ;;
          esac

          docker run --rm \
            -v $PWD:/src \
            -e SEMGREP_APP_TOKEN \
            semgrep/semgrep:latest \
            --config $CONFIG \
            --json \
            --output /src/security-${{ matrix.scan-type }}.json \
            --metrics=off \
            --quiet \
            /src/$PATHS

      - name: Process Results - ${{ matrix.scan-type }}
        run: |
          # Check for critical errors
          critical_count=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' security-${{ matrix.scan-type }}.json)
          warning_count=$(jq '[.results[] | select(.extra.severity == "WARNING")] | length' security-${{ matrix.scan-type }}.json)

          echo "Security Scan Results for ${{ matrix.scan-type }}:"
          echo "Critical Issues: $critical_count"
          echo "Warnings: $warning_count"

          # Set output for later use
          echo "critical_count=$critical_count" >> $GITHUB_OUTPUT
          echo "warning_count=$warning_count" >> $GITHUB_OUTPUT

      - name: Upload Security Results
        uses: actions/upload-artifact@v4
        with:
          name: security-results-${{ matrix.scan-type }}
          path: security-${{ matrix.scan-type }}.json
          retention-days: 30

      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('security-${{ matrix.scan-type }}.json', 'utf8'));

            const critical = results.results.filter(r => r.extra.severity === 'ERROR');
            const warnings = results.results.filter(r => r.extra.severity === 'WARNING');

            let comment = `## 🔍 Security Scan Results - ${{ matrix.scan-type }}\n\n`;
            comment += `- **Critical Issues**: ${critical.length}\n`;
            comment += `- **Warnings**: ${warnings.length}\n\n`;

            if (critical.length > 0) {
              comment += `### ❌ Critical Issues\n`;
              critical.forEach(issue => {
                comment += `- **${issue.check_id}**: ${issue.extra.message}\n`;
                comment += `  - File: \`${issue.path}:${issue.start.line}\`\n`;
              });
            }

            if (warnings.length > 0 && warnings.length <= 5) {
              comment += `\n### ⚠️ Warnings\n`;
              warnings.forEach(issue => {
                comment += `- **${issue.check_id}**: ${issue.extra.message}\n`;
                comment += `  - File: \`${issue.path}:${issue.start.line}\`\n`;
              });
            }

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

  security-gate:
    name: Security Gate
    runs-on: ubuntu-latest
    needs: security-scan
    if: always()

    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          pattern: security-results-*
          merge-multiple: true

      - name: Aggregate Results
        run: |
          total_critical=0
          total_warnings=0

          for file in security-*.json; do
            if [ -f "$file" ]; then
              critical=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' "$file")
              warnings=$(jq '[.results[] | select(.extra.severity == "WARNING")] | length' "$file")
              total_critical=$((total_critical + critical))
              total_warnings=$((total_warnings + warnings))
            fi
          done

          echo "Total Critical Issues: $total_critical"
          echo "Total Warnings: $total_warnings"

          # Fail if critical issues found
          if [ $total_critical -gt 0 ]; then
            echo "❌ Security gate failed: $total_critical critical issues found"
            exit 1
          fi

          # Warn if too many warnings
          if [ $total_warnings -gt 20 ]; then
            echo "⚠️ High number of warnings: $total_warnings (consider addressing)"
          fi

          echo "✅ Security gate passed"
```

### Solana-Specific Workflow

Create `.github/workflows/solana-security.yml`:

```yaml
name: Solana Security Analysis

on:
  push:
    paths:
      - 'programs/**'
      - 'Anchor.toml'
  pull_request:
    paths:
      - 'programs/**'
      - 'Anchor.toml'

jobs:
  anchor-security:
    name: Anchor Program Security
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install Anchor
        run: |
          npm install -g @coral-xyz/anchor-cli
          anchor --version

      - name: Anchor Build
        run: |
          anchor build

      - name: Run Anchor Security Scan
        run: |
          docker run --rm -v $PWD:/src semgrep/semgrep:latest \
            --config docs/security/rules/anchor-critical.yml \
            --config docs/security/rules/squares-specific.yml \
            --config p/rust \
            --json \
            --output anchor-security.json \
            --severity ERROR \
            /src/programs/

      - name: Check Anchor Tests
        run: |
          # Ensure tests pass before security validation
          anchor test --skip-local-validator

      - name: Validate Program Security
        run: |
          # Custom validation script for Solana programs
          cat > validate_anchor.py << 'EOF'
          import json
          import sys

          with open('anchor-security.json', 'r') as f:
              results = json.load(f)

          critical_issues = [r for r in results['results'] if r['extra']['severity'] == 'ERROR']

          if critical_issues:
              print(f"❌ Found {len(critical_issues)} critical security issues in Anchor programs:")
              for issue in critical_issues:
                  print(f"  - {issue['check_id']}: {issue['extra']['message']}")
                  print(f"    File: {issue['path']}:{issue['start']['line']}")
              sys.exit(1)
          else:
              print("✅ No critical security issues found in Anchor programs")
          EOF

          python validate_anchor.py
```

## Pre-commit Hooks

### Git Hook Setup

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

echo "🔍 Running pre-commit security checks..."

# Get list of staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM)

# Check if we have relevant files to scan
rust_files=$(echo "$staged_files" | grep -E '\.(rs)$' || true)
ts_files=$(echo "$staged_files" | grep -E '\.(ts|tsx|js|jsx)$' || true)
docker_files=$(echo "$staged_files" | grep -E '(Dockerfile|\.docker)' || true)

# Function to run security scan
run_security_scan() {
    local config=$1
    local paths=$2
    local scan_type=$3

    if [ -n "$paths" ]; then
        echo "🔍 Scanning $scan_type files..."
        docker run --rm -v $PWD:/src semgrep/semgrep:latest \
            --config $config \
            --error \
            --quiet \
            --no-git-ignore \
            /src || {
                echo "❌ Security scan failed for $scan_type files"
                echo "Please fix security issues before committing"
                exit 1
            }
    fi
}

# Run scans based on file types
if [ -n "$rust_files" ]; then
    run_security_scan "docs/security/rules/anchor-critical.yml,p/rust" "$rust_files" "Rust"
fi

if [ -n "$ts_files" ]; then
    run_security_scan "docs/security/rules/web3-frontend.yml,p/typescript" "$ts_files" "TypeScript"
fi

if [ -n "$docker_files" ]; then
    run_security_scan "docs/security/rules/docker-security.yml" "$docker_files" "Docker"
fi

# Always check for secrets in all staged files
echo "🔍 Checking for secrets..."
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
    --config p/secrets \
    --error \
    --quiet \
    --no-git-ignore \
    /src || {
        echo "❌ Secret detection failed"
        echo "Remove any hardcoded secrets before committing"
        exit 1
    }

echo "✅ All security checks passed"
```

### Husky Integration

If using Husky for Git hooks:

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0"
  }
}
```

Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run security scan
npm run security:precommit
```

Add to `package.json`:

```json
{
  "scripts": {
    "security:precommit": "docker run --rm -v $PWD:/src semgrep/semgrep:latest --config docs/security/.semgrep.yml --error /src"
  }
}
```

## Security Gates

### Branch Protection Rules

Configure branch protection in GitHub:

```yaml
# .github/branch-protection.yml
protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - 'Security Scan (rust)'
        - 'Security Scan (typescript)'
        - 'Security Gate'
        - 'Anchor Program Security'
    enforce_admins: true
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
    restrictions: null
```

### Deployment Gates

Create `.github/workflows/deploy-security.yml`:

```yaml
name: Deployment Security Check

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  pre-deploy-security:
    name: Pre-Deployment Security
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Full Security Scan
        run: |
          docker run --rm -v $PWD:/src semgrep/semgrep:latest \
            --config p/security-audit \
            --config docs/security/rules/ \
            --json \
            --output full-security-scan.json \
            --metrics=off \
            /src

      - name: Security Report
        run: |
          critical=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' full-security-scan.json)
          high=$(jq '[.results[] | select(.extra.severity == "WARNING")] | length' full-security-scan.json)

          echo "Pre-deployment Security Report for ${{ inputs.environment }}:"
          echo "Critical Issues: $critical"
          echo "High Priority Warnings: $high"

          if [ $critical -gt 0 ]; then
            echo "❌ Deployment blocked: Critical security issues found"
            exit 1
          fi

          if [ $high -gt 10 ]; then
            echo "⚠️ Warning: High number of security warnings ($high)"
            echo "Consider addressing before production deployment"
          fi

          echo "✅ Security check passed - deployment approved"
```

## Reporting and Notifications

### Discord Integration

Create webhook integration for security alerts:

```yaml
# In your security workflow
- name: Notify Discord on Security Issues
  if: failure()
  run: |
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{
           \"embeds\": [{
             \"title\": \"🚨 Security Alert\",
             \"description\": \"Security scan failed in ${{ github.repository }}\",
             \"color\": 15158332,
             \"fields\": [
               {\"name\": \"Branch\", \"value\": \"${{ github.ref_name }}\", \"inline\": true},
               {\"name\": \"Actor\", \"value\": \"${{ github.actor }}\", \"inline\": true},
               {\"name\": \"Workflow\", \"value\": \"${{ github.workflow }}\", \"inline\": true}
             ],
             \"url\": \"${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\"
           }]
         }" \
         ${{ secrets.DISCORD_WEBHOOK_URL }}
```

### SARIF Upload

For GitHub Security tab integration:

```yaml
- name: Upload SARIF results
  uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: security-results.sarif
    category: semgrep
```

Convert JSON to SARIF:

```bash
# Convert Semgrep JSON to SARIF format
docker run --rm -v $PWD:/src semgrep/semgrep:latest \
  --config p/security-audit \
  --sarif \
  --output security-results.sarif \
  /src
```

## Performance Optimization

### Caching Strategies

```yaml
- name: Cache Semgrep Rules
  uses: actions/cache@v4
  with:
    path: ~/.semgrep
    key: semgrep-rules-${{ hashFiles('docs/security/rules/*.yml') }}
    restore-keys: |
      semgrep-rules-

- name: Cache Docker Images
  run: |
    docker save semgrep/semgrep:latest > /tmp/semgrep.tar

- name: Restore Docker Cache
  uses: actions/cache@v4
  with:
    path: /tmp/semgrep.tar
    key: docker-semgrep-${{ runner.os }}
```

### Parallel Scanning

```yaml
strategy:
  matrix:
    include:
      - scan-type: 'rust'
        config: 'p/rust,docs/security/rules/anchor-critical.yml'
        paths: 'programs/'
      - scan-type: 'frontend'
        config: 'p/typescript,docs/security/rules/web3-frontend.yml'
        paths: 'components/ app/ lib/'
      - scan-type: 'agents'
        config: 'p/security-audit'
        paths: 'agents/'
```

### Incremental Scanning

For large repositories:

```yaml
- name: Get Changed Files
  id: changed-files
  uses: tj-actions/changed-files@v41
  with:
    files: |
      **/*.rs
      **/*.ts
      **/*.tsx
      **/*.js
      **/*.jsx

- name: Run Incremental Scan
  if: steps.changed-files.outputs.any_changed == 'true'
  run: |
    echo "Changed files: ${{ steps.changed-files.outputs.all_changed_files }}"
    docker run --rm -v $PWD:/src semgrep/semgrep:latest \
      --config docs/security/.semgrep.yml \
      --json \
      ${{ steps.changed-files.outputs.all_changed_files }}
```

## Troubleshooting

### Common Issues

**Permission Denied Errors:**

```bash
# Fix Docker permissions
sudo chmod 666 /var/run/docker.sock
```

**Out of Memory Errors:**

```yaml
# Increase container memory
docker run --rm -m 4g -v $PWD:/src semgrep/semgrep:latest ...
```

**Rule Syntax Errors:**

```bash
# Validate rules before committing
semgrep --validate docs/security/rules/*.yml
```

### Debug Mode

Enable verbose logging:

```yaml
- name: Debug Security Scan
  run: |
    docker run --rm -v $PWD:/src semgrep/semgrep:latest \
      --config docs/security/.semgrep.yml \
      --verbose \
      --debug \
      /src
```

### Performance Monitoring

Track scan performance:

```yaml
- name: Monitor Scan Performance
  run: |
    start_time=$(date +%s)
    docker run --rm -v $PWD:/src semgrep/semgrep:latest \
      --config p/security-audit \
      --time \
      /src
    end_time=$(date +%s)
    echo "Scan completed in $((end_time - start_time)) seconds"
```

This CI/CD integration ensures that security scanning is seamlessly integrated into your development workflow while maintaining the privacy and performance requirements of the Football Squares dApp.
