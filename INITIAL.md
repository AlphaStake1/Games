## FEATURE

A modular **Solana football-squares dApp** driven by agentic automation:

| Layer                 | Tech / Service                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Frontend**          | React + TypeScript (Vite), Tailwind CSS, wallet-adapter UI components (Phantom/Solflare) |
| **On-chain program**  | Rust + Anchor — stores board state, square ownership, payouts                            |
| **Automation / CRON** | **Clockwork** (Solana-native trust-minimized scheduling)                                 |
| **Oracles & VRF**     | **Switchboard** — NFL score feeds + verifiable randomness                                |
| **Off-chain compute** | Optional stateless workers on **Akash** (for heavy analytics / LLM work)                 |
| **Storage**           | IPFS/Arweave for static assets; Ceramic or Textile for mutable metadata                  |
| **LLM stack**         | Claude Sonnet 4 (orchestrator) · GPT-4.1 mini (task agents)                              |

All agents communicate via **typed JSON messages** to ensure deterministic decision-making and easy parsing by the LLMs running in VS Code.

### Access & Configuration

| Item                 | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| **Admin wallet**     | Solana keypair that can create new pools and boards             |
| **RPC endpoint**     | User-supplied; default to `https://api.mainnet-beta.solana.com` |
| **Oracle feed IDs**  | Switchboard feed addresses for each NFL game                    |
| **VRF queue**        | Switchboard VRF account for board number randomization          |
| **IPFS pinning key** | (If using Fleek or Spheron)                                     |

The dashboard is wallet-gated: holders of an **admin NFT** (minted at deployment) can generate invite links / codes that grant UI access.

---

## AGENTS (⚙️ Agentic Workflow)

### OrchestratorAgent — _Claude Sonnet 4_

Wakes up via **Clockwork** schedule (cron-like slot triggers) and evaluates global game context:

1. New NFL games today?
2. Pools status (open/full/in-play/settled)
3. Latest oracle scores & block timestamps
4. Pending winners or payouts?

Then spawns task-specific agents and enforces duplicate-prevention (e.g., no double-randomization, no duplicate payouts).

| Child Agent         | Model        | Responsibility                                                                   |
| ------------------- | ------------ | -------------------------------------------------------------------------------- |
| **BoardAgent**      | GPT-4.1 mini | Build 10 × 10 grid accounts, initialize metadata                                 |
| **RandomizerAgent** | GPT-4.1 mini | Request VRF from Switchboard, assign 0-9 headers                                 |
| **OracleAgent**     | GPT-4.1 mini | Poll Switchboard score feed, cache to Ceramic                                    |
| **WinnerAgent**     | GPT-4.1 mini | Compare live score ↔ board, mark winning square                                 |
| **PayoutAgent**     | GPT-4.1 mini | Submit Anchor `payout()` instruction, confirm SOL transfer                       |
| **AnalyticsAgent**  | GPT-4.1 mini | Aggregate stats, surface insights to dashboard (stickiness metrics, pool fill %) |

All inter-agent messages follow a strict JSON schema (`schemas/` folder) to keep logs machine-readable and auditable.

---

## EXAMPLES

```
examples/
├─ orchestrator_wakeup.json   # sample context payload at kickoff
├─ randomizer_vrf_request.json
├─ winner_detection.json
└─ payout_submission.json
```

Each file shows the **exact JSON** an agent should ingest or emit.

---

## DOCUMENTATION _(scrape 10–15 pages per link)_

| Domain                   | Why We Need It                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Solana Docs**          | [https://docs.solana.com/](https://docs.solana.com/)                                                 |
| **Anchor Framework**     | [https://www.anchor-lang.com/docs](https://www.anchor-lang.com/docs)                                 |
| **Rust By Example**      | [https://doc.rust-lang.org/rust-by-example/](https://doc.rust-lang.org/rust-by-example/)             |
| **Switchboard Oracle**   | [https://docs.switchboard.xyz/](https://docs.switchboard.xyz/)                                       |
| **Clockwork**            | [https://clockworkxyz.notion.site/](https://clockworkxyz.notion.site/) (use latest fork if archived) |
| **Phantom Wallet SDK**   | [https://docs.phantom.app/integrating/](https://docs.phantom.app/integrating/)                       |
| **Ceramic**              | [https://developers.ceramic.network/](https://developers.ceramic.network/)                           |
| **Akash Network**        | [https://docs.akash.network/](https://docs.akash.network/)                                           |
| **ElizaOS Agents**       | [https://eliza.ai/docs](https://eliza.ai/docs) (for advanced LLM/agent orchestration)                |
| **OpenAI API**           | [https://platform.openai.com/docs/](https://platform.openai.com/docs/)                               |
| **Anthropic API**        | [https://docs.anthropic.com/](https://docs.anthropic.com/)                                           |
| **Jina Reader / Search** | [https://jina.ai/reader/](https://jina.ai/reader/)                                                   |

---

## OTHER CONSIDERATIONS

1. **Designsystem.md** — continue to enforce global UI tokens (colors #255c7e / #ed5925 etc.).
2. **Security**
   - Validate all Cross-Program Invocations in Anchor.
   - Rate-limit VRF requests to avoid griefing.
   - Use SPL Token transfers with checked owner asserts for payouts.

3. **Testing**
   - On-chain unit tests in `programs/tests/` (e.g., board init, winner calc, payout).
   - Front-end Cypress tests for wallet flow.

4. **Extensibility**
   - To add a new agent, create a spec in `agents/NEW_AGENT_NAME/`, implement schema, and reference it in OrchestratorAgent’s task matrix.
   - OrchestratorAgent auto-loads any folder matching `agents/*Agent/` pattern.

---

> **Remember:** for any time-based automation, **Clockwork is our first-class scheduler**. If the task must interact directly with on-chain data, schedule it through Clockwork; if it’s heavy off-chain AI/analytics, run it on Akash and have it ping the program.
