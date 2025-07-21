name: "Base PRP Template v2 — Football Squares (Solana)"
description: |

## Purpose

Reusable pull-request plan (PRP) template for **Football-Squares**.  
Optimised for AI-assisted implementation with tight feedback loops,  
clear context links, and deterministic tests.

## Core Principles

1. **Context is King** – link every doc / file the agent must read.
2. **Validation Loops** – supply commands the agent can run & fix.
3. **Information Dense** – include codebase keywords, PDAs, seeds.
4. **Progressive Success** – ship small, compile, test, enhance.
5. **Obey `CLAUDE.md`** – style-guide, anti-patterns, env rules.

---

## Goal

[ Describe the exact feature / bug-fix / refactor ]

## Why

- Business value & user impact
- How it fits current architecture
- Which pain-point or metric it improves

## What

User-visible behaviour **and** technical spec.

### Success Criteria

- [ ] Quantitative / testable outcomes here

---

## All Needed Context

```yaml
# MUST READ – copied into the LLM context window
- file: docs/architecture.md
  why: Global component map & naming rules

- file: programs/squares/src/lib.rs
  why: Anchor program – know existing accounts / ixs

- url: https://docs.switchboard.xyz/developers/vrf
  why: Verify VRF callback proof

- url: https://clockworkxyz.notion.site/
  why: Thread creation & crank behaviour

- file: agents/OrchestratorAgent/index.ts
  why: Tool-call pattern & ctx.usage handling
```

---

### Current Codebase Tree

_(run `tree -L 2` before you start and paste below)_

```bash

```

### Desired Codebase Tree (new / modified files)

```bash
agents/
  └─ ScoreOracleAgent/
      ├─ index.ts          # polls Switchboard feed
      └─ tests/
scripts/
  └─ seed_scores.ts        # devnet helper
programs/squares/
  └─ src/
      └─ score.rs          # new instruction
```

### Known Gotchas & Library Quirks

```ts
// CRITICAL: Anchor >=0.30 requires #[account(zero_copy)] for >10k structs
// CRITICAL: Clockwork thread signer PDA must be last in remaining_accounts
// CRITICAL: Next 13 static export cannot use server actions — keep RPC in /app/api
```

---

## Implementation Blueprint

### Data Models

```rust
// programs/squares/src/score.rs
#[account]              // PDA: [board, "score"]
pub struct ScoreFeed {
    pub home: u8,       // 0-9
    pub away: u8,
    pub updated_at: i64,
}
```

```ts
// agents/ScoreOracleAgent/types.ts
export interface ScorePayload {
  gameId: number;
  home: number;
  away: number;
  oracleSlot: number;
}
```

### Tasks (ordered)

```yaml
Task 1:
CREATE programs/squares/src/score.rs
  - ADD new account + instruction record_score(...)
  - UPDATE lib.rs mod score

Task 2:
MODIFY programs/squares/src/error.rs
  - ADD ScoreFeedAlreadyUpdated

Task 3:
CREATE agents/ScoreOracleAgent/index.ts
  - MIRROR http pattern from OracleAgent
  - PUSH score ix via @coral-xyz/anchor

Task 4:
ADD script scripts/seed_scores.ts
  - Generate mock Switchboard feed on devnet

Task 5:
TESTS
  - Anchor mocha: record_score success + duplicate failure
  - Vitest: ScoreOracleAgent parses feed → submits ix
```

### Pseudocode Example

```ts
// Task 3 – core loop
while (true) {
  const feed = await switchboard.fetchLatest(GAME_ID);
  if (isNewScore(feed.slot)) {
    await program.methods
      .recordScore(boardPda, feed.result.home, feed.result.away)
      .accounts({ authority, board: boardPda, scoreFeed: scorePda })
      .rpc();
  }
  await sleep(15_000); // GOTCHA: respect rate limit
}
```

### Integration Points

```yaml
ANCHOR:
  - add to: programs/squares/src/lib.rs
  - invoke from: WinnerAgent after every score update

FRONT-END:
  - websocket event 'score:update' → BoardGrid.tsx

ENV:
  - SWITCHBOARD_SCORE_FEED=<devnet_pubkey>
```

---

## Validation Loop

### Level 1 – Lint & Type

```bash
pnpm lint && tsc --noEmit
cargo clippy -- -D warnings
```

### Level 2 – Unit / Anchor Tests

```bash
anchor test -- --skip-local-validator
pnpm vitest run -c vitest.unit.config.ts
```

### Level 3 – Localnet Integration

```bash
solana-test-validator -r &
anchor deploy
pnpm ts-node scripts/seed_scores.ts
pnpm ts-node agents/ScoreOracleAgent/index.ts --devnet
# Expect 'ScoreFeed updated' logs
```

---

## Final Checklist

- [ ] All tests green (Anchor + Vitest)
- [ ] `pnpm lint` & `tsc` clean
- [ ] `cargo clippy` clean
- [ ] Manual localnet run shows board UI updating
- [ ] CHANGELOG.md entry added
- [ ] Docs updated (`docs/oracle.md`)

---

## Anti-Patterns to Avoid

- ❌ Hard-coding PDAs or RPC URLs
- ❌ Skipping VRF or score-proof verification
- ❌ Adding new build tools when existing scripts suffice
- ❌ Catch-all `try … catch` without specific error handling
- ❌ Committing `.env` or keypair files

> **How to use:**
>
> 1. Duplicate this file into `/PRPs/` and rename with a concise feature title, e.g. `PRP_score_oracle.md`.
> 2. Fill the _Goal / Why / What / Success_ sections and the blank code-tree blocks.
> 3. Attach in the PR so reviewers (and Claude) have deterministic specs and commands.
