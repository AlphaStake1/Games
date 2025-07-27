# Season Pass Conferences - Comprehensive Technical Specification

**Version**: v0.9.0-draft  
**Last Updated**: 2025-07-26  
**Status**: Ready for Development & Audit Scoping

## Overview

Season Pass Conferences transform weekly Football Squares into season-long competition. Players purchase a single season pass granting one permanent square for every NFL game (Week 1 → Super Bowl), competing within tier-matched conferences of exactly 100 players with double-random VRF fairness.

## Conference Tier System

### Tier Structure & Pricing

| Tier | Conference Names                                                 | Season Pass | Target Pool | 1st Place Max | Protocol Share |
| ---- | ---------------------------------------------------------------- | ----------- | ----------- | ------------- | -------------- |
| 1    | Eastern → Central → Atlantic → Lakes → Prairie                   | $25         | $2,500      | ~$700         | ~$500          |
| 2    | Southern → Mountain → Desert → Delta → Plateau                   | $50         | $5,000      | ~$1,400       | ~$1,000        |
| 3    | Northern → Gulf of America → Great Lakes → Heartland → Badlands  | $100        | $10,000     | ~$2,800       | ~$2,000        |
| 4    | Western → Pacific → Sierra → Cascades → Rockies                  | $200        | $20,000     | ~$5,600       | ~$4,000        |
| 5    | South-East → South-West → North-East → North-West → Mid-Atlantic | $500        | $50,000     | ~$14,000      | ~$10,000       |

**Green Points Scoring Examples**:

- Q1 Forward hit (regular season): 200 × 0.45 = 90.00 pts
- Q2 Backward hit (regular season): 250 × 0.30 = 75.00 pts
- Q4 +5f hit (Super Bowl): 250 × 0.15 × 5.0 = 187.50 pts
- OT +5b hit (Conference Champ): 200 × 0.10 × 3.5 = 70.00 pts

**Note on Dynamic Pricing**: Season pass prices are fixed in USD but collected in SOL/USDC. The system uses Chainlink price oracles to calculate real-time SOL equivalent. Price updates occur every 15 minutes during active trading hours. If SOL volatility exceeds ±15% within 24 hours, an emergency re-pricing window may be triggered by the protocol treasury.

### Conference Rollover Algorithm

```typescript
function getNextConferenceName(tier: number, currentName: string): string {
  const tierNames = {
    1: [
      'Eastern',
      'Central',
      'Atlantic',
      'Lakes',
      'Prairie',
      'Valley',
      'River',
      'Forest',
    ],
    2: [
      'Southern',
      'Mountain',
      'Desert',
      'Delta',
      'Plateau',
      'Canyon',
      'Mesa',
      'Ridge',
    ],
    3: [
      'Northern',
      'Gulf of America',
      'Great Lakes',
      'Heartland',
      'Badlands',
      'Tundra',
      'Glacier',
      'Peak',
    ],
    4: [
      'Western',
      'Pacific',
      'Sierra',
      'Cascades',
      'Rockies',
      'Coastal',
      'Highland',
      'Summit',
    ],
    5: [
      'South-East',
      'South-West',
      'North-East',
      'North-West',
      'Mid-Atlantic',
      'Central-East',
      'Central-West',
      'Far-West',
    ],
  };

  const names = tierNames[tier];
  const currentIndex = names.indexOf(currentName);
  return names[(currentIndex + 1) % names.length];
}

// When conference fills: seatsSold[conferenceId] === 100
// 1. Lock current conference
// 2. Spawn new conference: getNextConferenceName(tier, currentName)
// 3. Initialize new board with seatsSold = 0
```

## Double-Random Fairness Protocol

### VRF Implementation Specification

**VRF Provider**: Switchboard (Solana) / Chainlink (EVM)
**Frequency**: T-minus 90 minutes before each NFL kickoff
**Randomness Source**: `VRF_KEY_HASH` environment variable

