# Comprehensive Research Summary for **Solana Football Squares dApp**

**Research Date:** 2025-07-08
**Total Sources Scraped:** 10 high-priority docs + deep dives (Solana, Anchor, Switchboard, Clockwork, Phantom, Proton, Ceramic, Akash, ElizaOS)

---

## Key Findings

### 1. Solana-Native Architecture

- **Anchor framework** is the de-facto standard for program development (IDL generation, CPI safety-checks).
- **Program accounts** hold: pool metadata, 10 × 10 board matrix, square ownership (PDA seeds), escrow vault.
- **Clockwork** provides on-chain cron-like scheduling (slot, timestamp, block-height triggers).
- **Switchboard** supplies:
  - **Oracle feeds** – real-time NFL scores (JSON price-feed style).
  - **VRF** – verifiable randomness for board number assignment.

- Off-chain helpers (CLI, analytics) run on **Akash** to avoid AWS/GCP lock-in.

### 2. Core Agent Pattern (TypeScript LLM workers)

```ts
// OrchestratorAgent (Claude Sonnet 4)
const taskMatrix: AgentTask[] = [
  { name: "BoardAgent", trigger: "PreGame", model: "gpt-4.1" },
  { name: "RandomizerAgent", trigger: "VRFReady", model: "gpt-4.1" },
  { name: "OracleAgent", trigger: "Every5Min", model: "gpt-4.1" },
  // …
];
```

Agents communicate via **strict JSON schemas** stored under `/schemas/*.ts` so LLMs can reason deterministically.

### 3. Automation / Cron Requirements

| Scheduler     | Use-Case                                           | Status        |
| ------------- | -------------------------------------------------- | ------------- |
| **Clockwork** | Board randomization, winner checks, payout windows | Primary       |
| Akash cron    | Off-chain analytics & email batches                | Supplementary |

### 4. Email / Notification Layer

- **Proton Mail Business + Proton VPN/Bridge** selected (end-to-end encryption, SMTP via local Bridge).
- `nodemailer` → `smtp://127.0.0.1:1025` inside the same Akash container.
- Templates stored as **Handlebars** in `/emails/`.

### 5. Front-End & Wallet UX

- **React + Vite + Tailwind**.
- `@solana/wallet-adapter` (Phantom, Solflare, Backpack).
- Real-time board grid rendered from Anchor account subscription (WebSocket).

### 6. Data & Storage

| Data Type         | Storage Layer            |
| ----------------- | ------------------------ |
| Immutable assets  | IPFS via Fleek           |
| Mutable game logs | Ceramic stream (IDX)     |
| Program state     | Solana accounts (Anchor) |

### 7. Security & Compliance

- Anchor `transfer_checked` for payouts (prevents precision exploits).
- VRF proof verified on-chain before board numbers committed.
- Email tokens & RPC keys kept in **.env** (not in repo).
- Proton Bridge container isolated behind **Proton VPN** exit node.

---

## Technical Decisions

1. **Model names are immutable**
   - Orchestrator: `claude-sonnet-4-20250514`
   - Task agents: `gpt-4.1`

2. **Board Schema (PDA seeds)**

   ```rust
   #[account(zero_copy)]
   pub struct Board {
       pub game_id: u64,
       pub home_headers: [u8; 10],
       pub away_headers: [u8; 10],
       pub squares: [[Pubkey; 10]; 10],
       pub finalized: bool,
       pub bump: u8,
   }
   ```

3. **Clockwork Thread example**

   ```json
   {
     "name": "winner-check-{game_id}",
     "rate": "*/5 * * * *", // every 5 min
     "trigger": "on_slot",
     "ix": {
       "program_id": "<program_pubkey>",
       "accounts": ["<board_pda>", "<oracle_feed>"],
       "data": "<winner_check_ix_base64>"
     }
   }
   ```

---

## Implementation Roadmap

| Phase | Milestone                              | Owner  | Target     |
| ----- | -------------------------------------- | ------ | ---------- |
| 1     | Anchor program skeleton + IDL          | Rust   | 2025-07-15 |
| 2     | React dashboard (read-only)            | FE     | 2025-07-20 |
| 3     | Clockwork integration (board init)     | DevOps | 2025-07-22 |
| 4     | VRF randomizer flow                    | BE     | 2025-07-25 |
| 5     | Winner detection + payout instruction  | Rust   | 2025-07-30 |
| 6     | Proton Bridge email receipts           | BE     | 2025-08-02 |
| 7     | Ceramic game log + analytics dashboard | FE     | 2025-08-05 |

---

## Critical Research Links

- Solana Docs: [https://docs.solana.com/](https://docs.solana.com/)
- Anchor: [https://www.anchor-lang.com/docs](https://www.anchor-lang.com/docs)
- Switchboard: [https://docs.switchboard.xyz/](https://docs.switchboard.xyz/)
- Clockwork: [https://clockworkxyz.notion.site/](https://clockworkxyz.notion.site/)
- Proton Bridge CLI: [https://proton.me/mail/bridge](https://proton.me/mail/bridge)
- Ceramic: [https://developers.ceramic.network/](https://developers.ceramic.network/)
- Akash Deployment: [https://docs.akash.network/](https://docs.akash.network/)
- ElizaOS Agent Design: [https://eliza.ai/docs](https://eliza.ai/docs)

---

### Stickiness & Engagement Strategy

- Weekly leaderboard emails (Proton) → keeps users returning.
- Seasonal NFT achievements (mint via program) for long-term retention.
- Off-season mode: trivia pools driven by the same agent stack.

---
