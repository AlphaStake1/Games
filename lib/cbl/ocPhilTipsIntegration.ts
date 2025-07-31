// OC Phil Tips Integration with Notion Playbooks
// Maps platform-specific tips to Notion documentation URLs

export interface TipResource {
  id: string;
  title: string;
  platform:
    | 'telegram'
    | 'discord'
    | 'twitter'
    | 'facebook'
    | 'instagram'
    | 'existing'
    | 'general';
  category:
    | 'getting_started'
    | 'growth'
    | 'content'
    | 'monetization'
    | 'automation'
    | 'troubleshooting';
  notionUrl: string;
  shortDescription: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number; // minutes
}

// Notion URLs structure (to be created)
export const NOTION_PLAYBOOK_URLS = {
  // Base playbook URLs - these would be the actual Notion doc URLs
  telegram:
    'https://www.notion.so/Telegram-CBL-Playbook-2417aef1c5a880bcb342d065297be7e6',
  discord:
    'https://www.notion.so/Discord-CBL-Playbook-2417aef1c5a88073be1ce09e0c2f2b53',
  twitter:
    'https://www.notion.so/Twitter-CBL-Playbook-2417aef1c5a880ba95cae536a8f98cb5',
  facebook:
    'https://www.notion.so/Facebook-CBL-Playbook-2417aef1c5a880048de7e854305c6ee2',
  instagram:
    'https://www.notion.so/Instagram-CBL-Playbook-2417aef1c5a88083b985e511fea26a5b',
  existing:
    'https://www.notion.so/Existing-Community-Playbook-2417aef1c5a880e98573ea50f563a41e',

  // Specific section URLs within playbooks
  sections: {
    telegram: {
      quickStart:
        'https://notion.so/oc-phil/telegram-quick-start-abc123#quick-start',
      botSetup:
        'https://notion.so/oc-phil/telegram-quick-start-abc123#bot-setup',
      automation:
        'https://notion.so/oc-phil/telegram-quick-start-abc123#automation',
      growth:
        'https://notion.so/oc-phil/telegram-quick-start-abc123#growth-tactics',
      troubleshooting:
        'https://notion.so/oc-phil/telegram-quick-start-abc123#troubleshooting',
    },
    discord: {
      serverSetup:
        'https://notion.so/oc-phil/discord-cbl-playbook-def456#server-setup',
      bots: 'https://notion.so/oc-phil/discord-cbl-playbook-def456#bot-integration',
      voiceChannels:
        'https://notion.so/oc-phil/discord-cbl-playbook-def456#voice-strategy',
      growth:
        'https://notion.so/oc-phil/discord-cbl-playbook-def456#growth-tactics',
    },
    twitter: {
      profileOptimization:
        'https://notion.so/oc-phil/twitter-cbl-playbook-ghi789#profile-setup',
      contentStrategy:
        'https://notion.so/oc-phil/twitter-cbl-playbook-ghi789#content-strategy',
      hashtags:
        'https://notion.so/oc-phil/twitter-cbl-playbook-ghi789#hashtag-strategy',
      engagement:
        'https://notion.so/oc-phil/twitter-cbl-playbook-ghi789#engagement',
    },
    facebook: {
      pageSetup:
        'https://notion.so/oc-phil/facebook-cbl-playbook-jkl012#page-setup',
      groupStrategy:
        'https://notion.so/oc-phil/facebook-cbl-playbook-jkl012#group-strategy',
      liveVideo:
        'https://notion.so/oc-phil/facebook-cbl-playbook-jkl012#live-video',
      localMarketing:
        'https://notion.so/oc-phil/facebook-cbl-playbook-jkl012#local-marketing',
    },
    instagram: {
      profileSetup:
        'https://notion.so/oc-phil/instagram-cbl-playbook-mno345#profile-setup',
      contentPillars:
        'https://notion.so/oc-phil/instagram-cbl-playbook-mno345#content-pillars',
      reelsStrategy:
        'https://notion.so/oc-phil/instagram-cbl-playbook-mno345#reels-strategy',
      storiesStrategy:
        'https://notion.so/oc-phil/instagram-cbl-playbook-mno345#stories-strategy',
    },
    existing: {
      assessment:
        'https://notion.so/oc-phil/existing-community-playbook-pqr678#assessment',
      integration:
        'https://notion.so/oc-phil/existing-community-playbook-pqr678#integration',
      migration:
        'https://notion.so/oc-phil/existing-community-playbook-pqr678#migration',
    },
  },
};

