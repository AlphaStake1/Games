# Football Squares dApp Architecture

## Overview

The Football Squares dApp is built as a multi-layered decentralized application that combines blockchain technology, AI automation, real-time communication, and modern web development practices. This document provides a comprehensive overview of the system architecture, design decisions, and component interactions.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
├─────────────────────────────────────────────────────────────────┤
│ Next.js Frontend │ Mobile Web App │ Progressive Web App (PWA)   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Real-time Communication                      │
├─────────────────────────────────────────────────────────────────┤
│           WebSocket Server │ Event Broadcasting                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Application Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  AI Agent System │ Orchestration │ Task Management              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Blockchain Layer                            │
├─────────────────────────────────────────────────────────────────┤
│   Solana Network │ Anchor Program │ Smart Contracts             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────────┤
│ VRF Services │ Clockwork │ Ceramic │ Email │ Monitoring          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Deep Dive

### 1. Frontend Layer (Next.js 13)

**Technology Stack:**
- Next.js 13 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components
- Solana Web3.js for blockchain interaction

**Key Components:**
- [`SquaresGrid.tsx`](../components/SquaresGrid.tsx): Interactive game board
- [`WalletProvider`](../app/providers.tsx): Solana wallet integration
- Real-time state management via WebSocket

**Design Patterns:**
- **Component-based Architecture**: Reusable UI components
- **Provider Pattern**: Context-based state management
- **Static Site Generation**: Optimized for performance and SEO

### 2. WebSocket Communication Layer

**File:** [`server/websocket.ts`](../server/websocket.ts)

**Responsibilities:**
- Real-time client-server communication
- Event broadcasting to multiple clients
- Game state synchronization
- Connection management and health monitoring

**Message Types:**
```typescript
interface WebSocketMessage {
  type: 'subscribe' | 'board_update' | 'score_update' | 'winner_announcement';
  gameId?: string;
  data?: any;
}
```

**Architecture Benefits:**
- Low-latency updates for live gaming experience
- Scalable connection handling
- Event-driven state synchronization

### 3. AI Agent System

The AI agent system is the core automation layer, consisting of specialized agents that handle different aspects of game management.

#### Agent Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Orchestrator   │◄──►│   Board Agent   │◄──►│ Randomizer      │
│  Agent          │    │                 │    │ Agent           │
│  (Claude)       │    │   (GPT-4)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Oracle Agent   │    │  Winner Agent   │    │  Email Agent    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Individual Agent Responsibilities

**Orchestrator Agent** ([`agents/OrchestratorAgent/index.ts`](../agents/OrchestratorAgent/index.ts))
- **AI Model**: Claude Sonnet 4
- **Purpose**: High-level task planning and coordination
- **Responsibilities**:
  - Create and prioritize task lists
  - Coordinate between other agents
  - Handle complex decision-making
  - Monitor overall system health

**Board Agent** ([`agents/BoardAgent/index.ts`](../agents/BoardAgent/index.ts))
- **AI Model**: GPT-4
- **Purpose**: Game state management and analytics
- **Responsibilities**:
  - Track game progression
  - Generate analytics reports
  - Manage board state transitions
  - Monitor user interactions

**Randomizer Agent** ([`agents/RandomizerAgent/index.ts`](../agents/RandomizerAgent/index.ts))
- **Purpose**: VRF request handling and randomness verification
- **Responsibilities**:
  - Request VRF randomness from Switchboard
  - Verify randomness integrity
  - Trigger header randomization
  - Handle randomization failures

**Oracle Agent** ([`agents/OracleAgent/index.ts`](../agents/OracleAgent/index.ts))
- **Purpose**: External data integration
- **Responsibilities**:
  - Fetch NFL scores from APIs
  - Validate score data
  - Submit score updates to blockchain
  - Handle API rate limiting

**Winner Agent** ([`agents/WinnerAgent/index.ts`](../agents/WinnerAgent/index.ts))
- **Purpose**: Winner calculation and payout processing
- **Responsibilities**:
  - Calculate quarter winners
  - Process automatic payouts
  - Handle payout failures
  - Generate winner reports

