# Football Squares dApp Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Football Squares dApp to production environments. The application supports multiple deployment strategies including traditional cloud providers, Docker containers, and decentralized infrastructure via Akash Network.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Akash Network Deployment](#akash-network-deployment)
6. [Traditional Cloud Deployment](#traditional-cloud-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

**Minimum Requirements:**

- 4 CPU cores
- 8GB RAM
- 100GB SSD storage
- 100 Mbps network connection

**Recommended Requirements:**

- 8 CPU cores
- 16GB RAM
- 500GB SSD storage
- 1 Gbps network connection

### Software Dependencies

**Core Dependencies:**

- Node.js 18+
- Docker 24+
- Docker Compose 2.20+
- Git 2.40+

**Blockchain Dependencies:**

- Solana CLI 1.18+
- Anchor CLI 0.30+
- Rust 1.75+

**Optional Dependencies:**

- Akash CLI (for Akash deployment)
- kubectl (for Kubernetes deployment)
- Terraform (for infrastructure as code)

### Installation Commands

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

## Environment Configuration

### Environment Variables

Create production environment configuration:

```bash
# Copy example environment file
cp .env.example .env.production

# Edit production configuration
nano .env.production
```

**Required Environment Variables:**

```bash
# === Blockchain Configuration ===
RPC_ENDPOINT=https://api.mainnet-beta.solana.com
ANCHOR_WALLET=/path/to/your/keypair.json
ANCHOR_PROVIDER_URL=https://api.mainnet-beta.solana.com

# === WebSocket Configuration ===
WS_PORT=8080
WS_HOST=0.0.0.0

# === AI Agent Configuration ===
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key

# === Email Configuration ===
PROTON_EMAIL=your_email@proton.me
PROTON_PASSWORD=your_app_password
PROTON_BRIDGE_HOST=proton-bridge
PROTON_BRIDGE_PORT=1025

# === Ceramic Configuration ===
CERAMIC_NODE_URL=https://ceramic-clay.3boxlabs.com
CERAMIC_PRIVATE_KEY=your_ceramic_private_key

# === Switchboard VRF Configuration ===
SWITCHBOARD_PROGRAM_ID=SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f
VRF_ACCOUNT=your_vrf_account_pubkey

# === Clockwork Configuration ===
CLOCKWORK_PROVIDER_URL=https://api.mainnet-beta.solana.com
CLOCKWORK_THREAD_ID=your_thread_id

# === Security Configuration ===
JWT_SECRET=your_jwt_secret_256_bit
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# === Monitoring Configuration ===
LOG_LEVEL=info
HEALTH_CHECK_INTERVAL=30000
```

### Network Configuration

**Firewall Rules:**

```bash
# Allow HTTP/HTTPS traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow WebSocket connections
sudo ufw allow 8080/tcp

# Allow SSH (replace 22 with your SSH port)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

**Nginx Configuration** (optional reverse proxy):

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API endpoints
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Smart Contract Deployment

### 1. Build the Program

```bash
# Clean previous builds
anchor clean

# Build the program
anchor build

# Verify build
anchor test --skip-local-validator
```

### 2. Deploy to Devnet (Testing)

```bash
# Set Solana config to devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL for deployment fees
solana airdrop 2

# Deploy the program
anchor deploy

# Verify deployment
solana program show <PROGRAM_ID>
```

### 3. Deploy to Mainnet

```bash
# Set Solana config to mainnet
solana config set --url https://api.mainnet-beta.solana.com

# Fund deployment wallet (minimum 5 SOL recommended)
# Transfer SOL to your deployment wallet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show <PROGRAM_ID>

# Update program ID in frontend
echo "NEXT_PUBLIC_PROGRAM_ID=<PROGRAM_ID>" >> .env.production
```

### 4. Initialize Program State

```bash
# Run initialization script
pnpm run init-board

# Create Clockwork threads
pnpm run create-thread

# Verify program functionality
pnpm run health:single anchor
```

## Docker Deployment

### 1. Production Build

```bash
# Build all Docker images
docker-compose -f docker/docker-compose.yml build

# Tag images for production
docker tag football-squares:latest football-squares:v1.0.0
```

### 2. Single Server Deployment

```bash
# Copy production configuration
cp .env.production docker/.env

# Deploy using Docker Compose
cd docker
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f
```

### 3. Multi-Server Deployment

For high availability, deploy across multiple servers:

**Load Balancer Server:**

```yaml
# docker-compose.lb.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
```

**Application Servers:**

```bash
# Server 1
SERVER_ID=1 docker-compose up -d

# Server 2
SERVER_ID=2 docker-compose up -d

# Server 3
SERVER_ID=3 docker-compose up -d
```

### 4. Database Scaling

```yaml
# docker-compose.db.yml - If using traditional database
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: football_squares
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    deploy:
      replicas: 3
```

## Akash Network Deployment

### 1. Akash CLI Setup

```bash
# Install Akash CLI
curl -sSfL https://raw.githubusercontent.com/akash-network/node/main/install.sh | sh

# Create wallet
akash keys add wallet

# Fund wallet with AKT tokens
# Send AKT to your wallet address

# Create certificate
akash tx cert create client --from wallet --chain-id akashnet-2
```

### 2. Deployment Configuration

Update [`docker/deploy.yaml`](../docker/deploy.yaml):

```yaml
version: '2.0'

services:
  app:
    image: football-squares:latest
    env:
      - RPC_ENDPOINT=https://api.mainnet-beta.solana.com
      - NODE_ENV=production
    expose:
      - port: 3000
        as: 80
        to:
          - global: true

  websocket:
    image: football-squares-ws:latest
    expose:
      - port: 8080
        to:
          - global: true

  agents:
    image: football-squares-agents:latest
    env:
      - ANTHROPIC_API_KEY=your_api_key
      - OPENAI_API_KEY=your_api_key

profiles:
  compute:
    app:
      resources:
        cpu:
          units: 2
        memory:
          size: 4Gi
        storage:
          size: 10Gi
    websocket:
      resources:
        cpu:
          units: 1
        memory:
          size: 2Gi
        storage:
          size: 5Gi

placement:
  akash:
    pricing:
      app:
        denom: uakt
        amount: 1000
      websocket:
        denom: uakt
        amount: 500
```

### 3. Deploy to Akash

```bash
# Create deployment
akash tx deployment create deploy.yaml --from wallet --chain-id akashnet-2

# View bids
akash query market bid list --owner $(akash keys show wallet -a)

# Create lease (replace with actual bid ID)
akash tx market lease create --bid-id <BID_ID> --from wallet --chain-id akashnet-2

# Get deployment status
akash provider lease-status --from wallet --bid-id <BID_ID>

# Get deployment logs
akash provider lease-logs --from wallet --bid-id <BID_ID>
```

### 4. Update and Manage

```bash
# Update deployment
akash tx deployment update deploy.yaml --from wallet --deployment-id <DEPLOYMENT_ID>

# Close deployment
akash tx deployment close --deployment-id <DEPLOYMENT_ID> --from wallet
```

## Traditional Cloud Deployment

### AWS Deployment

**1. EC2 Instance Setup:**

```bash
# Launch EC2 instance (t3.large recommended)
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type t3.large \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxx

# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip
```

**2. Application Deployment:**

```bash
# Clone repository
git clone https://github.com/your-repo/football-squares.git
cd football-squares

# Install dependencies
npm install --production

# Set up environment
cp .env.example .env.production
# Edit .env.production with your configuration

# Build application
pnpm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Google Cloud Platform

**1. Compute Engine Setup:**

```bash
# Create instance
gcloud compute instances create football-squares \
  --zone=us-central1-a \
  --machine-type=e2-standard-4 \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud
```

**2. Container Deployment:**

```bash
# Build and push to Container Registry
docker build -t gcr.io/your-project/football-squares .
docker push gcr.io/your-project/football-squares

# Deploy to Cloud Run
gcloud run deploy football-squares \
  --image gcr.io/your-project/football-squares \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean

**1. Droplet Setup:**

```bash
# Create droplet via CLI
doctl compute droplet create football-squares \
  --size s-4vcpu-8gb \
  --image ubuntu-20-04-x64 \
  --region nyc1
```

**2. App Platform Deployment:**

```yaml
# .do/app.yaml
name: football-squares
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/football-squares
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 3
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: RPC_ENDPOINT
        value: https://api.mainnet-beta.solana.com
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is configured in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

**Pipeline Stages:**

1. **Code Quality**
   - TypeScript compilation
   - ESLint checks
   - Prettier formatting
   - Security audit

2. **Testing**
   - Unit tests
   - Integration tests
   - Smart contract tests
   - Health checks

3. **Build**
   - Docker image building
   - Smart contract compilation
   - Frontend build optimization

4. **Security**
   - Dependency vulnerability scanning
   - Container security scanning
   - Secret detection

5. **Deployment**
   - Staging deployment
   - Production deployment (on release)
   - Rollback capabilities

### Manual Deployment Commands

```bash
# Deploy to staging
pnpm run deploy:staging

# Deploy to production
pnpm run deploy:production

# Rollback deployment
pnpm run deploy:rollback

# Check deployment status
pnpm run deploy:status
```

## Monitoring and Maintenance

### Health Monitoring

**Application Health Checks:**

```bash
# Check all services
pnpm run health

# Check specific services
pnpm run health:single rpc
pnpm run health:single websocket
pnpm run health:single agents
```

**Automated Monitoring Setup:**

```bash
# Set up cron job for health checks
echo "*/5 * * * * cd /path/to/app && pnpm run health >> /var/log/health.log" | crontab -

# Set up log rotation
sudo tee /etc/logrotate.d/football-squares << EOF
/var/log/football-squares/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 app app
}
EOF
```

### Performance Monitoring

**Metrics Collection:**

- Application performance metrics
- Database query performance
- WebSocket connection metrics
- Blockchain transaction metrics

**Alerting Rules:**

- High error rates (>5%)
- Slow response times (>2s)
- High memory usage (>90%)
- Failed health checks

### Backup and Recovery

**Database Backups:**

```bash
# Backup Ceramic data
pnpm run backup:ceramic

# Backup configuration
tar -czf config-backup-$(date +%Y%m%d).tar.gz .env* config/

# Backup smart contract state
solana account <PROGRAM_ID> --output json > program-backup-$(date +%Y%m%d).json
```

**Recovery Procedures:**

```bash
# Restore from backup
pnpm run restore:ceramic backup-file.tar.gz

# Restart services
docker-compose restart

# Verify recovery
pnpm run health
```

## Security Considerations

### Network Security

**Firewall Configuration:**

```bash
# Allow only necessary ports
sudo ufw deny incoming
sudo ufw allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp  # WebSocket
sudo ufw enable
```

**SSL/TLS Configuration:**

```bash
# Install Let's Encrypt certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Application Security

**Environment Security:**

- Use strong, unique passwords
- Rotate API keys regularly
- Implement proper access controls
- Enable audit logging

**Container Security:**

```bash
# Scan images for vulnerabilities
docker scan football-squares:latest

# Use non-root users in containers
# (Already configured in Dockerfiles)

# Limit container resources
docker run --memory=4g --cpus=2 football-squares:latest
```

### Smart Contract Security

**Deployment Security:**

- Use hardware wallet for mainnet deployment
- Verify program bytecode
- Implement upgrade authorities carefully
- Monitor for unusual transactions

```bash
# Verify program deployment
solana program show <PROGRAM_ID>

# Monitor program accounts
solana account <PROGRAM_ID> --output json | jq .
```

## Troubleshooting

### Common Issues

**1. Docker Build Failures**

```bash
# Clear Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose build --no-cache

# Check logs
docker-compose logs service-name
```

**2. Smart Contract Deployment Issues**

```bash
# Check Solana CLI configuration
solana config get

# Verify wallet balance
solana balance

# Check network status
solana cluster-version

# Deploy with verbose output
anchor deploy --provider.cluster mainnet --verbose
```

**3. WebSocket Connection Issues**

```bash
# Check port availability
netstat -tlnp | grep 8080

# Test WebSocket connection
wscat -c ws://localhost:8080

# Check firewall rules
sudo ufw status
```

**4. Agent System Failures**

```bash
# Check agent logs
docker-compose logs agents

# Verify API keys
pnpm run test:validate

# Restart agents
docker-compose restart agents
```

### Log Analysis

**Application Logs:**

```bash
# View real-time logs
docker-compose logs -f

# Filter by service
docker-compose logs websocket

# Search logs
docker-compose logs | grep ERROR
```

**System Logs:**

```bash
# System messages
sudo tail -f /var/log/syslog

# Docker daemon logs
sudo journalctl -fu docker.service

# Application-specific logs
tail -f /var/log/football-squares/app.log
```

### Performance Optimization

**Database Optimization:**

- Index frequently queried fields
- Implement connection pooling
- Use read replicas for analytics

**Frontend Optimization:**

- Enable gzip compression
- Implement CDN caching
- Optimize bundle sizes

**Infrastructure Optimization:**

- Use load balancers
- Implement auto-scaling
- Monitor resource usage

## Maintenance Schedule

### Daily Tasks

- [ ] Monitor system health
- [ ] Check error logs
- [ ] Verify backup completion
- [ ] Review security alerts

### Weekly Tasks

- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Test disaster recovery
- [ ] Security patch updates

### Monthly Tasks

- [ ] Capacity planning review
- [ ] Security audit
- [ ] Cost optimization review
- [ ] Documentation updates

## Support and Escalation

### Support Channels

- **Technical Issues**: GitHub Issues
- **Security Issues**: security@footballsquares.dev
- **Infrastructure**: DevOps team
- **Emergency**: On-call rotation

### Escalation Matrix

1. **Level 1**: Application errors, minor performance issues
2. **Level 2**: Service outages, security incidents
3. **Level 3**: Data loss, major security breaches

---

_Last updated: January 2025_

For deployment support, contact: deployments@footballsquares.dev
