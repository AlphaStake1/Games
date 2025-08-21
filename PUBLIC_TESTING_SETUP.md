# Public Testing Server Setup & Maintenance Guide

## Overview

This document explains how to set up and maintain a public-facing test server for the Football Squares platform using bore tunnel (bore.pub) for external access.

## Current Setup Status

- **Public URL**: http://bore.pub:1143/
- **Testing Portal**: http://bore.pub:1143/testing/index.html
- **Next.js Port**: 3001
- **Bore Tunnel Port**: 1143

## Quick Commands

### Check if services are running:

```bash
ps aux | grep -E "pnpm run dev|bore local" | grep -v grep
```

### Start services (if not running):

```bash
# Start Next.js server
nohup pnpm run dev > /home/new-msi/workspace/fsq/logs/nextjs-final.log 2>&1 &

# Start bore tunnel (wait 5 seconds after Next.js starts)
nohup ./bore local 3001 --to bore.pub --port 1143 > /home/new-msi/workspace/fsq/logs/bore-final.log 2>&1 &
```

### View logs:

```bash
tail -f /home/new-msi/workspace/fsq/logs/nextjs-final.log
tail -f /home/new-msi/workspace/fsq/logs/bore-final.log
```

### Stop services:

```bash
pkill -f "pnpm run dev"
pkill -f bore
```

## Initial Setup Steps (If Starting Fresh)

### 1. Configure Next.js Port

The dev server must run on port 3001 (not default 3000):

```json
// package.json
"scripts": {
    "dev": "next dev -p 3001",
    ...
}
```

### 2. Install bore (if not present)

```bash
# Download bore binary
wget https://github.com/ekzhang/bore/releases/download/v0.5.0/bore-v0.5.0-x86_64-unknown-linux-musl.tar.gz
tar -xzf bore-v0.5.0-x86_64-unknown-linux-musl.tar.gz
chmod +x bore
```

### 3. Set Up Testing Pages

The comprehensive testing portal is located at:

- Source: `/pages/testing/index.html`
- Must be copied to: `/public/testing/index.html`

```bash
cp -r pages/testing public/
```

This provides 6 testing categories:

- Weekly Board Play (35 questions)
- Season-Long Play (24 questions)
- Community Board Leader (25 questions)
- Signature & NFT Art (30 questions)
- AI Assistant (20 questions)
- Points & Rewards (23 questions)

## Common Issues & Solutions

### Issue 1: "This site can't be reached"

**Cause**: Services not running or bore tunnel disconnected

**Solution**:

1. Check if services are running: `ps aux | grep -E "pnpm|bore"`
2. Check logs for errors: `tail -n 50 logs/bore-final.log`
3. Restart both services using commands above

### Issue 2: Next.js Compilation Hanging

**Symptoms**: Server starts but pages take forever to load (3-5 minutes)

**Causes & Solutions**:

- Google Fonts timeout issues (network connectivity)
- Large compilation on first request
- Solution: Wait for initial compilation to complete (can take up to 4 minutes)

### Issue 3: Port 3001 Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**:

```bash
# Find and kill process using port 3001
lsof -i :3001
kill <PID>
# Or force kill all Next.js processes
pkill -f "next dev"
```

### Issue 4: Missing .next Directory

**Error**: `ENOENT: no such file or directory, open '.next/routes-manifest.json'`

**Solution**:

```bash
rm -rf .next
pnpm run dev  # Will rebuild on first request
```

## Persistent Running Solutions

### Option 1: nohup (Currently Used)

Services run until system restart:

```bash
nohup pnpm run dev > logs/nextjs.log 2>&1 &
nohup ./bore local 3001 --to bore.pub --port 1143 > logs/bore.log 2>&1 &
```

### Option 2: Monitoring Script

Use `/scripts/monitor-server.sh` to auto-restart crashed services:

```bash
nohup ./scripts/monitor-server.sh > logs/monitor.log 2>&1 &
```

### Option 3: systemd Service (Most Reliable)

For automatic startup on system boot:

```bash
sudo ./scripts/install-service.sh
```

## Available Helper Scripts

Located in `/scripts/`:

- `start-server-persistent.sh` - Starts both services
- `stop-server.sh` - Stops both services
- `monitor-server.sh` - Monitors and auto-restarts services
- `install-service.sh` - Installs systemd service

## Testing Portal Features

The testing portal at `/testing/index.html` includes:

- Category selection interface
- Progress tracking
- Auto-save every 30 seconds
- Email submission to CoachBoards@proton.me
- Comprehensive questions covering all platform aspects
- File upload for screenshots
- Scale ratings, checkboxes, text inputs
- Section collapsing for better navigation

## Important Notes

1. **Initial Load Time**: First request after starting may take 3-4 minutes due to Next.js compilation
2. **Google Fonts Issues**: May cause slow compilation due to network timeouts
3. **Persistence**: Using nohup means services persist through terminal/SSH disconnection but NOT system reboots
4. **Bore Tunnel**: Free service at bore.pub:1143 - stable but may occasionally disconnect
5. **Testing Data**: Stored in browser localStorage and emailed to CoachBoards@proton.me

## Alternative Tunneling Options

If bore.pub is unavailable:

```bash
# ngrok (if configured)
./ngrok http 3001 --log=stdout

# localtunnel
npx localtunnel --port 3001

# cloudflared
cloudflared tunnel --url http://localhost:3001
```

## Verification Steps

After setup, verify:

1. Next.js running: `curl http://localhost:3001/` (may take time on first request)
2. Bore tunnel connected: Check logs show "listening at bore.pub:1143"
3. Public access: Visit http://bore.pub:1143/
4. Testing portal: Visit http://bore.pub:1143/testing/index.html

## Contact for Issues

Testing feedback email: CoachBoards@proton.me

---

Last Updated: August 20, 2025
Successfully serving public testing at: http://bore.pub:1143/testing/index.html
