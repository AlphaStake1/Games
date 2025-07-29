name: "Base PRP Template v2 – Context-Rich with Validation Loops (Football Squares)"
description: |

## Purpose

Template for AI agents (Claude, GPT) to implement **Solana Football-Squares** features with full context, repeatable tests, and self-validation.

## Core Principles

1. **Context is King** – link every Solana/Anchor/Switchboard doc you’ll need.
2. **Validation Loops** – supply runnable scripts/tests the AI must pass.
3. **Consistency** – follow existing TypeScript + Rust patterns (no reinventing).
4. **Progressive Success** – build → lint → unit-test → localnet-test → enhance.
5. **Global Rules** – obey everything in `CLAUDE.md` (naming, security, style).

---

## Goal

[Clear end-state: e.g., “Add VRF-powered board randomization callable by Clockwork thread”.]

## Why

- Keeps game trust-minimized (no server-side RNG).
- Integrates with existing Anchor program & React UI.
- Required for Week-1 launch incentives.

## What (User-visible + Technical)

- Wallet-connected admin clicks “Randomize”; board headers update.
- Anchor `randomize_board` ix verifies VRF proof.
- Clockwork can invoke the same ix automatically when pre-game thread fires.

### Success Criteria

- [ ] Headers change only once per game.
- [ ] VRF proof stored on-chain and passes `vrf_verify` CPI.
- [ ] Unit + integration tests green on CI.

---

## All Needed Context

### Documentation & References

```yaml
- url: https://docs.switchboard.xyz/developers/vrf
  why: VRF request/verify flow, required accounts
- url: https://www.anchor-lang.com/docs/accounts
  why: PDA seed constraints & zero-copy structs
- file: programs/squares/src/lib.rs
  why: Existing program; add new ix without breaking ABI
- docfile: docs/clockwork_overview.md
  why: Thread creation & signer seeds
```

### Current Codebase tree

```bash
.
├─ programs/
│   └─ squares/
│       ├─ src/
│       │   └─ lib.rs
│       └─ tests/randomizer.ts
├─ app/
│   ├─ src/components/BoardGrid.tsx
│   └─ ...
├─ agents/
│   ├─ OrchestratorAgent/
│   └─ RandomizerAgent/
```

### Desired Codebase additions

```bash
programs/squares/src/vrf_account.rs   # VRF callback struct
programs/squares/src/randomize.rs     # new ix logic
agents/RandomizerAgent/index.ts       # LLM wrapper
scripts/request_vrf.ts                # CLI helper
```

### Known Gotchas & Library Quirks

```rust
// CRITICAL: Clockwork signer PDA must be added to ix account list
// Switchboard VRF returns randomness in little-endian u128
// Anchor 0.30+: use #[account(zero_copy)] for large board struct
```

---

## Implementation Blueprint

### Data models

```rust
#[account]
pub struct VRFAccount {
    pub randomness: [u8; 16],
    pub fulfilled: bool,
    pub bump: u8,
}
```

### Task List

```yaml
Task 1:
  MODIFY programs/squares/src/lib.rs
    - add mod randomize;
    - expose randomize_board(ctx) handler.

Task 2:
  CREATE programs/squares/src/randomize.rs
    - mirror pattern from settle_winner.rs
    - verify VRF, update board headers.

Task 3:
  CREATE scripts/request_vrf.ts
    - uses @switchboard-xyz/solana.js
    - writes txid to console.

Task 4:
  UPDATE agents/RandomizerAgent/index.ts
    - tool call: requestVRF(boardPDA)

Task 5:
  ADD tests in programs/squares/tests/randomizer.ts
    - anchor.setProvider(localnet)
    - mock VRF callback, assert headers updated.
```

### Pseudocode (per task)

```rust
// Task 2 core
pub fn randomize_board(ctx: Context<Randomize>) -> Result<()> {
    let board = &mut ctx.accounts.board;
    let vrf = &ctx.accounts.vrf_account;

    require!(vrf.fulfilled, CustomError::VrfNotReady);
    let nums = derive_headers_from(&vrf.randomness);
    board.home_headers = nums.home;
    board.away_headers = nums.away;
    board.finalized = true;
    Ok(())
}
```

### Integration Points

```yaml
Clockwork:
  - thread: 'pre-game-{game_id}'
  - ix: randomize_board

React UI:
  - call scripts/request_vrf.ts on admin button
```

---

## Validation Loop

### Level 1 – Lint & Format

```bash
cargo fmt --check
cargo clippy -- -D warnings
pnpm run lint   # eslint for TS
tsc --noEmit   # type-check agents & scripts
```

### Level 2 – Unit Tests

```bash
anchor test -- --nocapture tests/randomizer.ts
```

### Level 3 – Localnet Integration

```bash
solana-test-validator -r &
anchor deploy
pnpm ts-node scripts/request_vrf.ts --board <PDA>
# Expect: board account shows non-zero headers
```

---

## Final Checklist

- [ ] `cargo clippy` clean
- [ ] `anchor test` green
- [ ] `pnpm run test` green
- [ ] Manual localnet run shows randomized headers
- [ ] Updated docs (`docs/randomizer.md`)
- [ ] CHANGELOG entry

---

## Anti-Patterns to Avoid

- ❌ Calling external RNG — must use Switchboard VRF
- ❌ Hard-coding PDAs — derive with seeds + bumps
- ❌ Ignoring 429 errors from OpenAI calls in agent code
- ❌ Writing secrets to repo (use `.env.local`)
