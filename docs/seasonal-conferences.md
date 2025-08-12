# Season Pass Conferences

## Overview

Season Pass Conferences represent a fundamental shift from weekly Football Squares to season-long competition. Players purchase a single season pass that grants them one permanent square for every NFL game throughout the season (Week 1 → Super Bowl), competing within tier-matched conferences of exactly 100 players.

## Conference Tier System

### Tier Structure & Pricing

| Tier | Conference Names                                                 | Season Pass Price | Target Pool (Full) | 1st Place Max | Players |
| ---- | ---------------------------------------------------------------- | ----------------- | ------------------ | ------------- | ------- |
| 1    | Eastern → Central → Atlantic → Lakes → Prairie                   | $50               | $5,000             | ~$1,400       | 100     |
| 2    | Southern → Mountain → Desert → Delta → Plateau                   | $100              | $10,000            | ~$2,800       | 100     |
| 3    | Northern → Gulf of America → Great Lakes → Heartland → Badlands  | $250              | $25,000            | ~$7,000       | 100     |
| 4    | Western → Pacific → Sierra → Cascades → Rockies                  | $500              | $50,000            | ~$14,000      | 100     |
| 5    | South-East → South-West → North-East → North-West → Mid-Atlantic | $1,000            | $100,000           | ~$28,000      | 100     |

### Conference Lifecycle

1. **Active Conference**: Currently accepting season pass purchases (0-99 passes sold)
2. **Full Conference**: 100 passes sold → conference locks → new geographic name opens in same tier
3. **Season Active**: All 100 pass holders compete through entire NFL season
4. **Season End**: Top 21 players receive payouts, conference closes

## Double-Random System

### Pre-Game Randomization Process

Before each NFL game, two randomization events occur via verifiable randomness (VRF):

#### 1. NFT Marker Shuffle (T-minus 90 minutes)

- All 100 season pass NFTs are randomly redistributed across the 10×10 coordinate grid
- **Purpose**: Eliminates "lucky corner / unlucky edge" permanent advantages
- **Fairness**: Every player experiences ~285 different square positions over full season

#### 2. Row/Column Digit Redraw (Immediately after shuffle)

- Fresh 0-9 digits assigned to X-axis and Y-axis via VRF
- **Purpose**: New scoring combinations for each game
- **Transparency**: Single VRF seed used for both shuffle and digits for auditability

### Implementation Details

```
VRF Seed → Fisher-Yates Shuffle (100 NFT positions) + Digit Assignment (0-9 x 2 axes)
```

## Green Points Accumulation System

### Point Calculation Formula

Points = **Quarter Base** × **Hit Pattern %** × **Playoff Multiplier**

### Quarter Base Points

- **Q1**: 200 points
- **Q2**: 250 points
- **Q3**: 200 points
- **Q4**: 250 points
- **OT**: 200 points

### Hit Pattern Distribution

- **Forward** `(Home, Away)`: 45% → Most common
- **Backward** `(Away, Home)`: 30% → Second most
- **Forward +5** `((H+5)%10, (A+5)%10)`: 15% → Third
- **Backward +5** `((A+5)%10, (H+5)%10)`: 10% → Rarest

### Playoff Multipliers

| Stage                    | Multiplier | Example Impact |
| ------------------------ | ---------- | -------------- |
| Weeks 1-18               | ×1.0       | Base points    |
| Wild Card                | ×1.5       | 50% boost      |
| Divisional               | ×2.0       | 100% boost     |
| Conference Championships | ×3.5       | 250% boost     |
| **Super Bowl**           | **×5.0**   | Maximum impact |

### Scoring Examples

- Q1 Forward (regular): 200 × 0.45 = **90.00 pts**
- Q2 Backward (regular): 250 × 0.30 = **75.00 pts**
- Q4 +5f (Super Bowl): 250 × 0.15 × 5.0 = **187.50 pts**
- OT +5b (Conf Champ): 200 × 0.10 × 3.5 = **70.00 pts**

