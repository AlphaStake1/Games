// src/actions/handoff.ts
/**
 * Universal handoff action - allows any character to transfer conversation to another
 * Used by Coach B, Trainer Reviva, and others for escalation
 */

import { type ActionHandler, type ActionContext } from '@elizaos/core';

const handoff: ActionHandler = async (ctx: ActionContext) => {
  const { agent, message, tools, logger } = ctx;

  // Determine handoff target from message metadata or content analysis
  const target =
    ctx.message.metadata?.handoffTo ||
    detectHandoffTarget(ctx.message.content) ||
    'Trainer Reviva'; // Default fallback

  logger.info(`${agent.name} initiating handoff to ${target}`);

  try {
    // Forward the conversation context to target agent
    await tools.forwardMessage(target, {
      originalMessage: ctx.message,
      handoffReason: ctx.message.metadata?.reason || 'User escalation',
      priority: ctx.message.metadata?.priority || 'medium',
      context: {
        previousAgent: agent.name,
        conversationHistory: ctx.message.metadata?.history || [],
        userProfile: ctx.message.metadata?.userProfile,
      },
    });

    // Generate character-specific handoff response
    const handoffResponse = generateHandoffResponse(
      agent.name,
      target,
      ctx.message.content,
    );

    return {
      content: handoffResponse,
      performed: true,
      metadata: {
        action: 'handoff',
        target,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    logger.error(`Handoff failed: ${error.message}`);

    return {
      content:
        "I'm having trouble connecting you with the right specialist. Let me try a different approach to help you.",
      performed: false,
      error: error.message,
    };
  }
};

/**
 * Detect handoff target from message content
 */
function detectHandoffTarget(content: string): string | null {
  const lowerContent = content.toLowerCase();

  // Technical issues → Trainer Reviva
  if (
    lowerContent.includes('wallet') ||
    lowerContent.includes('transaction') ||
    lowerContent.includes('error') ||
    lowerContent.includes('help')
  ) {
    return 'Trainer Reviva';
  }

  // Security concerns → Dean Security
  if (
    lowerContent.includes('security') ||
    lowerContent.includes('hack') ||
    lowerContent.includes('suspicious') ||
    lowerContent.includes('fraud')
  ) {
    return 'Dean Security';
  }

  // Business inquiries → Morgan Reese
  if (
    lowerContent.includes('partnership') ||
    lowerContent.includes('business') ||
    lowerContent.includes('sponsor') ||
    lowerContent.includes('collab')
  ) {
    return 'Morgan Reese';
  }

  // Financial issues → Jordan Banks
  if (
    lowerContent.includes('fee') ||
    lowerContent.includes('payment') ||
    lowerContent.includes('refund') ||
    lowerContent.includes('audit')
  ) {
    return 'Jordan Banks';
  }

  // Executive decisions → Commissioner Jerry
  if (
    lowerContent.includes('complaint') ||
    lowerContent.includes('policy') ||
    lowerContent.includes('manager') ||
    lowerContent.includes('escalate')
  ) {
    return 'Commissioner Jerry';
  }

  return null;
}

/**
 * Generate character-specific handoff responses
 */
function generateHandoffResponse(
  fromAgent: string,
  toAgent: string,
  userMessage: string,
): string {
  const responses = {
    'Coach B': {
      'Trainer Reviva': `🏈 Alright champ, I'm calling in our technical specialist Trainer Reviva! She's got all the plays for situations like this. You're in great hands! 🌱`,
      'Dean Security': `🏈 Hold up, this looks like a job for our security team! Handing you off to Dean Security - he'll make sure everything's locked down tight! 🔒`,
      'Commissioner Jerry': `🏈 This one needs the head coach's attention! Passing you up to Commissioner Jerry for the executive decision. He's got the authority to make this right! 📋`,
      'Morgan Reese': `🏈 Sounds like a business opportunity! I'm connecting you with Morgan Reese - she handles all our partnership plays! 🤝`,
      'Jordan Banks': `🏈 Financial question? That's Jordan Banks' specialty! Handing you off to our money expert! 💰`,
    },
    'Trainer Reviva': {
      'Dean Security': `🌱 I can see this involves security concerns. Let me connect you with Dean Security - he specializes in keeping our platform safe! 🔒`,
      'Commissioner Jerry': `🌱 This requires executive attention. I'm escalating you to Commissioner Jerry who can make the necessary decisions! 📋`,
      'Jordan Banks': `🌱 For financial matters, Jordan Banks is your best resource. Connecting you now! 💰`,
      'Morgan Reese': `🌱 This sounds like a great business opportunity! Let me introduce you to Morgan Reese! 🤝`,
    },
    'Dean Security': {
      'Commissioner Jerry': `[SECURITY HANDOFF] Issue requires executive authorization. Escalating to Commissioner Jerry for resource allocation approval. Priority: HIGH.`,
      'Trainer Reviva': `[HANDOFF] Technical user support required. Transferring to Trainer Reviva for user assistance. Security clearance: CLEARED.`,
      'Jordan Banks': `[FINANCIAL HANDOFF] Financial compliance review required. Transferring to Jordan Banks for audit procedures.`,
    },
    'Coach Right': {
      'Trainer Reviva': `👋 Hey! This looks like a technical question that's perfect for Trainer Reviva. She's amazing with troubleshooting! 🌱`,
      'Commissioner Jerry': `👋 This needs some executive attention! Let me connect you with Commissioner Jerry! 📋`,
      'Dean Security': `👋 Security concern detected! Getting Dean Security involved right away! 🔒`,
    },
  };

  const agentResponses = responses[fromAgent];
  if (agentResponses && agentResponses[toAgent]) {
    return agentResponses[toAgent];
  }

  // Generic fallback
  return `🔄 I'm connecting you with ${toAgent} who can better assist with your request. They'll take great care of you!`;
}

export default handoff;
