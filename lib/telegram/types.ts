export interface WebhookEvent {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: CallbackQuery;
  channel_post?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: PhotoSize[];
  document?: Document;
  sticker?: Sticker;
  reply_to_message?: TelegramMessage;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  description?: string;
}

export interface CallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface PhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface Document {
  file_id: string;
  file_unique_id: string;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface Sticker {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  is_animated: boolean;
  thumb?: PhotoSize;
  emoji?: string;
  set_name?: string;
  file_size?: number;
}

export interface CBLTelegramUser {
  userId: string;
  telegramId: number;
  telegramUsername?: string;
  chatId: number;
  subscriptions: {
    boardUpdates: boolean;
    weeklyDigest: boolean;
    celebrations: boolean;
    tips: boolean;
  };
  tier: 'First Stream' | 'Drive Maker' | 'Franchise';
  joinedAt: Date;
  lastActive: Date;
}

export interface BoardEvent {
  type:
    | 'board_created'
    | 'board_filled'
    | 'square_purchased'
    | 'game_completed';
  boardId: string;
  cblUserId: string;
  cblUsername: string;
  gameInfo?: string;
  prizeAmount?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TelegramConfig {
  bot_token: string;
  webhook_url?: string;
  webhook_secret?: string;
  group_chat_id?: string;
  announcement_channel_id?: string;
}
