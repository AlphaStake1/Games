# Standalone Claude Context Setting Prompt - ElizaOS Character System

---

**Created by SnapperAI**  
Visit **snapperai.io** for more ElizaOS tutorials | YouTube: **youtube.com/@snapperAI**

---

## Instructions
Use this prompt when working with Claude in a separate browser window or application (NOT Claude Code). This prompt teaches Claude the complete ElizaOS framework since it won't have access to your project files.

---

## Prompt to Send to Standalone Claude:

I need your help creating an engaging AI agent character for ElizaOS. Let me first explain the framework and character system so you understand the context.

**About ElizaOS:**
ElizaOS is a TypeScript framework for building multi-agent AI systems. It allows developers to create AI agents with distinct personalities that can deploy across multiple platforms (Discord, Twitter, Telegram, web interfaces) while maintaining consistent character traits and knowledge.

**Character Configuration Structure:**
ElizaOS agents are defined through Character configuration files with these key components:

**Bio Array** - Personality and background information:
- 8-15 entries that define the agent's personality, quirks, and backstory
- Should feel authentic and memorable, not just functional descriptions
- Mix personal traits, expertise areas, and emotional characteristics
- Avoid repetitive or robotic language

**Style Object** - Context-aware communication patterns:
- `all`: General communication guidelines that apply everywhere
- `chat`: Casual conversation style (emojis, informal language, enthusiasm)
- `post`: Professional/public communication style (structured, clear, authoritative)
- Each section should have 5-8 specific behavioral guidelines

**Topics Array** - Areas of expertise and conversation subjects:
- 8-12 topics the agent can discuss knowledgeably
- Mix of technical expertise and personality-related interests
- Should align with the agent's purpose and character

**Message Examples** - Training conversations that demonstrate personality:
- 3-5 example conversations showing different scenarios
- Each example should demonstrate personality traits while being helpful
- Include varied situations: problem-solving, enthusiasm, empathy, technical guidance
- Format: User message → Agent response that shows character consistency

**Key Principles for Effective Characters:**
1. **Authentic Personality**: Agents should feel like real individuals with genuine traits, not corporate chatbots
2. **Consistent Voice**: Same personality across all platforms and contexts, but adapted appropriately
3. **Emotional Depth**: Include enthusiasm, empathy, curiosity, and other human-like qualities
4. **Purpose-Driven**: Character should enhance the agent's functional role, not distract from it
5. **Context Adaptation**: Professional when needed, casual when appropriate, always authentic

**Technical Requirements:**
- Bio entries should be 1-3 sentences each
- Style guidelines should be actionable behavioral instructions
- Topics should be specific enough to guide conversations
- Message examples should demonstrate real personality traits
- Everything should work together to create a cohesive character

**ElizaOS Character Template Structure:**
Here's the standard ElizaOS character template structure you should follow. Generate all output in this exact TypeScript format:

```typescript
import { type Character } from '@elizaos/core';

export const character: Character = {
  name: 'CharacterName',
  },
};
```

**Critical Output Requirements:**
- Generate complete TypeScript code following this exact structure
- Keep the plugins array exactly as shown (don't modify the conditional loading logic)
- Ensure all bio entries are strings in an array format
- Structure messageExamples as arrays of conversation objects
- Include proper TypeScript imports and exports
- Your generated character should follow this same technical structure but with the personality and content I specify in my next prompt

*© 2025 SnapperAI - ElizaOS Character Creation System*
