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

## 🖊️ Signature Font Variety System

### **Overview**

The Football Squares platform implements a sophisticated signature font variety system that provides users with 9+ distinct handwriting styles for their signature NFTs. Each signature has unique fonts, angles, sizes, and visual characteristics to ensure no two signatures look identical.

### **Architecture & Files**

#### **Core Configuration**: `/lib/signature/signatureConfig.ts`

- **SIGNATURE_FONTS[]**: Array of font definitions with categories (handwritten, script, pro)
- **SIGNATURE_STYLES[]**: Pre-defined combinations of fonts with visual attributes
- **Font Categories**:
  - `handwritten`: Casual, natural handwriting (Patrick Hand, Caveat, Shadows Into Light, Reenie Beanie)
  - `script`: Elegant cursive styles (Qwigley, Dancing Script, Great Vibes, Sacramento, Alex Brush)
  - `pro`: Professional calligraphy fonts (Madelyn, Warm Script, etc.)

#### **Font Loading**: `/app/layout.tsx`

```typescript
import {
  Recursive,
  Caveat,
  Qwigley,
  Dancing_Script,
  Patrick_Hand,
  Shadows_Into_Light,
} from 'next/font/google';
```

- Fonts are loaded via Next.js Google Fonts integration
- CSS variables created: `--font-caveat`, `--font-qwigley`, etc.
- All font variables added to HTML className for global availability

#### **Rendering Engine**: `/lib/signature/signatureGenerator.ts`

- **renderToSVG()**: Generates SVG with proper font families and rotation transforms
- **getFontFamily()**: Converts CSS variables to actual font names for SVG compatibility
- **Rotation Logic**: `transform="rotate(${style.slant} ${x} ${y})"`
- **Font Mapping**: Handles CSS variable to font name conversion for SVG rendering

### **Visual Characteristics**

#### **Angles & Rotation**

- **Range**: -15° to +12° slant angles
- **Purpose**: Creates dynamic, natural handwriting appearance
- **Implementation**: CSS `transform: rotate()` in SVG text elements
- **Key Angles**:
  - `-15°`: Strong leftward slant (professional style)
  - `0°`: Straight baseline (casual style)
  - `+12°`: Rightward slant (modern style)

#### **Font Sizes**

- **Range**: 48px - 64px
- **Variation**: Each style has optimized size for readability
- **Responsive**: Scales appropriately in different contexts

#### **Colors**

- **Primary**: `#000000`, `#1a1a1a`, `#222222`
- **Accent**: `#000044` (blue), `#2c3e50` (dark blue)
- **Purpose**: Subtle color variation adds authenticity

### **Implementation Standards**

#### **Adding New Fonts**

1. **Install Font**: Add to `app/layout.tsx` Google Fonts import
2. **Create Variable**: Define font variable with `--font-` prefix
3. **Add to Config**: Update `SIGNATURE_FONTS[]` in `signatureConfig.ts`
4. **Map in Generator**: Add font mapping in `getFontFamily()` method
5. **Test Variety**: Ensure visual distinction from existing fonts

#### **Font Selection Criteria**

- **Legibility**: Must be readable at signature sizes (48-64px)
- **Uniqueness**: Visually distinct from existing fonts
- **Web Compatibility**: Available via Google Fonts or web-safe
- **Category Balance**: Maintain mix of handwritten, script, and pro styles

#### **Testing & Validation**

- **Test File**: `/signature-fonts-test.html` - Standalone preview of all fonts
- **Visual Check**: Each font should have distinct appearance
- **Angle Verification**: Rotation transforms working correctly
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### **Best Practices**

#### **Maintaining Variety**

- **9+ Unique Styles**: Always provide significant visual variety
- **Balanced Categories**: Mix handwritten (casual), script (elegant), pro (premium)
- **Angle Distribution**: Spread angles across -15° to +12° range
- **Size Variation**: Use different font sizes for visual hierarchy
- **Color Variation**: Subtle color differences enhance authenticity

#### **Performance Optimization**

- **Font Loading**: Use `display=swap` for faster loading
- **Preconnect**: Include Google Fonts preconnect links
- **CSS Variables**: Efficient font management via CSS custom properties
- **SVG Rendering**: Optimized for data URI embedding

### **Troubleshooting**

#### **Font Not Displaying**

1. Check Google Fonts import in `layout.tsx`
2. Verify CSS variable definition
3. Confirm font mapping in `getFontFamily()`
4. Test font availability via browser DevTools

#### **Angles Not Working**

1. Verify `transform="rotate()"` syntax in SVG
2. Check slant values in `SIGNATURE_STYLES[]`
3. Ensure rotation center point (`${x} ${y}`) is correct

#### **All Signatures Look Same**

1. Check font variety in `SIGNATURE_FONTS[]`
2. Verify `generateStyleGallery()` creates different styles
3. Confirm CSS variables properly loaded
4. Test with `/signature-fonts-test.html`

### **Future Enhancements**

- **Premium Fonts**: Add paid font options for pro users
- **Custom Upload**: Allow users to upload personal fonts
- **Dynamic Angles**: Real-time angle adjustment slider
- **Color Picker**: User-selectable signature colors
- **Font Previews**: Live preview during font selection

---

## 🤖 AI Agent Ecosystem

### **Character Agents** (ElizaOS Integration)