// Comprehensive tips database for OC Phil to reference
export const TIPS_DATABASE: TipResource[] = [
  // TELEGRAM TIPS
  {
    id: 'telegram_quick_start',
    title: 'Getting Started with Telegram CBL',
    platform: 'telegram',
    category: 'getting_started',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.telegram.quickStart,
    shortDescription:
      'Complete setup guide for your first week as a Telegram CBL',
    difficulty: 'beginner',
    estimatedReadTime: 5,
  },
  {
    id: 'telegram_bot_automation',
    title: 'OC Phil Bot Setup & Automation',
    platform: 'telegram',
    category: 'automation',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.telegram.automation,
    shortDescription:
      'Configure automated celebrations, notifications, and engagement',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
  },
  {
    id: 'telegram_growth_tactics',
    title: 'Telegram Community Growth Strategies',
    platform: 'telegram',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.telegram.growth,
    shortDescription: 'Proven tactics to grow from 0 to 500+ members',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
  },

  // DISCORD TIPS
  {
    id: 'discord_server_setup',
    title: 'Discord Server Architecture for Squares',
    platform: 'discord',
    category: 'getting_started',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.discord.serverSetup,
    shortDescription:
      'Optimal channel structure and role setup for gaming communities',
    difficulty: 'beginner',
    estimatedReadTime: 7,
  },
  {
    id: 'discord_voice_strategy',
    title: 'Voice Channel Engagement Tactics',
    platform: 'discord',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.discord.voiceChannels,
    shortDescription: 'Use voice features to build stronger community bonds',
    difficulty: 'intermediate',
    estimatedReadTime: 6,
  },
  {
    id: 'discord_bot_integration',
    title: 'Essential Discord Bots for CBLs',
    platform: 'discord',
    category: 'automation',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.discord.bots,
    shortDescription: 'MEE6, Carl-bot, and custom OC Phil integration guide',
    difficulty: 'advanced',
    estimatedReadTime: 10,
  },

  // TWITTER/X TIPS
  {
    id: 'twitter_profile_optimization',
    title: 'X Profile Optimization for CBLs',
    platform: 'twitter',
    category: 'getting_started',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.twitter.profileOptimization,
    shortDescription: 'Bio, header, and profile setup for maximum discovery',
    difficulty: 'beginner',
    estimatedReadTime: 4,
  },
  {
    id: 'twitter_thread_mastery',
    title: 'Thread Strategy for Viral Growth',
    platform: 'twitter',
    category: 'content',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.twitter.contentStrategy,
    shortDescription:
      'Create compelling strategy threads that drive board signups',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
  },
  {
    id: 'twitter_hashtag_strategy',
    title: 'Hashtag Research & Implementation',
    platform: 'twitter',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.twitter.hashtags,
    shortDescription:
      'Mix of mega, large, medium, and niche hashtags for growth',
    difficulty: 'intermediate',
    estimatedReadTime: 6,
  },

  // FACEBOOK TIPS
  {
    id: 'facebook_group_vs_page',
    title: 'Groups vs Pages: Choosing Your Strategy',
    platform: 'facebook',
    category: 'getting_started',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.facebook.groupStrategy,
    shortDescription: 'When to use groups, pages, or both for maximum reach',
    difficulty: 'beginner',
    estimatedReadTime: 5,
  },
  {
    id: 'facebook_live_strategy',
    title: 'Facebook Live for Board Announcements',
    platform: 'facebook',
    category: 'content',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.facebook.liveVideo,
    shortDescription: 'Use live video to create excitement and urgency',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
  },
  {
    id: 'facebook_local_targeting',
    title: 'Local Community Engagement Tactics',
    platform: 'facebook',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.facebook.localMarketing,
    shortDescription:
      'Leverage local groups and businesses for community growth',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
  },

  // INSTAGRAM TIPS
  {
    id: 'instagram_content_pillars',
    title: 'Instagram Content Strategy Framework',
    platform: 'instagram',
    category: 'content',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.instagram.contentPillars,
    shortDescription: '80/20 rule: value vs promotion content mix',
    difficulty: 'beginner',
    estimatedReadTime: 6,
  },
  {
    id: 'instagram_reels_mastery',
    title: 'Reels Strategy for Maximum Reach',
    platform: 'instagram',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.instagram.reelsStrategy,
    shortDescription:
      'Educational, entertainment, and behind-the-scenes content',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
  },
  {
    id: 'instagram_stories_engagement',
    title: 'Stories Features for Community Building',
    platform: 'instagram',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.instagram.storiesStrategy,
    shortDescription: 'Polls, questions, quizzes, and interactive content',
    difficulty: 'intermediate',
    estimatedReadTime: 7,
  },

  // EXISTING COMMUNITY TIPS
  {
    id: 'existing_community_assessment',
    title: 'Community Integration Assessment',
    platform: 'existing',
    category: 'getting_started',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.existing.assessment,
    shortDescription: 'Analyze your existing community for squares potential',
    difficulty: 'beginner',
    estimatedReadTime: 8,
  },
  {
    id: 'existing_integration_strategy',
    title: 'Gradual Integration Approach',
    platform: 'existing',
    category: 'growth',
    notionUrl: NOTION_PLAYBOOK_URLS.sections.existing.integration,
    shortDescription: 'Introduce squares without disrupting community culture',
    difficulty: 'intermediate',
    estimatedReadTime: 12,
  },

  // GENERAL/CROSS-PLATFORM TIPS
  {
    id: 'pricing_psychology',
    title: 'Pricing Psychology for Board Fills',
    platform: 'general',
    category: 'monetization',
    notionUrl:
      'https://www.notion.so/Pricing-Psychology-Guide-2417aef1c5a880f7aa57d31532c671bb',
    shortDescription:
      'Dynamic pricing strategies based on game importance and demand',
    difficulty: 'intermediate',
    estimatedReadTime: 9,
  },
  {
    id: 'content_calendar',
    title: 'Weekly Content Planning Template',
    platform: 'general',
    category: 'content',
    notionUrl:
      'https://www.notion.so/Content-Calendar-Template-2417aef1c5a88025acebf61fe61b2cbd',
    shortDescription: 'Plan platform-specific content for maximum engagement',
    difficulty: 'beginner',
    estimatedReadTime: 6,
  },
  {
    id: 'milestone_tracking',
    title: 'CBL Milestone & Reward System',
    platform: 'general',
    category: 'growth',
    notionUrl:
      'https://www.notion.so/Milestone-Tracking-Guide-2417aef1c5a8805ab84bf3f246628654',
    shortDescription:
      'Track progress toward custom bot rewards and advanced features',
    difficulty: 'intermediate',
    estimatedReadTime: 8,
  },
];

