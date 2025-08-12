'use client';

import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';

// Simple knowledgeable assistant for support and training
const getTrainerRevivaResponse = (userMessage: string): KnowledgeResponse => {
  const message = userMessage.toLowerCase();

  if (
    message.includes('exercise') ||
    message.includes('trainer') ||
    message.includes('training')
  ) {
    return {
      response:
        "I'm Trainer Reviva — I can guide you through features, best practices, and walkthroughs. Tell me what you'd like to learn about.",
      relatedTopics: ['features', 'walkthroughs', 'best practices'],
    };
  }

  if (
    message.includes('help') ||
    message.includes('support') ||
    message.includes('issue') ||
    message.includes('bug')
  ) {
    return {
      response:
        "I can help with support topics. For technical problems, check the Technical Support page, or describe your issue and I'll provide steps to troubleshoot.",
      relatedTopics: ['technical support', 'troubleshooting', 'contact'],
    };
  }

  if (
    message.includes('how') ||
    message.includes('where') ||
    message.includes('find')
  ) {
    return {
      response:
        "Need help finding something? Tell me what you're looking for (rules, how to play, wallet setup, or FAQs) and I'll point you to the right place.",
      relatedTopics: ['how to play', 'wallet setup', 'FAQ'],
    };
  }

  return {
    response:
      "Hi — I'm Trainer Reviva! 👋 I offer guided walkthroughs, quick tips, and support links. How can I help you today?",
    relatedTopics: ['walkthroughs', 'support', 'tips'],
  };
};

const trainerRevivaConfig: ChatbotConfig = {
  name: 'Trainer Reviva',
  title: 'Trainer & Support',
  description: 'Repair and Healing',
  avatarSrc: '/Assets/Trainer Reviva_main.png',
  avatarAlt: 'Trainer Reviva',
  fallbackInitial: 'R',
  initialMessage:
    "Hello — I'm Trainer Reviva! 👋 I can give guided walkthroughs, quick tips, and troubleshoot common issues. What would you like help with?",
  gradientFrom: 'from-pink-500',
  gradientTo: 'to-red-500',
  avatarButtonSize: 80,
  avatarButtonOffsetY: -20,
  getResponse: getTrainerRevivaResponse,
};

const TrainerRevivaChatbot = () => {
  return <ChatCore config={trainerRevivaConfig} />;
};

export default TrainerRevivaChatbot;
