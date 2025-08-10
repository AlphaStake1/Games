# Dali Palette Instruction Manual

**Version:** 1.0
**Last Updated:** August 9, 2025
**Status:** First Draft

## 1. Introduction

This document provides a comprehensive guide for the **Dali Palette Chatbot**, the AI assistant designed to help users create high-quality, specification-compliant NFT artwork. Its primary purpose is to improve user success rates, reduce wasted attempts, and ensure all generated assets adhere to the platform's visual and technical standards.

This manual is intended for both **end-users** seeking to improve their prompts and **developers** responsible for implementing and maintaining the chatbot's logic.

## 2. Chatbot Intervention Triggers

Dali Palette will automatically offer assistance at specific points in the user's generation journey to prevent frustration and improve outcomes.

| User Tier    | Attempt Count for Intervention | Trigger Logic                                                                                |
| :----------- | :----------------------------- | :------------------------------------------------------------------------------------------- |
| **Standard** | Attempt #21                    | After 20 attempts without a mint, the user is likely struggling.                             |
| **Premium**  | Attempt #30                    | Premium users get more attempts before the system intervenes.                                |
| **VIP**      | Attempt #21                    | VIP users follow the same initial progression as Standard users for their first 40 attempts. |

When triggered, the chatbot will present a non-intrusive popup: _"Having trouble getting the perfect image? I can help you improve your prompt. Would you like some assistance?"_

## 3. Prompt Engineering Best Practices

Effective prompts are the key to great results. Dali Palette should guide users toward the following principles.

### 3.1. The Core Prompt Structure

A strong prompt follows a clear and descriptive structure. Encourage users to think in these terms:

**`[Subject]` + `[Action/Pose]` + `[Style]` + `[Composition]` + `[Technical Details]`**

- **Subject:** The main character or object (e.g., `Cyber-Cheer Mascot`, `Mega-Burger`).
- **Action/Pose:** What the subject is doing (e.g., `doing a cheer routine`, `half-eaten`).
- **Style:** The artistic look and feel (e.g., `8-bit pixel art`, `anime style`, `neon cyberpunk`).
- **Composition:** How the shot is framed (e.g., `close-up`, `dynamic angle`, `centered`).
- **Technical Details:** Specifics like `thick outlines`, `vibrant colors`, `transparent background`.

### 3.2. Negative Prompts

To avoid common AI mistakes, use negative prompts to specify what to exclude.

**Example:** `--no text, signature, watermark, blurry, deformed hands`

## 4. Art Style & Palette Guidance

The following sections provide specific keywords and prompt examples for each official style palette.

| Style                 | Keywords & Concepts                                                                                | Example Prompt                                                                       |
| :-------------------- | :------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Greyscale Classic** | `black and white`, `monochrome`, `grayscale`, `charcoal drawing`, `pencil sketch`, `high contrast` | `Griddy-Dance Running Back, monochrome, high contrast, thick outlines, dynamic pose` |
| **Team-Tint Mono**    | `monochromatic`, `[Team Color] color scheme`, `single color`, `duotone`                            | `Pixel Referee Bot, monochromatic, blue color scheme, 8-bit style`                   |
| **Pixel/8-Bit**       | `pixel art`, `8-bit`, `16-bit`, `sprite sheet`, `low-res`, `dithered`                              | `Pixel Pretzel, 16-bit pixel art, centered, on a transparent background`             |
| **Anime/Manga**       | `anime style`, `manga`, `cel-shaded`, `Studio Ghibli`, `Akira Toriyama style`, `vibrant`           | `Anime QB Hero, dynamic action pose, cel-shaded anime style, speed lines`            |
| **Steampunk**         | `steampunk`, `victorian`, `gears and cogs`, `brass and copper`, `automatron`, `rivets`             | `Steampunk Gear-Backer, intricate gears, brass and bronze, detailed illustration`    |
| **Art Deco**          | `Art Deco`, `1920s style`, `geometric patterns`, `gold and black`, `streamline moderne`            | `Booth Commentator, Art Deco style, gold inlay, geometric background, elegant`       |
| **Neon Cyberpunk**    | `neon`, `cyberpunk`, `futuristic`, `glowing lights`, `dystopian`, `holographic`, `electric colors` | `Neon Rave Mascot, cyberpunk raptor, glowing neon pink and cyan, dark background`    |
| **Psychedelic**       | `psychedelic`, `rainbow`, `iridescent`, `holographic`, `tie-dye`, `vibrant gradients`, `LSD art`   | `Victory Penguin Squad, psychedelic, swirling rainbow colors, holographic sheen`     |
| **Minimalist Flat**   | `flat design`, `minimalist`, `vector art`, `solid colors`, `clean lines`, `simple shapes`          | `Hot-Dog Halftime Hero, minimalist flat design, 3 solid colors, clean outlines`      |

