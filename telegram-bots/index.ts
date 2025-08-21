/**
 * Main entry point for Football Squares Telegram Bots
 * Launches Jerry, Coach B, and OC-Phil bots
 */

import dotenv from 'dotenv';
import express from 'express';
import { launchAllBots, setupWebhooks } from './telegram-bot-handler';

// Load environment variables
dotenv.config({ path: '../.env' });

// Validate required environment variables
const requiredEnvVars = [
  'TELEGRAM_JERRY_NOT_JONES_API_KEY',
  'TELEGRAM_COACH_B_API_KEY',
  'TELEGRAM_OC_PHIL_API_KEY',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_AI_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((varName) => console.error(`  - ${varName}`));
  console.error('\nPlease add these to your .env file');
  process.exit(1);
}

// Determine if we're using webhooks or polling
const USE_WEBHOOKS = process.env.USE_TELEGRAM_WEBHOOKS === 'true';
const WEBHOOK_URL =
  process.env.TELEGRAM_WEBHOOK_URL || `https://${process.env.DOMAIN}`;
const PORT = process.env.TELEGRAM_PORT || 3002;

async function main() {
  console.log('🏈 Football Squares Telegram Bot System');
  console.log('========================================');
  console.log('Configuration:');
  console.log(`  Mode: ${USE_WEBHOOKS ? 'Webhooks' : 'Long Polling'}`);
  console.log(
    `  Jerry Bot: ${process.env.TELEGRAM_JERRY_NOT_JONES_API_KEY ? '✅' : '❌'}`,
  );
  console.log(
    `  Coach B Bot: ${process.env.TELEGRAM_COACH_B_API_KEY ? '✅' : '❌'}`,
  );
  console.log(
    `  OC-Phil Bot: ${process.env.TELEGRAM_OC_PHIL_API_KEY ? '✅' : '❌'}`,
  );
  console.log(`  Claude API: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'}`);
  console.log(`  OpenAI API: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`  Gemini API: ${process.env.GOOGLE_AI_API_KEY ? '✅' : '❌'}`);
  console.log('========================================\n');

  if (USE_WEBHOOKS) {
    // Setup webhook server
    const app = express();
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        bots: ['jerry', 'coachB', 'ocPhil'],
        mode: 'webhooks',
      });
    });

    // Webhook endpoints for each bot
    app.post('/webhook/jerry', (req, res) => {
      // Handle Jerry webhook
      console.log('Received webhook for Jerry:', req.body);
      res.sendStatus(200);
    });

    app.post('/webhook/coachB', (req, res) => {
      // Handle Coach B webhook
      console.log('Received webhook for Coach B:', req.body);
      res.sendStatus(200);
    });

    app.post('/webhook/ocPhil', (req, res) => {
      // Handle OC-Phil webhook
      console.log('Received webhook for OC-Phil:', req.body);
      res.sendStatus(200);
    });

    app.listen(PORT, async () => {
      console.log(`📡 Webhook server listening on port ${PORT}`);
      await setupWebhooks(WEBHOOK_URL);
    });
  } else {
    // Use long polling (development mode)
    await launchAllBots();
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Start the bots
main().catch((error) => {
  console.error('❌ Failed to start bot system:', error);
  process.exit(1);
});
