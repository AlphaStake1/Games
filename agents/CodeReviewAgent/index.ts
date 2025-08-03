/**
 * Code Review Specialist Agent for Football Squares Platform
 *
 * Provides automated code review capabilities focusing on:
 * - Rust/Anchor best practices and security patterns
 * - TypeScript/React code quality and patterns
 * - Integration patterns and architecture compliance
 * - Performance optimization suggestions
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { EventEmitter } from 'events';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface CodeReviewRequest {
  filePath: string;
  fileContent: string;
  changeType: 'new_file' | 'modification' | 'refactor';
  context?: {
    relatedFiles?: string[];
    purpose?: string;
    concerns?: string[];
  };
}

interface ReviewResult {
  overall: 'approved' | 'needs_changes' | 'blocked';
  score: number; // 0-100
  issues: ReviewIssue[];
  suggestions: ReviewSuggestion[];
  securityConcerns: SecurityConcern[];
  performanceNotes: PerformanceNote[];
  summary: string;
}

interface ReviewIssue {
  severity: 'critical' | 'major' | 'minor' | 'suggestion';
  type:
    | 'security'
    | 'performance'
    | 'maintainability'
    | 'style'
    | 'best_practice';
  line?: number;
  description: string;
  suggestion: string;
  autoFixable: boolean;
}

interface ReviewSuggestion {
  category: 'optimization' | 'refactor' | 'enhancement' | 'cleanup';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'minimal' | 'moderate' | 'significant';
}

interface SecurityConcern {
  level: 'critical' | 'high' | 'medium' | 'low';
  category:
    | 'solana_specific'
    | 'general_security'
    | 'access_control'
    | 'data_validation';
  description: string;
  recommendation: string;
}

interface PerformanceNote {
  type: 'improvement' | 'concern' | 'optimization';
  area: 'transaction_cost' | 'computation' | 'memory' | 'network';
  description: string;
  impact: string;
}

export class CodeReviewAgent extends EventEmitter {
  private anthropic: Anthropic;
  private reviewHistory: Map<string, ReviewResult[]> = new Map();
  private patterns: {
    rust: RegExp[];
    typescript: RegExp[];
    security: RegExp[];
  };

  constructor() {
    super();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for CodeReviewAgent');
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.patterns = this.initializePatterns();
    console.log('CodeReviewAgent initialized with Claude Sonnet 4');
  }

  /**
   * Review Rust/Anchor code
   */
  async reviewRustCode(request: CodeReviewRequest): Promise<ReviewResult> {
    try {
      const prompt = `
You are an expert Rust and Solana/Anchor code reviewer. Review the following code:

File: ${request.filePath}
Change Type: ${request.changeType}
${request.context?.purpose ? `Purpose: ${request.context.purpose}` : ''}
${request.context?.concerns ? `Specific Concerns: ${request.context.concerns.join(', ')}` : ''}

\`\`\`rust
${request.fileContent}
\`\`\`

Provide a comprehensive review focusing on:

1. **Solana/Anchor Security**:
   - Account validation (owner, signer, initialized checks)
   - PDA derivation correctness
   - Safe math operations (checked_add, checked_sub)
   - Cross-program invocation (CPI) safety
   - Rent exemption and account size validation

2. **Rust Best Practices**:
   - Error handling patterns
   - Memory safety and ownership
   - Type safety and bounds checking
   - Performance considerations
   - Code organization and modularity

3. **Anchor Patterns**:
   - Proper use of constraints and validations
   - Account structure design
   - Instruction parameter validation
   - Event emission patterns

4. **Performance & Optimization**:
   - Transaction size optimization
   - Computational efficiency
   - Account space utilization
   - Gas/compute unit considerations

Respond with a structured JSON review including:
- overall: "approved" | "needs_changes" | "blocked"
- score: 0-100
- issues: array of specific issues with severity and suggestions
- securityConcerns: array of security-specific concerns
- performanceNotes: array of performance observations
- summary: overall assessment

Focus on actionable feedback and specific line references where possible.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const reviewContent =
        response.content[0].type === 'text' ? response.content[0].text : '';

      const review = this.parseReviewResponse(reviewContent, 'rust');

      this.storeReviewHistory(request.filePath, review);
      this.emit('codeReviewed', {
        filePath: request.filePath,
        result: review,
        language: 'rust',
      });

      return review;
    } catch (error) {
      console.error('Error reviewing Rust code:', error);
      throw error;
    }
  }

  /**
   * Review TypeScript/JavaScript code
   */
  async reviewTypeScriptCode(
    request: CodeReviewRequest,
  ): Promise<ReviewResult> {
    try {
      const prompt = `
You are an expert TypeScript/JavaScript code reviewer specializing in React, Node.js, and Web3 applications. Review the following code:

File: ${request.filePath}
Change Type: ${request.changeType}
${request.context?.purpose ? `Purpose: ${request.context.purpose}` : ''}
${request.context?.concerns ? `Specific Concerns: ${request.context.concerns.join(', ')}` : ''}

\`\`\`typescript
${request.fileContent}
\`\`\`

Provide a comprehensive review focusing on:

1. **TypeScript Quality**:
   - Type safety and proper typing
   - Interface and type definitions
   - Generic usage and constraints
   - Null/undefined handling

2. **React Patterns** (if applicable):
   - Component architecture
   - Hook usage and patterns
   - State management
   - Performance optimizations (useMemo, useCallback)
   - Accessibility considerations

3. **Web3/Solana Integration**:
   - Wallet connection patterns
   - Transaction handling
   - Error handling for blockchain operations
   - Connection and provider management

4. **General Code Quality**:
   - Function design and single responsibility
   - Error handling and edge cases
   - Code organization and modularity
   - Testing considerations

5. **Performance**:
   - Bundle size impact
   - Runtime performance
   - Memory usage patterns
   - Async operation handling

Respond with a structured JSON review including:
- overall: "approved" | "needs_changes" | "blocked"
- score: 0-100
- issues: array of specific issues with severity and suggestions
- suggestions: array of improvement suggestions
- performanceNotes: array of performance observations
- summary: overall assessment

Focus on actionable feedback and modern best practices.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const reviewContent =
        response.content[0].type === 'text' ? response.content[0].text : '';

      const review = this.parseReviewResponse(reviewContent, 'typescript');

      this.storeReviewHistory(request.filePath, review);
      this.emit('codeReviewed', {
        filePath: request.filePath,
        result: review,
        language: 'typescript',
      });

      return review;
    } catch (error) {
      console.error('Error reviewing TypeScript code:', error);
      throw error;
    }
  }

  /**
   * Review agent integration patterns
   */
  async reviewAgentIntegration(
    request: CodeReviewRequest,
  ): Promise<ReviewResult> {
    try {
      const prompt = `
You are an expert in multi-agent systems and ElizaOS character configurations. Review this agent implementation:

File: ${request.filePath}
Change Type: ${request.changeType}
${request.context?.purpose ? `Purpose: ${request.context.purpose}` : ''}

\`\`\`typescript
${request.fileContent}
\`\`\`

Focus on:

1. **Agent Architecture**:
   - ElizaOS character configuration compliance
   - Event-driven communication patterns
   - State management and persistence
   - Error handling and recovery

2. **Integration Patterns**:
   - Inter-agent communication
   - Task delegation and coordination
   - Data flow and dependencies
   - Failure handling and timeouts

3. **Performance & Reliability**:
   - Resource usage patterns
   - Concurrent operation handling
   - Memory management
   - Rate limiting and throttling

4. **Monitoring & Observability**:
   - Logging and debugging
   - Health check implementations
   - Metrics and monitoring
   - Alert conditions

Provide detailed feedback on agent design patterns and integration quality.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3500,
        messages: [{ role: 'user', content: prompt }],
      });

      const reviewContent =
        response.content[0].type === 'text' ? response.content[0].text : '';

      const review = this.parseReviewResponse(reviewContent, 'agent');

      this.storeReviewHistory(request.filePath, review);
      this.emit('codeReviewed', {
        filePath: request.filePath,
        result: review,
        language: 'agent',
      });

      return review;
    } catch (error) {
      console.error('Error reviewing agent integration:', error);
      throw error;
    }
  }

  /**
   * Quick lint-style review for common patterns
   */
  async quickLint(filePath: string, content: string): Promise<ReviewIssue[]> {
    const issues: ReviewIssue[] = [];
    const extension = path.extname(filePath);

    // Apply pattern-based checks
    if (extension === '.rs') {
      issues.push(...this.lintRustPatterns(content));
    } else if (['.ts', '.tsx', '.js', '.jsx'].includes(extension)) {
      issues.push(...this.lintTypeScriptPatterns(content));
    }

    // Apply security pattern checks
    issues.push(...this.lintSecurityPatterns(content));

    return issues;
  }

  /**
   * Generate review summary for multiple files
   */
  async generateBatchReviewSummary(
    reviews: Array<{ filePath: string; result: ReviewResult }>,
  ): Promise<string> {
    const prompt = `
Generate a comprehensive summary for this batch code review:

${reviews
  .map(
    (r) => `
File: ${r.filePath}
Overall: ${r.result.overall}
Score: ${r.result.score}
Critical Issues: ${r.result.issues.filter((i) => i.severity === 'critical').length}
Security Concerns: ${r.result.securityConcerns.length}
Summary: ${r.result.summary}
`,
  )
  .join('\n---\n')}

Provide:
1. Overall batch assessment
2. Priority recommendations
3. Common patterns or issues
4. Next steps for the development team

Keep it concise but actionable.
`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : 'Failed to generate summary';
  }

  /**
   * Initialize pattern recognition for quick linting
   */
  private initializePatterns() {
    return {
      rust: [
        /unwrap\(\)(?!\s*\/\/\s*safe)/g, // Unwrap without safety comment
        /expect\([^)]*\)(?!\s*\/\/\s*safe)/g, // Expect without safety comment
        /panic!\(/g, // Direct panic calls
        /\.clone\(\)/g, // Potentially unnecessary clones
      ],
      typescript: [
        /console\.log\(/g, // Console.log in production code
        /any(?!\s*\/\/)/g, // Any type without comment
        /\@ts-ignore/g, // TypeScript ignore comments
        /eval\(/g, // Eval usage
      ],
      security: [
        /password|secret|key|token/gi, // Potential hardcoded secrets
        /http:\/\//g, // Insecure HTTP URLs
        /Math\.random\(\)/g, // Insecure randomness
      ],
    };
  }

  /**
   * Pattern-based linting for Rust code
   */
  private lintRustPatterns(content: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // Check for unwrap usage
    const unwrapMatches = content.match(this.patterns.rust[0]);
    if (unwrapMatches) {
      issues.push({
        severity: 'major',
        type: 'best_practice',
        description: 'Found .unwrap() calls which can cause panics',
        suggestion:
          'Use proper error handling with Result<T, E> or add safety comments',
        autoFixable: false,
      });
    }

    // Check for panic! usage
    const panicMatches = content.match(this.patterns.rust[2]);
    if (panicMatches) {
      issues.push({
        severity: 'critical',
        type: 'security',
        description: 'Found panic! calls which can crash the program',
        suggestion: 'Replace with proper error handling',
        autoFixable: false,
      });
    }

    return issues;
  }

  /**
   * Pattern-based linting for TypeScript code
   */
  private lintTypeScriptPatterns(content: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // Check for console.log usage
    const consoleMatches = content.match(this.patterns.typescript[0]);
    if (consoleMatches) {
      issues.push({
        severity: 'minor',
        type: 'maintainability',
        description: 'Found console.log statements',
        suggestion: 'Remove debug console.log or replace with proper logging',
        autoFixable: true,
      });
    }

    // Check for any type usage
    const anyMatches = content.match(this.patterns.typescript[1]);
    if (anyMatches) {
      issues.push({
        severity: 'major',
        type: 'best_practice',
        description: 'Found "any" type usage',
        suggestion: 'Use specific types for better type safety',
        autoFixable: false,
      });
    }

    return issues;
  }

  /**
   * Security pattern linting
   */
  private lintSecurityPatterns(content: string): ReviewIssue[] {
    const issues: ReviewIssue[] = [];

    // Check for potential hardcoded secrets
    const secretMatches = content.match(this.patterns.security[0]);
    if (secretMatches) {
      issues.push({
        severity: 'critical',
        type: 'security',
        description: 'Potential hardcoded secrets or sensitive data',
        suggestion: 'Use environment variables or secure config management',
        autoFixable: false,
      });
    }

    // Check for Math.random() usage
    const randomMatches = content.match(this.patterns.security[2]);
    if (randomMatches) {
      issues.push({
        severity: 'major',
        type: 'security',
        description:
          'Found Math.random() which is not cryptographically secure',
        suggestion:
          'Use crypto.randomBytes() or Switchboard VRF for secure randomness',
        autoFixable: false,
      });
    }

    return issues;
  }

  /**
   * Parse AI review response into structured format
   */
  private parseReviewResponse(content: string, language: string): ReviewResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn(
        'Failed to parse structured review response, using fallback',
      );
    }

    // Fallback to parsing text response
    return {
      overall: content.includes('blocked')
        ? 'blocked'
        : content.includes('needs_changes')
          ? 'needs_changes'
          : 'approved',
      score: this.extractScore(content),
      issues: this.extractIssues(content),
      suggestions: [],
      securityConcerns: [],
      performanceNotes: [],
      summary: content.substring(0, 500) + '...',
    };
  }

  /**
   * Extract score from text review
   */
  private extractScore(content: string): number {
    const scoreMatch = content.match(/score[:\s]*(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75; // Default score
  }

  /**
   * Extract issues from text review
   */
  private extractIssues(content: string): ReviewIssue[] {
    // Simple extraction - in production, this would be more sophisticated
    const issuePatterns = [
      /critical|security|unsafe/gi,
      /error|bug|problem/gi,
      /improve|optimize|consider/gi,
    ];

    const issues: ReviewIssue[] = [];

    issuePatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        const severity =
          index === 0 ? 'critical' : index === 1 ? 'major' : 'minor';
        issues.push({
          severity: severity as any,
          type: 'best_practice',
          description: `Found ${matches.length} ${severity} concerns`,
          suggestion: 'Review the detailed feedback',
          autoFixable: false,
        });
      }
    });

    return issues;
  }

  /**
   * Store review history
   */
  private storeReviewHistory(filePath: string, review: ReviewResult): void {
    if (!this.reviewHistory.has(filePath)) {
      this.reviewHistory.set(filePath, []);
    }

    const history = this.reviewHistory.get(filePath)!;
    history.push(review);

    // Keep only last 10 reviews
    if (history.length > 10) {
      history.shift();
    }
  }

  /**
   * Get review statistics
   */
  getReviewStats(): {
    totalReviews: number;
    averageScore: number;
    issueDistribution: Record<string, number>;
    filesReviewed: number;
  } {
    let totalReviews = 0;
    let totalScore = 0;
    const issueDistribution: Record<string, number> = {};

    for (const reviews of this.reviewHistory.values()) {
      totalReviews += reviews.length;

      for (const review of reviews) {
        totalScore += review.score;

        for (const issue of review.issues) {
          issueDistribution[issue.severity] =
            (issueDistribution[issue.severity] || 0) + 1;
        }
      }
    }

    return {
      totalReviews,
      averageScore:
        totalReviews > 0 ? Math.round(totalScore / totalReviews) : 0,
      issueDistribution,
      filesReviewed: this.reviewHistory.size,
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'health check' }],
      });

      return true;
    } catch (error) {
      console.error('CodeReviewAgent health check failed:', error);
      return false;
    }
  }
}

export default CodeReviewAgent;
