# Production Deployment Checklist

## Critical Infrastructure Setup

### 1. Switchboard Oracle Configuration

- [ ] **Score Feed**: Set up real Switchboard data feed for NFL scores
  - Create Switchboard job account that fetches from sports API (ESPN, TheScoreAPI, etc.)
  - Alternative: Use Chainlink Functions or Pyth Network for game data
  - Current: Using mock data via `simulateScoreFetch()` in OracleAgent

### 2. API Keys & Services

- [ ] **OpenAI API Key**: Production key with appropriate rate limits and budget
- [ ] **Anthropic API Key**: Production key for Claude models (opus-4-20241218, opus-4-1-20250805, sonnet-4-20250514)
- [ ] **Proton Mail Bridge**: Configure real SMTP credentials for email notifications

### 3. Blockchain Infrastructure

- [ ] **Solana Network**: Switch from devnet to mainnet-beta
  - Update RPC_ENDPOINT to mainnet RPC
  - Generate production keypair with sufficient SOL
  - Update Switchboard VRF queue to mainnet queue
- [ ] **Clockwork Threads**: Deploy production scheduler threads
- [ ] **Program Deployment**: Deploy verified programs to mainnet

### 4. Database & Storage

- [ ] **PostgreSQL**: Production database with:
  - Secure credentials
  - Regular automated backups
  - Connection pooling
  - SSL/TLS encryption

### 5. Decentralized Infrastructure

- [ ] **Ceramic DID**: Generate production 32-byte hex seed
- [ ] **Akash Network**: Set up deployment keys for decentralized hosting

## Environment Variables to Update

```bash
# Production values needed:
RPC_ENDPOINT=https://api.mainnet-beta.solana.com  # or premium RPC
SWITCHBOARD_SCORE_FEED=<production_feed_address>
OPENAI_API_KEY=<production_key>
ANTHROPIC_API_KEY=<production_key>
POSTGRES_PASSWORD=<secure_password>
SMTP_USER=<real_proton_user>
SMTP_PASS=<real_proton_pass>
CLOCKWORK_THREAD_ID=<production_thread>
CERAMIC_DID_SEED=<production_seed>
AKASH_DEPLOY_KEY=<production_wallet>
```

## Security Considerations

- [ ] Audit smart contracts before mainnet deployment
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting for APIs
- [ ] Implement proper key rotation strategy
- [ ] Set up secure secrets management (e.g., HashiCorp Vault, AWS Secrets Manager)

## Testing Requirements

- [ ] Load testing with expected production traffic
- [ ] Disaster recovery plan and testing
- [ ] Security penetration testing
- [ ] Cross-browser and mobile testing for UI

---

_Note: This checklist tracks items that are currently using development/mock implementations that need production replacements._
