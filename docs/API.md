# Football Squares dApp API Documentation

## Overview

This document provides comprehensive API documentation for the Football Squares dApp, covering both the Solana smart contract instructions and the WebSocket API for real-time communication.

## Smart Contract API (Anchor Program)

### Program ID
```
Program ID: [Will be generated upon deployment]
Cluster: Devnet/Mainnet-beta
```

### Data Structures

#### Board Account
```rust
pub struct Board {
    pub authority: Pubkey,          // 32 bytes - Board creator
    pub price_per_square: u64,      // 8 bytes - Cost per square in lamports
    pub squares: [Square; 100],     // 1000+ bytes - 10x10 grid
    pub home_headers: [u8; 10],     // 10 bytes - Randomized numbers 0-9
    pub away_headers: [u8; 10],     // 10 bytes - Randomized numbers 0-9
    pub scores: [GameScore; 4],     // ~80 bytes - Quarterly scores
    pub state: BoardState,          // 1 byte - Current state
    pub created_at: i64,           // 8 bytes - Creation timestamp
}
```

#### Square Structure
```rust
pub struct Square {
    pub owner: Option<Pubkey>,      // 33 bytes - Owner public key
    pub purchased_at: Option<i64>,  // 9 bytes - Purchase timestamp
}
```

#### Game Score Structure
```rust
pub struct GameScore {
    pub home_score: u8,    // 1 byte - Home team score
    pub away_score: u8,    // 1 byte - Away team score
    pub quarter: u8,       // 1 byte - Quarter number (1-4)
    pub recorded_at: i64,  // 8 bytes - Score record timestamp
}
```

#### Board State Enum
```rust
pub enum BoardState {
    Created,      // 0 - Board created, accepting purchases
    Active,       // 1 - Squares being purchased
    Filled,       // 2 - All squares sold
    Randomized,   // 3 - Headers randomized, ready for game
    InPlay,       // 4 - Game in progress
    Completed,    // 5 - Game completed, all payouts processed
}
```

### Instructions

#### 1. Create Board

**Function:** `create_board`

**Description:** Initialize a new Football Squares board with specified square price.

**Accounts:**
```rust
pub struct CreateBoard<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Board>(),
        seeds = [b"board", authority.key().as_ref(), &clock.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub board: Account<'info, Board>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    
    pub clock: Sysvar<'info, Clock>,
}
```

**Parameters:**
- `price_per_square: u64` - Cost per square in lamports

**Usage Example:**
```typescript
const boardKeypair = Keypair.generate();
const pricePerSquare = 1_000_000; // 0.001 SOL

await program.methods
  .createBoard(new BN(pricePerSquare))
  .accounts({
    board: boardKeypair.publicKey,
    authority: wallet.publicKey,
    systemProgram: SystemProgram.programId,
    clock: SYSVAR_CLOCK_PUBKEY,
  })
  .signers([boardKeypair])
  .rpc();
```

#### 2. Purchase Square

**Function:** `purchase_square`

**Description:** Purchase a specific square on the board.

**Accounts:**
```rust
pub struct PurchaseSquare<'info> {
    #[account(
        mut,
        constraint = board.state == BoardState::Active || board.state == BoardState::Created
    )]
    pub board: Account<'info, Board>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: Board authority receives payment
    #[account(mut)]
    pub authority: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
    
    pub clock: Sysvar<'info, Clock>,
}
```

**Parameters:**
- `square_index: u8` - Index of square to purchase (0-99)

**Usage Example:**
```typescript
const squareIndex = 42; // Middle square

await program.methods
  .purchaseSquare(squareIndex)
  .accounts({
    board: boardPda,
    buyer: wallet.publicKey,
    authority: boardAuthority,
    systemProgram: SystemProgram.programId,
    clock: SYSVAR_CLOCK_PUBKEY,
  })
  .rpc();
```

#### 3. Randomize Headers

**Function:** `randomize_headers`

