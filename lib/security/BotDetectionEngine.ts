/**
 * Bot Detection Engine - Advanced behavioral analysis for automated user detection
 * Implements the bot policy framework with graduated response system
 */

export interface BotDetectionMetadata {
  responseTime?: number;
  userAgent?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  sessionId?: string;
  platform?: 'web' | 'discord' | 'telegram';
}

export interface InteractionHistory {
  userId: string;
  timestamp: number;
  message: string;
  responseTime: number;
  platform: string;
  agentId: string;
  metadata?: BotDetectionMetadata;
}

export interface BotAssessment {
  isBot: boolean;
  confidence: number; // 0-1 scale
  indicators: string[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CONFIRMED';
  recommendation: BotEnforcementAction;
  reasoning: string;
}

export interface BotEnforcementAction {
  type: 'monitor' | 'challenge' | 'restrict' | 'quarantine' | 'ban';
  duration?: number; // milliseconds
  requirements?: string[];
  appealable: boolean;
}

export interface BotPattern {
  id: string;
  name: string;
  threshold: number;
  weight: number;
  description: string;
  category: 'timing' | 'linguistic' | 'behavioral' | 'technical';
}

export class BotDetectionEngine {
  private readonly patterns: BotPattern[] = [
    // Timing Analysis Patterns
    {
      id: 'INHUMAN_SPEED',
      name: 'Response Too Fast',
      threshold: 300, // ms
      weight: 0.8,
      description: 'Responses faster than humanly possible for typing',
      category: 'timing',
    },
    {
      id: 'PERFECT_TIMING',
      name: 'Identical Response Times',
      threshold: 0.95, // consistency score
      weight: 0.7,
      description: 'Response times show no natural human variation',
      category: 'timing',
    },
    {
      id: 'NO_TYPING_DELAY',
      name: 'No Typing Simulation',
      threshold: 0.9, // immediacy score
      weight: 0.6,
      description: 'No natural typing delays for message length',
      category: 'timing',
    },

    // Linguistic Analysis Patterns
    {
      id: 'PERFECT_GRAMMAR',
      name: 'Unnaturally Perfect Grammar',
      threshold: 0.95, // perfection score
      weight: 0.6,
      description: 'Grammar and spelling too perfect for casual chat',
      category: 'linguistic',
    },
    {
      id: 'REPETITIVE_STRUCTURE',
      name: 'Repetitive Sentence Patterns',
      threshold: 0.8, // similarity score
      weight: 0.5,
      description: 'Uses identical sentence structures repeatedly',
      category: 'linguistic',
    },
    {
      id: 'VOCABULARY_CONSISTENCY',
      name: 'Limited Vocabulary Range',
      threshold: 0.9, // consistency score
      weight: 0.4,
      description: 'Uses same words and phrases repeatedly',
      category: 'linguistic',
    },

    // Behavioral Analysis Patterns
    {
      id: 'NO_EMOTIONAL_RANGE',
      name: 'Flat Emotional Response',
      threshold: 0.9, // emotional flatness score
      weight: 0.7,
      description: 'Responses lack natural emotional variation',
      category: 'behavioral',
    },
    {
      id: 'CONTEXT_IGNORING',
      name: 'Ignores Conversation Context',
      threshold: 0.8, // context awareness score
      weight: 0.8,
      description: 'Fails to reference or respond to previous messages',
      category: 'behavioral',
    },
    {
      id: 'TASK_ONLY_FOCUS',
      name: 'Only Task-Focused Interactions',
      threshold: 0.9, // task focus ratio
      weight: 0.6,
      description: 'Never engages in small talk or casual conversation',
      category: 'behavioral',
    },
    {
      id: 'NO_PERSONALITY',
      name: 'Lacks Individual Personality',
      threshold: 0.85, // personality variance score
      weight: 0.5,
      description: 'Responses show no individual personality traits',
      category: 'behavioral',
    },

    // Technical Fingerprinting Patterns
    {
      id: 'HEADLESS_BROWSER',
      name: 'Headless Browser Signature',
      threshold: 0.9, // automation score
      weight: 0.9,
      description: 'User-Agent or behavior suggests automated browser',
      category: 'technical',
    },
    {
      id: 'MISSING_HUMAN_EVENTS',
      name: 'Missing Human Interaction Events',
      threshold: 0.8, // human event score
      weight: 0.7,
      description: 'Lacks mouse movements, scrolling, or other human behaviors',
      category: 'technical',
    },
    {
      id: 'IDENTICAL_FINGERPRINTS',
      name: 'Identical Device Fingerprints',
      threshold: 0.95, // similarity score
      weight: 0.8,
      description: 'Multiple accounts with identical device characteristics',
      category: 'technical',
    },
  ];

