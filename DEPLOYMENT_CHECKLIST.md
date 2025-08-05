# Sprint 1 Deployment Checklist - Board Boost Feature

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

```bash
# Add to .env
RPC_URL=https://api.devnet.solana.com
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
TREASURY_WALLET=your-treasury-pubkey
```

### 2. Database Setup

```sql
-- Run this SQL in your Supabase dashboard
CREATE TABLE IF NOT EXISTS board_metadata (
  game_id TEXT PRIMARY KEY,
  cbl_wallet TEXT NOT NULL,
  fill_rate INTEGER DEFAULT 0,
  boost_amount TEXT DEFAULT '0',
  promoted_until TIMESTAMP WITH TIME ZONE DEFAULT '1970-01-01T00:00:00Z',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT DEFAULT '',
  board_metadata_pubkey TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promoted_boards ON board_metadata(promoted_until DESC, boost_amount DESC);
CREATE INDEX IF NOT EXISTS idx_cbl_boards ON board_metadata(cbl_wallet);
CREATE INDEX IF NOT EXISTS idx_tags ON board_metadata USING gin(to_tsvector('english', tags));
```

## 🚀 Deployment Steps

### 1. Build & Deploy Anchor Program

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Verify deployment
anchor idl verify $PROGRAM_ID target/idl/football_squares.json
```

### 2. Run Tests

```bash
# Run Anchor tests
anchor test

# Verify boost functionality
npm run test:boost
```

### 3. Start Indexer

```bash
# Start the board boost indexer
cd indexer
npm install
npm start
```

### 4. Deploy Frontend Updates

```bash
# Build and deploy frontend
npm run build
npm run deploy
```

## ✅ Acceptance Criteria

- [ ] **BoardMetadata PDA** can be created via `publish_board`
- [ ] **Boost payments** transfer 0.1 SOL to treasury vault
- [ ] **Treasury vault** accumulates boost fees correctly
- [ ] **Promoted boards** show in Featured Games section
- [ ] **Indexer** captures BoardPublished and BoardBoosted events
- [ ] **Frontend toggle** calls boost_board instruction
- [ ] **All tests pass** on devnet
- [ ] **Database** correctly stores board metadata

## 📊 Success Metrics

After deployment, monitor:

- Number of boards published per day
- Boost adoption rate (% of boards that get boosted)
- Treasury vault balance growth
- Featured Games section engagement
- Database indexing performance

## 🐛 Troubleshooting

### Common Issues:

1. **PDA derivation mismatch**: Ensure seeds match between program and frontend
2. **Insufficient balance**: CBL needs >0.1 SOL for boost
3. **Indexer lag**: Events may take 1-2 slots to appear in database
4. **RPC limits**: Use dedicated RPC for indexer if hitting rate limits

### Debug Commands:

```bash
# Check treasury balance
solana balance <treasury-pubkey> --url devnet

# View program logs
solana logs <program-id> --url devnet

# Query board metadata
anchor account BoardMetadata <board-metadata-pubkey>
```

## 🔄 Next Sprint Preview

After successful deployment, Sprint 2 will add:

- **Discovery API** endpoint (`/api/boards?sort=featured`)
- **Ranking algorithm** implementation
- **QR code generator** for social sharing
- **CBL reputation scoring** system

---

## 🎯 Go Live Command

```bash
# Final deployment sequence
anchor build && anchor deploy --provider.cluster devnet
anchor test
npm run indexer:start
npm run build && npm run deploy

echo "🚀 Board Boost feature is LIVE on devnet!"
```