**Description:** Generate random numbers for row and column headers using VRF.

**Accounts:**
```rust
pub struct RandomizeHeaders<'info> {
    #[account(
        mut,
        constraint = board.state == BoardState::Filled,
        has_one = authority
    )]
    pub board: Account<'info, Board>,
    
    pub authority: Signer<'info>,
    
    // Switchboard VRF accounts
    pub vrf: AccountLoader<'info, VrfAccountData>,
    pub vrf_permission: AccountLoader<'info, PermissionAccountData>,
    pub oracle_queue: AccountLoader<'info, OracleQueueAccountData>,
    
    /// CHECK: VRF escrow account
    #[account(mut)]
    pub escrow: AccountInfo<'info>,
    
    pub switchboard_program: Program<'info, SwitchboardProgram>,
}
```

**Usage Example:**
```typescript
await program.methods
  .randomizeHeaders()
  .accounts({
    board: boardPda,
    authority: wallet.publicKey,
    vrf: vrfAccount,
    vrfPermission: vrfPermissionAccount,
    oracleQueue: queueAccount,
    escrow: escrowAccount,
    switchboardProgram: switchboardProgramId,
  })
  .rpc();
```

#### 4. Record Score

**Function:** `record_score`

**Description:** Record game scores for a specific quarter (Oracle only).

**Accounts:**
```rust
pub struct RecordScore<'info> {
    #[account(
        mut,
        constraint = board.state == BoardState::InPlay || board.state == BoardState::Randomized
    )]
    pub board: Account<'info, Board>,
    
    #[account(
        constraint = is_oracle(&oracle.key())
    )]
    pub oracle: Signer<'info>,
    
    pub clock: Sysvar<'info, Clock>,
}
```

**Parameters:**
- `home_score: u8` - Home team score
- `away_score: u8` - Away team score  
- `quarter: u8` - Quarter number (1-4)

**Access Control:** Only authorized oracles can call this instruction.

**Usage Example:**
```typescript
// Only callable by oracle accounts
await program.methods
  .recordScore(14, 7, 1) // Home: 14, Away: 7, Quarter: 1
  .accounts({
    board: boardPda,
    oracle: oracleWallet.publicKey,
    clock: SYSVAR_CLOCK_PUBKEY,
  })
  .signers([oracleWallet])
  .rpc();
```

#### 5. Settle Winner

**Function:** `settle_winner`

**Description:** Calculate and pay out the winner for a specific quarter.

**Accounts:**
```rust
pub struct SettleWinner<'info> {
    #[account(
        mut,
        constraint = board.state == BoardState::InPlay
    )]
    pub board: Account<'info, Board>,
    
    pub authority: Signer<'info>,
    
    /// CHECK: Winner account receives payout
    #[account(mut)]
    pub winner: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}
```

**Parameters:**
- `quarter: u8` - Quarter to settle (1-4)

**Usage Example:**
```typescript
await program.methods
  .settleWinner(1) // Settle Q1 winner
  .accounts({
    board: boardPda,
    authority: wallet.publicKey,
    winner: winnerPublicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Error Codes

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Square is already owned")]
    SquareAlreadyOwned = 6000,
    
    #[msg("Invalid square index")]
    InvalidSquareIndex = 6001,
    
    #[msg("Board is not in correct state for this operation")]
    InvalidBoardState = 6002,
    
    #[msg("Insufficient payment for square")]
    InsufficientPayment = 6003,
    
    #[msg("Unauthorized oracle")]
    UnauthorizedOracle = 6004,
    
    #[msg("Invalid quarter")]
    InvalidQuarter = 6005,
    
    #[msg("Score already recorded for this quarter")]
    ScoreAlreadyRecorded = 6006,
    
    #[msg("No winner found for this quarter")]
    NoWinnerFound = 6007,
    
    #[msg("Payout already processed")]
    PayoutAlreadyProcessed = 6008,
}
```

