'use client';

import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';

// Knowledge base for Coach B responses
const getCoachBResponse = (userMessage: string): KnowledgeResponse => {
  const message = userMessage.toLowerCase();

  // Cryptocurrency related questions
  if (
    message.includes('crypto') ||
    message.includes('cryptocurrency') ||
    message.includes('bitcoin') ||
    message.includes('solana') ||
    message.includes('sol')
  ) {
    return {
      response:
        'Great question about cryptocurrency! 🪙 Our platform runs on Solana, which offers fast transactions and low fees. Crypto allows for transparent, automated payouts and verifiable fairness in our games. Need help with wallet setup or buying SOL?',
      relatedTopics: ['wallet setup', 'buying SOL', 'transaction fees'],
    };
  }

  // Wallet setup questions
  if (
    message.includes('wallet') ||
    message.includes('phantom') ||
    message.includes('setup') ||
    message.includes('connect wallet')
  ) {
    return {
      response:
        "Setting up a wallet is easy! 💳 I recommend Phantom Wallet for Solana. Here's what you need to do:\n\n1. Download Phantom from phantom.app\n2. Create a new wallet and save your seed phrase safely\n3. Add some SOL to your wallet\n4. Connect it to our site using the 'Connect Wallet' button\n\nNeed our detailed wallet guide? Check out the 'Need a Wallet?' link in the header!",
      relatedTopics: ['buying SOL', 'security tips', 'connecting wallet'],
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

  // Default response
  return {
    response:
      "That's a great question! 🤔 I specialize in helping with:\n\n• Cryptocurrency and Solana\n• Wallet setup and connections\n• How our Football Squares game works\n• Basic fantasy football strategy\n\nFor detailed fantasy analysis and current NFL news, I'd recommend visiting ESPN Fantasy, Yahoo Fantasy, or other dedicated fantasy sites. What specific topic can I help you with?",
    relatedTopics: [
      'crypto basics',
      'wallet help',
      'game rules',
      'fantasy basics',
    ],
  };
};

const coachBConfig: ChatbotConfig = {
  name: 'Coach B',
  title: 'Football Squares Maestro',
  description: 'Football Squares Maestro',
  avatarSrc: '/Assets/Coach B with light red shirt.png',
  avatarAlt: 'Coach B',
  fallbackInitial: 'B',
  initialMessage:
    "Hey there! I'm Coach B, your Football Squares assistant! 🏈 I can help you with cryptocurrency, wallet setup, token transfers, how our Squares game works, and general fantasy football questions. What would you like to know?",
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-purple-600',
  // Elevate avatar so it "pops out" of the pill like Coach 101
  avatarButtonSize: 76,
  avatarButtonOffsetY: -10,
  avatarButtonRounded: false,
  getResponse: getCoachBResponse,
};

const CoachBChatbot = () => {
  return <ChatCore config={coachBConfig} />;
};

export default CoachBChatbot;
