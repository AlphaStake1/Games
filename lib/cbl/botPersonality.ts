// CBL Bot Personality Customization System
// Allows CBLs to customize their bot's name, personality, and response style

export interface BotPersonality {
  name: string;
  username: string;
  description: string;
  welcomeMessage: string;
  responseStyle: ResponseStyle;
  customCommands?: CustomCommand[];
  branding: BotBranding;
  voiceTone: VoiceTone;
}

export interface ResponseStyle {
  formality: 'casual' | 'professional' | 'friendly' | 'energetic';
  enthusiasm: 'low' | 'medium' | 'high' | 'extreme';
  humor: 'none' | 'light' | 'moderate' | 'heavy';
  emojis: 'minimal' | 'balanced' | 'heavy';
  catchphrases: string[];
  signatureClosing: string;
}

export interface VoiceTone {
  primary: 'coach' | 'mentor' | 'friend' | 'expert' | 'entertainer';
  secondary?: 'motivational' | 'analytical' | 'supportive' | 'competitive';
  customTraits: string[]; // e.g., ["always uses sports metaphors", "references local teams"]
}

export interface CustomCommand {
  command: string;
  description: string;
  response: string;
  category: 'custom' | 'community_specific';
}

export interface BotBranding {
  primaryColor: string;
  accentColor: string;
  avatar?: string;
  theme: 'professional' | 'fun' | 'gaming' | 'community' | 'custom';
}

// Pre-built personality templates
export const PERSONALITY_TEMPLATES: Record<string, Partial<BotPersonality>> = {
  // Classic OC Phil style (default)
  oc_phil: {
    responseStyle: {
      formality: 'friendly',
      enthusiasm: 'high',
      humor: 'moderate',
      emojis: 'balanced',
      catchphrases: ['Game on!', "Let's dominate!", 'Victory is yours!'],
      signatureClosing: '🏈 Coach Phil',
    },
    voiceTone: {
      primary: 'coach',
      secondary: 'motivational',
      customTraits: [
        'uses football terminology',
        'celebrates wins enthusiastically',
      ],
    },
  },

  // Professional advisor
  professional: {
    responseStyle: {
      formality: 'professional',
      enthusiasm: 'medium',
      humor: 'light',
      emojis: 'minimal',
      catchphrases: ['Strategic thinking wins', 'Data-driven decisions'],
      signatureClosing: '📊 Your Strategy Advisor',
    },
    voiceTone: {
      primary: 'expert',
      secondary: 'analytical',
      customTraits: ['focuses on metrics', 'provides detailed analysis'],
    },
  },

  // Community friend
  community_buddy: {
    responseStyle: {
      formality: 'casual',
      enthusiasm: 'medium',
      humor: 'moderate',
      emojis: 'heavy',
      catchphrases: ['Hey there!', 'You got this!', 'Community first!'],
      signatureClosing: '😊 Your Community Buddy',
    },
    voiceTone: {
      primary: 'friend',
      secondary: 'supportive',
      customTraits: [
        'remembers personal details',
        'celebrates community milestones',
      ],
    },
  },

  // High-energy entertainer
  hype_master: {
    responseStyle: {
      formality: 'casual',
      enthusiasm: 'extreme',
      humor: 'heavy',
      emojis: 'heavy',
      catchphrases: ["LET'S GOOO!", 'HYPE TRAIN!', 'ABSOLUTELY CRUSHING IT!'],
      signatureClosing: '🚀 THE HYPE MASTER',
    },
    voiceTone: {
      primary: 'entertainer',
      secondary: 'motivational',
      customTraits: ['ALL CAPS excitement', 'creates intense energy'],
    },
  },

  // Zen mentor
  zen_mentor: {
    responseStyle: {
      formality: 'professional',
      enthusiasm: 'low',
      humor: 'light',
      emojis: 'minimal',
      catchphrases: ['Patience builds champions', 'Trust the process'],
      signatureClosing: '🧘 Your Zen Guide',
    },
    voiceTone: {
      primary: 'mentor',
      secondary: 'supportive',
      customTraits: ['philosophical approach', 'emphasizes long-term growth'],
    },
  },
};

