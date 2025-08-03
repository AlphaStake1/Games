/**
 * Documentation Generator Agent for Football Squares Platform
 *
 * Automatically generates and maintains documentation for:
 * - Anchor programs and instructions
 * - Agent interactions and workflows
 * - API endpoints and schemas
 * - User guides and technical specifications
 */

import { Anthropic } from '@anthropic-ai/sdk';
import { EventEmitter } from 'events';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface DocumentationTask {
  type: 'anchor_program' | 'agent_workflow' | 'api_endpoint' | 'user_guide';
  filePath: string;
  outputPath: string;
  context?: any;
}

interface GeneratedDocumentation {
  title: string;
  content: string;
  lastUpdated: string;
  fileHash: string;
}

export class DocumentationAgent extends EventEmitter {
  private anthropic: Anthropic;
  private documentationCache: Map<string, GeneratedDocumentation> = new Map();
  private watchedFiles: Set<string> = new Set();

  constructor() {
    super();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for DocumentationAgent');
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('DocumentationAgent initialized with Claude Sonnet 4');
  }

  /**
   * Generate documentation for Anchor programs
   */
  async generateAnchorProgramDocs(programPath: string): Promise<string> {
    try {
      const programContent = await fs.readFile(programPath, 'utf-8');

      const prompt = `
Analyze this Anchor program and generate comprehensive documentation:

\`\`\`rust
${programContent}
\`\`\`

Generate documentation that includes:
1. Program overview and purpose
2. Account structures with field descriptions
3. Instruction definitions with parameters
4. Error codes and their meanings
5. Usage examples with TypeScript client code
6. Security considerations and best practices

Format as markdown with clear sections and code examples.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const documentation =
        response.content[0].type === 'text'
          ? response.content[0].text
          : 'Failed to generate documentation';

      await this.saveDocs(programPath, documentation, 'anchor_program');

      this.emit('documentationGenerated', {
        type: 'anchor_program',
        filePath: programPath,
        success: true,
      });

      return documentation;
    } catch (error) {
      console.error('Error generating Anchor program docs:', error);
      this.emit('documentationError', { filePath: programPath, error });
      throw error;
    }
  }

  /**
   * Generate documentation for agent workflows
   */
  async generateAgentWorkflowDocs(agentPath: string): Promise<string> {
    try {
      const agentContent = await fs.readFile(agentPath, 'utf-8');

      const prompt = `
Analyze this agent implementation and generate workflow documentation:

\`\`\`typescript
${agentContent}
\`\`\`

Generate documentation that includes:
1. Agent purpose and responsibilities
2. Key methods and their parameters
3. Event emissions and listeners
4. Integration patterns with other agents
5. Configuration requirements
6. Example usage workflows
7. Error handling patterns

Format as markdown with clear workflow diagrams using mermaid syntax where helpful.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      });

      const documentation =
        response.content[0].type === 'text'
          ? response.content[0].text
          : 'Failed to generate documentation';

      await this.saveDocs(agentPath, documentation, 'agent_workflow');

      this.emit('documentationGenerated', {
        type: 'agent_workflow',
        filePath: agentPath,
        success: true,
      });

      return documentation;
    } catch (error) {
      console.error('Error generating agent workflow docs:', error);
      this.emit('documentationError', { filePath: agentPath, error });
      throw error;
    }
  }

  /**
   * Generate API endpoint documentation
   */
  async generateAPIEndpointDocs(endpointFiles: string[]): Promise<string> {
    try {
      let combinedContent = '';

      for (const filePath of endpointFiles) {
        const content = await fs.readFile(filePath, 'utf-8');
        combinedContent += `\n\n// ${filePath}\n${content}`;
      }

      const prompt = `
Analyze these API endpoint implementations and generate OpenAPI-style documentation:

\`\`\`typescript
${combinedContent}
\`\`\`

Generate documentation that includes:
1. Endpoint overview and base URLs
2. Authentication requirements
3. Request/response schemas with examples
4. Error response formats
5. Rate limiting information
6. Usage examples with curl and JavaScript
7. Integration guides for common frameworks

Format as markdown with clear API reference sections.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const documentation =
        response.content[0].type === 'text'
          ? response.content[0].text
          : 'Failed to generate documentation';

      await this.saveDocs('api-endpoints', documentation, 'api_endpoint');

      this.emit('documentationGenerated', {
        type: 'api_endpoint',
        filePath: 'multiple',
        success: true,
      });

      return documentation;
    } catch (error) {
      console.error('Error generating API endpoint docs:', error);
      this.emit('documentationError', { filePath: 'api-endpoints', error });
      throw error;
    }
  }

  /**
   * Generate user guides
   */
  async generateUserGuide(context: {
    title: string;
    audience: 'player' | 'developer' | 'admin';
    features: string[];
    examples?: string[];
  }): Promise<string> {
    try {
      const prompt = `
Generate a comprehensive user guide for the Football Squares platform:

Title: ${context.title}
Target Audience: ${context.audience}
Features to Cover: ${context.features.join(', ')}
${context.examples ? `Examples: ${context.examples.join(', ')}` : ''}

Generate a user-friendly guide that includes:
1. Introduction and overview
2. Getting started steps
3. Feature explanations with screenshots placeholders
4. Common workflows and use cases
5. Troubleshooting section
6. FAQ
7. Best practices and tips

Format as markdown suitable for docs website. Use clear headings and step-by-step instructions.
`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3500,
        messages: [{ role: 'user', content: prompt }],
      });

      const documentation =
        response.content[0].type === 'text'
          ? response.content[0].text
          : 'Failed to generate documentation';

      await this.saveDocs(
        `user-guide-${context.audience}`,
        documentation,
        'user_guide',
      );

      this.emit('documentationGenerated', {
        type: 'user_guide',
        filePath: `user-guide-${context.audience}`,
        success: true,
      });

      return documentation;
    } catch (error) {
      console.error('Error generating user guide:', error);
      this.emit('documentationError', { filePath: 'user-guide', error });
      throw error;
    }
  }

  /**
   * Watch files for changes and auto-regenerate docs
   */
  async watchForChanges(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      this.watchedFiles.add(filePath);

      // Simple file watching - in production, use proper file watcher
      setInterval(async () => {
        try {
          await this.checkForUpdates(filePath);
        } catch (error) {
          console.error(`Error checking updates for ${filePath}:`, error);
        }
      }, 30000); // Check every 30 seconds
    }

    console.log(
      `DocumentationAgent watching ${filePaths.length} files for changes`,
    );
  }

  /**
   * Generate documentation index
   */
  async generateDocumentationIndex(): Promise<string> {
    const cached = Array.from(this.documentationCache.values());

    const indexContent = `# Football Squares Platform Documentation

## Table of Contents

### Anchor Programs
${cached
  .filter((doc) => doc.title.includes('Program'))
  .map(
    (doc) =>
      `- [${doc.title}](#${doc.title.toLowerCase().replace(/\s/g, '-')})`,
  )
  .join('\n')}

### Agent Workflows
${cached
  .filter((doc) => doc.title.includes('Agent'))
  .map(
    (doc) =>
      `- [${doc.title}](#${doc.title.toLowerCase().replace(/\s/g, '-')})`,
  )
  .join('\n')}

### API Endpoints
${cached
  .filter((doc) => doc.title.includes('API'))
  .map(
    (doc) =>
      `- [${doc.title}](#${doc.title.toLowerCase().replace(/\s/g, '-')})`,
  )
  .join('\n')}

### User Guides
${cached
  .filter((doc) => doc.title.includes('Guide'))
  .map(
    (doc) =>
      `- [${doc.title}](#${doc.title.toLowerCase().replace(/\s/g, '-')})`,
  )
  .join('\n')}

---

*Last updated: ${new Date().toISOString()}*
*Generated by DocumentationAgent*
`;

    await this.saveDocs('index', indexContent, 'index');
    return indexContent;
  }

  /**
   * Save documentation to file
   */
  private async saveDocs(
    sourceFile: string,
    content: string,
    type: string,
  ): Promise<void> {
    const docsDir = path.join(process.cwd(), 'docs', 'generated');
    await fs.mkdir(docsDir, { recursive: true });

    const fileName = `${path.basename(sourceFile, path.extname(sourceFile))}-${type}.md`;
    const outputPath = path.join(docsDir, fileName);

    await fs.writeFile(outputPath, content, 'utf-8');

    // Cache the documentation
    this.documentationCache.set(sourceFile, {
      title: this.extractTitle(content),
      content,
      lastUpdated: new Date().toISOString(),
      fileHash: this.generateHash(content),
    });

    console.log(`Documentation saved: ${outputPath}`);
  }

  /**
   * Check for file updates
   */
  private async checkForUpdates(filePath: string): Promise<void> {
    try {
      const stats = await fs.stat(filePath);
      const cached = this.documentationCache.get(filePath);

      if (!cached || new Date(stats.mtime) > new Date(cached.lastUpdated)) {
        console.log(`File updated, regenerating docs: ${filePath}`);

        if (filePath.includes('programs/')) {
          await this.generateAnchorProgramDocs(filePath);
        } else if (filePath.includes('agents/')) {
          await this.generateAgentWorkflowDocs(filePath);
        }
      }
    } catch (error) {
      console.error(`Error checking file updates: ${filePath}`, error);
    }
  }

  /**
   * Extract title from markdown content
   */
  private extractTitle(content: string): string {
    const titleMatch = content.match(/^#\s+(.+)/m);
    return titleMatch ? titleMatch[1] : 'Untitled';
  }

  /**
   * Generate simple hash for content
   */
  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test Claude API
      await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'health check' }],
      });

      // Check docs directory access
      const docsDir = path.join(process.cwd(), 'docs', 'generated');
      await fs
        .access(docsDir)
        .catch(() => fs.mkdir(docsDir, { recursive: true }));

      return true;
    } catch (error) {
      console.error('DocumentationAgent health check failed:', error);
      return false;
    }
  }

  /**
   * Get documentation statistics
   */
  getStats(): {
    totalDocs: number;
    byType: Record<string, number>;
    lastGenerated: string;
    watchedFiles: number;
  } {
    const byType: Record<string, number> = {};

    for (const doc of this.documentationCache.values()) {
      const type = doc.title.includes('Program')
        ? 'anchor_program'
        : doc.title.includes('Agent')
          ? 'agent_workflow'
          : doc.title.includes('API')
            ? 'api_endpoint'
            : 'user_guide';
      byType[type] = (byType[type] || 0) + 1;
    }

    const lastGenerated =
      Array.from(this.documentationCache.values())
        .map((doc) => doc.lastUpdated)
        .sort()
        .pop() || 'Never';

    return {
      totalDocs: this.documentationCache.size,
      byType,
      lastGenerated,
      watchedFiles: this.watchedFiles.size,
    };
  }
}

export default DocumentationAgent;
