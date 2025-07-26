# Custom Security Rules for Football Squares dApp

> **Solana-Specific Security Patterns and Custom Rule Development**

This document details how to create and maintain custom Semgrep rules specifically tailored for the Football Squares dApp's security needs.

## Table of Contents

- [Overview](#overview)
- [Rule Structure](#rule-structure)
- [Solana/Anchor Rules](#solanaanchor-rules)
- [Frontend Security Rules](#frontend-security-rules)
- [Infrastructure Rules](#infrastructure-rules)
- [Rule Testing](#rule-testing)
- [Maintenance](#maintenance)

## Overview

### Why Custom Rules?

While Semgrep's built-in rulesets cover general security patterns, dApps have unique requirements:

- **Solana-specific vulnerabilities**: PDA derivation, CPI security, account validation
- **Web3 frontend patterns**: Wallet integration, transaction signing, RPC security
- **Crypto-specific logic**: Lamport handling, precision arithmetic, randomness
- **dApp architecture**: Multi-agent systems, WebSocket security, Oracle integration

### Rule Categories

| Category              | Purpose                   | Priority |
| --------------------- | ------------------------- | -------- |
| **Anchor Programs**   | Smart contract security   | Critical |
| **Frontend Security** | Web3 UI vulnerabilities   | High     |
| **Agent Security**    | Multi-agent system safety | Medium   |
| **Infrastructure**    | DevOps and deployment     | Medium   |

## Rule Structure

### Basic Rule Anatomy

```yaml
rules:
  - id: rule-identifier
    message: 'Human-readable description of the issue'
    languages: [rust, typescript] # Applicable languages
    severity: ERROR|WARNING|INFO # Issue severity
    pattern: | # Code pattern to match
      pattern_to_match($VAR)
    pattern-not: | # Exclude these patterns (optional)
      safe_pattern($VAR)
    metadata:
      category: security
      cwe: 'CWE-XXX'
      confidence: HIGH|MEDIUM|LOW
```

### Pattern Matching Syntax

```yaml
# Variable capture
pattern: $FUNCTION($...ARGS)

# Either/or patterns
pattern-either:
  - pattern: method1($ARG)
  - pattern: method2($ARG)

# Pattern exclusions
pattern-not-inside: |
  if ($CONDITION) {
    ...
  }

# Regex patterns
pattern-regex: 'hardcoded_secret_[a-zA-Z0-9]+'
```

## Solana/Anchor Rules

### Critical Security Rules

Create `docs/security/rules/anchor-critical.yml`:

```yaml
rules:
  - id: missing-signer-check
    message: 'Account should be marked as Signer for security'
    languages: [rust]
    severity: ERROR
    pattern-either:
      - pattern: |
          #[account(mut)]
          pub $ACCOUNT: Account<'info, $TYPE>,
    pattern-not-inside: |
      #[account(mut)]
      pub $ACCOUNT: Signer<'info>,
    metadata:
      category: security
      cwe: 'CWE-862'
      confidence: HIGH

  - id: unchecked-pda-derivation
    message: 'PDA derivation should validate bump parameter'
    languages: [rust]
    severity: ERROR
    pattern: |
      let ($ADDR, $BUMP) = Pubkey::find_program_address(&$SEEDS, &$PROGRAM_ID);
    pattern-not-inside: |
      require!($BUMP == $EXPECTED_BUMP, ...);
    metadata:
      category: security
      confidence: MEDIUM

  - id: lamport-overflow-risk
    message: 'Lamport arithmetic may overflow - use checked operations'
    languages: [rust]
    severity: ERROR
    pattern-either:
      - pattern: $ACCOUNT.lamports() + $AMOUNT
      - pattern: $ACCOUNT.lamports() - $AMOUNT
      - pattern: $VAR + $LAMPORTS
      - pattern: $VAR - $LAMPORTS
    pattern-inside: |
      $ACCOUNT.to_account_info().try_borrow_mut_lamports()
    metadata:
      category: security
      cwe: 'CWE-190'

  - id: missing-owner-check
    message: 'Account owner should be validated'
    languages: [rust]
    severity: ERROR
    pattern: |
      pub $FUNCTION(ctx: Context<$CONTEXT>) -> Result<()> {
        let $ACCOUNT = &ctx.accounts.$ACCOUNT_NAME;
        ...
      }
    pattern-not-inside: |
      require!($ACCOUNT.owner == &$EXPECTED_OWNER, ...);
    metadata:
      category: security
      confidence: MEDIUM

  - id: unsafe-cpi-call
    message: 'CPI call should validate program ID'
    languages: [rust]
    severity: ERROR
    pattern: |
      CpiContext::new($PROGRAM.to_account_info(), $ACCOUNTS)
    pattern-not-inside: |
      require!($PROGRAM.key() == &$EXPECTED_PROGRAM_ID, ...);
    metadata:
      category: security
      cwe: 'CWE-670'
```

### Football Squares Specific Rules

Create `docs/security/rules/squares-specific.yml`:

```yaml
rules:
  - id: game-state-validation
    message: 'Game state transitions should be validated'
    languages: [rust]
    severity: WARNING
    pattern: |
      board.$FIELD = $VALUE;
    pattern-not-inside: |
      require!(!board.game_ended, SquaresError::GameEnded);
    paths:
      include:
        - 'programs/squares/src/lib.rs'

  - id: square-index-bounds
    message: 'Square index should be bounds checked'
    languages: [rust]
    severity: ERROR
    pattern: |
      board.squares[$INDEX as usize]
    pattern-not-inside: |
      require!($INDEX < 100, SquaresError::InvalidSquareIndex);

  - id: score-validation
    message: 'Score values should be validated'
    languages: [rust]
    severity: WARNING
    pattern: |
      pub fn record_score(ctx: Context<RecordScore>, home_score: u8, away_score: u8, quarter: u8)
    pattern-not-inside: |
      require!(quarter <= 4, SquaresError::InvalidQuarter);

  - id: winner-payout-double-spend
    message: 'Winner payout should prevent double spending'
    languages: [rust]
    severity: ERROR
    pattern: |
      **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += $AMOUNT;
    pattern-not-inside: |
      board.payout_amount = 0;
```

## Frontend Security Rules

### Web3 Security Rules

Create `docs/security/rules/web3-frontend.yml`:

```yaml
rules:
  - id: unchecked-wallet-connection
    message: 'Wallet connection state should be checked before use'
    languages: [typescript, javascript]
    severity: ERROR
    pattern: |
      const { publicKey } = useWallet();
      ...
      $FUNCTION(..., publicKey, ...)
    pattern-not-inside: |
      if (!publicKey) {
        ...
        return;
      }

  - id: hardcoded-program-id
    message: 'Program ID should be imported from constants'
    languages: [typescript, javascript]
    severity: WARNING
    pattern-regex: '"[1-9A-HJ-NP-Za-km-z]{32,44}"'
    paths:
      include:
        - '*.ts'
        - '*.tsx'
    pattern-not-inside: |
      const PROGRAM_ID = "$PROGRAM_ID";

  - id: unsafe-websocket-message
    message: 'WebSocket messages should be validated before processing'
    languages: [typescript, javascript]
    severity: ERROR
    pattern: |
      const $MSG = JSON.parse($WS_DATA);
      ...
      $FUNCTION($MSG.$FIELD)
    pattern-not-inside: |
      if (!$MSG.$FIELD || typeof $MSG.$FIELD !== '$TYPE') return;

  - id: missing-transaction-confirmation
    message: 'Transaction should be confirmed before proceeding'
    languages: [typescript, javascript]
    severity: WARNING
    pattern: |
      const $TX = await $PROGRAM.methods.$METHOD().rpc();
    pattern-not-inside: |
      await $CONNECTION.confirmTransaction($TX);

  - id: exposed-private-key-patterns
    message: 'Potential private key exposure detected'
    languages: [typescript, javascript]
    severity: ERROR
    pattern-regex: |
      (private.*key|secret.*key|keypair).*=.*[0-9a-fA-F]{64,}
```

### React Security Rules

Create `docs/security/rules/react-security.yml`:

```yaml
rules:
  - id: dangerous-inner-html-usage
    message: 'dangerouslySetInnerHTML should sanitize user content'
    languages: [typescript, javascript]
    severity: ERROR
    pattern: |
      dangerouslySetInnerHTML={{ __html: $CONTENT }}
    pattern-not-inside: |
      DOMPurify.sanitize($CONTENT)

  - id: useeffect-infinite-loop
    message: 'useEffect may cause infinite re-renders'
    languages: [typescript, javascript]
    severity: WARNING
    pattern: |
      useEffect(() => {
        ...
        $SET_STATE($VALUE);
        ...
      }, [$STATE, ...]);

  - id: unvalidated-user-input
    message: 'User input should be validated before state update'
    languages: [typescript, javascript]
    severity: WARNING
    pattern: |
      const handleChange = ($EVENT) => {
        $SET_STATE($EVENT.target.value);
      };
    pattern-not-inside: |
      if (!$VALIDATION_CHECK) return;
```

## Infrastructure Rules

### Docker Security Rules

Create `docs/security/rules/docker-security.yml`:

```yaml
rules:
  - id: dockerfile-root-user
    message: 'Docker container should not run as root'
    languages: [dockerfile]
    severity: WARNING
    pattern-regex: |
      ^USER\s+0|^USER\s+root
    pattern-not: |
      USER node

  - id: exposed-secrets-in-dockerfile
    message: 'Dockerfile should not contain hardcoded secrets'
    languages: [dockerfile]
    severity: ERROR
    pattern-regex: |
      (PASSWORD|SECRET|KEY|TOKEN)\s*=\s*["\'][^"\']+["\']

  - id: missing-health-check
    message: 'Docker container should include health check'
    languages: [dockerfile]
    severity: INFO
    pattern: |
      FROM $BASE
      ...
    pattern-not-inside: |
      HEALTHCHECK ...
```

### GitHub Actions Security

Create `docs/security/rules/github-actions.yml`:

```yaml
rules:
  - id: hardcoded-secrets-in-workflow
    message: 'GitHub Actions should use secrets, not hardcoded values'
    languages: [yaml]
    severity: ERROR
    pattern-regex: |
      (api_key|token|password|secret):\s*["\'][^"\']+["\']
    paths:
      include:
        - '.github/workflows/*.yml'

  - id: unpinned-action-version
    message: 'GitHub Actions should be pinned to specific versions'
    languages: [yaml]
    severity: WARNING
    pattern-regex: |
      uses:\s*[^@\n]+@(main|master|latest)
    paths:
      include:
        - '.github/workflows/*.yml'
```

## Rule Testing

### Testing Framework

Create `docs/security/tests/rule-tests.yml`:

```yaml
# Test cases for custom rules
test_cases:
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
        buySquare(publicKey);
    should_not_match:
      - |
        const { publicKey } = useWallet();
        if (!publicKey) return;
        buySquare(publicKey);
```

### Running Tests

```bash
# Test specific rule
semgrep --test docs/security/rules/anchor-critical.yml

# Test all custom rules
semgrep --test docs/security/rules/

# Validate rule syntax
semgrep --validate docs/security/rules/*.yml
```

## Maintenance

### Regular Updates

1. **Monitor Security Advisories**: Watch Solana, Anchor, and Web3 security updates
2. **Review False Positives**: Regularly review and refine rule patterns
3. **Performance Optimization**: Profile rule execution times and optimize slow patterns
4. **Community Contributions**: Share and improve rules with the security community

### Rule Versioning

```yaml
# Include metadata for tracking
metadata:
  created: '2024-01-15'
  last_updated: '2024-01-20'
  version: '1.2'
  author: 'security-team'
  references:
    - 'https://github.com/coral-xyz/anchor/security'
    - 'https://solanasec.com/post/2022-02-18-sysvar-get/'
```

### Integration with CI/CD

Update your CI configuration to include custom rules:

```yaml
# .github/workflows/security.yml
- name: Run Custom Security Rules
  run: |
    semgrep --config docs/security/rules/ \
            --config p/security-audit \
            --json \
            --output custom-security-results.json \
            .
```

## Best Practices

1. **Start Conservative**: Begin with WARNING severity, promote to ERROR after validation
2. **Test Thoroughly**: Use real codebase examples to test rule accuracy
3. **Document Clearly**: Include clear messages and remediation guidance
4. **Version Control**: Track rule changes and maintain backwards compatibility
5. **Performance First**: Optimize pattern matching for large codebases

This custom rule system provides comprehensive security coverage tailored specifically to the Football Squares dApp's architecture and security requirements.