### Point Precision

- **Decimal Precision**: 2 decimals to minimize ties
- **Target Range**: 2,000-8,000 Green Points per competitive player
- **Fairness**: Equal base calculation ensures no positional bias

## Payout Structure

### Top 21 Payout Bands

#### Band A: Premium Winners (Places 1-7)

- **1st Place**: 50% more than 2nd place
- **2nd Place**: 40% more than 3rd place
- **3rd Place**: 30% more than 4th place
- **4th-7th Places**: Equal distribution

#### Band B: Profit Tier (Places 8-14)

- **Flat Payout**: 1.5× their season pass cost
- **Example**: $50 pass → $75 payout

#### Band C: Break-Even+ (Places 15-21)

- **Flat Payout**: Season pass cost + 5%
- **Example**: $50 pass → $52.50 payout

### Sample Payout Distribution (Tier 2: $50 passes, $5,000 pool)

| Place | Green Points  | Payout      | Return Multiple |
| ----- | ------------- | ----------- | --------------- |
| 1     | 19,000        | $1,750      | 35.0×           |
| 2     | 18,400        | $1,250      | 25.0×           |
| 3     | 17,800        | $960        | 19.2×           |
| 4-7   | 17,200-15,400 | $700 each   | 14.0×           |
| 8-14  | 14,800-11,200 | $75 each    | 1.5×            |
| 15-21 | 10,600-7,000  | $52.50 each | 1.05×           |

## Purchase Flow Implementation

### End-to-End User Journey

```
Click "Buy [Conference] Pass" →
Fetch Live Quote (price, seats available) →
Show Confirmation Modal →
Connect Wallet (if needed) →
Accept Terms & Conditions →
Create Order & Reserve Seat (5-min window) →
Sign Blockchain Transaction →
Wait for Confirmation →
Success: Redirect to Conference Board
```

### API Endpoints (Production Implementation)

#### Quote Endpoint

```
GET /api/conference/{slug}/quote
Response: {
  price: number,
  passesSold: number,
  seatsLeft: number,
  gasEstimate: number
}
Cache: 15 seconds
```

#### Order Creation

```
POST /api/order
Body: { slug: string, walletAddress: string }
Response: {
  orderId: string,
  preparedTx: TransactionObject,
  expiresAt: ISO8601
}
Side Effect: 5-minute seat reservation
```

#### Order Management

```
PATCH /api/order/{id}/abort
Effect: Release reserved seat, mark order cancelled

POST /webhook/tx (from blockchain indexer)
Effect: Confirm mint, finalize order, update database
```

### Smart Contract Interface

```solidity
function mintPass(bytes32 conferenceId) external payable {
    require(seatsSold[conferenceId] < 100, "Conference full");
    require(msg.value == priceTable[conferenceId], "Incorrect payment");

    uint256 tokenId = _allocateSeat(conferenceId, msg.sender);
    _safeMint(msg.sender, tokenId);

    emit PassMinted(conferenceId, tokenId, msg.sender, msg.value);
}
```

## Error Handling & Edge Cases

### Sold Out Conferences

- **Detection**: `seatsLeft === 0` in quote response
- **UX**: Immediate toast: "Conference full, try another tier"
- **Button State**: Disabled with "Sold Out" text

### Transaction Failures

- **User Rejection**: "Transaction cancelled, seat released"
- **Insufficient Funds**: "Add more SOL to your wallet"
- **Network Issues**: "Check connection and retry"
- **Timeout**: Automatic seat release after 5 minutes

### Multi-Pass Ownership

- **Allowed**: Users can own passes in multiple conferences
- **UX**: Button text changes to "Buy Another Pass - $X"
- **Limit**: Max 10 passes per wallet in VIP tier only

### Gas Price Volatility