export class BotPersonalityCustomizer {
  /**
   * Generate personality options for CBL to choose from
   */
  static generatePersonalityOptions(
    cblPlatform: string,
    platformHandle?: string,
  ): BotPersonality[] {
    const baseOptions: BotPersonality[] = [];

    // Create variations for each template
    Object.entries(PERSONALITY_TEMPLATES).forEach(([key, template]) => {
      const personality: BotPersonality = {
        name: this.generatePersonalityName(key, platformHandle),
        username: this.generateUsername(key, platformHandle),
        description: this.generateDescription(key, platformHandle),
        welcomeMessage: this.generateWelcomeMessage(key, platformHandle),
        responseStyle: template.responseStyle!,
        voiceTone: template.voiceTone!,
        branding: this.generateBranding(key),
      };

      baseOptions.push(personality);
    });

    return baseOptions;
  }

  /**
   * Generate name based on personality and platform
   */
  private static generatePersonalityName(
    personalityKey: string,
    platformHandle?: string,
  ): string {
    const base = platformHandle || 'Your Community';

    const nameTemplates: Record<string, string[]> = {
      oc_phil: [`${base} Coach`, `${base} Strategy Guide`, `Coach ${base}`],
      professional: [`${base} Advisor`, `${base} Analytics`, `${base} Pro`],
      community_buddy: [`${base} Buddy`, `${base} Helper`, `${base} Friend`],
      hype_master: [`${base} HYPE`, `${base} Energy`, `THE ${base} MACHINE`],
      zen_mentor: [`${base} Guide`, `${base} Mentor`, `Zen ${base}`],
    };

    return nameTemplates[personalityKey]?.[0] || `${base} Bot`;
  }

  /**
   * Generate username based on personality
   */
  private static generateUsername(
    personalityKey: string,
    platformHandle?: string,
  ): string {
    const base =
      platformHandle?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'community';

    const suffixes: Record<string, string> = {
      oc_phil: '_coach_bot',
      professional: '_advisor_bot',
      community_buddy: '_buddy_bot',
      hype_master: '_hype_bot',
      zen_mentor: '_guide_bot',
    };

    return `${base}${suffixes[personalityKey] || '_bot'}`;
  }

  /**
   * Generate description based on personality
   */
  private static generateDescription(
    personalityKey: string,
    platformHandle?: string,
  ): string {
    const community = platformHandle || 'your community';

    const descriptions: Record<string, string> = {
      oc_phil: `Your personal squares coach for ${community}! 🏈 Ready to dominate with proven strategies and endless energy!`,
      professional: `Professional squares strategy advisor for ${community}. 📊 Data-driven insights and expert analysis at your service.`,
      community_buddy: `Your friendly squares companion for ${community}! 😊 Here to help, celebrate, and build our amazing community together!`,
      hype_master: `THE ULTIMATE HYPE MACHINE FOR ${community.toUpperCase()}! 🚀 GET READY TO CRUSH EVERY BOARD WITH MAXIMUM ENERGY!`,
      zen_mentor: `Your zen squares guide for ${community}. 🧘 Patience, wisdom, and steady growth toward championship success.`,
    };

    return descriptions[personalityKey] || `Your squares bot for ${community}!`;
  }

  /**
   * Generate welcome message based on personality
   */
  private static generateWelcomeMessage(
    personalityKey: string,
    platformHandle?: string,
  ): string {
    const community = platformHandle || 'the community';

    const welcomes: Record<string, string> = {
      oc_phil: `🏈 Welcome to ${community}!\n\nI'm your personal squares coach, ready to help you dominate every board! Let's turn strategy into victory!\n\nUse /help to see all my coaching tools. Game on! 🚀`,

      professional: `📊 Welcome to ${community}.\n\nI'm your strategic advisor, providing data-driven insights for optimal board performance. My analytics will help you make informed decisions.\n\nUse /help to access professional tools and analysis.`,

      community_buddy: `😊 Hey there, welcome to ${community}!\n\nI'm so excited you're here! I'm your friendly squares buddy, ready to help with anything you need. This community is amazing and you're going to love it!\n\nUse /help to see how I can help! 🎉`,

      hype_master: `🚀 WELCOME TO ${community.toUpperCase()}!\n\nYO! I'M YOUR HYPE MASTER AND WE'RE ABOUT TO ABSOLUTELY CRUSH EVERY SINGLE BOARD! THE ENERGY IS UNREAL!\n\nUSE /help TO SEE ALL THE AMAZING TOOLS! LET'S GOOOO! 🔥🔥🔥`,

      zen_mentor: `🧘 Welcome to ${community}.\n\nI am your zen guide on the path to squares mastery. Success comes through patience, understanding, and consistent growth.\n\nUse /help to begin your journey toward championship mindset.`,
    };

    return (
      welcomes[personalityKey] ||
      `Welcome to ${community}! Use /help to get started.`
    );
  }

