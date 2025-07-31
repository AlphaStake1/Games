export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '8200812544:AAHOHPP2R5KS9qLAYEup3pHQ2f_vY8lpeyc',
  BOT_USERNAME: '@OC_Phil_bot',

  // Chat configuration
  MAIN_GROUP_ID: process.env.TELEGRAM_MAIN_GROUP_ID,
  ANNOUNCEMENT_CHANNEL_ID: process.env.TELEGRAM_ANNOUNCEMENT_CHANNEL_ID,

  // Webhook configuration
  WEBHOOK_URL: process.env.TELEGRAM_WEBHOOK_URL,
  WEBHOOK_SECRET:
    process.env.TELEGRAM_WEBHOOK_SECRET || 'default-webhook-secret',

  // Rate limiting
  MESSAGE_RATE_LIMIT: 30, // messages per minute
  DAILY_MEMBER_ADD_LIMIT: 50, // new members per day

  // Feature flags
  ENABLE_AUTO_RESPONSES: true,
  ENABLE_BOARD_NOTIFICATIONS: true,
  ENABLE_WEEKLY_DIGEST: true,
  ENABLE_CELEBRATION_GIFS: true,
};

export const BOT_COMMANDS = [
  { command: 'start', description: 'Welcome message and setup' },
  { command: 'help', description: 'Show all available commands' },
  { command: 'stats', description: 'View your current stats' },
  { command: 'boards', description: 'View active boards' },
  { command: 'tips', description: 'Get strategy tips' },
  { command: 'celebrate', description: 'Celebrate a win!' },
];

export const CELEBRATION_GIFS = [
  'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif', // Football celebration
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // Touchdown dance
  'https://media.giphy.com/media/3oz8xQYqVWKIKigga4/giphy.gif', // Victory celebration
  'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', // Football spike
  'https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif', // End zone dance
];