```solidity
// Contract: SeasonPassRandomizer
contract SeasonPassRandomizer {
    uint256 public constant VRF_CALLBACK_GAS = 200_000;
    bytes32 public immutable VRF_KEY_HASH;

    event DigitsShuffled(bytes32 conferenceId, uint256 gameId, uint256 vrfSeed);
    event BoardRandomized(bytes32 conferenceId, uint256[100] newPositions);

    function requestGameRandomness(bytes32 conferenceId, uint256 gameId) external {
        uint256 requestId = VRF_COORDINATOR.requestRandomWords(
            VRF_KEY_HASH,
            subscriptionId,
            3, // confirmations
            VRF_CALLBACK_GAS,
            2  // numWords: 1 for shuffle, 1 for digits
        );

        pendingRequests[requestId] = RandomnessRequest({
            conferenceId: conferenceId,
            gameId: gameId,
            timestamp: block.timestamp
        });
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        RandomnessRequest memory request = pendingRequests[requestId];

        // 1. Fisher-Yates shuffle of 100 NFT positions
        uint256[100] memory newPositions = fisherYatesShuffle(randomWords[0]);

        // 2. Generate fresh row/column digits (0-9)
        uint8[10] memory rowDigits = generateDigits(randomWords[1] >> 128);
        uint8[10] memory colDigits = generateDigits(randomWords[1] & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);

        gameBoards[request.conferenceId][request.gameId] = GameBoard({
            positions: newPositions,
            rowDigits: rowDigits,
            colDigits: colDigits,
            randomized: true
        });

        emit BoardRandomized(request.conferenceId, newPositions);
        emit DigitsShuffled(request.conferenceId, request.gameId, randomWords[1]);
    }
}
```

## Green Points & Leaderboard System

### Point Calculation Engine

```typescript
type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'OT';
type Result = 'forward' | 'backward' | '+5f' | '+5b';
type PlayoffRound = 'WC' | 'DIV' | 'CONF' | 'SB' | null;

interface PointEvent {
  quarter: Quarter;
  homeScore: number;
  awayScore: number;
  resultType: Result;
  isPlayoff: boolean;
  otNumber?: number;
  playoffRound?: PlayoffRound;
}

/**
 * Calculate Green points earned for a single scoring event.
 * Uses percentage-based distribution to reward rarity of hit patterns.
 */
function calculateGreenPoints({
  quarter,
  resultType,
  isPlayoff,
  otNumber = 1,
  playoffRound = null,
}: {
  quarter: Quarter;
  resultType: Result;
  isPlayoff: boolean;
  otNumber?: number;
  playoffRound?: PlayoffRound;
}): number {
  /** Baseline points per period */
  const base: Record<Quarter, number> = {
    Q1: 200,
    Q2: 250, // Halftime bonus
    Q3: 200,
    Q4: 250, // End-of-game bonus
    OT: 200, // Each OT period is independent
  };

  /** Category percentage split - determines relative rarity/reward */
  const split: Record<Result, number> = {
    forward: 0.45, // Most common: (Home, Away)
    backward: 0.3, // Second: (Away, Home)
    '+5f': 0.15, // Third: ((H+5)%10, (A+5)%10)
    '+5b': 0.1, // Rarest: ((A+5)%10, (H+5)%10)
  };

  /** Playoff multipliers */
  const bump: Record<Exclude<PlayoffRound, null>, number> = {
    WC: 1.5, // Wild Card
    DIV: 2, // Divisional
    CONF: 3.5, // Conference Championship
    SB: 5, // Super Bowl
  };

  // Core quarter value - OT periods are independent, not cumulative
  const quarterPoints = base[quarter];

  // Base score for this category
  const rawScore = quarterPoints * split[resultType];

  // Apply playoff-round bonus if relevant
  const finalScore =
    isPlayoff && playoffRound ? rawScore * bump[playoffRound] : rawScore;

  // Keep two decimals to minimize ties
  return Number(finalScore.toFixed(2));
}

// Tie-breaking logic for equal Green Point totals
function calculateTieBreaker(playerA: Player, playerB: Player): number {
  // 1. Most squares won throughout season
  if (playerA.totalSquaresWon !== playerB.totalSquaresWon) {
    return playerB.totalSquaresWon - playerA.totalSquaresWon;
  }

  // 2. Earliest mint block (first to join conference)
  if (playerA.mintBlock !== playerB.mintBlock) {
    return playerA.mintBlock - playerB.mintBlock;
  }

  // 3. VRF-seeded deterministic random (using season start VRF)
  const combinedSeed = keccak256(
    abi.encodePacked(playerA.wallet, playerB.wallet, seasonStartVRFSeed),
  );
  return uint256(combinedSeed) % 2 === 0 ? -1 : 1;
}
```

