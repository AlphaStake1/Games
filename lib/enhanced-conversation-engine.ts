// Enhanced Conversation Engine for Intelligent Bot Interactions
// Provides contextual understanding, memory, and flexible response generation

export interface ConversationTurn {
  id: string;
  userInput: string;
  botResponse: string;
  timestamp: Date;
  intent: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
}

export interface UserContext {
  sessionId: string;
  conversationHistory: ConversationTurn[];
  preferences: Record<string, any>;
  previousTopics: string[];
  userProfile: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    interests: string[];
    frustrationLevel: 'low' | 'medium' | 'high';
  };
}

export interface EnhancedResponse {
  response: string;
  intent: string;
  confidence: number;
  followUpQuestions?: string[];
  relatedTopics?: string[];
  personalityElements: {
    empathy?: boolean;
    encouragement?: boolean;
    technical?: boolean;
    casual?: boolean;
  };
}

export interface BotPersonality {
  name: string;
  traits: {
    formality: 'casual' | 'professional' | 'friendly';
    humor: 'witty' | 'gentle' | 'serious';
    supportStyle: 'coaching' | 'teaching' | 'problem-solving';
    expertise: string[];
  };
  responsePatterns: {
    greeting: string[];
    encouragement: string[];
    confusion: string[];
    success: string[];
  };
}

// Intent Classification System
export class IntentClassifier {
  private static patterns = {
    // Technical Support
    technical_issue: [
      /wallet.*(?:not working|disconnect|error|fail|problem)/i,
      /(?:can't|cannot).*(?:connect|load|access)/i,
      /(?:error|bug|issue|problem).*(?:with|in)/i,
      /(?:transaction|payment).*(?:fail|stuck|pending)/i,
    ],
    
    // Information Seeking
    how_to: [
      /how (?:do|can) i/i,
      /what (?:is|are)/i,
      /where (?:is|can|do)/i,
      /when (?:do|should)/i,
    ],
    
    // Emotional States
    frustrated: [
      /(?:this is|i'm).*(?:frustrat|annoying|stupid|ridiculous)/i,
      /(?:why (?:is|does)|what the hell)/i,
      /(?:doesn't work|not working|broken)/i,
    ],
    
    confused: [
      /(?:i don't|don't).*understand/i,
      /(?:confused|lost|unclear)/i,
      /what (?:does|do you) mean/i,
    ],
    
    // Specific Domains
    crypto_related: [
      /(?:crypto|cryptocurrency|bitcoin|solana|sol|wallet|defi|nft)/i,
    ],
    
    game_related: [
      /(?:squares|game|board|play|rules|payout|win)/i,
    ],
    
    wellness_related: [
      /(?:stress|tired|burn|overwhelm|help|support|wellness|health)/i,
    ],
  };

  static classifyIntent(message: string): { intent: string; confidence: number } {
    const message_lower = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        if (pattern.test(message_lower)) {
          // Calculate confidence based on pattern specificity
          const confidence = this.calculateConfidence(message, pattern);
          return { intent, confidence };
        }
      }
    }
    
    return { intent: 'general_inquiry', confidence: 0.5 };
  }
  
  private static calculateConfidence(message: string, pattern: RegExp): number {
    const match = message.match(pattern);
    if (!match) return 0;
    
    // Longer matches = higher confidence
    const matchLength = match[0].length;
    const messageLength = message.length;
    const baseConfidence = Math.min(0.9, matchLength / messageLength * 2);
    
    return Math.max(0.3, baseConfidence);
  }
}

// Sentiment Analysis
export class SentimentAnalyzer {
  private static positiveWords = [
    'great', 'awesome', 'love', 'excellent', 'perfect', 'amazing', 'fantastic',
    'thanks', 'helpful', 'good', 'nice', 'wonderful', 'appreciate'
  ];
  
  private static negativeWords = [
    'hate', 'terrible', 'awful', 'sucks', 'worst', 'horrible', 'frustrated',
    'annoyed', 'angry', 'confused', 'stupid', 'broken', 'useless', 'fail'
  ];
  
