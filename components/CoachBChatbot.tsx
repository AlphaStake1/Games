'use client';

import { useState, useCallback } from 'react';
import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';
import { 
  EnhancedBot, 
  BotPersonality, 
  EnhancedBotConfig 
} from '@/lib/enhanced-conversation-engine';

// Enhanced Knowledge Base for Coach B
const coachBKnowledgeBase = (userMessage: string) => {
  const message = userMessage.toLowerCase();

  // Cryptocurrency and Solana expertise
  if (
    message.includes('crypto') ||
    message.includes('cryptocurrency') ||
    message.includes('bitcoin') ||
    message.includes('solana') ||
    message.includes('sol') ||
    message.includes('defi') ||
    message.includes('nft')
  ) {
    // Advanced crypto responses based on specific queries
    if (message.includes('buy') && message.includes('sol')) {
      return {
        response: "Ready to get some SOL? 💪 Here's the winning play:\n\n**Best Options:**\n• **Coinbase/Binance**: Easy for beginners, higher fees\n• **Jupiter Exchange**: DEX with best rates, need existing SOL\n• **Phantom Wallet**: Built-in buy feature, decent rates\n\n**Pro Tips:**\n• Start with $10-20 to test everything\n• Always keep 0.1 SOL for transaction fees\n• DCA (dollar-cost averaging) beats timing the market\n\nWhich route feels right for your situation?",
        topics: ['crypto', 'solana', 'buying']
      };
    }

    if (message.includes('wallet') && (message.includes('setup') || message.includes('create'))) {
      return {
        response: "Wallet setup is your foundation - let's build it right! 🛠️\n\n**The Coach B Method:**\n1. **Download Phantom** - Most user-friendly for Solana\n2. **Create wallet** - Write down that seed phrase by HAND\n3. **Secure it** - Multiple copies, never digital photos\n4. **Test with small amount** - Send yourself $5 first\n\n**Security Mindset:** Your seed phrase = your keys to the kingdom. Treat it like cash - because it IS cash.\n\nWant me to walk through any specific step?",
        topics: ['wallet', 'security', 'phantom']
      };
    }

    return {
      response: "Crypto questions are my specialty! 🚀 Solana's ecosystem is incredible - fast, cheap, and growing every day. Whether it's understanding DeFi, managing your wallet, or optimizing transaction strategies, I've got insights that'll give you an edge.\n\nWhat specific aspect interests you most?",
      topics: ['crypto', 'solana', 'defi']
    };
  }

  // Game strategy and advanced squares tactics
  if (
    message.includes('strategy') ||
    message.includes('win') ||
    message.includes('pick') ||
    message.includes('choose') ||
    message.includes('best numbers')
  ) {
    return {
      response: "Now we're talking strategy! 🎯 Here's some insider knowledge:\n\n**The Math Behind Winning:**\n• Numbers 0, 3, 7 appear ~24% more in final scores\n• Avoid 5s and 8s - they're statistically rare\n• Corner squares (0,0) (0,9) get hot in blowouts\n• Middle squares catch close games\n\n**Advanced Tactics:**\n• Buy squares in batches - diversify your exposure\n• Target boards with 70-85 squares filled (optimal odds)\n• Quarter timing matters - 1st quarter is pure chaos\n\n**Psychology Game:** Everyone wants 0,7 combos. Sometimes the \"bad\" numbers surprise you!\n\nWhat's your current strategy? Let's optimize it!",
      topics: ['strategy', 'statistics', 'squares']
    };
  }

  // Token transfer questions
  if (
    message.includes('transfer') ||
    message.includes('send') ||
    message.includes('tokens') ||
    message.includes('transaction')
  ) {
    return {
      response:
        "Token transfers on Solana are super fast! ⚡ Here's what you need to know:\n\n• Transactions typically cost less than $0.01\n• They complete in seconds\n• Always double-check the recipient address\n• Keep some SOL for transaction fees\n\nWant to practice? Try sending a small amount first!",
      relatedTopics: [
        'transaction fees',
        'wallet security',
        'SOL requirements',
      ],
    };
  }

  // Squares game questions
  if (
    message.includes('squares') ||
    message.includes('game') ||
    message.includes('how to play') ||
    message.includes('rules') ||
    message.includes('payout')
  ) {
    return {
      response:
        "Football Squares is awesome! 🏈 Here's how it works:\n\n• Buy squares on a 10x10 grid (100 total)\n• Each square gets random numbers 0-9 for each team\n• Winners are determined by the last digit of each team's score\n• Payouts happen after each quarter!\n\nWe use blockchain for verifiable randomness and automatic payouts. Check our 'How To Play' and 'Rules' pages for full details!",
      relatedTopics: ['game rules', 'payouts', 'randomness', 'buying squares'],
    };
  }

  // Fantasy Football general questions
  if (
    message.includes('fantasy') ||
    message.includes('draft') ||
    message.includes('lineup') ||
    message.includes('waiver') ||
    message.includes('sleeper') ||
    message.includes('espn')
  ) {
    return {
      response:
        "I love fantasy football! 🏆 I can help with basic strategy and how it relates to our Squares game. For detailed analysis, current news, and expert advice, I'd recommend checking out:\n\n• ESPN Fantasy\n• Yahoo Fantasy\n• Sleeper app\n• FantasyPros\n\nOur Fantasy section has great integration tips for using fantasy insights in Squares strategy!",
      relatedTopics: [
        'fantasy platforms',
        'draft strategy',
        'squares strategy',
      ],
    };
  }

  // Site navigation questions
  if (
    message.includes('navigate') ||
    message.includes('find') ||
    message.includes('page') ||
    message.includes('where')
  ) {
    return {
      response:
        "I can help you find what you're looking for! 🧭 Here are our main sections:\n\n• How To Play - Learn the basics\n• Rules - Detailed game rules\n• Fantasy - Strategy guides\n• My NFTs - Your collectibles\n• FAQ - Common questions\n• Wallet Guide - Setup help\n\nWhat specific section interests you?",
      relatedTopics: ['game rules', 'wallet setup', 'fantasy strategy'],
    };
  }

  // NFT questions
  if (
    message.includes('nft') ||
    message.includes('collectible') ||
    message.includes('digital')
  ) {
    return {
      response:
        "NFTs are digital collectibles! 🎨 On our platform, you might earn special NFT rewards for achievements or participation. They're stored in your wallet and prove ownership on the blockchain. Check out our 'What are NFTs?' and 'My NFTs' sections to learn more!",
      relatedTopics: ['wallet storage', 'blockchain ownership', 'rewards'],
    };
  }

  // Help/support questions
  if (
    message.includes('help') ||
    message.includes('support') ||
    message.includes('problem') ||
    message.includes('issue')
  ) {
    return {
      response:
        "I'm here to help! 🤝 For technical issues, check our Technical Support page. For questions about crypto or our game, keep asking me! For detailed fantasy football analysis and current news, I'd point you to dedicated fantasy sites like ESPN or Yahoo Fantasy.",
      relatedTopics: ['technical support', 'contact', 'FAQ'],
    };
  }

  // Troubleshooting and technical issues
  if (
    message.includes('problem') ||
    message.includes('error') ||
    message.includes('not working') ||
    message.includes('stuck') ||
    message.includes('help')
  ) {
    return {
      response: "Technical issues happen - let's get you back in the game! 🔧\n\n**Quick Diagnostic:**\n• What exactly isn't working?\n• Any error messages?\n• When did it start?\n\n**Common Fixes:**\n✅ **Wallet Issues**: Disconnect & reconnect, check network\n✅ **Slow Loading**: Clear cache, try incognito mode\n✅ **Transaction Problems**: Check SOL balance for fees\n✅ **Connection Issues**: Verify RPC settings\n\nI can walk you through step-by-step fixes. What symptoms are you seeing?",
      topics: ['troubleshooting', 'technical', 'support']
    };
  }

  // Default intelligent response
  return {
    response: "Hey there! I'm Coach B - your crypto-savvy squares strategist! 🏈⚡\n\nI bring deep knowledge in:\n• **Crypto & Solana ecosystem** - from wallets to DeFi\n• **Squares strategy** - statistical analysis and winning tactics\n• **Technical troubleshooting** - getting you unstuck fast\n• **Fantasy football insights** - leveraging data for better picks\n\nI'm here to give you an edge, whether you're new to crypto or optimizing your game strategy. What's your biggest challenge right now?",
    topics: ['introduction', 'crypto', 'strategy', 'support']
  };
};

