# Points System Specification

This document provides the complete technical specification for the Blue Points and Orange Points reward systems.

## 1. Blue-Point Issuance

### 1.1 Base Blue Points per square (by board price)

| Tier | Price per square | VIP-only? | Base Blue Points per square             |
| ---- | ---------------- | --------- | --------------------------------------- |
| Free | —                | —         | **100 Blue Points** ⇢ cap 3 boards/week |
| 1    | $5               | No        | **150 Blue Points**                     |
| 2    | $10              | No        | **200 Blue Points**                     |
| 3    | $20              | No        | **400 Blue Points**                     |
| 4    | $50              | No        | **600 Blue Points**                     |
| 5    | $100             | Yes       | **1,000 Blue Points**                   |
| 6    | $250             | Yes       | **1,500 Blue Points**                   |
| 7    | $500+            | Yes       | **2,000 Blue Points**                   |

**Important Notes:**

- **Free players**: Cap of 3 free boards per week (300 Blue Points maximum weekly)
- **CBL boards under $7**: Players still earn Blue Points based on price tier, but CBL earns 0 Blue Points
- **VIP access**: House boards $100+ are VIP-only; CBL boards allow CBL to choose mixed or VIP-only

### 1.2 Multipliers and Bonuses

| Trigger                     | Multiplier / Bonus                                          | Stackable? | Notes                               |
| --------------------------- | ----------------------------------------------------------- | ---------- | ----------------------------------- |
| VIP status                  | **× 1.5** on all Blue Points                                | Yes        | Applies after base tier calculation |
| Extra squares on same board | **+ 25% Blue Points** for each square after the first       | Yes        | Encourages bulk purchases           |
| Weekly activity bonus       | **+ 500 Blue Points** if player enters ≥ 3 boards that week | No         | One-time weekly bump                |
| Seasonal streak             | **+ 5,000 Blue Points** at Week 18 for playing every week   | No         | Long-term engagement reward         |

### 1.3 Community Board Leader (CBL) Blue-Point Earnings

| CBL Action                              | Blue-Point Formula                                  | Requirements                               |
| --------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Board reaches ≥ 95% fill                | (Squares × Base Blue Points) × **1.5**              | Board must be priced $7+ per square        |
| Additional qualified board in same week | **+ 500 Blue Points**                               | Each additional $7+ board that reaches 95% |
| Higher-price boards                     | Automatically yield more Blue Points via base table | Standard tier progression applies          |

**CBL Specific Rules:**

- CBLs can price boards from $1+ per square
- CBLs earn **0 Blue Points** from boards priced under $7 per square
- Players on sub-$7 CBL boards still earn Blue Points based on price tier

## 2. Orange-Point Issuance

| Event                        | Orange Points         | Max Frequency       | Requirements                            |
| ---------------------------- | --------------------- | ------------------- | --------------------------------------- |
| Referral signup              | **20 Orange Points**  | Unlimited           | New wallet connection                   |
| Referral's first paid play   | **50 Orange Points**  | Per unique referral | Any paid board participation            |
| Social-media share           | **2 Orange Points**   | 1 per day           | URL or screenshot proof required        |
| Complete weekly challenge    | **25 Orange Points**  | 1 per week          | Challenge completion verified           |
| Mint an NFT                  | **50 Orange Points**  | Per mint            | On-chain verification                   |
| Consistency bonus            | **40 Orange Points**  | Per 4-week period   | 4 straight weeks of play                |
| Upgrade to VIP               | **100 Orange Points** | Once per season     | VIP subscription payment                |
| Play 4+ House boards in week | **40 Orange Points**  | 1 per week          | House-branded boards only               |
| CBL: board ≥ 95% fill        | **50 Orange Points**  | Per board           | Any CBL board reaching threshold        |
| CBL: retention bonus         | **100 Orange Points** | Per 4-week period   | ≥ 95% fill rate for 4 consecutive weeks |

**Orange Point Design Philosophy:**
Orange Points are designed to total roughly one-fifth of an equally active player's Blue Points across a season.

## 3. VIP Membership

**Season Pass:** $97 (regular $299 value)