**Email Agent** ([`agents/EmailAgent/index.ts`](../agents/EmailAgent/index.ts))
- **Purpose**: Notification system management
- **Responsibilities**:
  - Send transactional emails
  - Manage email templates
  - Handle delivery failures
  - Maintain email audit logs

### 4. Blockchain Layer (Solana + Anchor)

**Smart Contract:** [`programs/squares/src/lib.rs`](../programs/squares/src/lib.rs)

#### Program Structure

```rust
// Main program entry point
#[program]
pub mod squares {
    // Game lifecycle instructions
    pub fn create_board(ctx: Context<CreateBoard>, price_per_square: u64) -> Result<()>
    pub fn purchase_square(ctx: Context<PurchaseSquare>, square_index: u8) -> Result<()>
    pub fn randomize_headers(ctx: Context<RandomizeHeaders>) -> Result<()>
    pub fn record_score(ctx: Context<RecordScore>, home_score: u8, away_score: u8, quarter: u8) -> Result<()>
    pub fn settle_winner(ctx: Context<SettleWinner>, quarter: u8) -> Result<()>
}
```

#### Account Structure

```rust
#[account]
pub struct Board {
    pub authority: Pubkey,          // Board creator
    pub price_per_square: u64,      // Cost per square in lamports
    pub squares: [Square; 100],     // 10x10 grid of squares
    pub home_headers: [u8; 10],     // Randomized 0-9 for home team
    pub away_headers: [u8; 10],     // Randomized 0-9 for away team
    pub scores: [GameScore; 4],     // Quarterly scores
    pub state: BoardState,          // Current game state
    pub created_at: i64,           // Timestamp
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Square {
    pub owner: Option<Pubkey>,      // Square owner (if purchased)
    pub purchased_at: Option<i64>,  // Purchase timestamp
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct GameScore {
    pub home_score: u8,
    pub away_score: u8,
    pub quarter: u8,
    pub recorded_at: i64,
}
```

#### State Machine

```
┌─────────────┐    create_board    ┌─────────────┐
│   Created   │──────────────────►│   Active    │
└─────────────┘                   └─────────────┘
                                          │
                                          │ purchase_square
                                          ▼
┌─────────────┐  randomize_headers ┌─────────────┐
│ Randomized  │◄──────────────────│  Filled     │
└─────────────┘                   └─────────────┘
       │                                  
       │ record_score                     
       ▼                                  
┌─────────────┐    settle_winner   ┌─────────────┐
│  In Play    │──────────────────►│  Completed  │
└─────────────┘                   └─────────────┘
```

### 5. External Service Integration

#### Switchboard VRF (Verifiable Random Function)
- **Purpose**: Provably fair randomness for header generation
- **Integration**: Direct smart contract calls
- **Verification**: On-chain randomness verification

#### Clockwork Threads
- **File**: [`scripts/create_thread.ts`](../scripts/create_thread.ts)
- **Purpose**: Automated task scheduling
- **Use Cases**:
  - Periodic score updates
  - Game state transitions
  - Health monitoring
  - Cleanup tasks

#### Ceramic Network
- **Files**: [`ceramic/client.ts`](../ceramic/client.ts), [`lib/ceramic-integration.ts`](../lib/ceramic-integration.ts)
- **Purpose**: Decentralized event logging and analytics
- **Benefits**:
  - Immutable audit trails
  - Decentralized data storage
  - Cross-platform compatibility

#### Proton Mail Bridge
- **File**: [`agents/EmailAgent/index.ts`](../agents/EmailAgent/index.ts)
- **Purpose**: Secure email notifications
- **Features**:
  - End-to-end encryption
  - HTML template support
  - Delivery confirmation

## Data Flow

### Game Creation Flow

```
1. User creates board via frontend
2. Frontend calls smart contract create_board
3. Board account initialized on Solana
4. WebSocket broadcasts board creation
5. Ceramic logs board creation event
6. Email agent sends confirmation
```

### Square Purchase Flow

