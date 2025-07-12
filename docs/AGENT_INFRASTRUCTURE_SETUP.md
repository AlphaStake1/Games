# 🤖 Coach B. - Autonomous Agent Infrastructure Setup

## Overview
Setting up a fully autonomous and anonymous "Coach B." agent using the Eliza platform for operating Football Squares games with complete operational security.

## 🔐 Anonymous Identity & Security Setup

### 1. **Operational Security Foundation**
```bash
# Essential anonymization tools
- VPN service (ProtonVPN, Mullvad, or IVPN)
- Tor browser for sensitive operations
- Separate operating environment (VM or dedicated machine)
- Anonymous email forwarding service
```

### 2. **Anonymous Email Infrastructure**
```bash
# Protonmail Setup for Coach B.
1. Create ProtonMail account via Tor
   - Use anonymous name: "Coach B."
   - No phone number verification
   - Pay with crypto if using premium features

2. Email aliases for different functions:
   - coachb.games@protonmail.com (primary)
   - notifications@coachb-proxy.com (winner notifications)
   - support@coachb-games.com (customer service)
```

### 3. **Cryptocurrency Wallet Setup**
```bash
# Phantom Wallet for Coach B.
1. Generate new Solana wallet via CLI (air-gapped if possible):
   solana-keygen new --outfile ~/.config/solana/coachb-keypair.json
   
2. Backup seed phrase securely (offline storage)
3. Fund wallet with SOL for:
   - Transaction fees
   - Initial game seeding
   - Operational expenses

# Wallet Security:
- Never use personal wallets
- Separate hot/cold wallet strategy
- Multi-sig for large amounts
```

## 🏗️ Infrastructure Services Setup

### 4. **Supabase Database Configuration**
```sql
-- Create Supabase account anonymously
-- Database schema for Coach B. operations:

CREATE TABLE game_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id BIGINT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  board_pubkey TEXT,
  home_team TEXT,
  away_team TEXT,
  game_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  finalized_at TIMESTAMP
);

CREATE TABLE square_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id BIGINT REFERENCES game_instances(game_id),
  square_index INTEGER NOT NULL,
  player_email TEXT,
  player_pubkey TEXT,
  claim_signature TEXT,
  amount_paid DECIMAL(20,9),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id BIGINT,
  recipient_email TEXT,
  notification_type TEXT,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. **Domain & Hosting Setup**
```bash
# Anonymous domain registration
1. Use Namecheap or Njalla with crypto payment
2. WHOIS privacy protection enabled
3. Domains to register:
   - coachb-games.com (primary)
   - footballsquares-coach.com (backup)

# Hosting options:
- Akash Network (decentralized)
- VPS with crypto payment (Hostinger, Hetzner)
- IPFS for static assets
```

## 🤖 Eliza Platform Integration

### 6. **Eliza Agent Setup**
```typescript
// eliza-coach-b/character.ts
export const coachBCharacter = {
  name: "Coach B.",
  bio: "Autonomous football squares game operator specializing in fair play and secure crypto transactions.",
  personality: [
    "Professional and trustworthy",
    "Expert in football and cryptocurrency", 
    "Focused on transparent game operations",
    "Helpful with technical questions"
  ],
  knowledge: [
    "Solana blockchain operations",
    "Football scoring and game rules",
    "Cryptocurrency payments",
    "Game theory and fair play"
  ],
  actions: [
    "CREATE_GAME",
    "PROCESS_PAYMENT", 
    "SEND_NOTIFICATION",
    "UPDATE_GAME_STATE",
    "HANDLE_DISPUTE"
  ]
};

// Integration with our existing agents
export class CoachBElizaAgent extends ElizaAgent {
  async createGame(gameId: number, homeTeam: string, awayTeam: string) {
    // Calls our Anchor program create_board instruction
    return await this.anchorService.createBoard(gameId);
  }
  
  async processSquareClaim(gameId: number, squareIndex: number, playerEmail: string) {
    // Updates Supabase and sends confirmation email
    await this.databaseService.recordSquareClaim({gameId, squareIndex, playerEmail});
    await this.emailService.sendConfirmation(playerEmail);
  }
}
```

### 7. **Environment Configuration**
```bash
# .env.coachb (production environment variables)
# Database
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_KEY="your-service-key"

# Blockchain
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
ANCHOR_WALLET_PATH="/home/coachb/.config/solana/coachb-keypair.json"
PROGRAM_ID="Fg6PaFprPjfrgxLbfXyAyzsK1m1S82mC2f43s5D2qQq"

# Email
PROTONMAIL_BRIDGE_USER="coachb.games@protonmail.com"
PROTONMAIL_BRIDGE_PASS="your-bridge-password"
EMAIL_FROM="Coach B. <coachb.games@protonmail.com>"

# API Keys
SPORTS_API_KEY="your-sports-data-api-key"
SWITCHBOARD_AUTHORITY="your-switchboard-authority"

# Security
ENCRYPTION_KEY="your-32-byte-encryption-key"
JWT_SECRET="your-jwt-secret"
API_RATE_LIMIT="100"
```

## 🔄 Operational Workflows

### 8. **Automated Game Operations**
```typescript
// Coach B. daily operations schedule
const dailyWorkflow = {
  "06:00": "Check upcoming NFL games",
  "08:00": "Create new game boards", 
  "10:00": "Process overnight square claims",
  "12:00": "Send pre-game notifications",
  "16:00": "Monitor live games and scores",
  "20:00": "Process payouts for completed games",
  "22:00": "Send winner notifications",
  "00:00": "Daily backup and health check"
};
```

### 9. **Security & Monitoring**
```bash
# Operational security checklist:
□ VPN always active
□ Separate browser profile for Coach B. operations  
□ Regular key rotation (monthly)
□ Monitoring for unusual activity
□ Backup systems tested weekly
□ Incident response plan documented
```

## 📋 Setup Checklist

### Required Before Agent Deployment:
- [ ] **Anonymous Protonmail account created**
- [ ] **Phantom wallet generated and funded**
- [ ] **Supabase project with schema deployed**
- [ ] **Domain registered anonymously**
- [ ] **VPN/security infrastructure tested**
- [ ] **Eliza platform integrated with our codebase**
- [ ] **Email bridge configured and tested**
- [ ] **All environment variables secured**
- [ ] **Monitoring and alerting configured**
- [ ] **Backup procedures tested**

### Post-Deployment Verification:
- [ ] **Agent can create games autonomously**
- [ ] **Email notifications working**
- [ ] **Payments processing correctly**
- [ ] **All operations logged and auditable**
- [ ] **Security protocols functioning**

## 🚨 Operational Security Notes

1. **Never mix personal and Coach B. identities**
2. **Use separate devices/VMs when possible**
3. **Regular security audits of all systems**
4. **Have emergency shutdown procedures**
5. **Keep legal compliance documentation**
6. **Monitor for regulatory changes**

This infrastructure ensures Coach B. can operate completely autonomously while maintaining anonymity and security.