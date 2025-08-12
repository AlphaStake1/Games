'use client';

import React from 'react';
import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletStore } from '@/stores/walletStore';

// Knowledge base for Coach 101 - Wallet Guide Assistant
const getCoach101Response = (userMessage: string): KnowledgeResponse => {
  const message = userMessage.toLowerCase();

  // Greetings and introduction
  if (
    message.includes('hello') ||
    message.includes('hi') ||
    message.includes('hey') ||
    message.includes('start')
  ) {
    return {
      response:
        "Welcome! 👋 I'm Coach 101, your personal wallet setup guide! I'll walk you through getting started with SOL step-by-step. Are you:\n\n1️⃣ New to crypto wallets?\n2️⃣ Have a wallet but need SOL?\n3️⃣ Ready to connect and play?\n\nJust type the number or tell me where you're at!",
      relatedTopics: ['wallet setup', 'buying SOL', 'connecting wallet'],
    };
  }

  // New to crypto
  if (
    message.includes('new') ||
    message.includes('beginner') ||
    message.includes('1') ||
    message.includes('first time')
  ) {
    return {
      response:
        "Perfect! Let's start from the beginning. 🚀\n\nFirst, you'll need a crypto wallet - think of it like a digital bank account for your SOL.\n\n📱 I recommend Phantom Wallet because:\n• It's user-friendly\n• Works great with our platform\n• Has built-in SOL purchasing\n\nReady to install Phantom? Just click 'Install Phantom Wallet' above, or ask me for help with any step!",
      relatedTopics: ['install Phantom', 'what is a wallet', 'security tips'],
    };
  }

  // Installing Phantom
  if (
    message.includes('install') ||
    message.includes('phantom') ||
    message.includes('download')
  ) {
    return {
      response:
        "Let's get Phantom installed! 🎯\n\n**Desktop:**\n1. Visit phantom.app\n2. Click 'Download' for your browser\n3. Add the extension\n4. Click the puzzle piece icon and pin Phantom\n\n**Mobile:**\n1. Download from App Store or Google Play\n2. Open the app\n3. Create a new wallet\n\n⚠️ IMPORTANT: When you create your wallet, you'll get a 'recovery phrase'. Write it down on paper and keep it safe - never share it with anyone!",
      relatedTopics: ['recovery phrase', 'password setup', 'next steps'],
    };
  }

  // Recovery phrase / Security
  if (
    message.includes('recovery') ||
    message.includes('seed') ||
    message.includes('phrase') ||
    message.includes('security')
  ) {
    return {
      response:
        "🔐 Your recovery phrase is SUPER important!\n\n**DO:**\n✅ Write it on paper (not digital)\n✅ Store in a safe place\n✅ Keep multiple copies in different locations\n\n**DON'T:**\n❌ Screenshot it\n❌ Email it to yourself\n❌ Share with ANYONE (even 'support')\n❌ Store in cloud/phone notes\n\nAnyone with your phrase can access your wallet forever. Phantom will NEVER ask for it!",
      relatedTopics: ['wallet safety', 'scam prevention', 'backup tips'],
    };
  }

  // Buying SOL
  if (
    message.includes('buy') ||
    message.includes('sol') ||
    message.includes('purchase') ||
    message.includes('2')
  ) {
    return {
      response:
        "Time to get some SOL! 💰\n\n**Easiest way (in Phantom):**\n1. Open your Phantom wallet\n2. Click the 'Buy' button\n3. Choose $20 worth (about 0.1 SOL)\n4. Pick a payment provider:\n   • MoonPay (most states)\n   • Coinbase Pay (all 50 states)\n   • Transak\n\n**Alternative methods:**\n• Buy on Coinbase/Kraken → transfer to Phantom\n• Have Bitcoin? Can convert it (see alternatives above)\n\nWhich method works best for you?",
      relatedTopics: ['payment methods', 'how much SOL', 'transfer help'],
    };
  }

  // How much SOL needed
  if (
    message.includes('how much') ||
    message.includes('amount') ||
    message.includes('cost')
  ) {
    return {
      response:
        'Great question! 💵\n\n**Recommended starting amount:**\n• 0.1 SOL (~$20)\n• This covers several game entries + fees\n• Transaction fees are tiny (~$0.01)\n\n**Why SOL?**\n⚡ Lightning fast (seconds)\n💸 Super low fees\n🎮 Perfect for gaming\n\nYou can always add more later if needed. Ready to buy?',
      relatedTopics: ['buy SOL', 'transaction fees', 'top up later'],
    };
  }

  // State restrictions
  if (
    message.includes('state') ||
    message.includes('restricted') ||
    message.includes('not available') ||
    message.includes('ny') ||
    message.includes('texas') ||
    message.includes('louisiana')
  ) {
    return {
      response:
        'In a restricted state? No problem! 🗺️\n\n**Alternative options:**\n\n1️⃣ **Exchange Method:**\n• Sign up for Coinbase or Kraken\n• Buy SOL with USD\n• Withdraw to your Phantom address\n\n2️⃣ **Have Bitcoin?**\n• Transfer from Cash App to exchange\n• Trade BTC → SOL\n• Send to Phantom\n\n3️⃣ **Friend Transfer:**\n• Have someone send you SOL\n• Share your Phantom address\n\nNeed help with any of these methods?',
      relatedTopics: ['exchange setup', 'bitcoin conversion', 'wallet address'],
    };
  }

  // Cash App / Bitcoin
  if (
    message.includes('cash app') ||
    message.includes('bitcoin') ||
    message.includes('btc')
  ) {
    return {
      response:
        "Have Bitcoin in Cash App? Here's how to get SOL: 🔄\n\n**Option 1 (Safer):**\n1. Send BTC to Coinbase/Kraken\n2. Sell BTC for USD\n3. Buy SOL with USD\n4. Withdraw to Phantom\n\n**Option 2 (Faster but riskier):**\n1. Use a swap service like ChangeNOW\n2. Send small test amount first!\n3. Paste your Phantom SOL address\n4. Complete swap\n\n⚠️ Always test with small amounts first and verify URLs!",
      relatedTopics: ['exchange transfer', 'swap risks', 'test transactions'],
    };
  }

  // Connecting wallet
  if (
    message.includes('connect') ||
    message.includes('3') ||
    message.includes('link') ||
    message.includes('ready')
  ) {
    return {
      response:
        "Awesome, let's connect your wallet! 🔗\n\n**Steps:**\n1. Make sure Phantom is unlocked\n2. Click 'Connect Wallet' on our site\n3. Select 'Phantom'\n4. Approve the connection\n\n**Checklist:**\n✅ Phantom installed?\n✅ Wallet created?\n✅ Have some SOL?\n\nIf yes to all, you're ready to play! If not, let me know what you need help with.",
      relatedTopics: ['troubleshooting', 'play now', 'check balance'],
    };
  }

  // Balance check
  if (
    message.includes('balance') ||
    message.includes('check') ||
    message.includes('how much do i have')
  ) {
    return {
      response:
        "Let's check your SOL balance! 💳\n\n**In Phantom:**\n• Open your wallet\n• Your SOL balance shows at the top\n• Should see something like '0.1 SOL'\n\n**On our site:**\n• Once connected, balance shows in header\n• Need at least 0.05 SOL to play\n• Keep ~0.001 SOL for fees\n\nWhat's your current balance? I can help if it's low!",
      relatedTopics: ['add more SOL', 'minimum needed', 'top up'],
    };
  }

  // Troubleshooting
  if (
    message.includes('problem') ||
    message.includes('not working') ||
    message.includes('error') ||
    message.includes('help')
  ) {
    return {
      response:
        "Let's fix that! 🛠️ Common issues:\n\n**Can't see Phantom?**\n• Check browser extensions\n• Try refreshing the page\n• Make sure it's pinned to toolbar\n\n**Can't connect?**\n• Unlock Phantom first\n• Check you're on the right network\n• Try disconnecting and reconnecting\n\n**Transaction failing?**\n• Need ~0.001 SOL for fees\n• Check your balance\n\nWhat specific issue are you having?",
      relatedTopics: ['specific error', 'contact support', 'restart setup'],
    };
  }

  // Ready to play
  if (
    message.includes('play') ||
    message.includes('done') ||
    message.includes('finished') ||
    message.includes('complete')
  ) {
    return {
      response:
        "Fantastic! You're all set! 🎉\n\n**Quick checklist:**\n✅ Phantom installed\n✅ Wallet connected\n✅ SOL in wallet (0.05+ recommended)\n\n**Ready to play?**\n• Click 'Play Now' button\n• Choose your squares\n• Confirm transaction in Phantom\n• You're in the game!\n\nGood luck! 🏈 Need anything else before you start?",
      relatedTopics: ['game rules', 'how squares work', 'payouts'],
    };
  }

  // Progress check
  if (
    message.includes('where am i') ||
    message.includes('status') ||
    message.includes('progress')
  ) {
    return {
      response:
        "Let me check your progress! 📊\n\nLook at the progress indicator above. You should see:\n\n🟢 Green checkmarks for completed steps\n🟡 Yellow for in-progress\n⚪ Gray for not started\n\nWhich step are you on?\n1️⃣ Wallet Installed\n2️⃣ Wallet Connected\n3️⃣ Funded with SOL\n4️⃣ Ready to Play\n\nTell me the number and I'll help you move forward!",
      relatedTopics: ['current step', 'next action', 'skip ahead'],
    };
  }

  // Default response
  return {
    response:
      "I'm Coach 101, your wallet setup specialist! 🎓\n\nI can help you with:\n• Installing Phantom wallet\n• Buying your first SOL\n• Connecting to play\n• Troubleshooting issues\n\nWhere would you like to start? Or just tell me what you need help with!",
    relatedTopics: [
      'start from beginning',
      'buy SOL',
      'connect wallet',
      'troubleshoot',
    ],
  };
};

