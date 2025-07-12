name: "Multi-Agent System: Oracle Poller with Winner-Email Sub-Agent"
description: |

## Purpose
Demonstrate the **agent-as-tool** pattern in *Football Squares* by building:

* **ScoreOracleAgent** – polls the Switchboard NFL score feed and streams updates.  
* **EmailPayoutAgent** – uses Proton Bridge SMTP to draft/send winner notifications.  
* The Oracle agent can call the Email agent as an internal **tool** when it detects a new final score and the Anchor program marks a winner.

## Core Principles
1. **Context is King** – always link Anchor IDs, PDA seeds, oracle docs.  
2. **Validation Loops** – include Anchor tests + Vitest to prove end-to-end flow.  
3. **Information Dense** – reference Solana keywords (PDA, CPI, thread).  
4. **Progressive Success** – poll → detect → call tool → send mail.  

---

## Goal
CLI command `pnpm oracle:run --devnet` continuously:

1. Fetches live scores from Switchboard devnet feed.  
2. On score change, calls `record_score` ix on the Squares program.  
3. When program emits `WinnerSettled` event, invokes **EmailPayoutAgent** to email the winner with a Solscan link to their payout tx.

## Why
* **Business value** – automated, trust-minimised payout confirmations.  
* **Integration** – marries on-chain Solana events with off-chain user comms.  
* **Problem solved** – eliminates manual winner notification; improves UX.

## What
* **Oracle poll** every 15 s (respect rate-limit).  
* **Tool-call** interface: `send_winner_email({wallet, txSig})`.  
* **Streaming CLI** – colour-coded logs of tool invocations.

### Success Criteria
- [ ] Oracle agent records scores; Anchor test passes.
- [ ] Program emits `WinnerSettled` for devnet game.
- [ ] Email agent sends Proton mail; mock SMTP test green.
- [ ] CLI shows tool calls and JSON responses.
- [ ] All lint / type / test gates pass in CI.

---

## All Needed Context

```yaml
# MUST READ
- file: programs/squares/src/lib.rs
  why: Event struct `WinnerSettled`, PDA seeds.

- url: https://docs.switchboard.xyz/developers/feeds/nfl
  why: Endpoint & auth for NFL score feed.

- url: https://docs.switchboard.xyz/developers/vrf
  why: Example of oracleCallback proof (for verification).

- url: https://proton.me/mail/bridge
  why: SMTP bridge config & ports.

- file: agents/OrchestratorAgent/index.ts
  why: Shows ctx.usage forwarding pattern.

- file: scripts/create_thread.ts
  why: Example of Anchor provider & Clockwork thread.
```

---

### Current Codebase Tree

```bash
.
├── programs/squares/
├── agents/
│   ├── OrchestratorAgent/
│   └── ...
├── scripts/
└── tests/
```

### Desired Codebase Tree

```bash
.
├── agents/
│   ├── ScoreOracleAgent/
│   │   ├── index.ts
│   │   └── types.ts
│   └── EmailPayoutAgent/
│       └── index.ts
├── tools/
│   ├── switchboard_client.ts
│   └── proton_mailer.ts
├── scripts/
│   └── oracle_run.ts
├── tests/
│   ├── anchor/
│   │   └── record_score.spec.ts      # localnet integration
│   ├── unit/
│   │   ├── switchboard_client.spec.ts
│   │   └── email_agent.spec.ts
│   └── e2e/
│       └── oracle_to_email.spec.ts
└── .env.example
```

### Known Gotchas & Library Quirks

```ts
// CRITICAL: Switchboard devnet feed updates ~15 s; poll >10 s only.
// CRITICAL: Proton Bridge listens on localhost:1025 plain-SMTP.
// CRITICAL: Anchor IDL event names are snake_case in logs.
// CRITICAL: Pass ctx.usage when Oracle agent calls Email agent.
// CRITICAL: Never commit id.json or bridge creds; use .env.
```

---

## Implementation Blueprint

### Data Models

```ts
// agents/ScoreOracleAgent/types.ts
export interface ScoreUpdate {
  gameId: number;
  home: number;
  away: number;
  slot: number;
}

export interface WinnerPayload {
  boardPda: string;
  winnerWallet: string;
  payoutTx: string;
}
```

### Tasks

```yaml
Task 1: Switchboard client
CREATE tools/switchboard_client.ts
  - expose getLatestScore(gameId)

Task 2: Proton mailer
CREATE tools/proton_mailer.ts
  - nodemailer transport via env SMTP_HOST/PORT/USER/PASS

Task 3: EmailPayoutAgent
CREATE agents/EmailPayoutAgent/index.ts
  - @agent.tool "send_winner_email"

Task 4: ScoreOracleAgent
CREATE agents/ScoreOracleAgent/index.ts
  - poll feed
  - send record_score ix
  - subscribe to WinnerSettled logs
  - call send_winner_email tool

Task 5: CLI runner
CREATE scripts/oracle_run.ts
  - load env, init Anchor provider, start Oracle agent

Task 6: Tests
  - Anchor mocha test: record_score + WinnerSettled
  - Vitest: mailer mock returns 250 OK
```

### Pseudocode – Winner email tool

```ts
@agent.tool
async function send_winner_email(
  ctx,
  wallet: string,
  txSig: string
) {
  const html = `<p>🎉 Congrats!  View payout <a href="https://solscan.io/tx/${txSig}?cluster=devnet">here</a></p>`;
  await protonMailer.send({
    to: `${wallet}@example.dev`,
    subject: "Football Squares – You Won!",
    html,
  });
  return { status: "sent" };
}
```

---

## Validation Loop

### Level 1 – Lint & Types

```bash
pnpm lint && tsc --noEmit && cargo clippy -- -D warnings
```

### Level 2 – Unit Tests

```bash
pnpm vitest run -c vitest.unit.config.ts
```

### Level 3 – Anchor Localnet Integration

```bash
solana-test-validator -r &
anchor deploy
pnpm ts-node scripts/oracle_run.ts --devnet --once
# Expect console: "Winner email sent -> status: sent"
```

---

## Final Checklist

* [ ] All tests pass & CI green
* [ ] `pnpm oracle:run` prints tool calls
* [ ] Email arrives in Proton Bridge logs
* [ ] No hard-coded secrets; .env validated
* [ ] `docs/agents.md` updated with sequence diagram

---

## Anti-Patterns to Avoid

* ❌ Polling feed faster than Switchboard TTL
* ❌ Sync code in async agent context
* ❌ Skipping VRF/Score proof verification
* ❌ Committing `.env`, id.json, or Proton creds

## Confidence Score: **9 / 10**

Provides full path from oracle polling to winner notification with repeatable tests and clear CI hooks.