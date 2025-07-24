# ElizaOS V2 - Latest Developer Workshop Updates

**Source:** Latest Developer Workshop Transcript (January 2025)

## AI-Powered Development Workflow

### Core Development Philosophy

- **90% AI-generated code:** Modern ElizaOS development relies heavily on AI coding tools
- **Developer role shift:** From writing code to QA, review, fine-tuning, and testing
- **Speed advantage:** What used to take weeks now takes minutes with proper AI prompting

### Recommended AI Development Stack

1. **Cursor IDE** with enterprise account and Opus Max mode
2. **Claude.md** - Updated project context for Claude Code users
3. **Cursor Rules** - Architecture and style guidelines for AI assistants
4. **Voice-to-text prompting** - Use GPT-4 voice notes for better prompt dictation

### AI Coding Process

```bash
# Example AI coding workflow
1. Gather existing plugin examples (linear, GitHub)
2. Use voice prompting to describe requirements
3. Reference existing codebase architecture
4. Let AI generate 90% of code structure
5. Debug and fine-tune remaining 10%
```

## New Plugins and Capabilities

### Shell Plugin

- **Purpose:** Gives agents terminal access to execute system commands
- **Security:** Requires explicit environment variable configuration
- **Configuration:**

```bash
SHELL_ENABLED=true
SHELL_ALLOWED_DIRECTORIES=/path/to/allowed/directory
SHELL_TIMEOUT=30000
SHELL_FORBIDDEN_COMMANDS=rm,sudo,passwd
```

### Vision Plugin (by Shaw)

- **Capabilities:** Real-time camera and video capture
- **Technology:** Web Assembly for browser integration
- **Use cases:** Visual language model integration, real-time frame analysis

### MCP (Model Context Protocol) Plugin

- **Purpose:** Converts any MCP server into Eliza actions
- **Integration:** Seamless translation layer for existing MCP tools
- **Benefits:** Access to entire MCP ecosystem without custom integration

### N8N Workflow Plugin

- **Functionality:** Automatically generates N8N workflows
- **Integration:** Agents can manage other automation frameworks
- **Philosophy:** Eliza as meta-framework supporting other agent frameworks

## Advanced Plugin Development

### Action vs Provider Design Decision

**Use Actions when:**

- Operations are infrequent
- Fresh data is always needed
- API calls are lightweight

**Use Providers when:**

- Data is accessed frequently
- Caching would improve performance
- Expensive operations that shouldn't repeat

### Plugin Architecture Standards

```typescript
// Standard plugin structure
export default {
  name: 'plugin-name',
  description: 'LLM-readable description',
  actions: [
    /* task executors */
  ],
  providers: [
    /* data sources with caching */
  ],
  services: [
    /* singleton API clients */
  ],
  evaluators: [
    /* response filters */
  ],
  routes: [
    /* HTTP endpoints */
  ],
  events: [
    /* event handlers */
  ],
};
```

### Action Development Best Practices

```typescript
// Action naming convention
const ACTION_NAME = "GET_RESOURCE_DATA"; // UPPER_SNAKE_CASE

// Required fields
{
  name: "GET_RESOURCE_DATA",
  description: "LLM-facing description of what this action does",
  similes: ["check data", "fetch info", "retrieve resource"],
  examples: [
    // One-shot training examples
    [{
      user: "Show me recent activity",
      assistant: "I'll check your recent activity now."
    }]
  ],
  validate: (runtime) => !!runtime.getSetting("API_KEY"),
  handler: async (runtime, message, state, options, callback) => {
    // Implementation with proper error handling
    try {
      const service = runtime.getService("resource-service");
      const result = await service.getData();
      callback({
        text: `Found ${result.length} items`,
        success: true
      });
    } catch (error) {
      callback({
        text: "Failed to retrieve data",
        success: false
      });
    }
  }
}
```

## Development Workflow Updates

### Package Management

- **Primary:** Bun (not npm/pnpm)
- **Installation:** `bun install`
- **Building:** `bun run build`
- **Local development:** `bun link` or file-based installs

### Monorepo Development

```bash
# For core contributors
git clone [repo]
git checkout v2-develop  # Development branch
bun install
bun run clean  # Clear caches if issues
bun run start
```

### Plugin Development Cycle

1. **Bootstrap:** AI generates initial plugin structure
2. **Integration:** Add to character file or monorepo
3. **Testing:** Local testing with `bun run build`
4. **Debugging:** Copy-paste errors back to AI for fixes
5. **Iteration:** Refine until production-ready

### Common Development Issues

- **Cache corruption:** Run `bun run clean` to resolve
- **TypeScript errors:** Often AI hallucinations, fixable with targeted prompts
- **Bun/Turbo conflicts:** Temporary issues being resolved

## Community and Competition

### Clank Tank Competition

- **Purpose:** AI-powered game show for Eliza agents
- **Judging:** AI pipeline evaluates submissions
- **Requirements:** Submit code, connect Discord, provide wallet
- **Prizes:** Monetary rewards for quality agents
- **Timeline:** Submit within one week of announcement

### Plugin Publishing

1. **Official plugins:** Submit PR to ElizaOS org for foundational plugins
2. **Registry publishing:** `npx @elizaos/cli@beta publish`
3. **Requirements:** Username and access token
4. **Community plugins:** Personal repositories with registry listing

## Future Directions

### Computer Usage Agents

- **Goal:** Agents using computers like humans instead of APIs
- **Current limitation:** ~40-58% success rate
- **Timeline:** 3-5 years for reliable implementation
- **Impact:** Revolutionary change in agent capabilities

### Auto-Coding Pipeline

- **Status:** In development
- **Capability:** Automated plugin generation from natural language
- **Integration:** Social coding in Discord channels
- **Vision:** Agents that can modify and extend themselves

### Multi-Framework Support

- **Philosophy:** Eliza as orchestrator for other agent frameworks
- **Capability:** Agents can control other automation tools
- **Examples:** N8N workflows, computer usage agents, MCP integrations

## Advanced Security Considerations

### Shell Plugin Security

```bash
# Required security configuration
SHELL_ENABLED=true
SHELL_ALLOWED_DIRECTORIES=/safe/directory/path
SHELL_FORBIDDEN_COMMANDS=rm,sudo,passwd,kill
SHELL_TIMEOUT=30000
```

### Plugin Validation

- Always implement `validate` functions
- Check for required API keys and permissions
- Handle missing dependencies gracefully
- Use `runtime.getSetting()` instead of `process.env`

## Performance Optimization

### Action Chaining

- Agents can now execute multiple sequential actions
- Example: "Research topic → Write article → Reply to user"
- More intelligent than single-action responses

### Dynamic Context Loading

- Providers can be dynamically selected based on needs
- Reduces context window usage
- Improves response relevance and speed

### Caching Strategies

- Use providers for frequently accessed data
- Implement time-based cache invalidation
- Balance fresh data needs with performance

This workshop demonstrates ElizaOS's evolution toward AI-assisted development and more sophisticated agent capabilities.