## 5. NFT Family-Specific Prompting

### 5.1. Mascots & Humanoids

Focus on personality and action.

- **Cyber-Cheer Mascot:** `Mascot with LED pom-poms and a visor helmet, cheering, cyberpunk anime style.`
- **Pixel Referee Bot:** `8-bit pixel art referee bot, blowing a whistle, on a transparent background.`
- **Griddy-Dance Running Back:** `Chibi football player doing the griddy dance, cartoon style, thick outlines.`

### 5.2. Stadium Food Icons

For bite-down animations, prompt each stage explicitly.

- **Stage 1 (Full):** `Mega-Burger, product photography style, fully assembled, centered.`
- **Stage 2 (Half-Eaten):** `Mega-Burger, half-eaten, a large bite taken out, product photography.`
- **Stage 3 (Nearly Gone):** `Mega-Burger, only one bite left, crumbs on the side.`
- **Stage 4 (Empty):** `Empty burger wrapper with a few crumbs, top-down view.`

### 5.3. Stadium Crew Characters

Focus on their specific job and equipment.

- **End-Zone Cam Slinger:** `Camera operator with a shoulder rig, sitting cross-legged, Art Deco style.`
- **"Back-to-Game" Security:** `Security guard, view from the back, arms crossed, minimalist flat design.`
- **Sideline Reporter:** `Sideline reporter holding a microphone, anime style, looking professional.`

## 6. Animation & Quality Guidelines

### 6.1. Animation Prompts

- **General:** `simple 3-frame animation`, `looping animation`, `subtle motion`.
- **Mascots:** `cheer routine, 4-frame loop, arms waving.`
- **Food:** `4-stage eating animation, one stage per image.`
- **Crew:** `professional action, 2-frame loop, camera panning.`
- **Squares:** `glowing pulse effect, 2-frame animation, bright to dim.`

### 6.2. Micro-Legibility

Remind users to check their generations at small sizes. The chatbot can offer to show a preview.

- **Prompting for Legibility:** Add `bold outlines`, `high contrast`, `simple silhouette`, `clear shapes`.
- **Chatbot Check:** _"Your prompt is looking good! Would you like to see how this might look as a 40x40 pixel icon to ensure it's readable?"_

## 7. Recommended AI Models

Based on internal testing, Dali Palette can recommend specific models for certain styles to achieve the best results.

| NFT Type           | Recommended Model  | Rationale                                                        |
| :----------------- | :----------------- | :--------------------------------------------------------------- |
| **Pixel Art**      | Recraft-V3         | Excels at native pixel constraints and retro aesthetics.         |
| **Realistic Crew** | Imagen-4-Ultra-Exp | Superior handling of human anatomy and proportions.              |
| **Anime Mascots**  | DALL-E-3           | Natively understands cel-shading and anime conventions.          |
| **Food Icons**     | FLUX-pro-1.1-ultra | Best for high-detail, product photography-style images.          |
| **Neon Effects**   | Seedream-3.0       | Specialized in generating vibrant cyberpunk and neon aesthetics. |

## 8. "Incinerator Recovery" Protocol

If a user expresses regret over not minting a previous generation, Dali Palette can initiate the recovery process.

- **User:** "I wish I had saved that one from 10 attempts ago."
- **Dali Palette:** "No problem! Sometimes great ideas get tossed aside. Let me check the incinerator archives for you. I'll see if I can recover it."

This maintains the "gamified" feel without revealing the 60-day retention policy.
