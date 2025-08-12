'use client';

import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';

// OC-Phil's authentic CBL knowledge base with sports commentary style
const getOCPhilResponse = (userMessage: string): KnowledgeResponse => {
  const message = userMessage.toLowerCase();

  // Board creation and management
  if (
    message.includes('create board') ||
    message.includes('new board') ||
    message.includes('setup board') ||
    message.includes('board creation')
  ) {
    return {
      response:
        "Play drawn up! 🚀 Ready to get that board on the field? Here's your game plan:\n\n1️⃣ Set your entry price **$7+** to qualify for rake & Blue-Points\n2️⃣ Share your link and start **moving the chains**\n3️⃣ Watch those squares fill up!\n\n**Remember**: Price locks once first square sells—no audibles after the snap! 1st-and-Goal, keep driving!",
      relatedTopics: ['price floor', 'board sharing', 'square limits'],
    };
  }

  // Price floor and rake questions
  if (
    message.includes('price') ||
    message.includes('$7') ||
    message.includes('rake') ||
    message.includes('minimum') ||
    message.includes('qualify')
  ) {
    return {
      response:
        "Here's the **Price-Floor Quick Look** 📊:\n\n**$1 – $6**: ❌ (Blue stat bar turns **red**)\n**$7+**: ✅ (Blue stat bar turns **green**)\n\n🏆 Prize Pot: 95% ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇\n🟦 CBL Share: 3% ▇▇\n🏠 House: 2% ▇\n\nPrice it **$7+** to put points on the board! 1st-and-Goal, keep driving!",
      relatedTopics: ['rake system', 'board qualification', 'blue points'],
    };
  }

  // Blue Points and milestones
  if (
    message.includes('blue point') ||
    message.includes('milestone') ||
    message.includes('all-star') ||
    message.includes('progress')
  ) {
    return {
      response:
        "Blue-Points Meter (season) 📈:\n\n```\n0   1k   2k   3k   4k   5k   6k\n|────|────|────|────|────|────|\n          ^ Season-Earner bonus (+2000)\n                      ^ All-Star bonus (+2000 & ×1.5 going forward)\n```\n\nYou're **1st-and-10** on your own 20 — let's drive this to the end-zone! Next milestone coming up! 🚀",
      relatedTopics: ['season bonuses', 'all-star status', 'point multipliers'],
    };
  }

  // 3-board milestone and 7-day rolling window
  if (
    message.includes('3 board') ||
    message.includes('rolling') ||
    message.includes('7 day') ||
    message.includes('unlock')
  ) {
    return {
      response:
        '**Rolling-7-Day Tracker** 📅:\n\n```\n┌────── 7-Day Window (auto-slides daily) ──────┐\n Sun  Mon  Tue  Wed  Thu  Fri  Sat\n 🟦     🟦     🟦     🟦                    = 4 boards\n  ^Window Start            ^Today\n Unlock ≥ 3  boards  → 3% Rake Active\n└──────────────────────────────────────────────┘\n```\n\n**Mid-field now** — fill 3 qualifying boards in 7 days and that **3% rake goes live all season**! 🔥',
      relatedTopics: ['rake unlock', 'board goals', 'season rewards'],
    };
  }

  // Wallet cap and square limits
  if (
    message.includes('wallet cap') ||
    message.includes('10 squares') ||
    message.includes('limit') ||
    message.includes('override')
  ) {
    return {
      response:
        '**Wallet Cap Guardrail** 🛡️:\n\n```\n Squares per Wallet (max 10)\n [■■■■■■■■■■] 10 / 10   ← cap reached → "Buy" button disabled\n```\n\n**Max 10 squares per wallet** — spread the glory among your crew! No exceptions on this one, QB! 1st-and-Goal, keep driving!',
      relatedTopics: ['square limits', 'wallet restrictions', 'fair play'],
    };
  }

  // Board lifecycle and filling process
  if (
    message.includes('board fill') ||
    message.includes('lifecycle') ||
    message.includes('100 squares') ||
    message.includes('locked')
  ) {
    return {
      response:
        '**Board Lifecycle Flow** 🏈:\n\n```\nCreate Board → Share Link → Squares Purchased → 100/100?\n       │                                    │\n       └──────────No ────────────┐          │\n                                 ▼          │\n                           Update % Filled  │\n                                            ▼\n                                   Yes → Contract Locks →\n                                            ▼\n                               Mark FILLED → Stats + Blue-Points → OC-Phil Celebrates\n```\n\n**Touchdown!** Board locked, stats updated! 🕺',
      relatedTopics: ['board completion', 'contract locking', 'celebration'],
    };
  }

  // Common FAQ - editing price after sales
  if (
    message.includes('edit price') ||
    message.includes('change price') ||
    message.includes('after') ||
    message.includes('already bought')
  ) {
    return {
      response:
        "No audible after the snap—**price locks once first square sells**! ⚡\n\nOnce someone's in the game, that's your play call for the whole drive. Plan your pricing strategy before kickoff! 1st-and-Goal, keep driving!",
      relatedTopics: ['price locking', 'board rules', 'planning'],
    };
  }

  // Charity boards and low-price questions
  if (
    message.includes('charity') ||
    message.includes('$5') ||
    message.includes('low price') ||
    message.includes('goodwill')
  ) {
    return {
      response:
        "**$5 charity boards** earn goodwill, not Blue-Points! 💝\n\nThey're great for community building, but won't count toward your milestones. Price it **$7+** to put points on the board! 1st-and-Goal, keep driving!",
      relatedTopics: ['charity boards', 'price requirements', 'blue points'],
    };
  }

  // Complex questions or edge cases
  if (
    message.includes('complex') ||
    message.includes('unusual') ||
    message.includes('special case') ||
    message.includes('exception')
  ) {
    return {
      response:
        "Let me check with Coach B about that and circle back! 🏃‍♂️\n\nSome plays need the head coach's input. I'll get you the right answer, QB!",
      relatedTopics: ['escalation', 'coach b', 'special cases'],
    };
  }

  // Milestone celebrations and achievements
  if (
    message.includes('milestone') ||
    message.includes('achievement') ||
    message.includes('unlock') ||
    message.includes('celebrate')
  ) {
    return {
      response:
        "**End-zone dance!** 🕺 From now until season whistle you pocket **3%** on every filled board!\n\nThat's clutch performance right there! Keep the offense rolling. Next stop: **All-Star** at 50 boards! 🚀",
      relatedTopics: ['celebrations', 'all-star status', 'season rewards'],
    };
  }

  // Help and support
  if (
    message.includes('help') ||
    message.includes('support') ||
    message.includes('stuck') ||
    message.includes('problem')
  ) {
    return {
      response:
        "I'm your **Offensive Coordinator** — here to keep you moving the chains! ⚡\n\nFor complex plays, let me check with Coach B about that. For everything else, I've got your playbook right here! What specific situation are we dealing with, QB?",
      relatedTopics: ['coaching support', 'escalation', 'playbook'],
    };
  }

  // Default welcome response
  return {
    response:
      "Alright rookie, you're **1st-and-10** on your own 20 — let's drive this board to the end-zone! 🚀\n\nI'm **Offensive Coordinator Phil**, your OC for CBL success! I've got your playbook for:\n\n🏈 Board creation & pricing strategy\n📊 Blue-Points & milestone tracking\n💰 Rake splits & 7-day windows\n🎯 All-Star achievement paths\n\nWhat play are we calling first, QB?",
    relatedTopics: [
      'board creation',
      'milestone tracking',
      'rake system',
      'all-star status',
    ],
  };
};

const ocPhilConfig: ChatbotConfig = {
  name: 'OC-Phil',
  title: 'Offensive Coordinator',
  description: 'CBL Offensive Coordinator',
  avatarSrc: '/Assets/OC-Phil with Thumbs Up.png',
  avatarAlt: 'OC-Phil Avatar',
  fallbackInitial: 'OP',
  initialMessage:
    "Alright rookie, you're **1st-and-10** on your own 20 — let's drive this board to the end-zone! 🚀\n\nI'm **Offensive Coordinator Phil** (OC-Phil), your OC for CBL success! Got your playbook ready for board creation, Blue-Points tracking, rake splits, and All-Star achievement paths.\n\nWhat play are we calling first, QB?",
  gradientFrom: 'from-purple-600',
  gradientTo: 'to-blue-600',
  avatarButtonSize: 80,
  avatarButtonOffsetY: -20,
  getResponse: getOCPhilResponse,
};

const OCPhilWidget = () => {
  return <ChatCore config={ocPhilConfig} />;
};

export default OCPhilWidget;
