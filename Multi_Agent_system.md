name: "Multi-Agent System — Football Squares Orchestrator + Task Agents"
description: |

## Purpose
Demonstrate an **agent-as-tool** pattern for our Solana Football-Squares project:

* **OrchestratorAgent** (Claude Sonnet 4) = high-level planner  
* Child agents (*BoardAgent, RandomizerAgent, OracleAgent, WinnerAgent, PayoutAgent*) = tools it can invoke  
* All agents interact with Solana (Anchor program), Switchboard (oracle + VRF) and Clockwork (cron scheduling).

## Core Principles
1. **On-chain first** — critical state lives in Anchor accounts.  
2. **JSON-only messages** — deterministic schemas in `/schemas`.  
3. **Validation Loops** — lint, unit-test, localnet integration before PR merge.  
4. **Progressive Success** — start on devnet/localnet, then mainnet-beta.  

---

## Goal
A CLI + agent bundle that lets an admin:

1. Create a board for a given NFL game.  
2. Randomize headers via Switchboard VRF.  
3. Monitor live scores (Switchboard oracle).  
4. Auto-detect winners and trigger payout ix.  
5. Email the winner a receipt via Proton Mail Bridge.  

## Why
* Removes manual ops; ensures provable randomness and timely payouts.  
* Showcases modular agent tooling for other dApp teams.  
* Provides sticky user experience (real-time board + email receipts).

## What (User-visible & Technical)
* **Admin CLI**: `yarn squares init <gameId>` → board appears in UI.  
* **BoardAgent** creates PDA, writes to Anchor.  
* **RandomizerAgent** requests VRF, commits numbers.  
* **OracleAgent** polls score every 5 min (Clockwork thread).  
* **WinnerAgent** marks winning square; **PayoutAgent** sends SOL.  
* **EmailAgent** (tool) sends Proton receipt.

### Success Criteria
- [ ] Board headers match VRF entropy proof.  
- [ ] Winner & payout recorded on-chain and displayed in UI.  
- [ ] Proton email contains correct tx signature.  
- [ ] All tests pass on CI (GitHub Actions + `solana-test-validator`).  

---

## All Needed Context

### Docs & References
```yaml
- url: https://docs.switchboard.xyz/developers/vrf
  why: Request & verify randomness
- url: https://clockworkxyz.notion.site/
  why: Thread creation & signer seeds
- url: https://www.anchor-lang.com/docs
  why: Add new ix & zero-copy accounts
- file: programs/squares/src/lib.rs
  why: Existing Anchor program – extend but keep ABI
- url: https://proton.me/mail/bridge
  why: Headless SMTP Bridge for EmailAgent
```

### Current Codebase Tree

```bash
.
├─ programs/squares/src/lib.rs
├─ app/src/components/BoardGrid.tsx
├─ agents/OrchestratorAgent/
├─ schemas/
└─ scripts/
```

### Desired Additions

```bash
agents/
  ├─ BoardAgent/index.ts
  ├─ RandomizerAgent/index.ts
  ├─ OracleAgent/index.ts
  ├─ WinnerAgent/index.ts
  ├─ PayoutAgent/index.ts
  └─ EmailAgent/index.ts         # wraps Proton Bridge

scripts/
  ├─ init_board.ts               # CLI helpers
  └─ request_vrf.ts

programs/squares/src/
  ├─ vrf_account.rs
  └─ randomize.rs

tests/
  ├─ randomizer.ts
  ├─ winner.ts
  └─ payout.ts
```

### Gotchas & Quirks

```rust
// Clockwork signer PDA must be included in ix.accounts
// Switchboard VRF callback fires in a separate txn – handle idempotency
// Anchor >=0.30 uses borsh-vec-u8 for byte arrays > 32
```

---

## Implementation Blueprint

### Data Models (Rust)

```rust
#[account(zero_copy)]
pub struct Board {
    pub game_id: u64,
    pub home_headers: [u8; 10],
    pub away_headers: [u8; 10],
    pub squares: [[Pubkey; 10]; 10],
    pub finalized: bool,
}
```

### Task List

```yaml
Task 1: Add VRF PDA + handler
  - MODIFY programs/squares/src/lib.rs (mod vrf_account, randomize)

Task 2: Implement RandomizerAgent
  - CREATE agents/RandomizerAgent/index.ts
  - Calls scripts/request_vrf.ts and waits for callback

Task 3: Winner detection
  - CREATE agents/WinnerAgent/index.ts
  - Anchor ix compares oracle score vs headers

Task 4: Proton EmailAgent
  - CREATE agents/EmailAgent/index.ts
  - Uses nodemailer via Proton Bridge (SMTP localhost:1025)

Task 5: CLI glue
  - ADD scripts/init_board.ts (anchor call)
  - ADD scripts/payout.ts (manual trigger fallback)

Task 6: Tests
  - Anchor mocha tests in programs/squares/tests/

```

---

## Validation Loop

### Level 1 – Lint / Build

```bash
cargo clippy -- -D warnings
pnpm lint && tsc --noEmit
```

### Level 2 – Unit Tests

```bash
anchor test -- --nocapture tests/randomizer.ts
```

### Level 3 – Localnet Integration

```bash
solana-test-validator -r &
anchor deploy
pnpm ts-node scripts/init_board.ts --game 123
```

All steps must pass before PR is merged.

---

## Final Checklist

* [ ] Clippy / ESLint clean
* [ ] `anchor test` green
* [ ] Localnet manual run OK
* [ ] Docs updated (`docs/randomizer.md`, `docs/agents.md`)
* [ ] CHANGELOG entry

---

## Anti-Patterns to Avoid

* ❌ Off-chain RNG (must use Switchboard VRF)
* ❌ Storing secrets in repo (use `.env.local`)
* ❌ Skipping VRF proof verification
* ❌ Hard-coding PDAs

```

Use this template for any multi-agent feature PRP moving forward. It mirrors our Solana stack, enforces validation loops, and provides clear task breakdowns for LLM-assisted implementation.