  private readonly enforcementLevels = {
    LOW: {
      // 0.3-0.5 confidence
      type: 'monitor' as const,
      duration: 24 * 60 * 60 * 1000, // 24 hours
      requirements: ['enhanced_monitoring'],
      appealable: true,
    },
    MODERATE: {
      // 0.5-0.7 confidence
      type: 'challenge' as const,
      duration: 48 * 60 * 60 * 1000, // 48 hours
      requirements: ['captcha_verification', 'behavioral_questions'],
      appealable: true,
    },
    HIGH: {
      // 0.7-0.9 confidence
      type: 'restrict' as const,
      duration: 7 * 24 * 60 * 60 * 1000, // 7 days
      requirements: ['human_verification', 'video_call', 'id_verification'],
      appealable: true,
    },
    CONFIRMED: {
      // 0.9+ confidence
      type: 'quarantine' as const,
      duration: undefined, // Permanent until manual review
      requirements: ['manual_review', 'evidence_submission'],
      appealable: true,
    },
  };

  /**
   * Analyze user interaction history for bot indicators
   */
  async assessBotProbability(
    userId: string,
    interactionHistory: InteractionHistory[],
    metadata?: BotDetectionMetadata,
  ): Promise<BotAssessment> {
    const indicators: string[] = [];
    let totalScore = 0;
    let maxWeight = 0;

    // Timing Analysis
    const timingScore = this.analyzeTimingPatterns(interactionHistory);
    if (timingScore.triggered.length > 0) {
      indicators.push(...timingScore.triggered);
      totalScore += timingScore.score;
      maxWeight += timingScore.maxWeight;
    }

    // Linguistic Analysis
    const linguisticScore =
      await this.analyzeLinguisticPatterns(interactionHistory);
    if (linguisticScore.triggered.length > 0) {
      indicators.push(...linguisticScore.triggered);
      totalScore += linguisticScore.score;
      maxWeight += linguisticScore.maxWeight;
    }

    // Behavioral Analysis
    const behavioralScore =
      await this.analyzeBehavioralPatterns(interactionHistory);
    if (behavioralScore.triggered.length > 0) {
      indicators.push(...behavioralScore.triggered);
      totalScore += behavioralScore.score;
      maxWeight += behavioralScore.maxWeight;
    }

    // Technical Analysis
    const technicalScore = this.analyzeTechnicalPatterns(
      interactionHistory,
      metadata,
    );
    if (technicalScore.triggered.length > 0) {
      indicators.push(...technicalScore.triggered);
      totalScore += technicalScore.score;
      maxWeight += technicalScore.maxWeight;
    }

    // Calculate confidence score (0-1)
    const confidence =
      maxWeight > 0 ? Math.min(totalScore / maxWeight, 1.0) : 0;

    // Determine risk level and enforcement action
    const riskLevel = this.calculateRiskLevel(confidence);
    const recommendation = this.enforcementLevels[riskLevel];

    return {
      isBot: confidence >= 0.5,
      confidence,
      indicators,
      riskLevel,
      recommendation,
      reasoning: this.generateReasoning(indicators, confidence, riskLevel),
    };
  }