## WebSocket API

### Connection

**Endpoint:** `ws://localhost:8080` (development) or `wss://api.footballsquares.dev` (production)

**Authentication:** Connection-based, no additional auth required

### Message Format

All WebSocket messages follow this JSON structure:

```typescript
interface WebSocketMessage {
  type: string;
  gameId?: string;
  data?: any;
  timestamp?: number;
  clientId?: string;
}
```

### Client-to-Server Messages

#### 1. Subscribe to Game

**Type:** `subscribe`

**Description:** Subscribe to real-time updates for a specific game board.

```json
{
  "type": "subscribe",
  "gameId": "board_pubkey_base58"
}
```

**Response:**
```json
{
  "type": "subscription_confirmed",
  "gameId": "board_pubkey_base58",
  "data": {
    "status": "subscribed",
    "currentBoard": { /* current board state */ }
  }
}
```

#### 2. Unsubscribe from Game

**Type:** `unsubscribe`

```json
{
  "type": "unsubscribe",
  "gameId": "board_pubkey_base58"
}
```

#### 3. Ping

**Type:** `ping`

**Description:** Keep-alive message to maintain connection.

```json
{
  "type": "ping"
}
```

**Response:**
```json
{
  "type": "pong",
  "timestamp": 1672531200000
}
```

### Server-to-Client Messages

#### 1. Welcome Message

**Type:** `welcome`

**Description:** Sent immediately upon connection.

```json
{
  "type": "welcome",
  "data": {
    "clientId": "client_uuid",
    "serverVersion": "1.0.0",
    "supportedFeatures": ["subscriptions", "real_time_updates"]
  }
}
```

#### 2. Board Update

**Type:** `board_update`

**Description:** Sent when board state changes (square purchased, etc.).

```json
{
  "type": "board_update",
  "gameId": "board_pubkey_base58",
  "data": {
    "squareIndex": 42,
    "owner": "owner_pubkey_base58",
    "purchasedAt": 1672531200000,
    "totalSquaresSold": 43,
    "boardState": "Active"
  }
}
```

#### 3. Score Update

**Type:** `score_update`

**Description:** Sent when game scores are recorded.

```json
{
  "type": "score_update",
  "gameId": "board_pubkey_base58",
  "data": {
    "quarter": 1,
    "homeScore": 14,
    "awayScore": 7,
    "lastDigits": {
      "home": 4,
      "away": 7
    },
    "timestamp": 1672531200000
  }
}
```

#### 4. Winner Announcement

**Type:** `winner_announcement`

**Description:** Sent when a quarter winner is determined.

```json
{
  "type": "winner_announcement",
  "gameId": "board_pubkey_base58",
  "data": {
    "quarter": 1,
    "winner": {
      "publicKey": "winner_pubkey_base58",
      "squareIndex": 42,
      "payout": 1000000000
    },
    "winningNumbers": {
      "home": 4,
      "away": 7
    }
  }
}
```

#### 5. Error Message

**Type:** `error`

**Description:** Sent when an error occurs.

```json
{
  "type": "error",
  "data": {
    "code": "INVALID_GAME_ID",
    "message": "Game ID not found",
    "details": "The specified game ID does not exist"
  }
}
```

#### 6. Connection Status

**Type:** `connection_status`

**Description:** Periodic connection health updates.

```json
{
  "type": "connection_status",
  "data": {
    "connectedClients": 150,
    "uptime": 86400000,
    "lastHeartbeat": 1672531200000
  }
}
```

### WebSocket Error Codes

```typescript
enum WebSocketErrorCode {
  INVALID_MESSAGE_FORMAT = 'INVALID_MESSAGE_FORMAT',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}
```

## Client SDK Examples

### TypeScript/JavaScript

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';

// Initialize connection
const connection = new Connection('https://api.devnet.solana.com');
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl, programId, provider);