| Benefit               | Details                                         |
| --------------------- | ----------------------------------------------- |
| Blue-Point multiplier | **1.5×** on all Blue Point earnings             |
| Square capacity       | Up to 10 squares (vs 5 for non-VIP)             |
| Win bonus             | 5% on House boards, 3% on CBL boards            |
| Board access          | All weekly games + VIP-only House tiers ($100+) |
| Exclusive boards      | Access to VIP-only CBL boards (CBL choice)      |
| Future perks          | Early NFT drops, free square placements         |

## 4. Technical Implementation

### 4.1 Point Crediting

- Points credited **immediately** to on-chain ledger upon activity completion
- Status changes (VIP upgrade, CBL promotion) take effect from timestamp forward
- No batch processing delays

### 4.2 Tracking Systems

- **Multi-week streaks**: Calculated via wallet transaction history
- **CBL ownership**: Board PDA's owner field must match signer wallet
- **Social shares**: Require URL or screenshot proof; Oracle agent verifies
- **Free board caps**: Tracked per wallet per week (Sunday-Saturday)

### 4.3 Dispute Resolution

- Default in player's favor unless fraud is obvious
- On-chain audit trail for all point transactions
- Manual override capability for edge cases

## 5. Display & Privacy

### 5.1 Visibility Rules

- **Blue and Orange points**: Visible only to wallet owner in personal dashboard
- **Green points**: Public leaderboards (competitive seasonal metric)
- **No cross-player visibility** for Blue/Orange to prevent point-shaming and meta-gaming

### 5.2 UI Guidelines

- Large numbers abbreviated (e.g., "12.3K Blue Points") for readability
- Real-time point updates on dashboard
- Activity feed showing recent point earnings with timestamps

## 6. Economic Constants

### 6.1 Implementation Constants

```typescript
const BLUE_BASE = {
  free: 100,
  5: 150,
  10: 200,
  20: 400,
  50: 600,
  100: 1000,
  250: 1500,
  500: 2000,
};

const MULTIPLIERS = {
  vip: 1.5,
  extraSquare: 0.25,
  cblBonus: 1.5,
};

const BONUSES = {
  weeklyActivity: 500,
  seasonalStreak: 5000,
  cblAdditionalBoard: 500,
};
```

### 6.2 Tokenomics Placeholder

- **Premium NFT**: 10,000 Blue Points OR 2,000 Orange Points (internal pricing)
- **Draft Yard conversion**: 500 Blue : 1 Yard, 5 Orange : 1 Yard (not public until finalized)
- **Point expiration**: Never expire; permanent ledger storage

## 7. Example Calculations

### 7.1 Weekly Earnings Examples

| User Type       | Activity                                                       | Blue Points Calculation                                                                                                           | Orange Points                            |
| --------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Free player     | 2 free boards                                                  | 100 × 2 = **200**                                                                                                                 | 0                                        |
| Standard player | 2 squares on $25 board + 1 square on $100 board + weekly bonus | (400 × 2) + 1,000 + 500 = **2,300**                                                                                               | Social share + weekly challenge = **27** |
| VIP high-roller | 3 squares on $100 board + 2 squares on $250 board + bonuses    | Base: (1,000×3 + 1,500×2) = 6,000<br>Extra squares: +25% on 4 squares = +1,000<br>VIP: ×1.5 = 10,500<br>Weekly: +500 = **11,000** | Multiple activities = **240**            |

## 8. Migration & Testing

### 8.1 Migration Strategy

- Reset all existing point balances (game not live yet)
- Preserve wallet connection history for streak calculations
- Implement free-player weekly caps from launch

### 8.2 Testing Requirements

- Unit tests for each multiplier combination
- Edge case testing (VIP upgrade mid-week, CBL multi-board scenarios)
- Load testing for immediate point crediting
- Anti-gaming verification (social share limits, referral validation)

## 9. Marketing Flexibility

### 9.1 Promotional Overrides

External JSON configuration allows temporary promotional boosts:

```json
{
  "promoActive": true,
  "promoName": "Thanksgiving Double Orange",
  "multipliers": {
    "orangePoints": 2.0
  },
  "startDate": "2024-11-28",
  "endDate": "2024-12-01"
}
```

This system provides the foundation for a comprehensive reward economy that incentivizes engagement while maintaining economic balance and technical feasibility.