  /**
   * Analyze timing patterns in user interactions
   */
  private analyzeTimingPatterns(history: InteractionHistory[]): {
    score: number;
    maxWeight: number;
    triggered: string[];
  } {
    if (history.length < 3) return { score: 0, maxWeight: 0, triggered: [] };

    const responseTimes = history
      .filter((h) => h.responseTime > 0)
      .map((h) => h.responseTime);

    if (responseTimes.length < 3)
      return { score: 0, maxWeight: 0, triggered: [] };

    let score = 0;
    let maxWeight = 0;
    const triggered: string[] = [];

    // Check for inhuman speed
    const avgResponseTime =
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const inhumanSpeedPattern = this.patterns.find(
      (p) => p.id === 'INHUMAN_SPEED',
    )!;
    if (avgResponseTime < inhumanSpeedPattern.threshold) {
      score += inhumanSpeedPattern.weight;
      triggered.push(inhumanSpeedPattern.description);
    }
    maxWeight += inhumanSpeedPattern.weight;

    // Check for perfect timing consistency
    const timeVariance = this.calculateVariance(responseTimes);
    const normalizedVariance = timeVariance / avgResponseTime; // Coefficient of variation
    const perfectTimingPattern = this.patterns.find(
      (p) => p.id === 'PERFECT_TIMING',
    )!;
    if (normalizedVariance < 1 - perfectTimingPattern.threshold) {
      score += perfectTimingPattern.weight;
      triggered.push(perfectTimingPattern.description);
    }
    maxWeight += perfectTimingPattern.weight;

    return { score, maxWeight, triggered };
  }

  /**
   * Analyze linguistic patterns in messages
   */
  private async analyzeLinguisticPatterns(
    history: InteractionHistory[],
  ): Promise<{
    score: number;
    maxWeight: number;
    triggered: string[];
  }> {
    if (history.length < 5) return { score: 0, maxWeight: 0, triggered: [] };

    const messages = history.map((h) => h.message);
    let score = 0;
    let maxWeight = 0;
    const triggered: string[] = [];

    // Grammar perfection analysis
    const grammarScore = await this.analyzeGrammarPerfection(messages);
    const perfectGrammarPattern = this.patterns.find(
      (p) => p.id === 'PERFECT_GRAMMAR',
    )!;
    if (grammarScore > perfectGrammarPattern.threshold) {
      score += perfectGrammarPattern.weight;
      triggered.push(perfectGrammarPattern.description);
    }
    maxWeight += perfectGrammarPattern.weight;

    // Sentence structure repetition
    const structureScore = this.analyzeSentenceStructure(messages);
    const repetitiveStructurePattern = this.patterns.find(
      (p) => p.id === 'REPETITIVE_STRUCTURE',
    )!;
    if (structureScore > repetitiveStructurePattern.threshold) {
      score += repetitiveStructurePattern.weight;
      triggered.push(repetitiveStructurePattern.description);
    }
    maxWeight += repetitiveStructurePattern.weight;

    // Vocabulary consistency
    const vocabularyScore = this.analyzeVocabularyConsistency(messages);
    const vocabularyPattern = this.patterns.find(
      (p) => p.id === 'VOCABULARY_CONSISTENCY',
    )!;
    if (vocabularyScore > vocabularyPattern.threshold) {
      score += vocabularyPattern.weight;
      triggered.push(vocabularyPattern.description);
    }
    maxWeight += vocabularyPattern.weight;

    return { score, maxWeight, triggered };
  }

  /**
   * Analyze behavioral patterns in interactions
   */
  private async analyzeBehavioralPatterns(
    history: InteractionHistory[],
  ): Promise<{
    score: number;
    maxWeight: number;
    triggered: string[];
  }> {
    if (history.length < 5) return { score: 0, maxWeight: 0, triggered: [] };

    let score = 0;
    let maxWeight = 0;
    const triggered: string[] = [];

    // Emotional range analysis
    const emotionalScore = this.analyzeEmotionalRange(
      history.map((h) => h.message),
    );
    const emotionalPattern = this.patterns.find(
      (p) => p.id === 'NO_EMOTIONAL_RANGE',
    )!;
    if (emotionalScore > emotionalPattern.threshold) {
      score += emotionalPattern.weight;
      triggered.push(emotionalPattern.description);
    }
    maxWeight += emotionalPattern.weight;

    // Context awareness analysis
    const contextScore = this.analyzeContextAwareness(history);
    const contextPattern = this.patterns.find(
      (p) => p.id === 'CONTEXT_IGNORING',
    )!;
    if (contextScore > contextPattern.threshold) {
      score += contextPattern.weight;
      triggered.push(contextPattern.description);
    }
    maxWeight += contextPattern.weight;

    // Task focus analysis
    const taskFocusScore = this.analyzeTaskFocus(history.map((h) => h.message));
    const taskFocusPattern = this.patterns.find(
      (p) => p.id === 'TASK_ONLY_FOCUS',
    )!;
    if (taskFocusScore > taskFocusPattern.threshold) {
      score += taskFocusPattern.weight;
      triggered.push(taskFocusPattern.description);
    }
    maxWeight += taskFocusPattern.weight;

    return { score, maxWeight, triggered };
  }

