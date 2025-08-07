# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Guidance & ground-rules for Claude Code (and other LLMs) when working in this repo.

---

## 🔄 Project Awareness & Context

1. **Always open `PLANNING.md` first** – architecture, style, naming, design-system tokens.
2. **Check `TASK.md`** – if your task isn't listed, add it with a date & one-line description.
3. **Consult `/research/*`** – scrape pages live only if documentation is missing there.
4. **Sacred truths**
   - Primary orchestrator model: `claude-opus-4-20241218` (for building larger tasks).
   - Assistant orchestrator model: `claude-opus-4-1-20250805` (for complex multi-step tasks).
   - Supporting Claude model: `claude-sonnet-4-20250514` (for focused tasks).
   - Supporting OpenAI model: `gpt-4.1`. **Never rename or swap models.**
   - CRON / scheduler = **Clockwork**.
   - Email = **Proton Mail + Proton VPN/Bridge**.
5. **Always check for ElizaOS update before working on Agents**

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

## 🚀 Implementation Strategy Recommendations

- When developing new features or refactoring, prioritize modular and composable design patterns
- Always consider performance implications and potential scalability challenges
- Implement robust error handling and comprehensive logging mechanisms
- Conduct thorough code reviews and maintain high test coverage