  static analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const words = message.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (this.positiveWords.includes(word)) positiveScore++;
      if (this.negativeWords.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }
}

// Enhanced Response Generator
export class ResponseGenerator {
  constructor(private personality: BotPersonality) {}
  
  generateResponse(
    userMessage: string,
    context: UserContext,
    baseResponse: string
  ): EnhancedResponse {
    const { intent, confidence } = IntentClassifier.classifyIntent(userMessage);
    const sentiment = SentimentAnalyzer.analyzeSentiment(userMessage);
    
    // Enhance base response with personality and context
    let enhancedResponse = this.addPersonalityToResponse(
      baseResponse, 
      intent, 
      sentiment,
      context
    );
    
    // Add contextual elements based on conversation history
    if (context.conversationHistory.length > 0) {
      enhancedResponse = this.addContextualContinuity(
        enhancedResponse,
        context
      );
    }
    
    return {
      response: enhancedResponse,
      intent,
      confidence,
      followUpQuestions: this.generateFollowUpQuestions(intent, context),
      relatedTopics: this.extractTopics(userMessage, intent),
      personalityElements: this.getPersonalityElements(intent, sentiment)
    };
  }
  
  private addPersonalityToResponse(
    baseResponse: string,
    intent: string,
    sentiment: 'positive' | 'negative' | 'neutral',
    context: UserContext
  ): string {
    let enhanced = baseResponse;
    
    // Add empathy for frustrated users
    if (sentiment === 'negative' || context.userProfile.frustrationLevel === 'high') {
      enhanced = this.addEmpathy(enhanced);
    }
    
    // Add encouragement for confused users
    if (intent === 'confused' || context.userProfile.frustrationLevel === 'medium') {
      enhanced = this.addEncouragement(enhanced);
    }
    
    // Adjust formality based on personality and user experience
    enhanced = this.adjustFormality(enhanced, context.userProfile.experienceLevel);
    
    return enhanced;
  }
  
  private addEmpathy(response: string): string {
    const empathyPhrases = [
      "I understand that can be frustrating. ",
      "I can see why that would be confusing. ",
      "That sounds like a real pain point. ",
      "I hear you - that's definitely annoying. "
    ];
    
    const phrase = empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)];
    return phrase + response;
  }
  
  private addEncouragement(response: string): string {
    const encouragementPhrases = [
      "Don't worry, we'll get this sorted out! ",
      "No problem - I'm here to help! ",
      "Let's tackle this step by step. ",
      "You're asking great questions! "
    ];
    
    const phrase = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
    return phrase + response;
  }
  
  private adjustFormality(response: string, experienceLevel: string): string {
    if (experienceLevel === 'beginner') {
      // Use simpler language, more explanatory
      response = response.replace(/utilize/g, 'use');
      response = response.replace(/implement/g, 'set up');
      response = response.replace(/configure/g, 'adjust');
    }
    
    return response;
  }
  
  private addContextualContinuity(response: string, context: UserContext): string {
    const lastTurn = context.conversationHistory[context.conversationHistory.length - 1];
    
    // Reference previous conversation if relevant
    if (lastTurn && this.isRelatedTopic(lastTurn.topics, response)) {
      const continuityPhrases = [
        "Building on what we discussed earlier, ",
        "Following up from your previous question, ",
        "Since we were talking about this before, "
      ];
      
      const phrase = continuityPhrases[Math.floor(Math.random() * continuityPhrases.length)];
      return phrase + response.toLowerCase();
    }
    
    return response;
  }
  
  private isRelatedTopic(previousTopics: string[], currentResponse: string): boolean {
    return previousTopics.some(topic => 
      currentResponse.toLowerCase().includes(topic.toLowerCase())
    );
  }
  
  private generateFollowUpQuestions(intent: string, context: UserContext): string[] {
    const followUps: Record<string, string[]> = {
      technical_issue: [
        "What browser are you using?",
        "When did this problem first start?",
        "Have you tried refreshing the page?"
      ],
      how_to: [
        "Would you like a step-by-step walkthrough?",
        "Are you looking for beginner or advanced guidance?",
        "Should I explain the background first?"
      ],
      frustrated: [
        "What's the most frustrating part?",
        "Would you prefer to take a different approach?",
        "Is there a specific deadline you're working with?"
      ]
    };
    
    return followUps[intent] || [];
  }
  
  private extractTopics(message: string, intent: string): string[] {
    const topicKeywords = {
      crypto: ['wallet', 'solana', 'transaction', 'crypto', 'sol'],
      gaming: ['squares', 'board', 'game', 'play', 'rules'],
      wellness: ['stress', 'tired', 'overwhelmed', 'help', 'support'],
      technical: ['error', 'bug', 'problem', 'broken', 'fix']
    };
    
    const extractedTopics: string[] = [];
    const messageLower = message.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        extractedTopics.push(topic);
      }
    }
    
    return extractedTopics;
  }
  
  private getPersonalityElements(
    intent: string, 
    sentiment: 'positive' | 'negative' | 'neutral'
  ) {
    return {
      empathy: sentiment === 'negative',
      encouragement: intent === 'confused' || sentiment === 'negative',
      technical: intent === 'technical_issue',
      casual: this.personality.traits.formality === 'casual'
    };
  }
}

