import { NextRequest, NextResponse } from 'next/server';
import { OCPhilBot } from '@/lib/telegram/bot';
import { TELEGRAM_CONFIG } from '@/lib/telegram/config';
import { WebhookEvent } from '@/lib/telegram/types';

export const dynamic = 'force-dynamic';

const bot = new OCPhilBot(TELEGRAM_CONFIG.BOT_TOKEN);

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret for security
    const providedSecret = request.headers.get(
      'X-Telegram-Bot-Api-Secret-Token',
    );
    if (providedSecret !== TELEGRAM_CONFIG.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the webhook payload
    const update: WebhookEvent = await request.json();

    // Handle the update with OC Phil bot
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const botInfo = await bot.getMe();
    return NextResponse.json({
      status: 'healthy',
      bot: botInfo.result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Bot connection failed' },
      { status: 503 },
    );
  }
}
