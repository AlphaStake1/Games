# Phase 1 — Research & Skeleton Implementation  
> Football Squares (Solana) · July 2025

---

## 0 · Project Snapshot

A trust-minimised **Football-Squares dApp** that:

* stores board and payout logic in an **Anchor** program,  
* automates game-day tasks via **Clockwork** + LLM agents,  
* delivers real-time UI in **Next 13 static-export + Tailwind**,  
* emails winners through **Proton Mail + Bridge**,  
* logs mutable history in **Ceramic**,  
* all infra deployed on **Akash** / IPFS.

Phase-1 focuses on **research + scaffolding**. No production logic—just stubs, docs, and tests that prove the tool-chain works.

---

## 1 · Key Technologies to Research

| Domain                | Primary Docs to Scrape (≈10–15 pages each)                |
|-----------------------|-----------------------------------------------------------|
| **Solana Runtime**    | https://docs.solana.com/                                  |
| **Anchor Framework**  | https://www.anchor-lang.com/docs                          |
| **Switchboard Oracle**| https://docs.switchboard.xyz/ (VRF & price feeds)         |
| **Clockwork**         | https://clockworkxyz.notion.site/ (use latest fork)       |
| **Proton Mail Bridge**| https://proton.me/mail/bridge                             |
| **Ceramic**           | https://developers.ceramic.network/                       |
| **Akash**             | https://docs.akash.network/                               |
| **OpenAI API**        | https://platform.openai.com/docs/                         |
| **Anthropic API**     | https://docs.anthropic.com/                               |
| **Jina Reader/Search**| https://jina.ai/reader/                                   |
| **Recursive Font**    | https://www.recursive.design/ (variable font system)      |
| **KaTeX Math**        | https://katex.org/docs/ (font rendering)                  |
| **Tailwind CSS**      | https://tailwindcss.com/docs (hand-drawn utilities)       |

*All scrapes land in `/research/<tech>/<page>.md`.*

---

## 2 · Architecture Diagram (Phase-1 skeleton)

```

┌──────────────────────── Front-End (Next 13 static) ───────────────────────┐
│  BoardGrid.tsx • WalletConnect • Tailwind • shadcn/ui                     │
└───────────────────────▲────────────────────────────────────────────────────┘
                        │ JSON RPC / WebSocket
┌───────────────────────┴────────────────────────────────────────────────────┐
│     Solana Program (Anchor skeleton)  –  src/lib.rs                       │
│  • create_board       • randomize_board (stub)                             │
│  • submit_score (stub)• payout_winner  (stub)                              │
└───────────────────────▲────────────────────────────────────────────────────┘
                        │
┌───────────┴───────────┐
│  Off-Chain Agents     │  (TypeScript stubs)                   │
│  – OrchestratorAgent  │  Claude Sonnet 4                      │
│  – BoardAgent         │  GPT-4.1                              │
│  – RandomizerAgent    │  GPT-4.1                              │
│  – OracleAgent        │  GPT-4.1                              │
└───────────────────────┘
                        │
                        ▼
Research Docs (MD) • Scripts • Tests • .env.example

```

---

## 3 · Directory Skeleton (commit in Phase-1)

```

/football-squares/
├─ app/                       # Next 13 front-end
│   ├─ page.tsx
│   └─ globals.css            # Hand-drawn design system
├─ components/                # UI components
│   ├─ SquaresGrid.tsx        # Main board component
│   ├─ TeamHeaders.tsx        # Team name displays
│   └─ MobileNav.tsx          # Mobile navigation
├─ public/assets/             # SVG assets
│   ├─ scribble-border.svg    # Hand-drawn borders
│   └─ paper-texture.svg      # Paper texture overlay
├─ programs/
│   └─ squares/
│       ├─ Cargo.toml
│       └─ src/lib.rs         # Anchor skeleton
├─ agents/
│   ├─ OrchestratorAgent/
│   ├─ BoardAgent/
│   └─ ...
├─ scripts/
│   ├─ init_board.ts          # ts-node stub
│   └─ request_vrf.ts
├─ research/                  # Jina scrapes land here
│   └─ switchboard/...
├─ tests/
│   └─ anchor_localnet.ts
├─ docs/
│   └─ architecture.md
├─ .env.example
├─ package.json   (pnpm)
└─ anchor.toml

```

---

## 4 · Environment Template (`.env.example`)

```env
### Solana / Anchor
RPC_ENDPOINT=https://api.devnet.solana.com
KEYPAIR_PATH=~/.config/solana/id.json

### Switchboard
SWITCHBOARD_VRF_QUEUE=
SWITCHBOARD_SCORE_FEED=

### LLM Keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

### Proton Bridge SMTP (inside container)
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_USER=bridge_user
SMTP_PASS=bridge_pass
```

---

## 5 · Phase-1 Deliverables

| # | Deliverable         | Acceptance Criteria                                                           |
| - | ------------------- | ----------------------------------------------------------------------------- |
| 1 | **Research corpus** | `research/` contains ≥ 100 pages total, organised by tech.                    |
| 2 | **Anchor skeleton** | `anchor build` succeeds; unit test creates a board.                           |
| 3 | **Next.js shell**   | `npm run build && npm run start` serves static site showing placeholder grid. |
| 4 | **Design system**   | `app/globals.css` contains monochrome ink/paper CSS variables.                |
| 5 | **SVG assets**      | `public/assets/` contains scribble-border.svg and paper-texture.svg.          |
| 6 | **Agent stubs**     | TypeScript classes compile; Orchestrator prints planned tasks.                |
| 7 | **CLI stubs**       | `pnpm ts-node scripts/init_board.ts` prints "TODO".                           |
| 8 | **CI bootstrap**    | GitHub Action: lint + clippy + anchor build pass.                             |
| 9 | **Docs**            | `docs/architecture.md` explains Phase-1 skeleton & research flow.             |

---

## 6 · Phase-1 Task Checklist

* [ ] **Scrape docs** with Jina & store in `/research`.
* [ ] Scaffold **programs/squares/src/lib.rs** with account structs + placeholder ixs.
* [ ] Scaffold **app/** with shadcn/ui layout & dummy board.
* [ ] Create **agents/** folder with empty class stubs & JSON schema.
* [ ] Provide **scripts/** that print usage / TODO.
* [ ] Add `.env.example` & update `README` setup section.
* [ ] Configure **pnpm**, Prettier, ESLint, rustfmt, clippy.
* [ ] Add **GitHub Action**: `pnpm lint && tsc --noEmit && cargo clippy && anchor build`.

---

## 7 · What Phase-1 *Intentionally* Excludes

* No real VRF requests or oracle polling.
* No email sends.
* No payout logic / signer seeds.
* No production UI—just a placeholder grid.
* Security, gas audits, and performance tuning moved to Phase-2.

---

## 8 · Looking Ahead to Phase-2

| Area         | Phase-2 Focus                                       |
| ------------ | --------------------------------------------------- |
| **On-chain** | Implement VRF verification, winner checks, payouts. |
| **Agents**   | Full JSON tool-calls, Clockwork thread management.  |
| **Email**    | Proton Bridge integration & HTML receipts.          |
| **UI**       | Live WebSocket board updates, user wallet flow.     |
| **DevOps**   | Akash deploy scripts, IPFS pinning, Ceramic logs.   |

---

**Confidence Score (Phase-1 scope): 9 / 10**
We have clear research targets, a lightweight skeleton, and CI gates. Phase-2 can layer real business logic on top of this foundation.