# Phase 2 — Production Implementation

> Football Squares dApp · Solana · Aug 2025 target

---

## 0 · Scope

Phase-2 turns the Phase-1 skeleton into a **launch-ready application**:

| Layer         | Milestones (Phase-2)                               |
| ------------- | -------------------------------------------------- |
| **On-chain**  | Complete Anchor program (board logic, VRF, payout) |
| **Off-chain** | Fully-wired LLM agents + Clockwork threads         |
| **Front-end** | Live board UI, wallet flow, winner pop-ups         |
| **Email**     | Proton Bridge receipts + unsubscribe flow          |
| **Ops**       | Docker / Akash deploy, CI pipelines, alerts        |
| **Security**  | Immutable randomness, PDA audits, rate limits      |

> **Goal date**: **2025-08-15** mainnet-beta MVP.

---

## 1 · Enhanced Architecture

```

┌───────────── Next 13 (static) ──────────────┐
│ WalletConnect • BoardGrid • WinnerToast     │
└────────────────▲─────────────────────────────┘
                 │ WebSocket (app/ws)
┌────────────────┴─────────────────────────────┐
│ Off-Chain Agent Mesh (pnpm workspace)        │
│  • Orchestrator   (Claude Sonnet 4)          │
│  • BoardAgent     (GPT-4.1)                  │
│  • RandomizerAgent(→ Switchboard VRF)        │
│  • OracleAgent    (→ Switchboard feed)       │
│  • WinnerAgent    (payout ix)                │
│  • EmailAgent     (Proton Bridge)            │
└────────────────▲─────────────────────────────┘
                 │ JSON RPC + CPI calls
┌────────────────┴─────────────────────────────┐
│ Anchor Program (programs/squares)            │
│  • create_board                              │
│  • request_randomization (Clockwork)         │
│  • fulfill_vrf_callback                      │
│  • record_score                              │
│  • settle_winner + payout                    │
└────────────────┬─────────────────────────────┘
                 │
Persistent Logs (Ceramic)

```

---

## 2 · Directory Evolution (Phase-2)

```

/football-squares/
├─ app/                           # Next front-end (Phase-2 adds WS client)
├─ programs/squares/              # Anchor program (now complete)
│   ├─ src/
│   │   ├─ lib.rs                 # entry
│   │   ├─ processor.rs           # all ixs
│   │   └─ error.rs               # custom errors
│   └─ tests/
├─ agents/                        # pnpm workspaces
│   ├─ OrchestratorAgent/
│   │   └─ index.ts
│   ├─ BoardAgent/
│   ├─ RandomizerAgent/
│   ├─ OracleAgent/
│   ├─ WinnerAgent/
│   └─ EmailAgent/
├─ schemas/                       # JSON schemas used by agents
├─ scripts/                       # ts-node CLIs (now functional)
├─ ceramic/                       # IDX definitions + model runtime
├─ docker/
│   ├─ docker-compose.yml
│   ├─ proton-bridge.Dockerfile
│   └─ clockwork-crank.Dockerfile
└─ .github/workflows/ci.yml

```

---

## 3 · Core Implementations

### 3.1 Anchor Instruction – `fulfill_vrf_callback`

```rust
#[derive(Accounts)]
pub struct FulfillVrf<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    /// CHECK: Switchboard verified
    pub vrf_account: AccountInfo<'info>,
    pub signer: Signer<'info>,
}

pub fn fulfill_vrf(ctx: Context<FulfillVrf>, randomness: [u8; 16]) -> Result<()> {
    // Verify proof (Switchboard helper)
    switchboard_vrf::verify(ctx.accounts.vrf_account.clone(), randomness)?;

    let board = &mut ctx.accounts.board;
    require!(!board.finalized, SquaresError::AlreadyRandomized);

    board.home_headers = derive_headers(&randomness[..8]);
    board.away_headers = derive_headers(&randomness[8..]);
    board.finalized = true;

    emit!(HeadersRandomized { board_id: board.game_id });
    Ok(())
}
```

### 3.2 OrchestratorAgent (excerpt)

