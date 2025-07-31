// src/actions/troubleshootWallet.ts
/**
 * Trainer Reviva action - troubleshoots wallet connection issues
 * Integrates with Fry diagnostics for comprehensive wallet support
 */

import { type ActionHandler, type ActionContext } from '@elizaos/core';

const troubleshootWallet: ActionHandler = async (ctx: ActionContext) => {
  const { agent, message, tools, logger } = ctx;

  logger.info(
    `Trainer Reviva troubleshooting wallet for user: ${message.userId}`,
  );

  try {
    // Get wallet diagnostic information from Fry backend
    const fryDiagnosis = await tools.requestFryDiagnostic({
      type: 'wallet',
      walletAddress: message.metadata?.walletAddress,
      errorMessage: message.content,
      userAgent: message.metadata?.userAgent,
      platform: message.platform,
    });

    // Analyze the issue based on Fry's findings
    const troubleshootingSteps = generateTroubleshootingSteps(
      fryDiagnosis,
      message,
    );

    // Provide empathetic, step-by-step guidance
    const revivaResponse = generateRevivaWalletResponse(
      fryDiagnosis,
      troubleshootingSteps,
    );

    // Track support interaction
    await tools.logSupportInteraction({
      characterId: 'Trainer_Reviva',
      userId: message.userId,
      issueType: 'wallet_troubleshooting',
      resolution: fryDiagnosis.status,
      steps: troubleshootingSteps.length,
      timestamp: new Date().toISOString(),
    });

    return {
      content: revivaResponse,
      performed: true,
      metadata: {
        action: 'troubleshootWallet',
        diagnosticStatus: fryDiagnosis.status,
        stepsProvided: troubleshootingSteps.length,
        escalationNeeded: fryDiagnosis.systemIssue,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    logger.error(`Wallet troubleshooting failed: ${error.message}`);

    return {
      content:
        "Oh no! 😔 I'm having a technical hiccup while trying to diagnose your wallet issue. " +
        'Let me get our backend specialist Fry to take a look. In the meantime, try refreshing ' +
        "your browser and reconnecting your wallet. I'll be right back to help! 🌱",
      performed: false,
      error: error.message,
    };
  }
};

/**
 * Generate troubleshooting steps based on Fry's diagnosis
 */
function generateTroubleshootingSteps(
  diagnosis: any,
  message: any,
): Array<{ step: number; instruction: string; technical: string }> {
  const steps = [];

  if (diagnosis?.findings?.includes('Wallet provider not detected')) {
    steps.push({
      step: 1,
      instruction:
        "First, let's make sure your wallet extension is installed and enabled",
      technical:
        'Check browser extensions for wallet provider (Phantom, MetaMask, etc.)',
    });
  }

  if (diagnosis?.findings?.includes('Network mismatch detected')) {
    steps.push({
      step: steps.length + 1,
      instruction:
        "Your wallet is connected to the wrong network - let's switch it to Solana Mainnet",
      technical: 'Switch wallet network to Solana Mainnet (chainId: 101)',
    });
  }

  if (diagnosis?.findings?.includes('Connection timeout')) {
    steps.push({
      step: steps.length + 1,
      instruction: "There's a connection timeout - let's refresh and try again",
      technical: 'Clear browser cache and retry wallet connection',
    });
  }

  if (diagnosis?.findings?.includes('Insufficient balance')) {
    steps.push({
      step: steps.length + 1,
      instruction:
        "You'll need some SOL in your wallet to pay for transaction fees",
      technical: 'Add minimum 0.01 SOL for transaction fees',
    });
  }

  // Default troubleshooting steps if no specific issues detected
  if (steps.length === 0) {
    steps.push(
      {
        step: 1,
        instruction:
          "Let's start fresh - please disconnect and reconnect your wallet",
        technical: 'Force wallet disconnection and re-authentication',
      },
      {
        step: 2,
        instruction: "Make sure you're on the Solana network",
        technical: 'Verify network configuration',
      },
      {
        step: 3,
        instruction: 'Try refreshing the page if the connection is still stuck',
        technical: 'Clear session state and reload',
      },
    );
  }

  return steps;
}

/**
 * Generate Trainer Reviva's empathetic wallet response
 */
function generateRevivaWalletResponse(diagnosis: any, steps: any[]): string {
  let response =
    "Hey there! 🌱 I can see you're having some wallet trouble - don't worry, we'll get this sorted out together!\n\n";

  // Add diagnosis summary
  if (diagnosis?.issue) {
    response += `I've analyzed what's happening: ${diagnosis.issue}\n\n`;
  }

  // Add system issue notification if present
  if (diagnosis?.systemIssue) {
    response +=
      "🔧 I also noticed this might be related to something on our end. I'm already working with our backend team to fix that!\n\n";
  }

  // Add step-by-step instructions
  response += "Here's what we can try right now:\n\n";

  steps.forEach((step, index) => {
    response += `**Step ${step.step}**: ${step.instruction}\n`;
    if (index < steps.length - 1) response += '\n';
  });

  // Add encouraging conclusion
  response +=
    "\n\nTake your time with each step, and let me know how it goes! If you get stuck anywhere, just describe what you're seeing and I'll guide you through it. ";

  // Add escalation note if needed
  if (diagnosis?.escalationNeeded) {
    response +=
      "If these steps don't work, I might need to bring in Dean Security to take a deeper look at what's happening. ";
  }

  response += "You've got this! 💪✨";

  return response;
}

export default troubleshootWallet;