  /**
   * Analyze technical patterns and fingerprints
   */
  private analyzeTechnicalPatterns(
    history: InteractionHistory[],
    metadata?: BotDetectionMetadata,
  ): {
    score: number;
    maxWeight: number;
    triggered: string[];
  } {
    let score = 0;
    let maxWeight = 0;
    const triggered: string[] = [];

    if (!metadata) return { score, maxWeight, triggered };

    // Headless browser detection
    if (metadata.userAgent) {
      const headlessScore = this.analyzeUserAgent(metadata.userAgent);
      const headlessPattern = this.patterns.find(
        (p) => p.id === 'HEADLESS_BROWSER',
      )!;
      if (headlessScore > headlessPattern.threshold) {
        score += headlessPattern.weight;
        triggered.push(headlessPattern.description);
      }
      maxWeight += headlessPattern.weight;
    }

    // Device fingerprint analysis
    if (metadata.deviceFingerprint) {
      const fingerprintScore = this.analyzeDeviceFingerprint(
        metadata.deviceFingerprint,
      );
      const fingerprintPattern = this.patterns.find(
        (p) => p.id === 'IDENTICAL_FINGERPRINTS',
      )!;
      if (fingerprintScore > fingerprintPattern.threshold) {
        score += fingerprintPattern.weight;
        triggered.push(fingerprintPattern.description);
      }
      maxWeight += fingerprintPattern.weight;
    }

    return { score, maxWeight, triggered };
  }

