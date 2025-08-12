'use client';

import ChatCore, { ChatbotConfig, KnowledgeResponse } from './ChatCore';
import {
  NFT_PRICING_TIERS,
  NFT_GENERATION_LIMITS,
  getAllTiersMessage,
  getIncineratorMessage,
  getDownloadPolicy,
} from '@/lib/config/nftPricing';

// Knowledge base for Dali Palette - NFT art helper
const getDaliPaletteResponse = (userMessage: string): KnowledgeResponse => {
  const message = userMessage.toLowerCase();

  if (
    message.includes('nft') ||
    message.includes('mint') ||
    message.includes('metadata')
  ) {
    return {
      response:
        'I can help you mint and format your NFT. For metadata, include a title, description, attributes, and a link to the image file (IPFS recommended). Need an example metadata JSON?',
      relatedTopics: ['metadata', 'minting', 'ipfs'],
    };
  }

  if (
    message.includes('ai') ||
    message.includes('generate') ||
    message.includes('prompt')
  ) {
    return {
      response:
        "For AI-generated artwork, give a clear prompt describing style, color palette, subject, and any references. Try: 'vibrant surreal portrait, dripping paint, warm tones, high detail'. Want help drafting a prompt?",
      relatedTopics: ['prompts', 'styles', 'variations'],
    };
  }

  if (
    message.includes('tries') ||
    message.includes('attempt') ||
    message.includes('limit') ||
    message.includes('how many')
  ) {
    const session = NFT_GENERATION_LIMITS.session;
    return {
      response: `${getAllTiersMessage()}\n\nSession details:\n• ${session.duration}-minute timer with pause option\n• Must select at least 1 to mint\n• Full refund if you don't mint any\n• Can retry with new prompt`,
      relatedTopics: ['pricing', 'refund', 'session'],
    };
  }

  if (message.includes('download')) {
    const policy = getDownloadPolicy();
    return {
      response: `${policy.message}\n\n${policy.permanent}\n\nAfter your first mint, I'll encourage you to mint more to unlock downloads!`,
      relatedTopics: ['minting', 'ownership', 'storage'],
    };
  }

  if (
    message.includes('recover') ||
    message.includes('previous') ||
    message.includes('old')
  ) {
    return {
      response: getIncineratorMessage(),
      relatedTopics: ['recovery', 'storage', 'history'],
    };
  }

  if (message.includes('refund') || message.includes('retry')) {
    return {
      response:
        "If you're not happy with any of your 40 attempts, you have two options:\n• Get a full refund (all images discarded)\n• Try again with a new prompt (all images discarded)\n\nBut I'm confident we'll create something amazing together!",
      relatedTopics: ['session', 'attempts', 'satisfaction'],
    };
  }

  if (
    message.includes('upgrade') ||
    message.includes('premium') ||
    message.includes('vip') ||
    message.includes('pricing')
  ) {
    return {
      response: `${getAllTiersMessage()}\n\nPremium & VIP users get more attempts and better model access!`,
      relatedTopics: ['tiers', 'benefits', 'models'],
    };
  }

  if (
    message.includes('format') ||
    message.includes('png') ||
    message.includes('svg') ||
    message.includes('size') ||
    message.includes('resolution')
  ) {
    return {
      response:
        'Recommended file formats: PNG/JPEG for raster; SVG for vector. Use 2048px on the longest side for high-quality prints; smaller sizes (1024px) are fine for web previews. Keep files within upload limits and include an uncompressed master if possible.',
      relatedTopics: ['file format', 'resolution', 'compression'],
    };
  }

  if (
    message.includes('copyright') ||
    message.includes('ownership') ||
    message.includes('rights')
  ) {
    return {
      response:
        "Ownership: minting assigns the token on-chain to the minter's address. Ensure you have rights to any image you upload. For commissioned or AI works, confirm license terms before minting.",
      relatedTopics: ['licensing', 'ownership', 'commission'],
    };
  }

  if (
    message.includes('how to start') ||
    message.includes('help') ||
    message.includes('create')
  ) {
    return {
      response:
        'Start by choosing creation type: AI-generated, upload your own art, or hand-drawn. Prepare a title, description, image file, and any attributes. Then use the Create NFT page to upload and mint. Want a step-by-step guide?',
      relatedTopics: ['getting started', 'upload', 'mint'],
    };
  }

  return {
    response:
      "Hi — I'm Dali Palette 🎨. I can help with art creation, prompts, file formats, minting NFTs, and explain generation limits. Ask me about prompts, metadata, upload requirements, or account tiers.",
    relatedTopics: ['prompts', 'metadata', 'formats', 'limits'],
  };
};

const daliPaletteConfig: ChatbotConfig = {
  name: 'Dali Palette',
  title: 'NFT Art Assistant',
  description: "Let's Create Fun",
  avatarSrc: '/Assets/Dali_Palette.png',
  avatarAlt: 'Dali Palette',
  fallbackInitial: 'DP',
  initialMessage:
    "Hello — I'm Dali Palette! 🎨 I can help you create, format, and mint NFTs. Tell me what you're working on (AI prompts, files, or metadata) and I'll guide you through it.",
  gradientFrom: 'from-amber-500',
  gradientTo: 'to-pink-600',
  avatarButtonSize: 80,
  avatarButtonOffsetY: -20,
  getResponse: getDaliPaletteResponse,
};

const DaliPaletteChatbot = () => {
  return <ChatCore config={daliPaletteConfig} />;
};

export default DaliPaletteChatbot;