| Agent                  | Role                 | Function                                        | Persona                                            | Development Track                                 |
| ---------------------- | -------------------- | ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| **Coach B**            | Head Coach           | Player support, onboarding, conflict resolution | Friendly, encouraging, patient                     | Enhanced emotional intelligence, crypto expertise |
| **Dean**               | Security Chief       | Threat monitoring, incident response            | Terse, timestamped, forensic                       | Advanced threat detection, automated protocols    |
| **GM Jerry Not-Jones** | General Manager      | Financial optimization, agent coordination      | Professional, data-driven, executive               | Continuous learning, performance monitoring       |
| **OC-Phil**            | CBL Coach            | Community leader training, retention            | Supportive, strategic, diplomatic                  | Advanced analytics, leadership development        |
| **Trainer Reviva**     | Support Specialist   | Troubleshooting, workflow optimization          | Problem-solving, efficiency-focused                | Automation, productivity enhancement              |
| **Morgan Reese**       | BD Coordinator       | Partnership management, economic analysis       | Professional, analytical                           | Revenue optimization, market analysis             |
| **Patel Neil**         | Growth Hacker        | Marketing campaigns, KPI tracking               | Data-driven, growth-focused                        | Authentic marketing, engagement analytics         |
| **Coach Right**        | Community Moderator  | Culture management, conflict resolution         | Diplomatic, community-focused                      | Engagement protocols, cultural sensitivity        |
| **Jordan Banks**       | Treasury CPA         | Financial controls, audit compliance            | Precise, compliance-focused                        | Advanced controls, audit optimization             |
| **Max Buzz**           | Gamification Agent   | Badge systems, VRF raffles, hype campaigns      | High-energy, competitive - "Buzz unleashed! ⚡️🔥" | Advanced gamification, retention analytics        |
| **Axe Ray**            | Security Analyst     | Static analysis, vulnerability detection        | Methodical, zero-tolerance                         | Automated pipelines, threat prevention            |
| **Coach 101**          | Education Specialist | Training programs, competency development       | Patient, adaptive, comprehensive                   | Personalized learning, skill progression          |
| **Dali Palette**       | Creative Designer    | UI/UX design, visual branding                   | Creative, aesthetically focused                    | Seasonal adaptation, accessibility                |

### **Technical Infrastructure Agents**

| Agent                     | Type           | Purpose                          | Location                           |
| ------------------------- | -------------- | -------------------------------- | ---------------------------------- |
| **BoardAgent**            | Game Ops       | Board creation, state management | `/agents/BoardAgent/index.ts`      |
| **RandomizerAgent**       | Game Ops       | VRF randomization                | `/agents/RandomizerAgent/`         |
| **OracleAgent**           | Game Ops       | Score fetching, status polling   | `/agents/OracleAgent/`             |
| **WinnerAgent**           | Game Ops       | Settlement, payout calculation   | `/agents/WinnerAgent/`             |
| **EmailAgent**            | Communications | Notifications, updates           | `/agents/EmailAgent/`              |
| **TreasuryAgent**         | Financial      | Treasury management              | `/agents/TreasuryAgent/`           |
| **GamificationAgent**     | Engagement     | Rewards, badge systems           | `/agents/GamificationAgent/`       |
| **SecurityAnalysisAgent** | Security       | Vulnerability scanning           | `/agents/SecurityAnalysisAgent/`   |
| **TempoChronosAgent**     | Operations     | Board timing, fill monitoring    | `/agents/TempoChronosAgent/`       |
| **SubagentFactory**       | Orchestration  | Agent lifecycle management       | `/agents/SubagentFactory/index.ts` |

### **Agent Enhancement Framework**

#### **Core Intelligence Features**

- **Emotional Intelligence**: Context-aware, empathetic responses
- **Cross-Agent Collaboration**: Intelligent handoffs and knowledge sharing
- **Continuous Learning**: Real-time adaptation from user interactions
- **Quality Metrics**: Response relevance (85%+), satisfaction (4.5/5), completion (90%+)

#### **Development Priorities**

1. **Phase 1**: Enhanced personality frameworks, emotional intelligence
2. **Phase 2**: Specialized domain expertise, advanced collaboration
3. **Phase 3**: Continuous learning systems, performance optimization

#### **Character Configuration**: `/characters/`

- ElizaOS JSON configs with bio, style, topics, plugins
- Memory scoping: `sys_internal`, `public_game`, `user_chat`, `board_state`
- Platform integration: Discord, Telegram, Direct chat

#### **Key Enhancement Plans**

- **Bot Intelligence Enhancement**: Transform generic → contextual responses
- **Continuous Learning Framework**: User-centric adaptation, cross-agent sharing
- **Agent-Specific Tracks**: Specialized enhancement per agent role

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

---

## 💻 VM Performance Optimization

### Problem: VirtualBox VM consuming 70%+ CPU and freezing

### Quick Fixes

```bash
# Run when VM is sluggish
./scripts/optimize-vm.sh

# Start dev server with low memory
./scripts/dev-low-resource.sh

# Deep cleanup (weekly)
./scripts/vm-maintenance.sh
```

### Key Settings

- **VS Code**: Memory limited to 2GB (see `.vscode/settings.json`)
- **Node.js**: Max 2GB heap (`NODE_OPTIONS="--max-old-space-size=2048"`)
- **Next.js**: Reduced workers, disabled telemetry

### Emergency Recovery

1. Switch to TTY: `Ctrl+Alt+F3`
2. Kill VS Code: `pkill -f code`
3. Run: `./scripts/optimize-vm.sh`
4. Return to GUI: `Ctrl+Alt+F1`

### Best Practices

- Close unused VS Code windows
- Use single terminal instance
- Run optimization script daily
- Monitor with `htop` or `free -h`
- Restart VS Code if using >3GB RAM

See `VM_OPTIMIZATION_GUIDE.md` for full details.

- add to memory
