// src/actions/flagToxicUser.ts
/**
 * Dean Security action - flags and moderates toxic users
 * Integrates with toxicity detection and platform moderation tools
 */

// import { type ActionHandler, type ActionContext } from '@elizaos/core';
// Note: These types may not be available in the current ElizaOS version

// Define types locally
type ActionHandler = (ctx: ActionContext) => Promise<any>;
type ActionContext = {
  message: any;
  user: any;
  platform: string;
  [key: string]: any;
};

interface ToxicityScore {
  overall: number;
  categories: {
    harassment: number;
    spam: number;
    hate_speech: number;
    threats: number;
    inappropriate: number;
  };
  confidence: number;
}

const flagToxicUser: ActionHandler = async (ctx: ActionContext) => {
  const { agent, message, tools, logger } = ctx;

  logger.info(
    `Dean Security analyzing message for toxicity: ${message.userId}`,
  );

  try {
    // Analyze message toxicity using AI moderation
    const toxicityScore = await analyzeToxicity(
      message.content,
      message.attachments,
    );

    // Check if user has previous violations
    const userHistory = await tools.getUserModerationHistory(message.userId);

    // Determine action based on score and history
    const moderationAction = determineModerationAction(
      toxicityScore,
      userHistory,
    );

    if (moderationAction.action !== 'none') {
      // Execute moderation action
      await executeModerationAction(moderationAction, message, tools);

      // Notify community moderators
      await notifyModerators(moderationAction, message, tools);

      // Log security incident
      await logSecurityIncident(
        moderationAction,
        toxicityScore,
        message,
        tools,
      );

      return {
        content: generateModerationResponse(moderationAction, toxicityScore),
        performed: true,
        metadata: {
          action: 'flagToxicUser',
          moderationAction: moderationAction.action,
          toxicityScore: toxicityScore.overall,
          timestamp: new Date().toISOString(),
        },
      };
    }

    // No action needed - clean message
    return {
      content: null, // Silent - no response needed for clean messages
      performed: true,
      metadata: {
        action: 'flagToxicUser',
        moderationAction: 'none',
        toxicityScore: toxicityScore.overall,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    logger.error(
      `Toxicity analysis failed: ${error instanceof Error ? error.message : String(error)}`,
    );

    // Default to manual review on system failure
    await tools.flagForManualReview(
      message.userId,
      'System error during toxicity analysis',
    );

    return {
      content:
        '[SYSTEM] Message flagged for manual review due to analysis error.',
      performed: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Analyze message toxicity using AI moderation
 */
async function analyzeToxicity(
  content: string,
  attachments?: any[],
): Promise<ToxicityScore> {
  // Simulate toxicity analysis - in production would use:
  // - OpenAI Moderation API
  // - Google Perspective API
  // - Custom trained models

  const lowerContent = content.toLowerCase();
  let score = 0;

  const categories = {
    harassment: 0,
    spam: 0,
    hate_speech: 0,
    threats: 0,
    inappropriate: 0,
  };

  // Basic keyword detection (production would use ML models)
  const harassmentWords = ['stupid', 'idiot', 'loser', 'pathetic'];
  const spamWords = ['buy now', 'limited time', 'click here', 'free money'];
  const hateWords = ['hate', 'disgusting', 'worthless'];
  const threatWords = ['kill', 'destroy', 'hurt', 'attack'];
  const inappropriateWords = ['scam', 'fraud', 'steal'];

  harassmentWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      categories.harassment += 0.3;
      score += 0.3;
    }
  });

  spamWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      categories.spam += 0.4;
      score += 0.4;
    }
  });

  hateWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      categories.hate_speech += 0.5;
      score += 0.5;
    }
  });

  threatWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      categories.threats += 0.8;
      score += 0.8;
    }
  });

  inappropriateWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      categories.inappropriate += 0.4;
      score += 0.4;
    }
  });

  // Check for excessive caps (spam indicator)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7) {
    categories.spam += 0.3;
    score += 0.3;
  }

  // Check for repeated characters (spam indicator)
  if (/(.)\1{4,}/.test(content)) {
    categories.spam += 0.2;
    score += 0.2;
  }

  return {
    overall: Math.min(1.0, score),
    categories,
    confidence: 0.85, // Simplified confidence score
  };
}

