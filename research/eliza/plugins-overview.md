# ElizaOS V2 - Plugin System Overview

**Source:** https://eliza.how/plugins/overview

## Plugin System Architecture Overview

### Core Plugin Interface

The ElizaOS plugin system provides a comprehensive extension mechanism with a robust interface that includes:

1. **Essential Plugin Properties:**
   - `name`: Unique identifier
   - `description`: Human-readable explanation
   - `init()`: Initialization method
   - `config`: Plugin-specific configuration

2. **Key Components:**
   - `actions`: Tasks agents can perform
   - `providers`: Data sources
   - `evaluators`: Response filters
   - `services`: Background services
   - `routes`: HTTP endpoints
   - `events`: Event handlers

### Plugin Types

1. **Core Plugins:**
   - Bootstrap: Message handling and event system
   - SQL: Database integration
   - Knowledge: RAG (Retrieval-Augmented Generation) system

2. **LLM Providers:**
   - OpenAI
   - Anthropic
   - Google GenAI
   - Ollama
   - OpenRouter

3. **Platform Integrations:**
   - Discord
   - Telegram
   - Twitter

4. **DeFi Plugins:**
   - EVM (Ethereum Virtual Machine)
   - Solana

### Key Interfaces

#### Action Interface

- `name`: Unique identifier
- `description`: Action purpose
- `handler`: Execution logic
- `validate`: Pre-execution validation

#### Provider Interface

- `name`: Unique identifier
- `get()`: Data retrieval method
- Support for dynamic and static data sources

#### Evaluator Interface

- `name`: Unique identifier
- `description`: Evaluation purpose
- `handler`: Evaluation logic
- `validate`: Determines if evaluator should run

### Initialization Lifecycle

Plugins are registered in a specific order:

1. Database adapter
2. Actions
3. Evaluators
4. Providers
5. Models
6. Routes
7. Events
8. Services

### Development Considerations

- Plugins can define dependencies
- Support for custom component types
- Comprehensive testing and validation mechanisms
- Flexible configuration options

The ElizaOS plugin system offers developers a powerful, modular framework for extending AI agent capabilities across various domains.
