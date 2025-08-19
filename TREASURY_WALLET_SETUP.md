# 🏛️ Treasury Wallet Setup Guide

## Overview
The Football Squares Treasury system uses a **single Phantom wallet** with **4 segregated accounts** for professional fund management and regulatory compliance.

## 🎯 Account Structure

```
Phantom Wallet (Master Private Key)
│
├── Account 1: Player Funds 🎰
│   └── Handles: Buy-ins, Payouts, Escrow
│
├── Account 2: Operations 🎨
│   └── Handles: NFT Generation, ChainGPT API costs
│
├── Account 3: Revenue 💰
│   └── Handles: Platform fees (5%), House edge
│
└── Account 4: Reserve 🛡️
    └── Handles: Emergency funds, Insurance pool
```

## 📋 Setup Instructions

### Step 1: Create Phantom Wallet Accounts

1. **Open Phantom Wallet**
2. **Create Main Wallet** (if not already created)
3. **Add 3 Additional Accounts**:
   - Click profile icon → "Add Account"
   - Name: "FSQ Player Funds"
   - Repeat for "FSQ Operations", "FSQ Revenue", "FSQ Reserve"

### Step 2: Fund Each Account

#### Initial Funding Requirements:

| Account | SOL Needed | CGPT Tokens | Purpose |
|---------|------------|-------------|---------|
| Player Funds | 10+ SOL | 0 CGPT | Handle player transactions |
| Operations | 1 SOL | 100+ CGPT | NFT generation costs |
| Revenue | 1 SOL | 0 CGPT | Collect fees |
| Reserve | 5+ SOL | 0 CGPT | Emergency backup |

### Step 3: Get Account Addresses

1. **For each account**, copy the public address:
   - Click account name
   - Click "Copy Address"
   - Save in secure location

### Step 4: Configure Treasury Agent

Create `.env.treasury` file:

```bash
# Master wallet private key (exports from Phantom settings)
TREASURY_PRIVATE_KEY=your_private_key_here

# Individual account public addresses
PLAYER_FUNDS_ADDRESS=address_1_here
OPERATIONS_ADDRESS=address_2_here  
REVENUE_ADDRESS=address_3_here
RESERVE_ADDRESS=address_4_here

# CGPT Token Configuration
CGPT_TOKEN_MINT=CCDfDXZxzZtkZLuhY48gyKdXc5KywqpR8xEVHHh8ck1G

# Autonomous Limits
MAX_DAILY_CGPT=50
MAX_WEEKLY_CGPT=200
MIN_RESERVE_SOL=5
```

## 🤖 ElizaOS Agent Permissions

### Allowed Operations by Account:

#### ✅ Player Funds Account
- Accept buy-ins from players
- Process payouts to winners
- Transfer platform fees to Revenue
- **NEVER** fund operations or NFT costs

#### ✅ Operations Account  
- Purchase ChainGPT credits with CGPT
- Pay for NFT generation
- Cover API costs
- **NEVER** handle player funds

#### ✅ Revenue Account
- Receive 5% platform fees
- Fund Operations account when needed
- Distribute profits (manual approval)
- Track platform earnings

#### ✅ Reserve Account
- Emergency player payouts only
- Maintain minimum 5 SOL balance
- Manual intervention required for access
- Audit protection fund

## 🔒 Security Rules

### Automated Restrictions:
```typescript
// Built-in safety checks
if (fromAccount === 'PLAYER_FUNDS' && toAccount === 'OPERATIONS') {
  throw Error('❌ Cannot mix player funds with operations');
}

if (dailySpent > MAX_DAILY_CGPT) {
  throw Error('❌ Daily CGPT limit exceeded');  
}

if (reserveBalance < MIN_RESERVE_SOL) {
  alert('⚠️ Reserve funds critically low');
}
```

### Manual Approval Required:
- Any transfer > 20 CGPT tokens
- Any payout > 50 SOL
- Any reserve account access
- Cross-account transfers (except fees)

## 📊 Daily Operations

### Autonomous Agent Tasks:
1. **Morning (00:00 UTC)**
   - Reset daily spending counters
   - Check all account balances
   - Verify fund segregation

2. **Hourly**
   - Monitor Operations CGPT balance
   - Check pending player payouts
   - Track NFT generation queue

3. **Evening (23:00 UTC)**
   - Daily reconciliation report
   - Calculate platform revenue
   - Alert on any issues

### Manual Tasks:
- Weekly profit distribution
- Reserve fund management
- Security audit reviews
- CGPT token purchases

## 🚀 Activation

1. **Complete wallet setup** with 4 accounts
2. **Fund accounts** per requirements above
3. **Export private key** from Phantom
4. **Configure** `.env.treasury` file
5. **Test** with small transactions first

## ⚠️ Important Notes

- **NEVER** share the master private key
- **ALWAYS** maintain fund segregation
- **MONITOR** daily CGPT spending
- **BACKUP** wallet seed phrase securely
- **TEST** on devnet first if unsure

## 📈 Expected Daily Volumes

| Metric | Estimated Volume |
|--------|-----------------|
| Player Buy-ins | 50-200 SOL |
| Player Payouts | 45-180 SOL |
| Platform Fees | 2.5-10 SOL |
| NFT Generations | 100-500 per day |
| CGPT Usage | 10-30 tokens |

## 🆘 Troubleshooting

### Issue: "Insufficient CGPT in Operations"
**Solution**: Transfer CGPT from Revenue or manually purchase

### Issue: "Fund segregation violation"  
**Solution**: Review transaction logs, ensure proper account usage

### Issue: "Reserve below minimum"
**Solution**: Transfer SOL from Revenue to Reserve account

### Issue: "Daily CGPT limit reached"
**Solution**: Wait for daily reset or increase limits in config

---

**Ready to activate?** Once your Phantom wallet is configured with these 4 accounts, the Treasury Agent will handle everything autonomously!