// Conversation Memory Management
export class ConversationMemory {
  private static sessions = new Map<string, UserContext>();
  
  static getOrCreateSession(sessionId: string): UserContext {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        conversationHistory: [],
        preferences: {},
        previousTopics: [],
        userProfile: {
          experienceLevel: 'intermediate',
          interests: [],
          frustrationLevel: 'low'
        }
      });
    }
    
    return this.sessions.get(sessionId)!;
  }
  
  static addTurn(sessionId: string, turn: ConversationTurn): void {
    const session = this.getOrCreateSession(sessionId);
    session.conversationHistory.push(turn);
    
    // Update user profile based on interaction patterns
    this.updateUserProfile(session, turn);
    
    // Keep only last 10 turns to manage memory
    if (session.conversationHistory.length > 10) {
      session.conversationHistory = session.conversationHistory.slice(-10);
    }
  }
  
  private static updateUserProfile(session: UserContext, turn: ConversationTurn): void {
    // Update frustration level based on sentiment patterns
    const recentTurns = session.conversationHistory.slice(-3);
    const negativeTurns = recentTurns.filter(t => t.sentiment === 'negative').length;
    
    if (negativeTurns >= 2) {
      session.userProfile.frustrationLevel = 'high';
    } else if (negativeTurns === 1) {
      session.userProfile.frustrationLevel = 'medium';
    } else {
      session.userProfile.frustrationLevel = 'low';
    }
    
    // Track topic interests
    turn.topics.forEach(topic => {
      if (!session.userProfile.interests.includes(topic)) {
        session.userProfile.interests.push(topic);
      }
    });
    
    // Update previous topics
    session.previousTopics = [...new Set([...session.previousTopics, ...turn.topics])];
  }
}

// Main Enhanced Bot Interface
export interface EnhancedBotConfig {
  name: string;
  personality: BotPersonality;
  knowledgeBase: (message: string) => { response: string; topics: string[] };
}

export class EnhancedBot {
  private responseGenerator: ResponseGenerator;
  
  constructor(private config: EnhancedBotConfig) {
    this.responseGenerator = new ResponseGenerator(config.personality);
  }
  
  processMessage(userMessage: string, sessionId: string): EnhancedResponse {
    const session = ConversationMemory.getOrCreateSession(sessionId);
    
    // Get base response from knowledge base
    const { response: baseResponse, topics } = this.config.knowledgeBase(userMessage);
    
    // Enhance with context and personality
    const enhancedResponse = this.responseGenerator.generateResponse(
      userMessage,
      session,
      baseResponse
    );
    
    // Save conversation turn
    const turn: ConversationTurn = {
      id: Date.now().toString(),
      userInput: userMessage,
      botResponse: enhancedResponse.response,
      timestamp: new Date(),
      intent: enhancedResponse.intent,
      sentiment: SentimentAnalyzer.analyzeSentiment(userMessage),
      topics: topics
    };
    
    ConversationMemory.addTurn(sessionId, turn);
    
    return enhancedResponse;
  }
}