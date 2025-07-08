
# CLAUDE.md  
> Guidance & ground-rules for Claude Code (and other LLMs) when working in this repo.

---

## 🔄 Project Awareness & Context

1. **Always open `PLANNING.md` first** – architecture, style, naming, design-system tokens.  
2. **Check `TASK.md`** – if your task isn’t listed, add it with a date & one-line description.  
3. **Consult `/research/*`** – scrape pages live only if documentation is missing there.  
4. **Sacred truths**  
   - Primary orchestrator model: `claude-sonnet-4-20250514`.  
   - Supporting OpenAI model: `gpt-4.1`. **Never rename or swap models.**  
   - CRON / scheduler = **Clockwork**.  
   - Email = **Proton Mail + Proton VPN/Bridge**.

---

## 🛠️ Local Dev Commands (Quick-ref)

```bash
# Front-end (Next.js static-export)
npm run dev            # hot reload
npm run build          # next build && next export
npm run start          # serve ./out locally

# Rust / Anchor
anchor test            # unit + integration tests
anchor deploy          # deploy to localnet/devnet
solana-test-validator  # local validator

# TypeScript agents / CLI
pnpm ts-node scripts/init_board.ts --game 123
pnpm lint && tsc --noEmit           # ESLint + TS type-check
````
---
### Project-Specific Commands

| Command                                  | What it does                                   |
|------------------------------------------|------------------------------------------------|
| `pnpm squares:init <gameId>`             | One-shot script → creates board + sets Clockwork thread |
| `pnpm squares:randomize <boardPDA>`      | Manually trigger VRF randomization (dev only)  |
| `pnpm db:seed`                           | Seeds Ceramic dev profile for demo accounts    |
| `cargo run --bin vrf-callback-debug`     | Runs local VRF callback simulator              |
    *Make sure each script exists in /scripts or explain where it lives

---

## 🚦 Core Rules for LLM-Driven Code

| # | Rule |
|---|-----------------------------------------------------------------------------------------------------------------------------------|

\| 1 | **Never hallucinate** libraries, CLI flags, file paths. Confirm existence first. |
\| 2 | **Files > 500 LOC** → refactor into modules (`lib/`, `utils/`, etc.). |
\| 3 | Use **JSON-only interfaces** between agents (`/schemas/*.ts`). |
\| 4 | All new Rust code must pass `cargo clippy -- -D warnings`. |
\| 5 | All new TS code must pass `pnpm lint` & `tsc --noEmit`. |
\| 6 | Unit tests live in `/tests` (TS) or `programs/squares/tests` (Mocha). Provide: happy-path, edge, failure. |
\| 7 | If uncertain → ask a clarifying question instead of guessing. |

---

## 🏗️ Project Architecture Snapshot

```
app/ (Next.js 13 static export)
  ├─ components/           # shadcn/ui + custom
  ├─ providers.tsx         # wallet adapter, theme
  └─ ...

programs/squares/          # Anchor smart-contract
  ├─ src/lib.rs
  └─ tests/

agents/                    # Claude / GPT workers
  ├─ OrchestratorAgent/
  ├─ BoardAgent/
  ├─ RandomizerAgent/
  └─ ...

schemas/                   # JSON Schemas for agent I/O
scripts/                   # CLI helpers (ts-node)

docs/                      # markdown specs
research/                  # Jina scrapes / official docs
```

*Stick to this layout unless PLANNING.md says otherwise.*

---

## 📐 Code Style

* **TypeScript / JavaScript** → Airbnb + Prettier (see `.eslintrc`).
* **Rust** → `rustfmt + clippy`.
* **React** → Functional components, hooks, shadcn/ui tokens.
* **Docstrings** → Google style in TS & Rust (`///` on top of fns).
* **Commit messages** → Conventional Commits (`feat:`, `fix:`, etc.).

---

## 🔬 Testing & Validation Loop

1. **Lint / Type-check**

   ```bash
   pnpm lint && tsc --noEmit
   cargo clippy -- -D warnings
   ```

2. **Unit tests**

   ```bash
   anchor test
   pnpm vitest
   ```

3. **Localnet integration**

   ```bash
   solana-test-validator -r &
   anchor deploy && pnpm ts-node scripts/e2e_demo.ts
   ```

*All steps must be green before marking a TASK complete.*

---
| Item               | Action                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **Vitest vs Jest** | Confirm actual test runner; update `pnpm test` alias.                                                    |
| **Design tokens**  | Link the exact file: `app/styles/tokens.css` (or similar).                                               |
| **`/schemas`**     | Verify every agent imports the right JSON schema from that folder; otherwise add a “TODO: build schema”. |

---

## 🔑 Secrets & Environment

* Use `.env.local` – never commit real keys.
* Required vars (see `.env.example`):

  ```env
  OPENAI_API_KEY=...
  ANTHROPIC_API_KEY=...
  RPC_ENDPOINT=...
  PROTON_BRIDGE_USER=...
  PROTON_BRIDGE_PASS=...
  ```

---

## 🎨 Design System

Follow `designsystem.md`:

* Brand colors:

  * Primary Blue `#255c7e`
  * Accent Orange `#ed5925`
* Use shadcn/ui primitives; never invent custom CSS unless tokenized.

---

## 🧠 Agent-Specific Guidelines

* **OrchestratorAgent** can call sub-agents only via tool pattern, never directly hit Solana RPC.
* **RandomizerAgent** must verify Switchboard VRF proof before writing to chain (no trustless skip).
* **EmailAgent** uses Proton Bridge SMTP @ `127.0.0.1:1025`.
* Always include `ctx.usage` for token accounting.

---

## 📎 Documentation Duties

* Update `/docs/*.md` when APIs, env vars, or contract accounts change.
* If new third-party lib used → scrape 10–15 official-doc pages into `/research/<lib>/`.

Documentation & References
- file: docs/PLANNING.md
  why: High-level architecture and naming conventions

- file: TASK.md
  why: Source-of-truth for open tasks; update after each PR

- file: designsystem.md
  why: Color tokens and component rules

- file: research/clockwork/overview.md
  why: Scheduler account-layout and thread-creation examples

For monorepo with multiple packages, prepend the subdir:
- file: programs/squares/src/lib.rs
  why: Anchor program entry point – read before adding new ix

---
Standardise package-manager commands (pnpm)
- pnpm install               # bootstrap repo
- pnpm dev                   # next dev + nodemon agents
- pnpm lint && pnpm test     # full QA suite
- pnpm ts-node scripts/init_board.ts --game 123
* If you keep npm, swap every pnpm reference in docs and CI to npm run

---

## ❌ Anti-Patterns

* No off-chain RNG.
* No direct Gmail / SES (use Proton).
* No hard-coded PDAs; derive via seeds.
* No `console.log` commits in production code.
* No giant pull requests (>500 LOC diff) without prior task breakdown.

---

*Claude, follow these instructions exactly; ask if anything is unclear or missing.*