// Create a new board
async function createBoard(pricePerSquare: number) {
  const boardKeypair = Keypair.generate();
  
  const tx = await program.methods
    .createBoard(new BN(pricePerSquare))
    .accounts({
      board: boardKeypair.publicKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
      clock: SYSVAR_CLOCK_PUBKEY,
    })
    .signers([boardKeypair])
    .rpc();
    
  return { tx, boardPublicKey: boardKeypair.publicKey };
}

// Purchase a square
async function purchaseSquare(boardPublicKey: PublicKey, squareIndex: number) {
  const tx = await program.methods
    .purchaseSquare(squareIndex)
    .accounts({
      board: boardPublicKey,
      buyer: wallet.publicKey,
      authority: boardAuthority,
      systemProgram: SystemProgram.programId,
      clock: SYSVAR_CLOCK_PUBKEY,
    })
    .rpc();
    
  return tx;
}

// WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'board_update':
      handleBoardUpdate(message.data);
      break;
    case 'score_update':
      handleScoreUpdate(message.data);
      break;
    case 'winner_announcement':
      handleWinnerAnnouncement(message.data);
      break;
  }
};

// Subscribe to game updates
function subscribeToGame(gameId: string) {
  ws.send(JSON.stringify({
    type: 'subscribe',
    gameId: gameId
  }));
}
```

### React Hooks

```typescript
// Custom hook for WebSocket connection
export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    
    ws.onopen = () => setSocket(ws);
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    return () => ws.close();
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { socket, messages, sendMessage };
}

// Custom hook for game subscription
export function useGameSubscription(gameId: string) {
  const { sendMessage, messages } = useWebSocket();
  const [boardState, setBoardState] = useState(null);

  useEffect(() => {
    if (gameId) {
      sendMessage({ type: 'subscribe', gameId });
    }
  }, [gameId, sendMessage]);

  useEffect(() => {
    const gameMessages = messages.filter(m => m.gameId === gameId);
    const latestBoardUpdate = gameMessages
      .filter(m => m.type === 'board_update')
      .slice(-1)[0];
      
    if (latestBoardUpdate) {
      setBoardState(latestBoardUpdate.data);
    }
  }, [messages, gameId]);

  return { boardState };
}
```

## Rate Limits

### Smart Contract
- **Transaction Rate**: Limited by Solana network capacity (~65,000 TPS)
- **Account Rent**: Minimum balance required for account storage
- **Compute Units**: Each instruction has compute unit limits

### WebSocket API
- **Connection Limit**: 1000 concurrent connections per server
- **Message Rate**: 100 messages per minute per client
- **Subscription Limit**: 10 active game subscriptions per client

### HTTP Endpoints (if applicable)
- **Request Rate**: 1000 requests per hour per IP
- **Burst Limit**: 10 requests per second

## Testing

### Unit Testing

```typescript
// Example unit test for smart contract
describe('Football Squares Program', () => {
  it('creates a board successfully', async () => {
    const pricePerSquare = 1_000_000; // 0.001 SOL
    const { tx, boardPublicKey } = await createBoard(pricePerSquare);
    
    expect(tx).toBeDefined();
    
    const board = await program.account.board.fetch(boardPublicKey);
    expect(board.pricePerSquare.toNumber()).toEqual(pricePerSquare);
    expect(board.state).toEqual({ created: {} });
  });
});
```

### Integration Testing

```typescript
// Example WebSocket integration test
describe('WebSocket Integration', () => {
  it('broadcasts board updates', (done) => {
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'board_update') {
        expect(message.gameId).toBeDefined();
        expect(message.data.squareIndex).toBeGreaterThanOrEqual(0);
        done();
      }
    };
    
    // Trigger a board update by purchasing a square
    // ... test logic
  });
});
```

## Support

For API support and questions:
- **Documentation**: [docs/](../docs/)
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Discord**: [Community Server](https://discord.gg/your-server)
- **Email**: api-support@footballsquares.dev

---

*Last updated: January 2025*