// Dynamic configuration that can access wallet state
const Coach101Chatbot = () => {
  const { connected } = useWallet();
  const { balance } = useWalletStore();

  React.useEffect(() => {
    // Listen for custom event to open chat
    const handleOpenCoach101 = () => {
      // Find and click the chat button to open it
      setTimeout(() => {
        const chatButton = document.querySelector('[aria-label="Open chat"]');
        if (chatButton instanceof HTMLElement) {
          chatButton.click();
        }
      }, 100);
    };

    window.addEventListener('openCoach101', handleOpenCoach101);

    return () => {
      window.removeEventListener('openCoach101', handleOpenCoach101);
    };
  }, []);

  const coach101Config: ChatbotConfig = {
    name: 'Coach 101',
    title: 'Wallet Setup Guide',
    description: 'Covering the Basics',
    avatarSrc: '/Assets/Coach101_headset.png',
    avatarAlt: 'Coach 101',
    fallbackInitial: '101',
    initialMessage:
      "Hey! I'm Coach 101, your personal wallet guide! 🎯 I'll help you get set up with SOL in just a few minutes. Where are you in the process?\n\n1️⃣ Need to install a wallet\n2️⃣ Have wallet, need SOL\n3️⃣ Ready to connect and play\n\nJust type a number or tell me what you need!",
    gradientFrom: 'from-green-600',
    gradientTo: 'to-blue-600',
    avatarButtonSize: 80,
    avatarButtonOffsetY: -20,
    getResponse: getCoach101Response,
  };

  return <ChatCore config={coach101Config} />;
};

export default Coach101Chatbot;