```
1. User selects square on frontend
2. Wallet prompts for transaction approval
3. purchase_square instruction executed
4. Square ownership updated on-chain
5. WebSocket broadcasts purchase event
6. Board agent updates analytics
7. Email confirmation sent
```

### Score Update Flow

```
1. Clockwork thread triggers score check
2. Oracle agent fetches latest scores
3. Agent validates score changes
4. record_score instruction executed
5. WebSocket broadcasts score update
6. Winner agent checks for winners
7. settle_winner called if applicable
8. Payouts processed automatically
```

## Security Architecture

### Smart Contract Security

**Access Control:**
```rust
#[access_control(is_oracle(&ctx.accounts.oracle))]
pub fn record_score(ctx: Context<RecordScore>, ...) -> Result<()> {
    // Only authorized oracles can update scores
}
```

**Economic Security:**
- Minimum square prices prevent spam
- Escrow-based fund management
- Automatic payout mechanisms
- Anti-MEV protections

**State Validation:**
- Comprehensive error handling
- State transition validation
- Overflow protection
- Reentrancy guards

### Infrastructure Security

**Network Security:**
- TLS/SSL for all communications
- WebSocket connection authentication
- Rate limiting and DDoS protection
- Firewall configurations

**API Security:**
- JWT token authentication
- Request signing verification
- Input validation and sanitization
- CORS policy enforcement

**Deployment Security:**
- Environment variable isolation
- Secret management via Docker secrets
- Container security scanning
- Network segmentation

## Performance Considerations

### Scalability Optimizations

**Frontend:**
- Static site generation for fast loading
- Component lazy loading
- Image optimization
- CDN distribution

**WebSocket:**
- Connection pooling
- Message queuing
- Horizontal scaling support
- Load balancing

**Blockchain:**
- Transaction batching
- Account optimization
- Compute unit efficiency
- Parallel processing

**Agent System:**
- Concurrent execution
- Task prioritization
- Resource management
- Error recovery

### Monitoring and Observability

**Health Checks:**
- [`scripts/health-check.ts`](../scripts/health-check.ts)
- Service availability monitoring
- Performance metrics collection
- Alert system integration

**Logging:**
- Structured logging format
- Centralized log aggregation
- Error tracking and alerting
- Performance profiling

## Deployment Architecture

### Container Orchestration

**Docker Compose Configuration:**
```yaml
services:
  app:                    # Next.js frontend
  websocket:             # WebSocket server
  agents:                # AI agent system
  proton-bridge:         # Email service
  ceramic:               # Logging service
```

### Akash Network Deployment

**Benefits:**
- Decentralized infrastructure
- Cost-effective hosting
- Geographic distribution
- Censorship resistance

**Configuration:** [`docker/deploy.yaml`](../docker/deploy.yaml)

### CI/CD Pipeline

**GitHub Actions:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

**Pipeline Stages:**
1. Code quality checks (ESLint, TypeScript)
2. Security scanning (Audit, SAST)
3. Test execution (Unit, Integration)
4. Smart contract compilation
5. Docker image building
6. Deployment to staging/production

## Future Architecture Considerations

### Scalability Improvements

**Layer 2 Integration:**
- State channels for micro-transactions
- Rollup integration for batch processing
- Cross-chain bridge implementation

**Microservices Migration:**
- Service decomposition
- API gateway implementation
- Event-driven architecture
- Message queue integration

### Enhanced AI Capabilities

**Machine Learning Integration:**
- Predictive analytics for game outcomes
- User behavior analysis
- Fraud detection algorithms
- Personalized recommendations

**Advanced Automation:**
- Dynamic pricing algorithms
- Intelligent game scheduling
- Automated customer support
- Market making strategies

## Conclusion

The Football Squares dApp architecture represents a modern, scalable approach to building decentralized applications. By combining cutting-edge blockchain technology with AI automation and real-time communication, the system provides a robust foundation for web3 gaming applications.

The modular design ensures maintainability and extensibility, while the comprehensive testing and monitoring infrastructure provides the reliability required for production deployment. The architecture is designed to scale from hundreds to thousands of concurrent users while maintaining security and performance standards.