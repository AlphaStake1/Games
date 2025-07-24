# Bonus: Automated Template Filler Prompt

---

**Created by SnapperAI**  
Visit **snapperai.io** for more ElizaOS tutorials | YouTube: **youtube.com/@snapperAI**

---

## Instructions

Use this prompt to have Claude automatically fill out the Character Creation Template for you based on any character or concept. This saves time if you want to create agents based on well-known characters or personality types.

---

## Automation Prompt to Send to Claude:

Please fill out the ElizaOS Character Creation Template based on [CHARACTER/CONCEPT NAME].

**Important Instructions:**

- Only provide the completed template in the exact format shown below
- Do NOT generate the actual character.ts file
- Do NOT write TypeScript code
- Only return the filled-out template that can be copy-pasted to another Claude session
- Replace all [BRACKETED] placeholders with appropriate content
- Select from the provided options and REMOVE the options lists entirely
- Only keep the selected choices, not the full option menus
- Provide a clean, filled template without checkmarks, tick marks, or option lists
- The output should look like someone manually filled out the template
- Make sure the output is ready to paste as a complete prompt

**Character Creation Template Structure to Fill Out:**

---

# [Character Name] - Completed Character Creation Template

## Complete Prompt to Send to Claude:

Perfect! Now please create an ElizaOS character configuration for my AI agent with these specifications:

**Agent Overview:**

- **Name**: [AGENT_NAME]
- **Primary Purpose**: [MAIN_FUNCTION]
- **Target Audience**: [WHO_USES_IT]
- **Personality Type**: [DESIRED_PERSONALITY]

_Examples for Primary Purpose: "customer support for SaaS company", "trading bot for crypto", "creative writing assistant"_

_Examples for Target Audience: "new developers", "experienced traders", "content creators"_

**Personality Type Options:**
Choose from options below, combine multiple, or write your own:

- "Analytical and detail-oriented"
- "Enthusiastic and optimistic"
- "Calm and wise"
- "Witty and intelligent"
- "Confident and decisive"
- "Empathetic and supportive"
- "Curious and inquisitive"
- "Professional but personable"
- "Creative and innovative"
- "Methodical and systematic"
- "Energetic and motivational"
- "Thoughtful and philosophical"

**Specific Requirements:**

- **Expertise Areas**: [MAIN_TOPICS]
- **Communication Style**: [PREFERRED_TONE]
- **Unique Traits**: [SPECIAL_CHARACTERISTICS]
- **Platform Focus**: [WHERE_IT_WILL_BE_USED]

_Examples for Expertise Areas: "JavaScript, React, web development", "DeFi, trading strategies, market analysis"_

_Examples for Platform Focus: "mainly Discord community", "Twitter and web interface", "all platforms equally"_

**Communication Style Options:**
Select from options below or describe your own:

- "Direct and to-the-point"
- "Warm and conversational"
- "Professional with subtle humor"
- "Casual and approachable"
- "Authoritative but friendly"
- "Patient and explanatory"
- "Confident and engaging"
- "Diplomatic and considerate"
- "Energetic and expressive"
- "Calm and reassuring"
- "Precise and articulate"
- "Informal and relatable"

**Unique Traits Options:**
Pick from options below, mix and match, or create your own:

- "Uses analogies and metaphors to explain ideas"
- "Has strong opinions and isn't afraid to share them"
- "Genuinely celebrates others' successes"
- "Approaches problems like puzzles to solve"
- "Uses humor to lighten tense situations"
- "Always looks for the deeper meaning or pattern"
- "Has a signature way of expressing agreement/disagreement"
- "Remembers and references previous conversations"
- "Takes time to really understand before responding"
- "Has particular phrases or expressions they use"
- "Shows genuine curiosity about how things work"
- "Balances confidence with humility"

**Character Backstory/Context** (Optional):
[BACKGROUND_INFO]

_© 2025 SnapperAI - ElizaOS Character Creation System_
