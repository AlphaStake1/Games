# INITIAL_EXAMPLES.md

## FEATURE

A modular **Solana Football-Squares dApp** driven by agentic automation.

| Layer                    | Tech / Service                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Front-end                | React + TypeScript (Vite) · Tailwind CSS · `@solana/wallet-adapter` (Phantom/Solflare) |
| On-chain program         | Rust + Anchor — stores board state, square ownership, payouts                          |
| Automation / Cron        | **Clockwork** (Solana-native trust-minimized scheduler)                                |
| Oracles & VRF            | **Switchboard** — NFL score feeds · verifiable randomness for board numbers            |
| Off-chain compute (opt.) | Stateless Node/TS workers on **Akash**                                                 |
| Email comms              | **Proton Mail + Proton VPN/Bridge** via `nodemailer`                                   |
| Storage & Metadata       | IPFS/Arweave for assets · Ceramic/Textile for mutable history                          |
| LLM stack                | Claude Sonnet 4 (OrchestratorAgent) · GPT-4.1 mini (task agents)                       |
| Auth & Dashboard         | Admin NFT-gated React dashboard; invite codes issued on-chain                          |

Agents exchange **typed JSON messages** (`schemas/` folder) so LLMs can reason over deterministic structures.

---

## EXAMPLES (`examples/` folder)

| File / Dir                    | What it Demonstrates                                           |
| ----------------------------- | -------------------------------------------------------------- |
| `init_board.ts`               | CLI → Anchor call to create a 10×10 board program-side         |
| `clockwork_trigger.json`      | Sample Clockwork schedule payload for `WinnerAgent`            |
| `oracle_poll.ts`              | Pull latest score from a Switchboard feed and cache to Ceramic |
| `agents/orchestrator.stub.ts` | Skeleton OrchestratorAgent (Claude) JSON contract              |
| `agents/randomizer.stub.ts`   | VRF request / response flow                                    |
| `emails/payout_receipt.hbs`   | Handlebars template sent through Proton Bridge                 |
| `README.md`                   | Explains how to run each script with `pnpm ts-node`            |

> **Tip for LLM devs in VS Code:** open any file in `examples/` and run _“Explain file to me”_ — the repo’s `.code-snippets` will auto-prompt the LLM with context from `/schemas`.

---

## DOCUMENTATION (to scrape ≈ 10–30 pages each)

- Solana Docs — <https://docs.solana.com/>
- Anchor Framework — <https://www.anchor-lang.com/docs>
- Switchboard Oracle & VRF — <https://docs.switchboard.xyz/>
- Clockwork Scheduler — <https://clockworkxyz.notion.site/> _(use latest fork if archived)_
- Phantom Wallet SDK — <https://docs.phantom.app/integrating/>
- Ceramic Developers — <https://developers.ceramic.network/>
- Akash Network — <https://docs.akash.network/>
- Proton Mail Bridge CLI — <https://proton.me/mail/bridge>
- ElizaOS Agents — <https://eliza.ai/docs>
- OpenAI API — <https://platform.openai.com/docs/>
- Anthropic API — <https://docs.anthropic.com/>
- Jina Reader & Search — <https://jina.ai/reader/>

---

## OTHER CONSIDERATIONS

1. **`.env.example`**

RPC_ENDPOINT=https://api.mainnet-beta.solana.com
ORACLE_FEED_ID=...
VRF_QUEUE=...
ADMIN_KEYPAIR=~/.config/solana/id.json
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_USER=bridge_user
SMTP_PASS=bridge_pass

> _Proton Bridge runs inside the same container; agents connect via local SMTP._

2. **README** should include:

- Quick-start (`pnpm i && pnpm dev`)
- How to spin up Clockwork triggers
- How to run tests (`anchor test`, Playwright UI)

3. **Designsystem.md** — reuse color tokens `#002244`, `#004953`, `#ed5925`.

4. **Adding a new agent**

- Create `agents/<Name>Agent/` with `index.ts`, `schema.ts`, `README.md`.
- Register it in `OrchestratorAgent` task matrix; Clockwork detects JSON manifest and schedules automatically.

5. **Security notes**

- SPL Token `transfer_checked` for payouts
- Verify VRF proofs on-chain
- Rate-limit Oracle pulls to prevent griefing

---

> **Remember:**
> _Clockwork is our first-class scheduler, and Proton Mail + Proton VPN/Bridge is our default email channel._
> Any new example or agent should reflect those choices.
