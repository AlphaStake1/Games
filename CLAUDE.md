# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
pnpm run dev            # hot reload
pnpm run build          # next build && next export
pnpm run start          # serve ./out locally

# Rust / Anchor
anchor test            # unit + integration tests
anchor deploy          # deploy to localnet/devnet
solana-test-validator  # local validator

# TypeScript agents / CLI
pnpm ts-node scripts/init_board.ts --game 123
pnpm lint && tsc --noEmit           # ESLint + TS type-check
```

---

### Project-Specific Commands

| Command                              | What it does                                            |
| ------------------------------------ | ------------------------------------------------------- |
| `pnpm squares:init <gameId>`         | One-shot script → creates board + sets Clockwork thread |
| `pnpm squares:randomize <boardPDA>`  | Manually trigger VRF randomization (dev only)           |
| `pnpm db:seed`                       | Seeds Ceramic dev profile for demo accounts             |
| `cargo run --bin vrf-callback-debug` | Runs local VRF callback simulator                       |

    *Make sure each script exists in /scripts or explain where it lives

---

## 🚦 Core Rules for LLM-Driven Code

| #   | Rule |
| --- | ---- |

\| 1 | **Never hallucinate** libraries, CLI flags, file paths. Confirm existence first. |
\| 2 | **Files > 500 LOC** → refactor into modules (`lib/`, `utils/`, etc.). |
\| 3 | Use **JSON-only interfaces** between agents (`/schemas/*.ts`). |
\| 4 | All new Rust code must pass `cargo clippy -- -D warnings`. |
\| 5 | All new TS code must pass `pnpm lint` & `tsc --noEmit`. |
\| 6 | Unit tests live in `/tests` (TS) or `programs/squares/tests` (Mocha). Provide: happy-path, edge, failure. |
\| 7 | If uncertain → ask a clarifying question instead of guessing. |
\| 8 | **Before installing tools/MCPs** → Check global availability AND Docker containers first. |

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

_Stick to this layout unless PLANNING.md says otherwise._

---

## 📐 Code Style

- **TypeScript / JavaScript** → Airbnb + Prettier (see `.eslintrc`).
- **Rust** → `rustfmt + clippy`.
- **React** → Functional components, hooks, shadcn/ui tokens.
- **Docstrings** → Google style in TS & Rust (`///` on top of fns).
- **Commit messages** → Conventional Commits (`feat:`, `fix:`, etc.).

---

## 🔍 Tool Discovery & Installation Protocol

**ALWAYS follow this sequence before installing any tool or MCP:**

### 1. Check Global System Availability

```bash
# Check if tool exists in PATH
which <tool-name>
command -v <tool-name>

# For Python packages
python3 -c "import <package>; print('<package> is available')" 2>/dev/null || echo "<package> not found"

# For Node packages
npm list -g <package-name>
pnpm list -g <package-name>
```

### 2. Check Docker Container Availability

```bash
# Search for official Docker images
docker search <tool-name> | head -5

# Check if tool is available in existing containers
docker run --rm <image-name> which <tool-name>
docker run --rm <image-name> <tool-name> --version

# List container contents to explore
docker run --rm <image-name> ls -la /
docker run --rm <image-name> find /app -name "*<tool>*" -type f
```

### 3. Check MCP Server Integration

```bash
# Look for MCP-provided tools (they start with "mcp__")
# Always prefer MCP tools over manual installations
```

### 4. Only Install If Not Available

- **Docker approach preferred** for isolation and reproducibility
- Document installation method in scripts with comments
- Add tool info to this CLAUDE.md file under "Local Dev Commands"

### Example: Tool Discovery Process

```bash
# 1. Check global
which crawl4ai || echo "Not in PATH"

# 2. Check Docker
docker search crawl4ai | head -3
docker run --rm unclecode/crawl4ai python3 --version

# 3. Use Docker if available, else install
# Always prefer Docker containers for external tools
```

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

3. **Browser automation testing**

   ```bash
   # Start dev server in background
   nohup pnpm run dev > dev.log 2>&1 &

   # Use MCP Playwright tools for browser testing
   # Key pages to verify: /, /help, /how-to-play, /fantasy
   # Test interactive elements: support forms, navigation, RSS feeds
   ```

4. **Localnet integration**

   ```bash
   solana-test-validator -r &
   anchor deploy && pnpm ts-node scripts/e2e_demo.ts
   ```

_All steps must be green before marking a TASK complete._

---

| Item               | Action                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **Vitest vs Jest** | Confirm actual test runner; update `pnpm test` alias.                                                    |
| **Design tokens**  | Link the exact file: `app/styles/tokens.css` (or similar).                                               |
| **`/schemas`**     | Verify every agent imports the right JSON schema from that folder; otherwise add a “TODO: build schema”. |

---

## 🔑 Secrets & Environment

- Use `.env.local` – never commit real keys.
- Required vars (see `.env.example`):

  ```env
  OPENAI_API_KEY=...
  ANTHROPIC_API_KEY=...
  RPC_ENDPOINT=...
  PROTON_BRIDGE_USER=...
  PROTON_BRIDGE_PASS=...

  # Mailchain (Coach B's email system)
  MAILCHAIN_URL=https://app.mailchain.com
  MAILCHAIN_EMAIL=CoachB@mail.chain
  MAILCHAIN_PASSWORD=...
  MAILCHAIN_PRIVATE_KEY=...

  # Solana Domain Email Aliases (also registered to Coach B's wallet)
  # squaregames.sol
  # footballsquares.sol
  # playboards.sol
  # fantasyball.sol
  # playsquares.sol
  # footballboards.sol
  # footballboard.sol

  # Coach B's Phantom Wallet
  COACH_B_PHANTOM_USERNAME=@CoachB1
  COACH_B_WALLET_ADDRESS=4JJjBzzefL4wzneyyjLu2GzB98MpTSZ9RSdvm7pp9DrH
  COACH_B_WALLET_PASSPHRASE=...

  # Grant Trust Treasury Agent
  GRANT_TRUST_WALLET_ADDRESS=GyNvkSqgYQX9pLAHyrWCLR6bNsrAmh4Ktn5PpPQgaaF1
  GRANT_TRUST_PRIVATE_KEY=keys/grant-trust-keypair.json
  TREASURY_MULTISIG_ADDRESS=...
  TREASURY_MONITORING_RPC=...
  TREASURY_ALERT_WEBHOOK=...

  # Web3 Storage & Infrastructure
  PINATA_API_KEY=...
  PINATA_SECRET_KEY=...
  CERAMIC_NODE_URL=...
  CERAMIC_PRIVATE_KEY=...
  ARWEAVE_WALLET_KEY=...

  # Mason Foreman Architect Agent
  MASON_FOREMAN_WALLET_ADDRESS=3WQRVfDTr5SNuyxhaGiYBboMHTGKKYY7CF5sYNyo3NrB
  MASON_FOREMAN_PRIVATE_KEY=keys/mason-foreman-keypair.json
  DEPLOYMENT_AUTHORITY_KEYPAIR=...
  PROGRAM_UPGRADE_AUTHORITY=...
  INFRASTRUCTURE_MONITORING_KEY=...

  # Deployment & Infrastructure
  DOCKER_REGISTRY_URL=...
  KUBERNETES_CONFIG_PATH=...
  TERRAFORM_WORKSPACE=...
  MONITORING_DASHBOARD_URL=...
  GRAFANA_API_KEY=...
  PROMETHEUS_ENDPOINT=...
  ALERT_WEBHOOK_URL=...

  # CI/CD Pipeline
  GITHUB_ACTIONS_TOKEN=...
  DEPLOYMENT_PIPELINE_WEBHOOK=...
  ARTIFACT_STORAGE_URL=...
  BUILD_CACHE_ENDPOINT=...

  # Axe Ray Security Analysis Agent
  SEC3_XRAY_API_KEY=...
  SEMGREP_APP_TOKEN=...
  CODEQL_DATABASE_PATH=...
  SECURITY_SCAN_WEBHOOK=...
  VULNERABILITY_DB_URL=...

  # Security Analysis Tools
  CARGO_AUDIT_DB_PATH=...
  CLIPPY_CONFIG_PATH=...
  BANDIT_CONFIG_FILE=...
  ESLINT_SECURITY_CONFIG=...
  DEPENDENCY_CHECK_SUPPRESSIONS=...

  # Recon Ghost Privacy Agent
  RECON_GHOST_WALLET_ADDRESS=2BX4SwrCVLRDz59bzMq52ftJoZYnda1xkrNYHvtkx1eH
  RECON_GHOST_PRIVATE_KEY=keys/recon-ghost-keypair.json
  BURNER_WALLET_POOL_SIZE=...
  PRIVACY_OPERATION_LOG=...

  # Anonymization Infrastructure
  TOR_CONTROL_PASSWORD=...
  VPN_API_KEYS=...
  PROXY_CHAIN_CONFIG=...
  METADATA_SCRUBBER_PATH=...
  EXIFTOOL_CONFIG=...

  # Anonymous Storage
  BUNDLR_PRIVATE_KEY=...
  ARWEAVE_ANONYMOUS_WALLET=...
  IPFS_ANONYMOUS_NODE=...
  SMARTWEAVE_BURNER_KEY=...
  CERAMIC_ANONYMOUS_DID=...

  # Dali Palette Art Generation Agent
  DALI_PALETTE_WALLET_ADDRESS=HzTFaTJU2E9dF9gyp33zgpTDchTHNtJDk5AMLDiUBMLw
  DALI_PALETTE_PRIVATE_KEY=keys/dali-palette-keypair.json

  # AI Art Generation APIs
  OPENAI_API_KEY=... # For DALL-E 3
  STABILITY_AI_API_KEY=... # For Stable Diffusion
  MIDJOURNEY_API_KEY=...
  HUGGINGFACE_API_KEY=...

  # Art Processing Tools
  FABRIC_JS_LICENSE=...
  CANVAS_API_ENDPOINT=...
  IMAGE_OPTIMIZATION_SERVICE=...
  NFT_METADATA_TEMPLATE_URL=...
  ARTWORK_STORAGE_BUCKET=...

  # Max Buzz Gamification Agent
  MAX_BUZZ_WALLET_ADDRESS=Dm6gg8kLhL2MsBsEq1y952EXq1x5YbS328CPYpAnJx2c
  MAX_BUZZ_PRIVATE_KEY=keys/max-buzz-keypair.json

  # Gamification & Rewards
  BADGE_AIRDROP_AUTHORITY=...
  CNFT_BUBBLEGUM_TREE=...
  BURN_TO_UPGRADE_PROGRAM=...
  VRF_RAFFLE_AUTHORITY=...
  COUPON_TOKEN_MINT=...

  # Community Engagement
  LEADERBOARD_UPDATE_WEBHOOK=...
  COMMUNITY_PULSE_API=...
  ENGAGEMENT_METRICS_DB=...
  TOURNAMENT_MANAGEMENT_KEY=...
  MERCHANDISE_PARTNER_API=...
  ```

---

## 🎨 Design System

Follow `designsystem.md`:

- Brand colors:
  - Primary Blue `#255c7e`
  - Accent Orange `#ed5925`

- Use shadcn/ui primitives; never invent custom CSS unless tokenized.

---

## 🧠 Agent-Specific Guidelines

- **OrchestratorAgent** can call sub-agents only via tool pattern, never directly hit Solana RPC.
- **RandomizerAgent** must verify Switchboard VRF proof before writing to chain (no trustless skip).
- **EmailAgent** uses Proton Bridge SMTP @ `127.0.0.1:1025`.
- Always include `ctx.usage` for token accounting.

---

## 📎 Documentation Duties

- Update `/docs/*.md` when APIs, env vars, or contract accounts change.
- If new third-party lib used → scrape 10–15 official-doc pages into `/research/<lib>/`.

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

- pnpm install # bootstrap repo
- pnpm dev # next dev + nodemon agents
- pnpm lint && pnpm test # full QA suite
- pnpm ts-node scripts/init_board.ts --game 123

* If you keep npm, swap every pnpm reference in docs and CI to npm run

---

## ❌ Anti-Patterns

- No off-chain RNG.
- No direct Gmail / SES (use Proton).
- No hard-coded PDAs; derive via seeds.
- No `console.log` commits in production code.
- No giant pull requests (>500 LOC diff) without prior task breakdown.

---

_Claude, follow these instructions exactly; ask if anything is unclear or missing._