// OC Phil tip matching service
export class OCPhilTipsService {
  /**
   * Get relevant tips based on platform and context
   */
  static getTipsByPlatform(
    platform: string,
    category?: string,
    difficulty?: string,
  ): TipResource[] {
    let filtered = TIPS_DATABASE.filter(
      (tip) => tip.platform === platform || tip.platform === 'general',
    );

    if (category) {
      filtered = filtered.filter((tip) => tip.category === category);
    }

    if (difficulty) {
      filtered = filtered.filter((tip) => tip.difficulty === difficulty);
    }

    return filtered;
  }

  /**
   * Get tip recommendations based on CBL progress
   */
  static getRecommendedTips(
    platform: string,
    followerCount: number,
    monthlyBoards: number,
    fillRate: number,
  ): TipResource[] {
    const recommendations: TipResource[] = [];

    // Beginner recommendations (< 100 followers)
    if (followerCount < 100) {
      recommendations.push(
        ...this.getTipsByPlatform(platform, 'getting_started'),
        ...this.getTipsByPlatform('general', 'content', 'beginner'),
      );
    }
    // Growth phase (100-500 followers)
    else if (followerCount < 500) {
      recommendations.push(
        ...this.getTipsByPlatform(platform, 'growth'),
        ...this.getTipsByPlatform(platform, 'content', 'intermediate'),
      );
    }
    // Optimization phase (500+ followers)
    else {
      recommendations.push(
        ...this.getTipsByPlatform(platform, 'automation'),
        ...this.getTipsByPlatform(platform, 'monetization'),
        ...this.getTipsByPlatform('general', 'growth', 'advanced'),
      );
    }

    // Add specific recommendations based on performance
    if (fillRate < 80) {
      const fillRateTip = TIPS_DATABASE.find(
        (tip) => tip.id === 'pricing_psychology',
      );
      if (fillRateTip) recommendations.unshift(fillRateTip);
    }

    if (monthlyBoards < 10) {
      const contentTip = TIPS_DATABASE.find(
        (tip) => tip.id === 'content_calendar',
      );
      if (contentTip) recommendations.unshift(contentTip);
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Search tips by keyword
   */
  static searchTips(query: string): TipResource[] {
    const lowercaseQuery = query.toLowerCase();

    return TIPS_DATABASE.filter(
      (tip) =>
        tip.title.toLowerCase().includes(lowercaseQuery) ||
        tip.shortDescription.toLowerCase().includes(lowercaseQuery) ||
        tip.category.toLowerCase().includes(lowercaseQuery),
    );
  }

  /**
   * Get quick start guide for platform
   */
  static getQuickStartGuide(platform: string): TipResource | null {
    return (
      TIPS_DATABASE.find(
        (tip) =>
          tip.platform === platform && tip.category === 'getting_started',
      ) || null
    );
  }

  /**
   * Format tip response for OC Phil bot
   */
  static formatTipResponse(tip: TipResource): string {
    const icon = this.getCategoryIcon(tip.category);
    const difficulty = this.getDifficultyEmoji(tip.difficulty);

    return (
      `${icon} **${tip.title}** ${difficulty}\n\n` +
      `${tip.shortDescription}\n\n` +
      `📖 **Read time:** ${tip.estimatedReadTime} minutes\n` +
      `🔗 **Full guide:** ${tip.notionUrl}\n\n` +
      `💡 Pro tip: Bookmark this guide and return to it as you implement!`
    );
  }

  /**
   * Format multiple tips for bot response
   */
  static formatTipsListResponse(tips: TipResource[], title: string): string {
    let response = `📚 **${title}**\n\n`;

    tips.forEach((tip, index) => {
      const icon = this.getCategoryIcon(tip.category);
      const difficulty = this.getDifficultyEmoji(tip.difficulty);

      response += `${index + 1}. ${icon} **${tip.title}** ${difficulty}\n`;
      response += `   ${tip.shortDescription}\n`;
      response += `   📖 ${tip.estimatedReadTime}min read | 🔗 [View Guide](${tip.notionUrl})\n\n`;
    });

    response += `💬 Ask me about any specific topic for detailed guidance!`;

    return response;
  }

  private static getCategoryIcon(category: string): string {
    const icons = {
      getting_started: '🚀',
      growth: '📈',
      content: '✍️',
      monetization: '💰',
      automation: '🤖',
      troubleshooting: '🔧',
    };
    return icons[category as keyof typeof icons] || '📌';
  }

  private static getDifficultyEmoji(difficulty: string): string {
    const emojis = {
      beginner: '🟢',
      intermediate: '🟡',
      advanced: '🔴',
    };
    return emojis[difficulty as keyof typeof emojis] || '⚪';
  }
}

// Export for use in OC Phil bot commands
export { TIPS_DATABASE, NOTION_PLAYBOOK_URLS, OCPhilTipsService };