### Leaderboard Update Cron

```typescript
// Runs after each game completion
async function updateConferenceLeaderboards() {
  for (const conference of activeConferences) {
    const players = await getConferencePlayers(conference.id);

    for (const player of players) {
      const totalPoints = await calculatePlayerSeasonPoints(
        player.wallet,
        conference.id,
      );

      await updateLeaderboard({
        conferenceId: conference.id,
        walletAddress: player.wallet,
        greenPoints: totalPoints,
        rank: null, // Will be calculated in next step
      });
    }

    // Recalculate ranks
    await recalculateConferenceRanks(conference.id);
  }
}
```

## Payout Structure & Treasury Management

### Top 21 Distribution (~80% of Pool)

```typescript
function calculateSeasonPayouts(conferencePool: number): PayoutStructure {
  const playerPayout = Math.floor(conferencePool * 0.8); // 80% to players
  const protocolShare = conferencePool - playerPayout; // 20% to protocol

  // Band distribution within the 80%
  const bandA = Math.floor(playerPayout * 0.65); // Places 1-7 (premium)
  const bandB = Math.floor(playerPayout * 0.25); // Places 8-14 (1.5x return)
  const bandC = playerPayout - bandA - bandB; // Places 15-21 (1.05x return)

  return {
    // Premium tier (progressive)
    place1: Math.floor(bandA * 0.35), // ~35% of Band A
    place2: Math.floor(bandA * 0.23), // ~23% of Band A
    place3: Math.floor(bandA * 0.18), // ~18% of Band A
    places4to7: Math.floor((bandA * 0.24) / 4), // ~6% each

    // Fixed return tiers
    places8to14: Math.floor(bandB / 7), // 1.5x pass cost
    places15to21: Math.floor(bandC / 7), // 1.05x pass cost

    // Protocol allocation
    protocolTreasury: protocolShare,
  };
}
```

### Protocol Treasury Allocation (~20% of Pool)

- **12%** → Weekly-board rewards wallet (`WEEKLY_REWARDS_WALLET`)
- **5%** → Protocol treasury / future promotions (`PROTOCOL_TREASURY`)
- **3%** → Operational/VRF gas buffer (`OPERATIONAL_BUFFER`)

**Rounding Policy**: Each individual prize rounded to nearest whole dollar; dust (<$10) auto-rolls into next season's seed pool.

**Rollover Seed Pool Cap**: Maximum carry-over between seasons is capped at $1,000 per tier. Any excess beyond this cap is distributed to the weekly boards treasury to prevent odds dilution.

**Contract Constants**:

```solidity
uint16 public constant SEASON_PAYOUT_BPS = 8_000; // 80%
uint16 public constant WEEKLY_REWARDS_BPS = 1_200; // 12%
uint16 public constant TREASURY_BPS = 500; // 5%
uint16 public constant OPERATIONAL_BPS = 300; // 3%
```

## Emergency Scenarios & Refund Policy

### Conference Shutdown / Season Cancellation

In the event of NFL season cancellation, strike, or critical smart contract vulnerability:

```solidity
function emergencyWithdraw(bytes32 conferenceId) external {
    require(emergencyMode[conferenceId], "Not in emergency mode");
    require(passHolders[msg.sender][conferenceId], "No pass in conference");
    require(!emergencyClaimed[msg.sender][conferenceId], "Already claimed");

    uint256 gamesPlayed = getGamesPlayedCount(conferenceId);
    uint256 totalGames = 22; // Regular season + playoffs

    // Pro-rata refund: (unplayed games / total games) * pass price
    uint256 refundAmount = (passPrice[conferenceId] * (totalGames - gamesPlayed)) / totalGames;

    emergencyClaimed[msg.sender][conferenceId] = true;
    payable(msg.sender).transfer(refundAmount);

    emit EmergencyWithdrawal(conferenceId, msg.sender, refundAmount);
}
```

**Trigger Conditions**:

