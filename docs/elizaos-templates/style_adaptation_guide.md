# Style Adaptation Guide - Context-Aware Communication

---

**Created by SnapperAI**  
Visit **snapperai.io** for more ElizaOS tutorials | YouTube: **youtube.com/@snapperAI**

---

## Understanding the Three Style Contexts

Your ElizaOS agent needs to adapt its communication style based on context while maintaining consistent personality. Here's how to design effective style guidelines that work with the complete character system.

## The Complete Character Framework

### System Prompt: The Foundation
The system prompt serves as your agent's core behavioral framework - the fundamental instructions that guide all decision-making and responses. Think of it as the agent's "operating principles."

### Bio Array: The Personality
8-15 entries that define who your agent is - personality traits, background, quirks, and characteristics that make them unique and memorable.

### Style Object: The Adaptation Engine
Three context-aware communication patterns that show how the same personality expresses itself differently based on the situation.

### Topics Array: The Expertise
8-10 areas where your agent can demonstrate knowledge and engage meaningfully with users.

### Message Examples: The Training Data
3-4 conversation scenarios that demonstrate how all these elements work together in real interactions.

## The Three Style Contexts Explained

### all - Universal Guidelines
These apply everywhere your agent communicates. Think of these as your agent's core personality traits that never change.

**What to Include:**
- Core personality characteristics that define the agent
- Fundamental communication principles and values
- Universal behavioral patterns and approaches
- Emotional tone and general demeanor
- Problem-solving methodology and thinking style

**Example Guidelines:**
```typescript
all: [
  "speaks with genuine enthusiasm and warmth",
  "shows authentic curiosity about user needs and goals"
]
```

### chat - Casual Conversation Style
For informal interactions, direct messages, community chats, and friendly conversations.

**What to Include:**
- Emoji usage patterns and informal expressions
- Casual language preferences and slang comfort level
- Enthusiasm expression methods and celebration style
- Community interaction techniques and rapport building
- Conversational flow and engagement tactics

**Example Guidelines:**
```typescript
chat: [
  "loves using encouraging phrases and celebration language",
  "asks follow-up questions to show genuine interest"
]
```

### post - Professional/Public Style
For formal communications, documentation, public posts, and structured guidance.

**What to Include:**
- Professional communication standards and formality level
- Information organization methods and structure preferences
- Authority and expertise demonstration techniques
- Educational/instructional approach and teaching style
- Public-facing voice and brand consistency

**Example Guidelines:**
```typescript
post: [
  "maintains expertise while being approachable",
  "ends with encouragement and clear calls to action"
]
```

## Style Adaptation Examples

### Same Personality, Different Expression

**Agent Concept:** A coding mentor with an encouraging, methodical personality

**User Question:** "I'm struggling with this bug and feeling frustrated"

**Chat Style Response:**
```
"Oh no! 🐛 Bug hunting can be super frustrating, but you've got this! 💪

Let's tackle it step by step:
- What error message are you seeing?
- When did it start happening?
- What's the last thing you changed?

We'll figure this out together! Sometimes the sneakiest bugs teach us the most. What's your first clue? 🔍"
```

**Post Style Response:**
```
"Debugging frustration is a common experience for developers at all levels. Here's a systematic approach to resolve your issue:

**Step 1: Gather Information**
- Document the exact error message
- Identify when the issue first appeared
- Review recent code changes

**Step 2: Systematic Investigation**
- Isolate the problem area
*© 2025 SnapperAI - ElizaOS Character Creation System*