  /**
   * Generate branding based on personality
   */
  private static generateBranding(personalityKey: string): BotBranding {
    const brandings: Record<string, BotBranding> = {
      oc_phil: {
        primaryColor: '#255c7e', // Brand blue
        accentColor: '#ed5925', // Brand orange
        theme: 'professional',
      },
      professional: {
        primaryColor: '#2c3e50', // Navy
        accentColor: '#3498db', // Blue
        theme: 'professional',
      },
      community_buddy: {
        primaryColor: '#27ae60', // Green
        accentColor: '#f39c12', // Orange
        theme: 'community',
      },
      hype_master: {
        primaryColor: '#e74c3c', // Red
        accentColor: '#f1c40f', // Yellow
        theme: 'gaming',
      },
      zen_mentor: {
        primaryColor: '#8e44ad', // Purple
        accentColor: '#95a5a6', // Gray
        theme: 'professional',
      },
    };

    return (
      brandings[personalityKey] || {
        primaryColor: '#255c7e',
        accentColor: '#ed5925',
        theme: 'professional',
      }
    );
  }

  /**
   * Apply personality to command responses
   */
  static personalizeResponse(
    baseResponse: string,
    personality: BotPersonality,
    commandContext?: string,
  ): string {
    let response = baseResponse;

    // Apply enthusiasm level
    if (personality.responseStyle.enthusiasm === 'extreme') {
      response = response.toUpperCase();
    }

    // Add personality-specific elements
    if (personality.responseStyle.catchphrases.length > 0) {
      const catchphrase =
        personality.responseStyle.catchphrases[
          Math.floor(
            Math.random() * personality.responseStyle.catchphrases.length,
          )
        ];
      response = `${catchphrase} ${response}`;
    }

    // Adjust emoji usage
    const emojiLevel = personality.responseStyle.emojis;
    if (emojiLevel === 'heavy') {
      // Add more emojis based on context
      if (commandContext === 'celebration') {
        response += ' 🎉🏆🚀';
      } else if (commandContext === 'strategy') {
        response += ' 🎯📊💡';
      }
    } else if (emojiLevel === 'minimal') {
      // Remove excess emojis
      response = response.replace(/[🎉🏆🚀🎯📊💡😊🔥]+/g, '');
    }

    // Add signature closing
    if (personality.responseStyle.signatureClosing) {
      response += `\n\n${personality.responseStyle.signatureClosing}`;
    }

    return response;
  }

  /**
   * Create custom commands for personality
   */
  static generateCustomCommands(personality: BotPersonality): CustomCommand[] {
    const commands: CustomCommand[] = [];

    // Add personality-specific commands
    switch (personality.voiceTone.primary) {
      case 'coach':
        commands.push({
          command: 'motivate',
          description: 'Get a motivational coaching message',
          response:
            personality.responseStyle.catchphrases[0] || 'You got this!',
          category: 'custom',
        });
        break;

      case 'friend':
        commands.push({
          command: 'checkin',
          description: 'Casual check-in and community updates',
          response: 'Hey! How are you doing today? 😊',
          category: 'custom',
        });
        break;

      case 'entertainer':
        commands.push({
          command: 'hype',
          description: 'GET MAXIMUM HYPE ENERGY!',
          response: "LET'S GOOOOO! 🚀🔥 TIME TO CRUSH EVERYTHING!",
          category: 'custom',
        });
        break;

      case 'mentor':
        commands.push({
          command: 'wisdom',
          description: 'Receive thoughtful guidance',
          response: 'Remember: patience and consistency build champions. 🧘',
          category: 'custom',
        });
        break;
    }

    return commands;
  }

  /**
   * Validate custom personality settings
   */
  static validatePersonality(personality: BotPersonality): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!personality.name || personality.name.length < 3) {
      errors.push('Bot name must be at least 3 characters');
    }

    if (
      !personality.username ||
      !personality.username.match(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/)
    ) {
      errors.push('Invalid username format');
    }

    if (!personality.username.toLowerCase().endsWith('bot')) {
      errors.push('Username must end with "bot"');
    }

    if (!personality.description || personality.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (!personality.welcomeMessage || personality.welcomeMessage.length < 20) {
      errors.push('Welcome message must be at least 20 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Service is already exported with the class declaration above
