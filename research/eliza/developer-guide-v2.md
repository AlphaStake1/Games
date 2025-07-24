# ElizaOS V2 Developer Guide - Live Session Notes

**Source:** YouTube Developer Session Transcript (Beta Release)

## Installation & Setup

### Beta Version Commands

**Important:** During beta, append `@beta` to commands:

```bash
# CLI Installation
npx @elizaos/cli@beta start

# Alternative (may work in future releases)
npx elizaos start

# Project Creation
npm create eliza@beta
```

### Quick Start Methods

#### 1. Simple User (No Coding)

```bash
npx @elizaos/cli@beta start
```

- Access dashboard at local URL
- Create agents via GUI
- Configure API keys in web interface
- Start chatting immediately

#### 2. Plugin Developer

```bash
npm create eliza@beta
# Choose "plugin" option
cd my-cool-plugin
npm run start
```

#### 3. Project Developer

```bash
npm create eliza@beta
# Choose "project" option
cd my-cool-project
npm run start
```

#### 4. Contributor/Core Developer

```bash
git clone [repo]
git checkout v2-develop
bun install  # Note: Uses Bun, not npm/pnpm
bun run start
```

## Project Structure Changes

### New Project Architecture

- **app/**: Desktop application (coming soon as executable)
- **client/**: Web frontend (GUI dashboard)
- **cli/**: Main runtime and CLI commands
- **core/**: Agent runtime and core logic
- **create-eliza/**: Project/plugin creation templates
- **plugins/**: All plugins (will be moved to separate repos)
- **project-starter/**: Template for new projects
- **plugin-starter/**: Template for new plugins

### Character Configuration

**V1 vs V2:**

- V1: Static JSON character files
- V2: TypeScript character configuration with dynamic plugin loading

```typescript
// New V2 character structure
export default {
  name: 'MyAgent',
  plugins: [
    // Dynamic plugin loading based on environment
    process.env.DISCORD_TOKEN ? discordPlugin : null,
    process.env.OPENAI_API_KEY ? openaiPlugin : null,
  ].filter(Boolean),
  secrets: {
    // Namespaced environment variables
    ELIZA_DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  },
};
```

## Database Configuration

### Two Options:

1. **PGLite** (Recommended for development)
   - Runs locally
   - No external dependencies
   - Good for testing and development

2. **PostgreSQL** (Production)
   - Requires connection string
   - Recommended: Neon or Supabase (free tiers available)

## Model Providers & Configuration

### Default Behavior:

- Runs local models out of the box
- Downloads models automatically on first run
- Falls back to cloud providers if API keys present

### Provider Priority System:

```typescript
// Example: Anthropic + OpenAI fallback
// Anthropic loads first, handles text generation
// OpenAI handles embeddings (Anthropic doesn't support embeddings)
plugins: [anthropicPlugin, openaiPlugin];
```

### Environment Variables:

```bash
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
# Agent will automatically prefer cloud models over local
```

## Architecture Improvements (V1 → V2)

### Dynamic Runtime Providers

**Old:** Fixed context, same cost every time
**New:** Dynamic provider system that chooses relevant context

Available Providers:

- Time/date information
- Agent settings and roles
- Relationship data
- Recent messages
- Knowledge base
- Facts about users/agents
- Current room entities
- Available capabilities
- Pending choices/decisions

### Multi-Action Decision Making

**Old:** Single action per response (reply OR do_thing)
**New:** Agent creates action sequences

Example workflow:

1. "Look up information on website"
2. "Write brief article based on findings"
3. "Reply to user with article"

### Social Anxiety Feature

- Prevents agents from responding to every message in busy rooms
- Adds natural conversation pacing
- Configurable response frequency

## Plugin Development

### Plugin Structure:

```typescript
export default {
  name: 'my-plugin',
  description: 'Does cool things',
  init: () => {
    /* initialization */
  },
  actions: [
    /* array of actions */
  ],
  providers: [
    /* data providers */
  ],
  evaluators: [
    /* response filters */
  ],
  services: [
    /* background services */
  ],
  routes: [
    /* HTTP endpoints */
  ],
  events: [
    /* event handlers */
  ],
  models: [
    /* model definitions */
  ],
};
```

### Plugin Types:

- **Actions:** Tasks agents can perform
- **Providers:** Data sources (dynamic/static)
- **Evaluators:** Response validation/filtering
- **Services:** Background processes (formerly "clients")
- **Routes:** Custom HTTP endpoints
- **Events:** Message/system event handlers

### Plugin Publishing:

```bash
npx @elizaos/cli@beta publish
# Requires username and access token
# Publishes to official plugin registry
```

## Multi-Agent Systems (Swarms)

### Example: ElizaOS Org (6 agents)

- **Eddie:** Community manager with Eliza documentation
- **Jimmy:** Project manager
- **Laura:** Social media manager
- **Spartan:** Investment manager
- **Ruby:** Developer relations
- **Snoop:** Test agent

### Features:

- Agents can work independently or collaboratively
- Multi-agent chat rooms (coming soon)
- Each agent has specialized skills and knowledge
- Shared context and memory systems

## Development Workflow

### Testing:

```bash
bun run start  # Start development server
npm run start  # Alternative if having issues
```

### Contributing:

1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests: `bun test`
5. Submit pull request to `v2-develop` branch

### Common Issues:

- **Event emitter errors:** Try `npm run start` in project directory
- **Model download timeouts:** Increased to 1 hour in newer versions
- **Missing beta tag:** Append `@beta` to commands during beta period

## API Simplification

### New Runtime Interface:

```typescript
// Everything accessible through runtime
runtime.getEmbedding();
runtime.createMemory();
runtime.createTask();
runtime.addKnowledge();
runtime.getServices();
runtime.setSettings();
```

### Consolidated Database:

- Runtime extends database adapter
- No separate database.client calls
- Unified interface for all data operations

## Future Features

### Planned Additions:

- **MCP Support:** Within 2 weeks
- **Desktop App:** Executable download
- **Multi-project Loading:** Run multiple projects simultaneously
- **OpenAI Response API:** Agent SDK support
- **Enhanced Rolodex:** Cross-platform identity management
- **Advanced Entity System:** Better relationship tracking

### Multi-Agent Improvements:

- Room-based conversations
- Cross-platform messaging
- Shared memory and context
- Dynamic agent collaboration

## Best Practices

### Environment Management:

- Use `.env.local` for secrets
- Namespace environment variables per agent
- Consider external secret management (AWS Secrets Manager, etc.)

### Development Tips:

- Use TypeScript for better error handling
- Test locally with PGLite before production
- Start with single agents before building swarms
- Copy/modify the official "org" project as starting point

### Plugin Development:

- Include comprehensive test suites
- Add proper error handling and validation
- Document plugin capabilities and requirements
- Consider dynamic loading based on available credentials

This developer guide captures the practical insights from the live development session, providing implementation details not covered in the official documentation.