// Coach B Personality Definition
const coachBPersonality: BotPersonality = {
  name: 'Coach B',
  traits: {
    formality: 'friendly',
    humor: 'witty',
    supportStyle: 'coaching',
    expertise: ['cryptocurrency', 'solana', 'football squares', 'strategy', 'troubleshooting']
  },
  responsePatterns: {
    greeting: [
      "What's the play today?",
      "Ready to level up your game?", 
      "Let's tackle this together!",
      "Time to make some winning moves!"
    ],
    encouragement: [
      "You're on the right track!",
      "That's exactly the kind of thinking that wins games!",
      "Great question - shows you're thinking strategically!",
      "Now you're playing with power!"
    ],
    confusion: [
      "Let me break that down differently...",
      "No worries, this stuff can be complex...", 
      "Think of it this way...",
      "Here's the simple version..."
    ],
    success: [
      "Touchdown! 🏈",
      "That's how winners think!",
      "Perfect execution!",
      "You're getting the hang of this!"
    ]
  }
};

// Enhanced Bot Configuration
const enhancedCoachBConfig: EnhancedBotConfig = {
  name: 'Coach B',
  personality: coachBPersonality,
  knowledgeBase: coachBKnowledgeBase
};

// Legacy wrapper function for ChatCore compatibility
const getCoachBResponse = (userMessage: string): KnowledgeResponse => {
  const [enhancedBot] = useState(() => new EnhancedBot(enhancedCoachBConfig));
  const sessionId = 'coach-b-session'; // Simple session for now
  
  try {
    const enhancedResponse = enhancedBot.processMessage(userMessage, sessionId);
    return {
      response: enhancedResponse.response,
      relatedTopics: enhancedResponse.relatedTopics || []
    };
  } catch (error) {
    console.error('Enhanced conversation error:', error);
    // Fallback to basic response
    return coachBKnowledgeBase(userMessage);
  }
};

const coachBConfig: ChatbotConfig = {
  name: 'Coach B',
  title: 'Football Squares Maestro',
  description: 'Crypto Squares Maestro',
  avatarSrc: '/Assets/Coach B with light red shirt.png',
  avatarAlt: 'Coach B',
  fallbackInitial: 'B',
  initialMessage:
    "Hey there! I'm Coach B, your Football Squares assistant! 🏈 I can help you with cryptocurrency, wallet setup, token transfers, how our Squares game works, and general fantasy football questions. What would you like to know?",
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-purple-600',
  avatarButtonSize: 80,
  avatarButtonOffsetY: -20,
  getResponse: getCoachBResponse,
};

const CoachBChatbot = () => {
  return <ChatCore config={coachBConfig} />;
};

export default CoachBChatbot;
