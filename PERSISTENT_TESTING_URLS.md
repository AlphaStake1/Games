# 🌐 PERSISTENT TESTING URLs FOR FOOTBALL SQUARES

## 📊 COMPREHENSIVE TESTING PORTAL ACCESS

### 🎯 Main Testing Portal (index.html)

The comprehensive 6-category testing evaluation system with 157+ questions.

#### 🔵 Via Ngrok (HTTPS)

- **URL**: `https://5a8cb5c8b840.ngrok-free.app/testing/index.html`
- **Features**: Secure HTTPS, works with all browsers
- **Note**: May show ngrok warning page first time

#### 🟢 Via Bore Tunnel (HTTP)

- **Main Branch**: `http://bore.pub:3004/testing/index.html`
- **B-Site Branch**: `http://bore.pub:1143/testing/index.html`
- **Features**: Direct access, no warning pages

---

## 🏈 MAIN SITE ACCESS

### 📱 Main Branch (Original Version)

- **Bore Tunnel**: `http://bore.pub:3004/`
- **Local Port**: 3003
- **Features**: Original Football Squares platform

### 🎨 B-Site Branch (Enhanced UX Version)

- **Ngrok**: `https://5a8cb5c8b840.ngrok-free.app/`
- **Bore Tunnel**: `http://bore.pub:1143/`
- **Local Port**: 3001
- **Features**: Enhanced navigation, mobile optimization, accessibility improvements

---

## 📋 TESTING PORTAL DETAILS

### 6 Comprehensive Testing Categories:

1. **🗓️ Weekly Board Play** - 35 questions across 5 sections
2. **🏆 Season-Long Play** - 24 questions across 4 sections
3. **👑 Community Board Leader** - 25 questions across 4 sections
4. **🎨 Signature & NFT Art** - 30 questions across 6 sections
5. **🤖 AI Assistant** - 20 questions across 4 sections
6. **📊 Points & Rewards** - 23 questions across 4 sections

### Features:

- Progress tracking & auto-save
- Dynamic form generation
- Multiple input types (radio, checkbox, scales, file uploads)
- Email submission to: **CoachBoards@proton.me**
- Mobile responsive design
- Local storage backup

---

## 🔧 TECHNICAL DETAILS

### Server Processes:

```bash
# Main Branch Server
PID 105810 - Next.js on port 3003
PID 106162 - Bore tunnel on port 3004

# B-Site Server
PID 50597 - Next.js on port 3001
PID 54640 - Bore tunnel on port 1143
PID 50747 - Ngrok tunnel
```

### Management Commands:

```bash
# Check status
ps aux | grep -E "(105810|106162|50597|54640|50747)"

# Restart main branch
PORT=3003 pnpm run dev &
./bore local 3003 --to bore.pub --port 3004 &

# Check URLs
curl -s localhost:4040/api/tunnels | grep public_url
```

---

## 📢 SHARE WITH TESTERS

### Quick Copy Message:

```
🏈 Football Squares Testing Portal Ready!

Main Testing Portal:
https://5a8cb5c8b840.ngrok-free.app/testing/index.html

Alternative Access:
http://bore.pub:3004/testing/index.html

6 comprehensive testing categories with 157+ questions
Takes ~30 minutes to complete
Feedback emails to: CoachBoards@proton.me

Thank you for testing!
```

---

## ⚠️ TROUBLESHOOTING

### If testing portal shows 404:

1. Main branch may not have testing files
2. Use B-site URL instead: `http://bore.pub:1143/testing/index.html`

### If ngrok shows warning:

- Click "Visit Site" to proceed
- This is normal security behavior

### If bore tunnel is down:

- Check process: `ps aux | grep bore`
- Restart if needed with commands above

---

## ✅ VERIFIED WORKING AS OF:

**August 21, 2025 - 1:10 AM CDT**

All servers running persistently with systemd service protection.
