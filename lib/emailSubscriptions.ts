import fs from 'fs/promises';
import path from 'path';

export interface EmailSubscription {
  id: string;
  email: string;
  walletAddress: string | null;
  source: string;
  createdAt: string;
}

// File path for storing subscriptions
const SUBSCRIPTIONS_FILE = path.join(
  process.cwd(),
  'data',
  'subscriptions.json',
);

// Ensure data directory exists
async function ensureDataDirectory(): Promise<void> {
  const dataDir = path.dirname(SUBSCRIPTIONS_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Load all subscriptions from file
async function loadSubscriptions(): Promise<EmailSubscription[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Save all subscriptions to file
async function saveSubscriptions(
  subscriptions: EmailSubscription[],
): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(
    SUBSCRIPTIONS_FILE,
    JSON.stringify(subscriptions, null, 2),
  );
}

// Check if email already exists
export async function emailExists(email: string): Promise<boolean> {
  const subscriptions = await loadSubscriptions();
  return subscriptions.some(
    (sub) => sub.email.toLowerCase() === email.toLowerCase(),
  );
}

// Save a new email subscription
export async function saveEmailSubscription(
  subscription: EmailSubscription,
): Promise<void> {
  const subscriptions = await loadSubscriptions();

  // Double check for duplicates
  const exists = subscriptions.some(
    (sub) => sub.email.toLowerCase() === subscription.email.toLowerCase(),
  );
  if (exists) {
    throw new Error('Email already exists');
  }

  subscriptions.push(subscription);
  await saveSubscriptions(subscriptions);
}

// Get all subscriptions
export async function getAllSubscriptions(): Promise<EmailSubscription[]> {
  return await loadSubscriptions();
}

// Get subscriptions by source
export async function getSubscriptionsBySource(
  source: string,
): Promise<EmailSubscription[]> {
  const subscriptions = await loadSubscriptions();
  return subscriptions.filter((sub) => sub.source === source);
}

// Get subscriptions by wallet address
export async function getSubscriptionsByWallet(
  walletAddress: string,
): Promise<EmailSubscription[]> {
  const subscriptions = await loadSubscriptions();
  return subscriptions.filter((sub) => sub.walletAddress === walletAddress);
}

// Remove subscription by email
export async function removeSubscription(email: string): Promise<boolean> {
  const subscriptions = await loadSubscriptions();
  const initialLength = subscriptions.length;

  const filtered = subscriptions.filter(
    (sub) => sub.email.toLowerCase() !== email.toLowerCase(),
  );

  if (filtered.length !== initialLength) {
    await saveSubscriptions(filtered);
    return true;
  }

  return false;
}

// Get subscription analytics
export async function getSubscriptionAnalytics(): Promise<{
  total: number;
  bySource: Record<string, number>;
  byMonth: Record<string, number>;
  withWallet: number;
  withoutWallet: number;
}> {
  const subscriptions = await loadSubscriptions();

  const analytics = {
    total: subscriptions.length,
    bySource: {} as Record<string, number>,
    byMonth: {} as Record<string, number>,
    withWallet: 0,
    withoutWallet: 0,
  };

  subscriptions.forEach((sub) => {
    // Count by source
    analytics.bySource[sub.source] = (analytics.bySource[sub.source] || 0) + 1;

    // Count by month
    const month = new Date(sub.createdAt).toISOString().slice(0, 7); // YYYY-MM
    analytics.byMonth[month] = (analytics.byMonth[month] || 0) + 1;

    // Count wallet vs non-wallet
    if (sub.walletAddress) {
      analytics.withWallet++;
    } else {
      analytics.withoutWallet++;
    }
  });

  return analytics;
}
