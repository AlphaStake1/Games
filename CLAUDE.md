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

---

## 📋 Next.js 15 & Development Guidelines

### Dynamic Routes (CRITICAL)

- **Next.js 15 requirement**: Dynamic route params are now async Promises
- Always use `params: Promise<{ param: string }>` in route handlers and pages
- Await params before use: `const { param } = await params;`
- This applies to both API routes and page components

### Development Server

- **Port**: Dev server runs on port 3001 (3000 often in use)
- **Public access**: Use ngrok for testing - `./ngrok http 3001 --log=stdout`
- **Hot reload**: Changes reflect immediately in development mode

### Asset Management

- **Icons**: Store wallet/brand icons in `/public/icons/` as SVG files
- Use local paths (`/icons/filename.svg`) not external URLs for reliability
- Standard wallet icons: Phantom, Solflare, Torus

### Signature Styles

- Ensure visual distinction between signature options
- Use varied fonts, angles (slant), and styles
- Angle signatures 12-15° for dynamic appearance
- Font categories: handwritten, script, pro

### Testing & Deployment

- **Build check**: Always run `pnpm run build` before committing
- **Type checking**: Run `pnpm tsc --noEmit` to verify TypeScript
- **Lint**: Use `pnpm lint` for code quality
- **Rust/Anchor**: Ensure `rustup default stable` for builds

### Git Workflow

- **Primary remote**: `coach-b` (main development)
- **Commit format**: Use conventional commits (feat:, fix:, etc.)
- **Push**: `git push coach-b main` for primary repository

---

## 🔒 Security Reminders

- Never expose private keys or sensitive data in code
- Validate all user inputs, especially wallet addresses
- Use environment variables for API keys and endpoints
- Implement rate limiting on public API routes