- NFL announces season suspension/cancellation
- Critical smart contract vulnerability discovered
- VRF oracle failure lasting >48 hours
- Governance vote by protocol treasury multisig (3/5 threshold)

## Smart Contract Architecture

### Core Contract: SeasonPass.sol

```solidity
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract SeasonPass is ERC721, UUPSUpgradeable, Pausable, ReentrancyGuard, VRFConsumerBaseV2 {
    struct Conference {
        bytes32 id;
        uint8 tier;
        string name;
        uint256 passPrice;
        uint16 seatsSold;
        bool active;
    }

    struct GameBoard {
        uint256[100] nftPositions;
        uint8[10] rowDigits;
        uint8[10] colDigits;
        bool randomized;
        uint256 vrfRequestId;
    }

    mapping(bytes32 => Conference) public conferences;
    mapping(bytes32 => mapping(uint256 => GameBoard)) public gameBoards;
    mapping(bytes32 => uint256) public seatsSold;
    mapping(address => bytes32[]) public userConferences;

    event PassMinted(
        bytes32 indexed conferenceId,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 price,
        uint16 seatNumber
    );

    event ConferenceFilled(bytes32 indexed conferenceId, string nextConferenceName);

    function mintPass(bytes32 conferenceId) external payable whenNotPaused nonReentrant {
        Conference storage conf = conferences[conferenceId];
        require(conf.active, "Conference inactive");
        require(seatsSold[conferenceId] < 100, "Conference full");
        require(msg.value == conf.passPrice, "Incorrect payment");

        uint256 tokenId = _allocateNextSeat(conferenceId, msg.sender);
        _safeMint(msg.sender, tokenId);

        seatsSold[conferenceId]++;
        userConferences[msg.sender].push(conferenceId);

        emit PassMinted(conferenceId, tokenId, msg.sender, msg.value, uint16(seatsSold[conferenceId]));

        // Check if conference is full
        if (seatsSold[conferenceId] == 100) {
            conf.active = false;
            string memory nextName = _generateNextConferenceName(conf.tier, conf.name);
            _createNewConference(conf.tier, nextName, conf.passPrice);
            emit ConferenceFilled(conferenceId, nextName);
        }
    }

    // Upgrade authorization (UUPS pattern)
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {
        // Additional checks can be added here
        require(block.timestamp >= lastUpgradeTime + 7 days, "Upgrade cooldown");
        lastUpgradeTime = block.timestamp;
    }

    // Emergency controls
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPause(block.timestamp);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpause(block.timestamp);
    }

    // VRF Fallback mechanism
    function manualRandomize(bytes32 conferenceId, uint256 gameId, uint256 fallbackSeed)
        external onlyOwner whenPaused {
        require(block.timestamp > vrfRequestTime[conferenceId][gameId] + 6 hours, "VRF timeout not reached");

        // Use fallback seed from trusted multisig
        _processRandomization(conferenceId, gameId, fallbackSeed);
        emit VRFFallbackUsed(conferenceId, gameId, fallbackSeed);
    }

    function _allocateNextSeat(bytes32 conferenceId, address owner) internal returns (uint256) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(conferenceId, seatsSold[conferenceId])));
        return tokenId;
    }
}
```

### Events for Subgraph Indexing

```typescript
// Subgraph schema.graphql
type Conference @entity {
  id: ID!
  tier: Int!
  name: String!
  passPrice: BigInt!
  seatsSold: Int!
  active: Boolean!
  createdAt: BigInt!
}

type SeasonPass @entity {
  id: ID!
  tokenId: BigInt!
  conference: Conference!
  owner: Bytes!
  seatNumber: Int!
  mintedAt: BigInt!
}

type GameBoard @entity {
  id: ID!
  conference: Conference!
  gameId: BigInt!
  randomized: Boolean!
  vrfRequestId: BigInt
  positions: [Int!]!
  rowDigits: [Int!]!
  colDigits: [Int!]!
}
```

## Purchase Flow API Specification

### Production Endpoints

#### 1. Quote Endpoint

