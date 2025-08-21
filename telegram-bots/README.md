# 🤖 Football Squares Telegram Bots

This directory contains the Telegram bot implementations for Jerry, Coach B, and OC-Phil.

## Bot Configurations

| Bot                    | AI Model         | Purpose                                     | Username          |
| ---------------------- | ---------------- | ------------------------------------------- | ----------------- |
| **GM Jerry Not-Jones** | Claude 3 Opus    | Executive orchestrator, treasury management | @JerryNotJonesBot |
| **Coach B**            | ChatGPT (GPT-4)  | Player support, game guidance               | @CoachBFSQBot     |
| **OC-Phil**            | Gemini 2.0 Flash | Community Board Leader support              | @OCPhilBot        |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd telegram-bots
npm install
```

### 2. Test Bot Configuration

```bash
npm run test
```

This will verify:

- ✅ Bot tokens are valid
- ✅ Bots can connect to Telegram
- ✅ AI API keys are present
- ✅ Webhook status (if configured)

### 3. Start the Bots

```bash
# Development mode (long polling)
npm run dev

# Production mode
npm start
```

## 📱 Setting Up Your Telegram Bots

### Step 1: Create Bots with BotFather

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the prompts for each bot:

**Jerry Bot:**

- Name: `GM Jerry Not-Jones`
- Username: `JerryNotJonesBot`
- Description: "Executive Orchestrator for Football Squares. Treasury management and system oversight."

**Coach B Bot:**

- Name: `Coach B - Football Squares`
- Username: `CoachBFSQBot`
- Description: "Your friendly Football Squares coach! I'll help you play, win, and have fun!"

**OC-Phil Bot:**

- Name: `OC-Phil CBL Support`
- Username: `OCPhilBot`
- Description: "Community Board Leader specialist. Helping you build successful football squares communities."

### Step 2: Configure Bot Commands

Send these commands to BotFather for each bot:

**For Jerry:**

```
/setcommands
@JerryNotJonesBot
status - System overview
treasury - Financial status (auth required)
agents - Agent performance metrics
security - Security status
games - Active games overview
help - Available commands
```

**For Coach B:**

```
/setcommands
@CoachBFSQBot
help - How can I help you?
boards - View available boards
mysquares - Check your squares
rules - Game rules explained
winners - Recent winners
support - Get support
```

**For OC-Phil:**

```
/setcommands
@OCPhilBot
help - CBL resources
create - Create a new board
revenue - Revenue calculator
marketing - Marketing templates
bestpractices - Community tips
analytics - Board performance
```

### Step 3: Add Tokens to .env

Add these to your `.env` file (already done):

```env
TELEGRAM_JERRY_NOT_JONES_API_KEY=8283608060:AAEuO4VJXvUGc3rPCweR8ISw0_5EUgGl8Hc
TELEGRAM_COACH_B_API_KEY=8290071502:AAE4Pna8KoJ_G7w0XqhsLBmdmHJ7KlDFMyk
TELEGRAM_OC_PHIL_API_KEY=8200812544:AAHOHPP2R5KS9qLAYEup3pHQ2f_vY8lpeyc
```

## 🔒 Jerry's Authentication

Jerry requires authentication for sensitive information:

**Authentication phrase:** `The hornet stung the elephant who told Fuzzy`

When authenticated, Jerry provides access to:

- Treasury balance and projections
- Profit overflow status
- Detailed financial metrics
- Confidential system information

## 🎯 Features

### Jerry (Executive Orchestrator)

- Real-time system status monitoring
- Treasury and financial management
- Agent performance tracking
- Security threat monitoring
- Authenticated access to sensitive data

### Coach B (Player Support)

- Game rules explanation
- Board availability updates
- Square purchase assistance
- Winner announcements
- Personalized player support

### OC-Phil (CBL Support)

- Board creation guidance
- Revenue optimization strategies
- Marketing template access
- Community engagement tips
- Performance analytics

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

This uses long polling and auto-restarts on file changes.

### Testing Individual Bots

```bash
# Test connection and configuration
npm run test

# Send test message (requires chat ID)
npm run test:message
```

### Production Deployment

For production, use webhooks instead of polling:

1. Set up HTTPS endpoint (e.g., using ngrok for testing)
2. Configure webhook URL in `.env`:

```env
USE_TELEGRAM_WEBHOOKS=true
TELEGRAM_WEBHOOK_URL=https://your-domain.com
TELEGRAM_PORT=3002
```

3. Start with webhooks:

```bash
npm start
```

## 📊 Monitoring

Check bot status:

```bash
# Test all connections
npm run test

# View logs
npm run logs
```

## 🐛 Troubleshooting

### Bot Not Responding

1. **Check token validity:**

```bash
npm run test
```

2. **Verify AI API keys:**

- Ensure ANTHROPIC_API_KEY is set for Jerry
- Ensure OPENAI_API_KEY is set for Coach B
- Ensure GOOGLE_AI_API_KEY is set for OC-Phil

3. **Check network connectivity:**

- Firewall rules for Telegram API
- Proxy settings if behind corporate network

### Authentication Issues (Jerry)

If Jerry's authentication isn't working:

1. Check exact phrase match (case-sensitive)
2. Verify user ID is being stored correctly
3. Check authentication timeout settings

### Webhook Issues

If using webhooks and bots aren't receiving messages:

1. Verify HTTPS certificate is valid
2. Check webhook URL is publicly accessible
3. Use `npm run test` to see webhook status
4. Check Telegram's webhook info for errors

## 📚 API Documentation

### Telegram Bot API

- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### AI Provider APIs

- [Claude API (Anthropic)](https://docs.anthropic.com/claude/reference/getting-started)
- [OpenAI API](https://platform.openai.com/docs)
- [Gemini API (Google)](https://ai.google.dev/api/rest)

## 🔄 Integration with Main System

The bots integrate with the Football Squares system via:

1. **Shared Context Service** - Real-time system state
2. **Agent Coordination** - Jerry orchestrates other agents
3. **Treasury Management** - Financial operations
4. **Game Management** - Board and game operations

## 🚦 Status Indicators

When running, you'll see:

- 🟢 Bot online and responding
- 🟡 Bot degraded (slow responses)
- 🔴 Bot offline or errored
- 🔒 Authentication required (Jerry)
- ✅ Command successful
- ❌ Command failed

## 🛠️ Maintenance

### Daily Tasks

- Monitor bot response times
- Check error logs for issues
- Verify treasury sync (Jerry)

### Weekly Tasks

- Review chat analytics
- Update bot responses based on feedback
- Check API usage and limits

### Monthly Tasks

- Update AI model versions
- Review and optimize prompts
- Audit authentication logs (Jerry)
