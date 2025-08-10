export const NFT_GENERATION_LIMITS = {
  session: {
    duration: 60, // minutes
    pausable: true,
    refundable: true, // if no mints
    retryOption: true, // with new prompt
  },
  aiArtwork: {
    standard: {
      totalAttempts: 40,
      tiers: [
        { range: [1, 10], model: 'economy', quality: 'basic' },
        { range: [11, 20], model: 'mid-tier', quality: 'balanced' },
        {
          range: [21, 30],
          model: 'mid-tier',
          quality: 'balanced',
          intervention: 21,
        },
        { range: [31, 35], model: 'premium', quality: 'high' },
        { range: [36, 40], model: 'premium', quality: 'high', warning: 36 },
      ],
    },
    premium: {
      totalAttempts: 70,
      interventionAt: 30,
      tiers: [
        { range: [1, 30], model: 'standard-progression' },
        { range: [31, 70], model: 'premium', quality: 'high' },
      ],
    },
    vip: {
      totalAttempts: 70,
      tiers: [
        { range: [1, 40], model: 'standard-progression' },
        { range: [41, 50], model: 'mid-tier', quality: 'balanced' },
        { range: [51, 70], model: 'premium', quality: 'high' },
      ],
    },
  },
  animated: {
    totalAttempts: 4,
    tiers: [
      { attempt: 1, name: '1st Down', quality: 'basic' },
      { attempt: 2, name: '2nd Down', quality: 'premium' },
      { attempt: 3, name: '3rd Down', quality: 'premium+' },
      { attempt: 4, name: '4th Down', quality: 'elite' },
    ],
  },
  uploadedImages: {
    processingAttempts: -1, // unlimited
    requiresCrop: true,
    requiresBackgroundRemoval: true,
  },
  signatures: {
    colorAdjustments: -1, // unlimited
    glowEffect: true,
  },
} as const;

export const NFT_PRICING_TIERS = {
  standard: {
    name: 'Standard',
    price: 'Per Session',
    aiGenerations: 40,
    animationAttempts: 4,
    uploadLimit: -1,
    description: 'Standard NFT creation',
    features: [
      '40 AI generation attempts',
      '4 animated NFT attempts (1st-4th Down)',
      'Unlimited image uploads & processing',
      'Auto background removal',
      'Dali Palette assistance at attempt 21',
      '60-minute session with pause',
      'Refund if no mints',
    ],
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    aiGenerations: 70,
    animationAttempts: 4,
    uploadLimit: -1,
    description: 'Enhanced NFT creation',
    features: [
      '70 AI generation attempts',
      'Dali help offered at attempt 30',
      'Premium models after attempt 30',
      '4 animated NFT attempts',
      'Download after 3+ mints',
      'Priority processing',
    ],
  },
  vip: {
    name: 'VIP',
    price: 29.99,
    aiGenerations: 70,
    animationAttempts: 4,
    uploadLimit: -1,
    description: 'Ultimate NFT creation',
    features: [
      '70 AI generation attempts',
      'Extended tier progression',
      'Mid-tier models (41-50)',
      'Premium models (51-70)',
      'Download after 3+ mints',
      'Priority support',
    ],
  },
} as const;

export const getNFTLimitsMessage = (
  tier: keyof typeof NFT_PRICING_TIERS = 'free',
) => {
  const tierInfo = NFT_PRICING_TIERS[tier];
  const generations =
    tierInfo.aiGenerations === -1 ? 'unlimited' : `${tierInfo.aiGenerations}`;
  const uploads =
    tierInfo.uploadLimit === -1 ? 'unlimited' : `${tierInfo.uploadLimit}`;

  return `${tierInfo.name} tier: ${generations} AI generations and ${uploads} uploads per month.`;
};

export const getAllTiersMessage = () => {
  return `Generation limits per session:
• Standard: 40 AI attempts, 4 animations
• Premium: 70 AI attempts, better models after 30
• VIP: 70 AI attempts, extended quality tiers

All tiers: 60-min session, pause option, refund if no mints`;
};

export const getIncineratorMessage = () => {
  return `I can attempt to retrieve your previous creations from the incinerator! Just describe what you're looking for and I'll see if I can recover it. Note: Recovery isn't always possible, depending on when it was created.`;
};

export const getModelTierInfo = (
  attemptNumber: number,
  accountType: 'standard' | 'premium' | 'vip' = 'standard',
) => {
  const config = NFT_GENERATION_LIMITS.aiArtwork[accountType];
  const tiers = config.tiers;

  for (const tier of tiers) {
    if (
      tier.range &&
      attemptNumber >= tier.range[0] &&
      attemptNumber <= tier.range[1]
    ) {
      return tier;
    }
  }
  return null;
};

export const shouldShowDaliIntervention = (
  attemptNumber: number,
  accountType: 'standard' | 'premium' | 'vip' = 'standard',
) => {
  if (accountType === 'standard' || accountType === 'vip')
    return attemptNumber === 21;
  if (accountType === 'premium') return attemptNumber === 30;
  return false;
};

export const shouldShowWarning = (attemptNumber: number) => {
  return attemptNumber === 36;
};

export const getDownloadPolicy = () => {
  return {
    minMints: 3,
    message: 'Mint 3+ NFTs to unlock download capability for this session!',
    permanent: 'Minted NFTs can always be downloaded with wallet verification.',
  };
};