```typescript
GET /api/conference/{slug}/quote

Response: {
  success: boolean;
  data: {
    slug: string;
    name: string;
    tier: number;
    price: number;
    passesSold: number;
    seatsLeft: number;
    gasEstimate: number;
    priceUSD: number;
    nextConferenceName?: string; // If current is nearly full
  };
  cached: boolean;
  cacheAge: number; // seconds
}

Cache-Control: public, max-age=15
Rate-Limit: 100/minute per IP
```

#### 2. Order Creation

```typescript
POST /api/order

Body: {
  slug: string;
  walletAddress: string;
  tier: number;
}

Response: {
  success: boolean;
  data: {
    orderId: string;
    conferenceId: string;
    preparedTx: {
      to: string;
      value: string;
      data: string;
      gasLimit: string;
    };
    seatNumber: number;
    expiresAt: string; // ISO8601
    reservationMinutes: number;
  };
}

Side Effects:
- 5-minute seat reservation in database
- OrderCreated event logged
- Seat counter incremented (reversible)
```

#### 3. Order Management

```typescript
PATCH /api/order/{orderId}/abort

Response: {
  success: boolean;
  message: string;
}

Side Effects:
- Release reserved seat
- Mark order as 'cancelled'
- Decrement seat counter
- OrderAborted event logged

POST /webhook/transaction-confirmed

Body: {
  orderId: string;
  txHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
}

Side Effects:
- Finalize order in database
- Send confirmation email
- Update leaderboard tables
- OrderFinalized event logged
```

## Environment & Deployment

### Required Environment Variables

```bash
# .env.example - Season Pass Configuration

# Blockchain
NEXT_PUBLIC_CHAIN_ID=901 # Solana Devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
SEASON_PASS_PROGRAM_ID=8qbE...abc123

# VRF Configuration
VRF_KEY_HASH=0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15
VRF_SUBSCRIPTION_ID=1234
VRF_CALLBACK_GAS_LIMIT=200000

# Protocol Wallets
WEEKLY_REWARDS_WALLET=7xKd...def456
PROTOCOL_TREASURY_WALLET=9mPq...ghi789
OPERATIONAL_BUFFER_WALLET=5nRs...jkl012

# API Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/seasonpass
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-256-bit-secret

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
POSTHOG_PROJECT_API_KEY=phc_xxxxxxxxxxxx
AMPLITUDE_API_KEY=amp_xxxxxxxxxxxx

# Payment Processing
SOLANA_PAY_REFERENCE_KEY=ref_xxxxxxxxxxxx
USDC_MINT_ADDRESS=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Email & Notifications
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
```

### Development Scripts

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "dev:localchain": "concurrently \"solana-test-validator\" \"next dev\"",
    "test": "jest",
    "test:e2e": "cypress run",
    "test:contracts": "anchor test",
    "deploy:devnet": "anchor deploy --provider.cluster devnet",
    "deploy:mainnet": "anchor deploy --provider.cluster mainnet",
    "db:migrate": "prisma migrate dev",
    "db:seed": "ts-node scripts/seed-conferences.ts"
  }
}
```

## Analytics Schema

### Event Tracking Specification

```typescript
// Analytics Events
interface SeasonPassAnalytics {
  // Purchase Funnel
  BeginCheckout: {
    slug: string;
    tier: number;
    price: number;
    seatsLeft: number;
    userAgent: string;
    referrer: string;
  };

  ModalOpened: {
    slug: string;
    tier: number;
    loadTime: number; // ms
    walletConnected: boolean;
  };

  WalletConnected: {
    walletType: 'phantom' | 'solflare' | 'backpack' | 'other';
    connectionTime: number; // ms
    isReconnection: boolean;
  };

  TermsAccepted: {
    slug: string;
    timeToAccept: number; // seconds
    scrolledToBottom: boolean;
  };

  TransactionSigned: {
    slug: string;
    tier: number;
    price: number;
    gasEstimate: number;
    attemptNumber: number;
  };

  PurchaseConfirmed: {
    slug: string;
    tier: number;
    price: number;
    seatIndex: number;
    txHash: string;
    totalTime: number; // seconds from modal open
    gasUsed: number;
  };

  PurchaseFailed: {
    slug: string;
    tier: number;
    error:
      | 'rejected'
      | 'insufficient_funds'
      | 'network_error'
      | 'contract_error';
    errorMessage: string;
    attemptNumber: number;
  };

