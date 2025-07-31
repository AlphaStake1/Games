# Football Squares Agent Characters

This directory contains the character profiles for our Football Squares agent ecosystem.

## Character Roster

| Agent                  | Role                   | Primary Channels           | Key Responsibilities                                      |
| ---------------------- | ---------------------- | -------------------------- | --------------------------------------------------------- |
| **Dean**               | Head of Security       | Discord, Slack             | Security scanning, incident response, threat monitoring   |
| **Commissioner Jerry** | Executive Orchestrator | Telegram                   | Budget approval, team coordination, exec briefings        |
| **Trainer Reviva**     | Support Specialist     | Discord, Telegram          | User troubleshooting, escalation handling, bug triage     |
| **Morgan Reese**       | BD Coordinator         | Email, Discord             | Partnership qualification, deal pipeline management       |
| **Patel Neil**         | Growth Hacker          | Twitter, Discord, Telegram | Marketing campaigns, funnel optimization, KPI tracking    |
| **Coach Right**        | Community Moderator    | Discord, Telegram          | Community culture, event hosting, conflict resolution     |
| **Jordan Banks**       | Treasury CPA           | Internal Only              | Financial controls, treasury management, audit compliance |
| **Coach B**            | Head Coach             | Website, Discord, Telegram | Primary player support, game rules, onboarding            |
| **OC-Phil**            | CBL Coach              | Discord                    | Community Board Leader training and support               |

## Character Structure

Each character file (`{name}.json`) contains:

- **Bio & Lore**: Character background and personality
- **Knowledge**: Domain expertise areas
- **Style**: Communication patterns for chat/posts
- **Topics**: Primary conversation areas
- **Clients**: Supported platforms/channels
- **Plugins**: Required ElizaOS plugins
- **Actions**: Available function calls
- **Examples**: Message and post samples for training

## ElizaOS Integration Requirements

### Required Credentials (To Be Added)

```bash
# Platform API Keys
DISCORD_BOT_TOKEN=
TELEGRAM_BOT_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET=
SLACK_BOT_TOKEN=

# Service Integrations
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Database & Memory
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Security & Monitoring
SEMGREP_API_TOKEN=
DISCORD_WEBHOOK_URL=  # For security alerts

# Business Tools
CRM_API_KEY=  # For Morgan's lead management
ANALYTICS_API_KEY=  # For Patel's metrics
NOTION_API_KEY=  # For OC-Phil's CBL management
```

### Plugin Dependencies

Each character requires specific ElizaOS plugins:

- `elizaos-plugin-discord` - Discord integration
- `elizaos-plugin-telegram` - Telegram integration
- `elizaos-plugin-sql` - Database operations
- `elizaos-plugin-security` - Security scanning (Dean)
- `elizaos-plugin-crm` - Lead management (Morgan)
- `elizaos-plugin-analytics` - Metrics tracking (Patel)
- `elizaos-plugin-faq` - Knowledge base (Coach B, Reviva)

### Memory Scoping

Characters are assigned to specific memory scopes:

- **Dean**: `sys_internal` only
- **Jerry**: All scopes (orchestrator)
- **Coach B, Coach Right**: `public_game`, `user_chat`
- **Reviva**: `user_chat`, `board_state`
- **Jordan**: `tx_finance`, `sys_internal`
- **Morgan, Patel**: `public_game`, `sys_internal`
- **OC-Phil**: `public_game` (CBL focus)

## Testing & Validation

1. **Character Validation**: Each character should be tested for persona alignment
2. **Action Registration**: Verify all custom actions are properly registered
3. **Memory Access**: Confirm scoped memory access works correctly
4. **Platform Integration**: Test each character on their designated platforms
5. **Hot Reload**: Use ElizaOS dev mode for iterative testing

## Development Workflow

```bash
# 1. Start ElizaOS dev server
pnpm eliza:dev

# 2. Load character configurations
# Characters will be auto-loaded from this directory

# 3. Test persona alignment
# Use hot-reload to iterate on character responses

# 4. Register custom actions
# Actions defined in character files need implementation

# 5. Validate memory scoping
# Ensure characters can only access their designated scopes
```

## Next Steps

- [ ] Implement custom actions for each character
- [ ] Set up platform credentials and webhooks
- [ ] Create character-specific plugins for specialized functions
- [ ] Test persona alignment with sample conversations
- [ ] Integrate with existing agent infrastructure (Calculator, etc.)
- [ ] Deploy to staging environment for validation