```ts
// agents/OrchestratorAgent/index.ts
import { Agent, ToolCall } from 'llm-agent-sdk';
import schema from '../../schemas/orchestrator.schema.json';

export class OrchestratorAgent extends Agent<typeof schema> {
  constructor() {
    super('Orchestrator', 'claude-sonnet-4-20250514', schema);
  }

  protected async plan() {
    const context = await this.fetchGameContext();
    const decision = await this.callLLM('plan_tasks', { context });

    const toolCalls: ToolCall[] = [];
    decision.tasks.forEach((t) => {
      toolCalls.push({ tool: t.agent, args: t.args });
    });
    return toolCalls;
  }

  protected tools = {
    board_create: async (args) => BoardAgent.create(args.gameId),
    randomize: async (args) => RandomizerAgent.request(args.boardPda),
    oracle_poll: async () => OracleAgent.poll(),
    settle: async (args) => WinnerAgent.settle(args.boardPda),
    payout: async (args) => PayoutAgent.pay(args.boardPda),
  };
}
```

### 3.3 Proton EmailAgent (simplified)

```ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendWinnerEmail(recipient: string, tx: string) {
  await transporter.sendMail({
    from: '"Football Squares" <no-reply@footballsquares.app>',
    to: recipient,
    subject: '🏆 You won!',
    html: `<p>Your payout is on-chain: <a href="https://solscan.io/tx/${tx}">${tx}</a></p>`,
  });
}
```

### 3.4 Clockwork Thread creation script

```ts
// scripts/create_thread.ts
import { ClockworkProvider } from '@clockwork-xyz/sdk';
import { squaresIdl, PROGRAM_ID } from '../target/types/squares_idl';
import * as anchor from '@coral-xyz/anchor';

export async function createPreGameThread(boardPda: anchor.web3.PublicKey) {
  const provider = ClockworkProvider.fromAnchorProvider(
    anchor.AnchorProvider.env(),
  );

  await provider.threadCreate({
    name: `winner-check-${boardPda.toBase58()}`,
    rate: { cron: '*/5 * * * *', skippable: true },
    programId: PROGRAM_ID,
    accounts: [{ pubkey: boardPda, isSigner: false, isWritable: true }],
    ixData: squaresIdl.instructions.find((i) => i.name === 'recordScore')!.data,
  });
}
```

---

## 4 · Environment Variables (Phase-2 additions)

```env
CLOCKWORK_THREAD_ID=              # set by create_thread.ts
CERAMIC_DID_SEED=                 # 32 byte hex
AKASH_DEPLOY_KEY=                 # wallet for deploy
```

---

## 5 · Docker / Akash

```yaml
# docker/docker-compose.yml (local dev)
version: '3.9'
services:
  validator:
    image: solanalabs/solana:v1.18.2
    command: solana-test-validator -q
    ports: ['8899:8899']

  app:
    build: ..
    depends_on: [validator]
    environment:
      - RPC_ENDPOINT=http://validator:8899

  proton-bridge:
    build:
      context: .
      dockerfile: proton-bridge.Dockerfile
    ports: ['1025:1025'] # SMTP
```

An Akash SDL (`deploy.yaml`) is provided under `/docker/` for staging.

---

## 6 · CI / CD (GitHub Actions)

```yaml
name: ci
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      solana: ghcr.io/solana-labs/solana:latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 8 }
      - run: pnpm install
      - run: cargo install anchor-cli --locked
      - run: anchor build
      - run: pnpm lint && tsc --noEmit
      - run: anchor test --skip-local-validator
```

---

## 7 · Phase-2 Acceptance Criteria

| #   | Item                          | Test/Metric                                                         |
| --- | ----------------------------- | ------------------------------------------------------------------- |
| 1   | **Board randomization**       | VRF proof stored; headers unique; test passes.                      |
| 2   | **Winner detection + payout** | Anchor test simulates score feed; SOL transferred; Email sent.      |
| 3   | **Live UI**                   | Board updates via WebSocket ≤ 3 s latency.                          |
| 4   | **Clockwork threads**         | Crank logs show tasks every 5 min.                                  |
| 5   | **Docs & research**           | `/docs/architecture.md` updated; `/research` includes any new APIs. |
| 6   | **CI green**                  | All jobs pass on PR merge.                                          |

---

## 8 · Post-Launch Hardening (Phase-3 preview)

- Ledger hardware-signer integration for payouts
- Multi-chain oracle fallback
- Full analytics dashboard (Ceramic log queries)
- NFT achievements & leaderboard email digests
- Multi-language UI with i18n-next

---

**Confidence** : **9 / 10**
All critical paths—from VRF to payout email—are mapped and testable. Remaining risk lies in mainnet VRF queue congestion; we'll mitigate with devnet soak testing before launch.
