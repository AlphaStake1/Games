# Crypto Squares — A Solana-Based Football Squares dApp

> A modern, crypto-native spin on [Football Squares](https://en.wikipedia.org/wiki/Super_Bowl_squares), rebuilt on the Solana blockchain.

An open-source platform where players claim grid squares, track live scores, and receive automated on-chain payouts—fully auditable, fully transparent, and powered by a decentralized stack.

---

## ✨ Project Vision (Solana First)

This project is a trust-minimised **Football-Squares dApp** that:

*   stores board and payout logic in an **Anchor** program,
*   automates game-day tasks via **Clockwork** + LLM agents,
*   delivers a real-time UI in **Next.js (static export) + Tailwind**,
*   emails winners through a **Proton Mail Bridge**,
*   logs mutable history on **Ceramic**,
*   and is deployed on **Akash** / IPFS.

---

## 🏗 Tech Stack

| Layer          | Stack                                                            |
| -------------- | ---------------------------------------------------------------- |
| **Blockchain** | Solana, Anchor, Switchboard (VRF & Oracles), Clockwork           |
| **Front-end**  | Next.js 13 (Static), TypeScript, Tailwind CSS, shadcn/ui         |
| **AI/Agents**  | OpenAI API, Anthropic API, TypeScript-based agents               |
| **Storage**    | Ceramic (Mutable Data), IPFS (Immutable Assets)                  |
| **Deployment** | Akash, Docker                                                    |
| **Notifications**| Proton Mail Bridge (SMTP)                                        |

---

## ⚙️ Local Development Quick-Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **Rust** & **Cargo**
- **Anchor Framework** (`avm install latest` & `avm use latest`)

### 2. Clone Repository
```bash
git clone https://github.com/your-username/football-squares.git
cd football-squares
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Environment Setup
Copy the example environment file and fill in your details.
```bash
cp .env.example .env
```

### 5. Build & Test Anchor Program
```bash
anchor build
anchor test
```

### 6. Run Next.js Frontend
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

---

## ✅ Phase 1 Deliverables

The first phase of development focused on research, scaffolding, and setting up the core project structure.

| # | Deliverable         | Acceptance Criteria                                                           |
|---|---------------------|-------------------------------------------------------------------------------|
| 1 | **Research corpus** | `research/` contains ≥ 100 pages total, organised by tech.                    |
| 2 | **Anchor skeleton** | `anchor build` succeeds; unit test creates a board.                           |
| 3 | **Next.js shell**   | `pnpm build && pnpm start` serves static site showing placeholder grid.         |
| 4 | **Design system**   | `app/globals.css` contains monochrome ink/paper CSS variables.                |
| 5 | **SVG assets**      | `public/assets/` contains `scribble-border.svg` and `paper-texture.svg`.    |
| 6 | **Agent stubs**     | TypeScript classes compile; Orchestrator prints planned tasks.                |
| 7 | **CLI stubs**       | `pnpm ts-node scripts/init_board.ts` prints "TODO".                           |
| 8 | **CI bootstrap**    | GitHub Action: `pnpm lint`, `tsc --noEmit`, `cargo clippy`, `anchor build` pass. |

---

## 🤝 Contributing

We welcome issues, PRs, and ideas! Please see `CONTRIBUTING.md` for more details.

## 📝 License

Apache-2.0 — see `LICENSE`.

---
© 2025 Alpha Stake LLC • Open-sourcing Football Squares for the crypto age.
