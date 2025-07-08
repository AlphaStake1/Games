# Crypto Squares — Football Board
> A modern, crypto-native spin on [Football Squares](https://en.wikipedia.org/wiki/Super_Bowl_squares).

An open-source platform where players claim grid squares (free or paid), track live scores, and receive automated on-chain payouts—fully auditable, fully transparent.

---

## ✨ Key Features

| ⭐ = already live | Module | What it Delivers |
|------------------|--------|------------------|
| ⭐ | **Multi-Board Engine** | Run parallel grids (Sunday Night, Monday Night, Thursday Night) and season-long leaderboards. |
| ⭐ | **Free vs Paid Segregation** | Separate sweepstakes (free/NFT prizes) from cash boards (escrow + auto-refund if unsold). |
| ⭐ | **Forward / Backward / +5 Rules**¹ | Flexible rule sets with a 60 / 40 split, bonus squares, and OT variants. |
| ⭐ | **On-Chain Randomizer** | Seeded RNG commits to the blockchain for provably fair digit assignment. |
| ⭐ | **Non-custodial Wallet Connect** | Users connect or generate Bitcoin, Solana, or EVM wallets *client-side only*. |
|   | **NFT Mint & Showcase** | Collectible overlays and trophy cabinet for winners. |
| ⭐ | **Admin Panel** | Create boards, set cut-off, trigger **All Bets Off** refunds, manage payouts, export logs. |

<sub>¹ Forward = read **home→away** digits. Backward = **away→home**. “+5” = each digit + 5 (mod 10) bonus square.</sub>

---

## 🏗 Tech Stack

| Layer | Stack |
|-------|-------|
| **Front-end** | Next.js 13.5 + React 18, Tailwind CSS, WalletConnect v2, Solana Wallet Adapter, Socket.io |
| **Back-end** | Node.js 20 + NestJS API, TypeScript, PostgreSQL (Prisma ORM), **Redis** *(pub/sub for live-score pushes)* |
| **Blockchain** | EVM (Polygon) via ethers.js, Solana via `@solana/web3.js`, Bitcoin Taproot via bitcoinjs-lib |
| **NFT** | Metaplex (Solana) + ERC-721 (EVM) collectibles |
| **DevOps** | Docker Compose, GitHub Actions CI/CD, AWS Fargate |
--
Copy .env.example to .env and fill the blanks.
---

## ⚙️ Local Dev Quick-Start


# 1. Clone
git clone https://github.com/AlphaStake1/football_board.git
cd football_board

# 2. Environment
cp .env.example .env   # fill `DB_URL`, `CHAIN_IDS`, etc.

# 3. Install deps  (ensure pnpm ≥ 8 is installed)
pnpm i

# 4. Docker up
docker compose up --build

# 5. Seed DB (optional demo data)
pnpm prisma db seed

# 6. Run unit tests
pnpm test


App: http://localhost:3000

GraphQL: http://localhost:4000/graphql

🖼 Live Demo / Screenshots
Claiming a Square	Admin Panel (board controls)

Try the hosted demo here → LIVE_URL

pnpm test          # jest + ts-jest unit + integration
pnpm e2e           # Playwright E2E

🚧 Roadmap
Mobile PWA mode

Lightning-network payouts

Multi-chain NFT gallery

MPC / social-recovery wallet option

See /docs/ROADMAP.md for milestone tracking.

🤝 Contributing
We welcome issues, PRs, and ideas!

Fork → feature branch (git checkout -b feat/my-feature)

pnpm lint && pnpm test

Open a PR following our template.

See CONTRIBUTING.md or join the discussion tab.

📝 License
Apache-2.0 — see LICENSE.

© 2025 Alpha Stake LLC • Open-sourcing Football Squares for the crypto age.
