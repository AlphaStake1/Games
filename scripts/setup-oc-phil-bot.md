# OC Phil Bot Configuration Guide

This guide covers the manual BotFather settings needed for OC Phil to work optimally.

## 🤖 BotFather Commands to Run

### 1. Enable Inline Mode

```
/setinline
@OC_Phil_bot
Search squares tips and create boards
```

### 2. Set Privacy Mode (IMPORTANT)

```
/setprivacy
@OC_Phil_bot
Disable
```

**Why**: This allows OC Phil to read all group messages, enabling community features like:

- Celebrating board wins automatically
- Responding to @mentions
- Tracking community engagement

### 3. Set Bot Commands

```
/setcommands
@OC_Phil_bot

board - Create a new squares board for upcoming games
myboards - View your active and completed boards
join - Join an existing squares board
stats - View your performance statistics and win rate
leaderboard - See top performers in your community
tips - Get personalized strategy advice based on your progress
strategy - Advanced board strategy and pricing guidance
notify - Set up game and board notifications
schedule - View upcoming NFL games and board opportunities
celebrate - Share wins and achievements with the community
pricing - Get optimal pricing recommendations for your boards
analytics - View detailed performance analytics (Franchise tier)
help - Show all available commands and how to use them
start - Welcome message and bot introduction
```

### 4. Set Bot Description

```
/setdescription
@OC_Phil_bot
🏈 Your AI offensive coordinator for squares domination! I help Community Board Leaders build thriving communities with proven strategies, real-time tips, and automated celebrations. From beginner guidance to Franchise-tier analytics - let's turn your passion into profit!

Ready to coach your community to victory? Use /help to get started!
```

### 5. Set Short Description

```
/setabouttext
@OC_Phil_bot
🏈 AI squares coach helping CBLs build winning communities! Strategy tips, board creation, analytics & more.
```

## 🎯 Additional Recommended Settings

### Enable Business Mode (Optional)

```
/setbusiness
@OC_Phil_bot
Enable
```

**Benefits**:

- Verified business badge
- Enhanced credibility for CBLs
- Access to business-specific features

### Set Bot Avatar

1. Send `/setuserpic` to BotFather
2. Select @OC_Phil_bot
3. Upload a professional football/coaching themed image
4. **Recommended**: Orange and blue theme matching brand colors

### Domain Whitelist (if using web features)

```
/setdomain
@OC_Phil_bot
yourdomain.com
```

## 🔧 Environment Variables Needed

Add these to your `.env.local`:

```bash
# OC Phil Bot Configuration
OC_PHIL_BOT_TOKEN=your_bot_token_here
OC_PHIL_BOT_USERNAME=OC_Phil_bot
TELEGRAM_BOT_FATHER_TOKEN=your_botfather_token_here

# Webhook Configuration
WEBHOOK_BASE_URL=https://your-domain.com/api
WEBHOOK_SECRET=your_webhook_secret_here

# Feature Flags
ENABLE_INLINE_MODE=true
ENABLE_GROUP_FEATURES=true
ENABLE_BUSINESS_MODE=true
```

## 🚀 Testing Your Configuration

### 1. Test Basic Commands

- Send `/start` to @OC_Phil_bot
- Try `/help` to see all commands
- Test `/tips` for personalized advice

### 2. Test Group Features

- Add @OC_Phil_bot to a test group
- Verify it can read messages (privacy disabled)
- Test @OC_Phil_bot mentions

### 3. Test Inline Mode

- In any chat, type `@OC_Phil_bot strategy`
- Should show inline results for tips and commands

## ⚠️ Important Notes

1. **Privacy Mode MUST be disabled** for community features to work
2. **Commands are automatically set** by your bot code, but manual setting provides better UX
3. **Inline mode** greatly improves user experience across all chats
4. **Business mode** adds credibility but isn't required for functionality

## 🔄 Configuration Checklist

- [ ] Inline mode enabled with description
- [ ] Privacy mode disabled (allows reading all messages)
- [ ] All 14 commands set with descriptions
- [ ] Bot description and about text set
- [ ] Bot avatar uploaded (optional)
- [ ] Environment variables configured
- [ ] Test basic commands work
- [ ] Test group functionality
- [ ] Test inline mode works

Once configured, OC Phil will have full functionality for:

- ✅ Community coaching and tips
- ✅ Board creation and management
- ✅ Milestone tracking and rewards
- ✅ Inline help across all chats
- ✅ Group celebration and engagement
- ✅ CBL custom bot creation for milestones