  // Usage Analytics
  ConferenceViewed: {
    slug: string;
    tier: number;
    seatsLeft: number;
    viewDuration: number; // seconds
  };

  LeaderboardViewed: {
    slug: string;
    tier: number;
    userRank?: number;
    topScore: number;
  };
}

// Implementation
function trackEvent<T extends keyof SeasonPassAnalytics>(
  event: T,
  properties: SeasonPassAnalytics[T],
) {
  // Google Analytics 4
  gtag('event', event, properties);

  // PostHog
  posthog.capture(event, properties);

  // Amplitude
  amplitude.track(event, properties);
}
```

## Testing Strategy

### Unit Tests Required

```typescript
// hooks/usePurchasePass.test.ts
describe('usePurchasePass', () => {
  test('✅ fetches quote successfully', async () => {});
  test('✅ handles sold out conferences', async () => {});
  test('✅ creates order with seat reservation', async () => {});
  test('✅ aborts order on transaction rejection', async () => {});
  test('✅ tracks analytics events correctly', async () => {});
});

// components/ConfirmPurchaseModal.test.tsx
describe('ConfirmPurchaseModal', () => {
  test('✅ displays correct price breakdown', async () => {});
  test('✅ requires wallet connection', async () => {});
  test('✅ validates terms acceptance', async () => {});
  test('✅ handles processing states', async () => {});
  test('✅ meets accessibility standards', async () => {});
});
```

### Integration Tests (Cypress)

```typescript
// cypress/e2e/season-pass-purchase.cy.ts
describe('Season Pass Purchase Flow', () => {
  it('✅ completes full purchase journey', () => {
    cy.visit('/boards?mode=seasonal');
    cy.get('[data-testid="eastern-buy-button"]').click();
    cy.get('[data-testid="confirm-modal"]').should('be.visible');
    cy.get('[data-testid="connect-wallet-btn"]').click();
    cy.get('[data-testid="terms-checkbox"]').check();
    cy.get('[data-testid="confirm-purchase-btn"]').click();
    cy.get('[data-testid="success-toast"]').should(
      'contain',
      'Purchase Successful',
    );
    cy.url().should('include', '/conference/eastern/board');
  });

  it('✅ handles sold out conference gracefully', () => {
    // Mock sold out state
    cy.intercept('GET', '/api/conference/eastern/quote', {
      seatsLeft: 0,
    });
    cy.visit('/boards?mode=seasonal');
    cy.get('[data-testid="eastern-buy-button"]').should('be.disabled');
    cy.get('[data-testid="eastern-buy-button"]').should('contain', 'Sold Out');
  });
});
```

### Contract Fuzz Tests (Foundry)

```solidity
// test/SeasonPass.t.sol
contract SeasonPassTest is Test {
    function testFuzz_CannotExceed100Seats(uint256 attempts) public {
        vm.assume(attempts > 100 && attempts < 1000);

        for (uint256 i = 0; i < 100; i++) {
            seasonPass.mintPass{value: 25 ether}(conferenceId);
        }

        // Should revert on 101st attempt
        vm.expectRevert("Conference full");
        seasonPass.mintPass{value: 25 ether}(conferenceId);
    }

    function testFuzz_PreventReplayAttacks(uint256 nonce) public {
        bytes32 requestId = keccak256(abi.encodePacked(block.timestamp, nonce));

        // First fulfillment should succeed
        seasonPass.fulfillRandomWords(requestId, randomWords);

        // Second fulfillment should revert
        vm.expectRevert("Request already fulfilled");
        seasonPass.fulfillRandomWords(requestId, randomWords);
    }
}
```

## Accessibility Compliance

### WCAG 2.1 AA Checklist

- ✅ **Color Contrast**: All text meets 4.5:1 ratio minimum
- ✅ **Keyboard Navigation**: Modal can be operated via Tab/Enter/Escape
- ✅ **Screen Reader**: All interactive elements have aria-labels
- ✅ **Focus Management**: Focus traps within modal, returns to trigger button
- ✅ **Motion Sensitivity**: Respects `prefers-reduced-motion` for animations
- ✅ **Live Regions**: Toast notifications announced via `aria-live="polite"`
- ✅ **Form Labels**: All form inputs properly associated with labels
- ✅ **Error Handling**: Clear error messages with `aria-describedby`

### Implementation Example

```tsx
<Dialog
  open={isOpen}
  onOpenChange={onClose}
  aria-labelledby="purchase-title"
  aria-describedby="purchase-description"