- **Real-time Estimates**: Modal shows current network fee
- **Auto-refresh**: Gas estimates update every 30 seconds
- **User Education**: Tooltip explaining network fees
- **Treasury Buffer**: Protocol maintains ≥10× average SOL fee buffer; topped up weekly from rake before distributions

### Conference Fill Rate Edge Cases

- **Partial Fill Rule**: If a conference is ≤15 seats short at Week 1 kickoff, pool size and payouts are prorated by filled-seat percentage; otherwise passes auto-refund
- **Example**: 85/100 seats filled = 85% of standard payouts (1st place gets 85% of projected max)
- **Minimum Threshold**: Conferences need ≥85 players to proceed; below this triggers auto-refund

### Green Points Tie-Breaking

- **Primary**: Total Green Points accumulated
- **Secondary**: Most squares won throughout season
- **Tertiary**: Earliest mint block (first to join conference)
- **Final**: VRF-seeded deterministic random using season start seed

## Analytics & Tracking

### Key Events

```javascript
track('BeginCheckout', {
  slug: 'southern',
  price: 50,
  tier: 2,
  seatsLeft: 43,
});

track('PurchaseConfirmed', {
  slug: 'southern',
  price: 50,
  tier: 2,
  seatIndex: 58,
  txHash: '0x...',
});
```

### Funnel Metrics

- **Quote Load**: Success rate of quote API calls
- **Modal Open**: Users who view purchase modal
- **Wallet Connect**: Users who connect wallet
- **Terms Accept**: Users who accept terms
- **Transaction Sign**: Users who attempt payment
- **Purchase Complete**: Successful mints

## Technical Implementation

### File Structure

```
components/
  ConfirmPurchaseModal.tsx    # Purchase confirmation UI
hooks/
  usePurchasePass.ts          # Purchase flow state management
docs/
  seasonal-conferences.md     # This documentation
```

### Key Features Implemented

- **Real-time quotes** with live seat availability
- **Wallet integration** via Solana adapter
- **Error boundaries** for graceful failure handling
- **Toast notifications** for all state changes
- **Mobile optimization** with responsive design
- **Analytics integration** ready for production
- **Type safety** with TypeScript interfaces

### State Management

- **Purchase Modal**: Open/closed state with current quote
- **Processing State**: Loading indicators during async operations
- **Error Handling**: User-friendly error messages
- **Wallet Status**: Connection state and public key access

## Future Enhancements

### Phase 2 Features

- **Conference Leaderboards**: Real-time Green Points standings
- **NFT Marketplace**: Secondary trading of season passes
- **Team Filtering**: Conference selection based on favorite teams
- **Social Features**: Player profiles and achievement badges

### Technical Improvements

- **WebSocket Integration**: Real-time seat availability updates
- **Caching Strategy**: Redis for quote data and user sessions
- **Rate Limiting**: API protection against spam purchases
- **Monitoring**: Real-time alerts for failed transactions

## Business Considerations

### Revenue Model

- **Platform Fee**: 20-30% of each conference pool
- **Gas Fee Offset**: Small markup on network fees
- **Premium Features**: Enhanced analytics for VIP tier

### Legal Compliance

- **Gambling Regulations**: Skill-based vs chance-based classification
- **Tax Reporting**: Winner notification and 1099 generation
- **Terms of Service**: Clear refund and dispute policies
- **Age Verification**: 18+ requirement in applicable jurisdictions

## Conclusion

Season Pass Conferences represent a significant evolution in Football Squares gameplay, offering:

- **Long-term Engagement**: Season-long competition vs single games
- **Fair Competition**: Double-random system eliminates positional bias
- **Tier Matching**: Players compete within appropriate skill/budget levels
- **Transparent Payouts**: Clear payout structure with guaranteed winners
- **Professional UX**: Streamlined purchase flow with comprehensive error handling

This system transforms casual weekly squares into a sophisticated season-long fantasy sport with provable fairness and substantial prize pools.