  /**
   * Helper methods for specific analysis types
   */
  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squaredDiffs = numbers.map((x) => Math.pow(x - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private async analyzeGrammarPerfection(messages: string[]): Promise<number> {
    // Simplified grammar analysis - in production, integrate with grammar checking API
    let errorCount = 0;
    let totalWords = 0;

    for (const message of messages) {
      const words = message.split(/\s+/).length;
      totalWords += words;

      // Simple heuristics for common errors
      if (!message.match(/[.!?]$/)) errorCount += 0.5; // Missing punctuation
      if (message.match(/\b(your|youre)\b/gi)) errorCount += 0.2; // Common typos
      if (message.match(/\b(its|it's)\b/gi)) errorCount += 0.2; // Common confusion
    }

    const errorRate = errorCount / Math.max(totalWords / 10, 1); // Errors per 10 words
    return Math.max(0, 1 - errorRate); // Higher score = more perfect grammar
  }

  private analyzeSentenceStructure(messages: string[]): number {
    if (messages.length < 3) return 0;

    // Analyze sentence start patterns
    const sentenceStarts = messages.map((msg) =>
      msg
        .split(/[.!?]+/)[0]
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' '),
    );

    const uniqueStarts = new Set(sentenceStarts);
    return 1 - uniqueStarts.size / sentenceStarts.length; // Higher = more repetitive
  }

  private analyzeVocabularyConsistency(messages: string[]): number {
    const allWords = messages.join(' ').toLowerCase().split(/\s+/);
    const uniqueWords = new Set(allWords);

    // Calculate vocabulary diversity (lower = more consistent/repetitive)
    const diversity = uniqueWords.size / allWords.length;
    return Math.max(0, 1 - diversity * 2); // Higher score = lower diversity
  }

  private analyzeEmotionalRange(messages: string[]): number {
    // Simple emotional indicator detection
    const emotionalIndicators = [
      /[!]{2,}/, // Multiple exclamation marks
      /[?]{2,}/, // Multiple question marks
      /\b(wow|amazing|terrible|awful|great|horrible)\b/gi, // Strong adjectives
      /[😀-🙏]/, // Emoji usage
      /\b(lol|haha|omg|wtf)\b/gi, // Casual expressions
    ];

    let emotionalMessages = 0;
    for (const message of messages) {
      if (emotionalIndicators.some((pattern) => pattern.test(message))) {
        emotionalMessages++;
      }
    }

    const emotionalRatio = emotionalMessages / messages.length;
    return Math.max(0, 1 - emotionalRatio * 2); // Higher score = less emotional range
  }

  private analyzeContextAwareness(history: InteractionHistory[]): number {
    let contextAwareResponses = 0;

    for (let i = 1; i < history.length; i++) {
      const current = history[i].message.toLowerCase();
      const previous = history[i - 1].message.toLowerCase();

      // Check for references to previous messages
      const contextIndicators = [
        /\b(that|this|it)\b/, // Pronouns referencing previous content
        /\b(you said|you mentioned|earlier|before)\b/, // Direct references
        /\b(yes|no|sure|okay)\b/, // Responses to questions
      ];

      if (contextIndicators.some((pattern) => pattern.test(current))) {
        contextAwareResponses++;
      }
    }

    const contextRatio =
      contextAwareResponses / Math.max(history.length - 1, 1);
    return Math.max(0, 1 - contextRatio); // Higher score = less context awareness
  }

  private analyzeTaskFocus(messages: string[]): number {
    const taskKeywords = [
      /\b(buy|purchase|square|game|price|cost|wallet|connect|help)\b/gi,
      /\b(how to|where|when|what|why)\b/gi, // Task-oriented questions
    ];

    const casualKeywords = [
      /\b(hello|hi|thanks|please|sorry)\b/gi, // Pleasantries
      /\b(weather|weekend|how are you)\b/gi, // Small talk
    ];

    let taskMessages = 0;
    let casualMessages = 0;

    for (const message of messages) {
      if (taskKeywords.some((pattern) => pattern.test(message))) {
        taskMessages++;
      }
      if (casualKeywords.some((pattern) => pattern.test(message))) {
        casualMessages++;
      }
    }

    const taskRatio = taskMessages / Math.max(messages.length, 1);
    const casualRatio = casualMessages / Math.max(messages.length, 1);

    // High task focus with low casual interaction suggests bot
    return Math.max(0, taskRatio - casualRatio);
  }

  private analyzeUserAgent(userAgent: string): number {
    const botIndicators = [
      /headless/i,
      /phantomjs/i,
      /selenium/i,
      /webdriver/i,
      /bot/i,
      /crawler/i,
      /spider/i,
    ];

    const suspiciousPatterns = [
      /^mozilla\/5\.0$/i, // Too generic
      /chrome\/0\.0\.0/i, // Invalid version
    ];

    if (botIndicators.some((pattern) => pattern.test(userAgent))) {
      return 1.0; // Definite bot indicator
    }

    if (suspiciousPatterns.some((pattern) => pattern.test(userAgent))) {
      return 0.8; // Suspicious but not definitive
    }

    return 0; // Normal user agent
  }

  private analyzeDeviceFingerprint(fingerprint: string): number {
    // This would integrate with a device fingerprinting service
    // For now, return a placeholder score
    return 0;
  }

  private calculateRiskLevel(
    confidence: number,
  ): 'LOW' | 'MODERATE' | 'HIGH' | 'CONFIRMED' {
    if (confidence >= 0.9) return 'CONFIRMED';
    if (confidence >= 0.7) return 'HIGH';
    if (confidence >= 0.5) return 'MODERATE';
    return 'LOW';
  }

  private generateReasoning(
    indicators: string[],
    confidence: number,
    riskLevel: string,
  ): string {
    if (indicators.length === 0) {
      return 'No bot indicators detected. User appears to be human.';
    }

    const primaryIndicators = indicators.slice(0, 3);
    const reasoning =
      `Bot detection confidence: ${Math.round(confidence * 100)}%. ` +
      `Primary indicators: ${primaryIndicators.join(', ')}. ` +
      `Risk level: ${riskLevel}. ` +
      `Recommendation: ${this.enforcementLevels[riskLevel as keyof typeof this.enforcementLevels].type}.`;

    return reasoning;
  }
}

/**
 * Factory function to create bot detection engine
 */
export function createBotDetectionEngine(): BotDetectionEngine {
  return new BotDetectionEngine();
}