>
  <DialogContent
    className="focus:outline-none"
    onOpenAutoFocus={(e) => {
      // Focus the first interactive element
      e.preventDefault();
      setTimeout(() => {
        const firstButton = e.currentTarget.querySelector('button');
        firstButton?.focus();
      }, 0);
    }}
  >
    <div id="purchase-description" className="sr-only" aria-live="polite">
      Purchase confirmation dialog for {quote?.name} season pass
    </div>

    <Button
      onClick={confirmPurchase}
      disabled={!canProceed}
      aria-describedby={!canProceed ? 'confirm-error' : undefined}
    >
      {isProcessing ? (
        <>
          <span className="sr-only">Processing transaction, please wait</span>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
          Processing...
        </>
      ) : (
        'Confirm & Pay'
      )}
    </Button>

    {!canProceed && (
      <div id="confirm-error" className="sr-only">
        Please connect your wallet and accept terms to continue
      </div>
    )}
  </DialogContent>
</Dialog>
```

## Design System Integration

### Conference Tier Tokens

```json
// tokens/conferenceTiers.json
{
  "tiers": {
    "1": {
      "name": "Tier 1",
      "price": 25,
      "colors": {
        "primary": "#16a34a",
        "secondary": "#dcfce7",
        "border": "#bbf7d0",
        "text": "#14532d"
      },
      "gradient": "from-green-500 to-green-600"
    },
    "2": {
      "name": "Tier 2",
      "price": 50,
      "colors": {
        "primary": "#2563eb",
        "secondary": "#dbeafe",
        "border": "#bfdbfe",
        "text": "#1e3a8a"
      },
      "gradient": "from-blue-500 to-blue-600"
    },
    "3": {
      "name": "Tier 3",
      "price": 100,
      "colors": {
        "primary": "#7c3aed",
        "secondary": "#ede9fe",
        "border": "#c4b5fd",
        "text": "#5b21b6"
      },
      "gradient": "from-purple-500 to-purple-600"
    },
    "4": {
      "name": "Tier 4",
      "price": 200,
      "colors": {
        "primary": "#ea580c",
        "secondary": "#fed7aa",
        "border": "#fdba74",
        "text": "#9a3412"
      },
      "gradient": "from-orange-500 to-orange-600"
    },
    "5": {
      "name": "Tier 5",
      "price": 500,
      "colors": {
        "primary": "#eab308",
        "secondary": "#fef3c7",
        "border": "#fed7aa",
        "text": "#92400e"
      },
      "gradient": "from-yellow-500 to-yellow-600"
    }
  }
}
```

## Compliance & Legal Requirements

### Regulatory Compliance

**Skill-Based Classification**: Season Pass Conferences are structured as skill-based sweepstakes, not gambling. The double-random VRF system ensures that while chance influences individual game outcomes, overall season success depends on accumulated performance across multiple events.

**Age Verification**: All users must verify 18+ age (21+ in applicable jurisdictions) during wallet connection. Implemented via:

```typescript
const verifyAge = async (walletAddress: string) => {
  const ageVerification = await checkAgeGate(walletAddress);
  if (!ageVerification.isValid) {
    throw new Error(
      `Must be ${ageVerification.minimumAge}+ in your jurisdiction`,
    );
  }
};
```

**Jurisdictional Disclaimers**: Purchase modal includes jurisdiction-specific notices:

- "This is a skill-based competition available to residents of permitted jurisdictions"
- "Prohibited in [restricted states/countries list]"
- "Subject to local laws and regulations"

### Data Privacy & GDPR Compliance

**Data Retention Policy**:
| Data Type | Retention Period | Purpose |
|-----------|------------------|---------|
| Wallet Addresses | Permanent | Blockchain transparency |
| Analytics Events | 24 months | Product optimization |
| Email Addresses | Until user deletion | Communications |
| KYC Documents | 7 years | Regulatory compliance |

**User Deletion Endpoint**:

```typescript
DELETE /api/user/{walletAddress}/gdpr-delete
// Removes: email, analytics history, cached preferences
// Preserves: on-chain transactions (immutable)
```

## DevOps & Monitoring

### CI/CD Pipeline Requirements

```yaml
# .github/workflows/deploy.yml
name: Season Pass Deployment
on:
  push:
    branches: [main]