/**
 * Determine appropriate moderation action
 */
function determineModerationAction(score: ToxicityScore, userHistory: any) {
  const violationCount = userHistory?.violations?.length || 0;

  // High toxicity or threats = immediate action
  if (score.overall >= 0.8 || score.categories.threats >= 0.6) {
    return {
      action: violationCount >= 2 ? 'ban' : 'timeout',
      duration: violationCount >= 2 ? 'permanent' : '24h',
      reason: 'High toxicity detected',
      severity: 'high',
    };
  }

  // Medium toxicity = warning or timeout
  if (score.overall >= 0.5) {
    return {
      action: violationCount >= 1 ? 'timeout' : 'warn',
      duration: violationCount >= 1 ? '6h' : 'none',
      reason: 'Inappropriate content detected',
      severity: 'medium',
    };
  }

  // Low toxicity = warning only
  if (score.overall >= 0.3) {
    return {
      action: 'warn',
      duration: 'none',
      reason: 'Content may be inappropriate',
      severity: 'low',
    };
  }

  // Clean message
  return {
    action: 'none',
    duration: 'none',
    reason: 'Content approved',
    severity: 'none',
  };
}

/**
 * Execute the moderation action
 */
async function executeModerationAction(action: any, message: any, tools: any) {
  switch (action.action) {
    case 'warn':
      await tools.sendDirectMessage(
        message.userId,
        `⚠️ Warning: Your recent message may violate our community guidelines. Please keep discussions respectful.`,
      );
      break;

    case 'timeout':
      await tools.timeoutUser(message.userId, action.duration);
      await tools.deleteMessage(message.messageId);
      await tools.sendDirectMessage(
        message.userId,
        `🔇 You have been temporarily muted for ${action.duration} due to inappropriate content. Reason: ${action.reason}`,
      );
      break;

    case 'ban':
      await tools.banUser(message.userId);
      await tools.deleteMessage(message.messageId);
      await tools.sendDirectMessage(
        message.userId,
        `🚫 You have been banned from the platform. Reason: ${action.reason}. Contact support if you believe this was an error.`,
      );
      break;
  }
}

/**
 * Notify community moderators
 */
async function notifyModerators(action: any, message: any, tools: any) {
  if (action.severity === 'high') {
    await tools.sendMessage(
      'Coach Right',
      `🚨 High severity moderation action taken:\n` +
        `User: ${message.username}\n` +
        `Action: ${action.action}\n` +
        `Reason: ${action.reason}\n` +
        `Message: "${message.content.substring(0, 100)}..."`,
    );
  }
}

/**
 * Log security incident
 */
async function logSecurityIncident(
  action: any,
  score: ToxicityScore,
  message: any,
  tools: any,
) {
  await tools.logSecurityEvent({
    type: 'toxicity_moderation',
    userId: message.userId,
    action: action.action,
    toxicityScore: score.overall,
    categories: score.categories,
    reason: action.reason,
    timestamp: new Date().toISOString(),
    messageContent: message.content,
    platform: message.platform,
  });
}

/**
 * Generate moderation response message
 */
function generateModerationResponse(action: any, score: ToxicityScore): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  switch (action.action) {
    case 'warn':
      return `[${timestamp}] MODERATION WARNING issued. Toxicity score: ${(score.overall * 100).toFixed(1)}%. User advised of guidelines.`;

    case 'timeout':
      return `[${timestamp}] TIMEOUT enforced - ${action.duration}. Toxicity score: ${(score.overall * 100).toFixed(1)}%. Content removed.`;

    case 'ban':
      return `[${timestamp}] BAN executed. Toxicity score: ${(score.overall * 100).toFixed(1)}%. Severe violation detected. User removed from platform.`;

    default:
      return `[${timestamp}] Content analyzed. No action required.`;
  }
}

export default flagToxicUser;
