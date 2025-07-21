# Season-Pass NFT System

A comprehensive Season-Pass system for NFL squares competition, featuring soulbound NFTs, conference-based competition, and automated scoring across the entire NFL season.

## 🏆 Overview

The Season-Pass system replaces the previous "Join Season-Long Competition" functionality with a dedicated NFT-based competition system. Players mint non-transferable Season-Pass NFTs that grant access to every NFL game throughout the season and playoffs.

## 📁 File Structure

```
programs/season_pass/src/lib.rs          # Core smart contract
app/season-pass/page.tsx                 # Landing page
app/season-pass/conferences/page.tsx     # Conference selection & minting
app/season-pass/dashboard/page.tsx       # Player dashboard
app/season-pass/rules/page.tsx           # Rules & onboarding
app/page.tsx                             # Updated main page routing
```

## 🚀 Key Features

### 1. **Soulbound NFT System**
- **Token-2022 Implementation**: Non-transferable NFTs bound to player wallets
- **One-Time Minting**: Single payment grants access to entire season
- **Auto-Assignment**: Random square assignment before each game

### 2. **Conference System**
- **100-Player Capacity**: Each conference accommodates exactly 100 players
- **5 Tier Levels**: $100, $200, $300, $400, $500 conferences
- **Sequential Filling**: Conferences fill in order, cycling through tiers
- **Independent Leaderboards**: Each conference has its own competition

### 3. **Season Types**
- **Full-Season Pass**: Weeks 1-18 + playoffs, 1 pass per wallet
- **Half-Season Pass**: Weeks 10-18 + playoffs, up to 5 passes per wallet
- **Scaling Prices**: Half-season passes scale: 1x, 1.1x, 1.2x, 1.3x, 1.4x

### 4. **Scoring System**
- **Hit Patterns**: Forward (10pts), Backward (7pts), Forward+5 (5pts), Backward+5 (3pts)
- **Playoff Multipliers**: Wild Card (1.5x), Divisional (2x), Conference (2.5x), Super Bowl (3x)
- **Overtime Support**: Full points for overtime scoring events
  - **Explanation**: Overtime does not dilute or change how a hit is scored.
    - Same base points: Forward (10 pts), Backward (7 pts), Forward+5 (5 pts), Backward+5 (3 pts).
    - Same playoff multiplier (if applicable): If in a Divisional-round game, every hit—regulation or OT—still gets the ×2 multiplier.
    - Example: A Forward hit in a Divisional overtime = 10 pts × 2 = 20 pts, exactly what you’d have earned in the 1st quarter. There’s no reduction, decay, or “half-credit” just because the clock passed 60:00. Overtime keeps the scoreboard live and lets trailing players pile up points as long as the game continues.

### 5. **Prize Distribution**
- **7-Tier Payout**: Top 7 finishers per conference
- **Percentage-Based**: 50%, 20%, 10%, 5%, 5%, 5%, 5%
- **Automatic Distribution**: Smart contract handles prize payouts

## 🛠 Technical Implementation

### Smart Contract (`programs/season_pass/src/lib.rs`)

```rust
// Key structs and functions
pub struct Conference {
    pub id: u64,
    pub base_price: u64,
    pub filled_count: u8,
    pub is_active: bool,
    pub season_type: SeasonType,
}

pub struct SeasonPass {
    pub conference_id: u64,
    pub owner: Pubkey,
    pub pass_count: u8,
    pub total_points: u32,
    pub total_hits: u32,
    pub mint_timestamp: i64,
}

// Core functions
pub fn initialize_conference(...)
pub fn mint_season_pass(...)
pub fn record_game_hit(...)
pub fn calculate_playoff_multiplier(...)
```

### Frontend Pages

#### 1. **Landing Page** (`app/season-pass/page.tsx`)
- Hero section with conversion-focused copy
- Pass type selection (Full vs Half-Season)
- Conference availability display
- Scoring engine explanation
- Payout structure visualization

#### 2. **Conference Selection** (`app/season-pass/conferences/page.tsx`)
- Real-time conference capacity display
- Pass type and quantity selection
- Wallet connection interface
- NFT minting workflow
- Price calculation with scaling

#### 3. **Player Dashboard** (`app/season-pass/dashboard/page.tsx`)
- **Tabbed Interface**: Season-Pass, Weekly Cash, Free Play
- **Stats Overview**: Total points, rank, hit rate, streaks
- **Conference Leaderboard**: Live rankings with current user highlight
- **Recent Activity**: Color-coded by game type
- **Season Progress**: Visual progress tracking

#### 4. **Rules & Onboarding** (`app/season-pass/rules/page.tsx`)
- **Step-by-step onboarding guide**
- **Comprehensive scoring rules**
- **Conference system explanation**
- **FAQ section**
- **Prize structure calculator**

## 🎯 User Flow

1. **Discovery**: User clicks "Join Season-Long Competition" on main page
2. **Landing**: Learns about Season-Pass system and benefits
3. **Selection**: Chooses conference tier and pass type
4. **Minting**: Connects wallet and mints Season-Pass NFT
5. **Competition**: Automatic participation in all games
6. **Tracking**: Monitors progress via dashboard
7. **Rewards**: Automatic prize distribution at season end

## 📊 Dashboard Integration

The dashboard implements layout segmentation as requested:

```tsx
// Color-coded point system
const getGameTypeConfig = (gameType: string) => {
  switch (gameType) {
    case 'season-pass':
      return { color: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
    case 'weekly-cash':
      return { color: 'bg-gradient-to-r from-green-400 to-emerald-500' };
    case 'free-play':
      return { color: 'bg-gradient-to-r from-blue-400 to-cyan-500' };
  }
};
```

## 🔧 Configuration

### Conference Pricing
```rust
const CONFERENCE_PRICES: [u64; 5] = [100, 200, 300, 400, 500];
```

### Hit Pattern Points
```rust
const HIT_POINTS: [u8; 4] = [10, 7, 5, 3]; // Forward, Backward, Forward+5, Backward+5
```

### Playoff Multipliers
```rust
const PLAYOFF_MULTIPLIERS: [f32; 4] = [1.5, 2.0, 2.5, 3.0]; // Wild Card through Super Bowl
```

### Half-Season Scaling
```rust
const SCALE_CURVE_BPS: [u16; 5] = [0, 1000, 2000, 3000, 4000]; // 1x, 1.1x, 1.2x, 1.3x, 1.4x
```

## 🌟 Key Benefits

1. **Standalone System**: Independent from Weekly Cash Games
2. **Soulbound NFTs**: Prevents secondary market speculation
3. **Automated Everything**: No manual actions required after minting
4. **Transparent Competition**: On-chain leaderboards and scoring
5. **Scalable Architecture**: Supports unlimited conferences
6. **Integrated Experience**: Unified dashboard for all game types

## 📈 Future Enhancements

1. **Advanced Analytics**: Player performance tracking
2. **Social Features**: Conference chat and interactions
3. **Achievement System**: Badges and milestones
4. **Mobile App**: Dedicated mobile experience
5. **Integration**: Enhanced connection with Weekly Cash Games

## 🔗 Navigation Updates

The main page now properly routes to the Season-Pass system:

```tsx
// Updated in app/page.tsx
<Button onClick={() => router.push('/season-pass')}>
  Join Season-Long Competition
</Button>
```

This implementation provides a complete Season-Pass system that transforms the traditional weekly squares experience into a comprehensive season-long competition with NFT-based participation and automated scoring.