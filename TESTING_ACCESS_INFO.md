# FSQ Testing Access Information

## 🌐 Public Testing URL

**Live Testing Site:** http://bore.pub:1143

## 📍 Key Testing Pages

- **Main App:** http://bore.pub:1143/
- **Testing Page:** http://bore.pub:1143/testing
- **Game Board:** http://bore.pub:1143/game/[game-id]
- **Player Dashboard:** http://bore.pub:1143/player

## 🔄 Tunnel Status

The bore tunnel is currently **ACTIVE** and forwarding local port 3000 to bore.pub:1143.

## 🛠️ For Developers

### To Keep Tunnel Running Persistently:

**Option 1: Use the startup script (Recommended)**

```bash
./start-bore-tunnel.sh
```

This script will automatically restart the tunnel if it disconnects.

**Option 2: Run in screen session**

```bash
screen -S bore-tunnel
./bore local 3000 --to bore.pub --port 1143
# Press Ctrl+A then D to detach
# To reattach: screen -r bore-tunnel
```

**Option 3: Run with nohup**

```bash
nohup ./bore local 3000 --to bore.pub --port 1143 > bore.log 2>&1 &
# Check logs: tail -f bore.log
```

### To Check if Tunnel is Running:

```bash
ps aux | grep bore
curl http://bore.pub:1143/
```

### To Stop the Tunnel:

```bash
pkill -f "bore local"
```

## 📝 Notes for Testers

- The tunnel provides public access to the local development server
- All changes made locally will be immediately reflected at bore.pub:1143
- The site uses Solana Devnet for testing (no real funds required)
- Test wallets can be funded with devnet SOL via the faucet

## ⚠️ Important

- This is a DEVELOPMENT environment - data may be reset
- The tunnel may occasionally disconnect and reconnect
- For production testing, use the deployed Vercel site instead

---

_Last Updated: 2025-08-19_