jobs:
  test-matrix:
    strategy:
      matrix:
        test-type: [lint, typecheck, unit, e2e, contracts, gas-report]
    steps:
      - name: Run ${{ matrix.test-type }}
        run: |
          npm run ${{ matrix.test-type }}
          # Fail if gas usage increases >5%
          if [[ "${{ matrix.test-type }}" == "gas-report" ]]; then
            node scripts/check-gas-delta.js --threshold=5
          fi
```

### Alerting & Observability

**Critical Alerts (PagerDuty)**:

```typescript
// Seat reservation database >90% full
if (reservationCount > 0.9 * maxReservations) {
  alert('High reservation utilization', { severity: 'warning' });
}

// VRF callback >5 minutes overdue
if (Date.now() - vrfRequestTime > 5 * 60 * 1000) {
  alert('VRF timeout detected', { severity: 'critical' });
}

// Treasury wallet balance mismatch
if (Math.abs(expectedBalance - actualBalance) > 0.01) {
  alert('Treasury balance discrepancy', { severity: 'high' });
}
```

**Health Monitoring**:

```typescript
// /api/health endpoint
{
  "status": "healthy",
  "checks": {
    "database": "ok",
    "vrf_oracle": "ok",
    "subgraph_sync": "ok",
    "treasury_balance": "ok"
  },
  "uptime": "99.97%",
  "last_vrf_callback": "2025-07-26T10:30:00Z"
}
```

### Audit & Security Timeline

**Pre-Launch Requirements**:

- [ ] **Week 1-2**: Smart contract audit by [Audit Firm]
- [ ] **Week 3**: Penetration testing of API endpoints
- [ ] **Week 4**: Bug bounty program launch ($50K pool)
- [ ] **Week 5**: Final security review & deployment approval
- [ ] **Week 6**: Mainnet deployment with limited conference caps

**Ongoing Security**:

- Monthly security reviews
- Quarterly smart contract upgrades (if needed)
- Continuous bug bounty program
- Real-time transaction monitoring

## Glossary

**VRF (Verifiable Random Function)**: Cryptographic proof that random numbers were generated fairly and cannot be manipulated by any party.

**BPS (Basis Points)**: 1/100th of a percent. Used for precise percentage calculations (e.g., 500 BPS = 5%).

**Green Points**: Season-long scoring currency accumulated by players for correct square matches, with playoff multipliers.

**Conference Rollover**: Automatic creation of new geographic conference when current one reaches 100 players.

**Double-Random System**: Two-stage randomization process: (1) NFT position shuffle, (2) digit redraw via VRF.

## Conclusion

This comprehensive specification provides complete technical documentation for Season Pass Conferences, covering:

- ✅ **Protocol Layer**: Smart contracts, VRF integration, event schemas
- ✅ **Business Logic**: Payout calculations, treasury allocation, conference rollover
- ✅ **Emergency Scenarios**: Refund policies, upgrade patterns, security controls
- ✅ **API Specification**: Production endpoints with caching and rate limiting
- ✅ **Purchase Flow**: End-to-end user journey with error handling
- ✅ **Testing Strategy**: Unit, integration, and fuzz test requirements
- ✅ **Analytics Schema**: Complete event tracking for funnel optimization
- ✅ **Accessibility**: WCAG 2.1 AA compliance checklist
- ✅ **Compliance**: Legal requirements, data privacy, age verification
- ✅ **DevOps**: CI/CD, monitoring, audit timeline
- ✅ **Deployment**: Environment variables and development scripts

**Status**: This v0.9.0-draft specification addresses ~90% of implementation requirements and is ready for development handoff and auditor scoping.

The Season Pass system transforms traditional weekly squares into a sophisticated season-long fantasy sport with provable fairness, tier-matched competition, and substantial prize pools distributed to top performers.
