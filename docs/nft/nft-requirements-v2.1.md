# Football Squares House NFT Requirements Document v2.1

## Change Log (v2.1 vs v2.0)

- **New Series:** 12 additional collectible series (Uniform & Gear, Rituals, Halftime, etc.)
- **Accessory Overlays:** First-class composable assets with transparent layers
- **Model Rotation Policy:** 4-5 AI models cycling every 5th generation attempt
- **Enhanced Animation Stack:** Diffusion micro-clips + 2D puppet/sprite options
- **Extended Metadata:** Series tags, rarity tiers, overlay slots, animation types
- **Advanced QA:** Overlay collision testing, sprite seam verification

---

## 1. Collection Architecture

| Component              | Requirement                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Collection Root**    | Single immutable Core Collection PDA (unchanged)                                                                                                  |
| **Base Families**      | Squares, Mascots, Food, Crew (unchanged)                                                                                                          |
| **Series Tags**        | 12 new series: UniformGear, Rituals, Halftime, OffSeason, Rivalry, TechHUD, Celebration, Retro, International, Charity, BroadcastAR, Championship |
| **Accessory Overlays** | Composable transparent assets for helmets, visors, jerseys, etc.                                                                                  |
| **Overlay Slots**      | helmet, visor, faceMask, jersey, sleeves, gloves, cleats, patch, prop, bgFx                                                                       |
| **Rarity Tiers**       | Common, Rare, Epic, Legendary                                                                                                                     |

---

## 2. New NFT Series Specifications

### 2.1 Uniform & Gear Overlays (Series: UniformGear)

**Assets:** Throwback helmets, alternate jerseys, specialty cleats, captain patches
**Animation:** Visor glint (2-frame), glove flex, jersey ripple
**Overlay Slots:** helmet, visor, jersey, sleeves, gloves, cleats, patch

### 2.2 Game Day Rituals (Series: Rituals)

**Assets:** Tunnel run-out, coin toss, pregame hype circle, chalk talk
**Animation:** Smoke drift, wrist tape tighten, chalk scribble (2-3 frames)
**Focus:** Pre-game ceremonies and traditions

### 2.3 Halftime Spectacle (Series: Halftime)

**Assets:** Drone shows, fireworks, LED crowd waves, mascot dance-offs
**Animation:** Drone morph (3-4 frames), firework bloom, crowd wave ripple
**Premium:** Full micro-clip animations for drone formations

### 2.4 Off Season Grind (Series: OffSeason)

**Assets:** Combine drills, film room, weight room, training camp
**Animation:** Stopwatch tick, highlight reel, barbell shimmer
**Theme:** Behind-the-scenes preparation

### 2.5 Rivalries & Traditions (Series: Rivalry)

**Assets:** Cold weather classic, sunbelt shootout, heritage games
**Animation:** Pennant flutter, breath vapor, sun glare pulse
**IP Safety:** Abstract colors/shapes, no official team logos

### 2.6 Tech & Analytics HUD (Series: TechHUD)

**Assets:** Route heatmaps, speed displays, play-call wristbands
**Animation:** HUD scanlines, data nodes pinging, stat count-up
**Style:** Futuristic interface elements

### 2.7 Celebration & Emotion (Series: Celebration)

**Assets:** Victory roars, gestures, tunnel reflections, victory leaps
**Animation:** Confetti loops, emotional expressions, crowd reactions
**Focus:** Peak emotional moments

### 2.8 Retro / Vintage (Series: Retro)

**Assets:** Leather helmet era, vintage scoreboards, old tickets
**Animation:** Film grain flicker, pixel sparkle, retro transitions
**Palette:** Sepia, film stock colors

### 2.9 International Gridiron (Series: International)

**Assets:** London fog games, Mexico festivities, Germany events
**Animation:** City lights twinkle, flag ripples, cultural elements
**Global Appeal:** International game locations

### 2.10 Charity & Awareness (Series: Charity)

**Assets:** Pink October ribbons, military tribute, awareness campaigns
**Revenue:** Mint fees route to dedicated charity treasury
**Impact:** Social cause integration

### 2.11 Broadcast Graphics & AR (Series: BroadcastAR)

**Assets:** Down markers, sponsor graphics, stat popups, replay wipes
**Animation:** Transition wipes, number tickers, overlay effects
**Meta:** Behind-the-broadcast elements

### 2.12 Championship Hardware (Series: Championship)

**Assets:** Trophy showcases, championship rings, MVP awards
**Animation:** Gem sparkles, confetti rain, trophy shine
**Rarity:** Primarily Epic/Legendary tier

---

## 3. Accessory Overlay System

### 3.1 Technical Implementation

- **Format:** Transparent PNG (static) or WebM/MP4 with alpha (animated)
- **Composition:** Client-side z-index stacking, no on-chain mutations
- **Compatibility:** `composes_with` attribute lists compatible base families

### 3.2 Overlay Slot Definitions

| Slot     | Purpose              | Z-Index | Examples                           |
| -------- | -------------------- | ------- | ---------------------------------- |
| helmet   | Head protection gear | 10      | Vintage leather, modern composite  |
| visor    | Eye protection/style | 11      | Tinted, clear, holographic         |
| faceMask | Face protection      | 9       | Traditional cage, modern hybrid    |
| jersey   | Main uniform         | 5       | Throwback, color rush, alternate   |
| sleeves  | Arm coverage         | 6       | Compression, throwback style       |
| gloves   | Hand gear            | 8       | Signature, team colors, grip-tech  |
| cleats   | Footwear             | 3       | Retro, modern, specialty surface   |
| patch    | Badges/emblems       | 12      | Captain's C, memorial, achievement |
| prop     | Held items           | 15      | Equipment, ceremonial items        |
| bgFx     | Background effects   | 1       | Stadium lighting, particle effects |

---

## 4. Model Rotation & AI Pipeline

### 4.1 5-Engine Rotation Policy

| Attempts | Engine          | Specialization          |
| -------- | --------------- | ----------------------- |
| 1-5      | SDXL-General    | Versatile base model    |
| 6-10     | SD-Anime/Chibi  | Character-focused       |
| 11-15    | Pixel-Art-SD    | Retro gaming aesthetics |
| 16-20    | Neon-Cyber-LoRA | Cyberpunk/tech themes   |
| 21-25    | Icon-Flat-LoRA  | Minimalist/flat design  |

**Fallback Policy:** If engine exceeds 10s queue time, advance to next engine and log failure.

### 4.2 Dali Palette Integration

- **Mode:** Silent prompt enhancement unless user opts out
- **UI:** Show "✨ Improved Prompt" expandable panel
- **Guardrails:** Preserve core nouns, add style/composition hints
- **Triggers:** Standard (attempt 21), Premium (attempt 30), VIP (attempt 21)

---

## 5. Enhanced Animation Stack

### 5.1 Animation Types

| Type              | Description                 | Frame Count | Use Cases                       |
| ----------------- | --------------------------- | ----------- | ------------------------------- |
| **Pulse/Glow**    | Brightness/color shifts     | 2 frames    | Squares, HUD elements           |
| **Micro Gesture** | Simple character actions    | 2-3 frames  | Mascot waves, crew actions      |
| **Event Burst**   | Dynamic celebrations        | 3-4 frames  | Halftime shows, celebrations    |
| **Micro Clips**   | Diffusion-generated video   | 2-3 seconds | Premium animations              |
| **Sprite Loop**   | Traditional frame animation | 2-4 frames  | Grid previews, low-cost options |

### 5.2 Export Profiles

- **Primary:** MP4 (H.264, optimized for web)
- **Alternative:** WebM (VP9, smaller file size)
- **Fallback:** GIF (≤15MB, maximum compatibility)
- **Grid Preview:** PNG sequence for ultra-light grid animations

---

## 6. Extended Metadata Schema

```json
{
  "name": "Victory Leap Wall #07",
  "description": "Celebration Series — Legendary overlay-ready variant",
  "image": "https://arweave.net/<txid>.png",
  "animation_url": "https://arweave.net/<txid>.mp4",
  "attributes": [
    { "trait_type": "Family", "value": "Mascot" },
    { "trait_type": "Series", "value": "Celebration" },
    { "trait_type": "Rarity", "value": "Legendary" },
    { "trait_type": "Palette", "value": "Neon Cyberpunk" },
    {
      "trait_type": "OverlaySlots",
      "value": ["helmet", "visor", "patch", "prop"]
    },
    { "trait_type": "AnimationType", "value": "MicroClip" },
    { "trait_type": "Frames", "value": 3 },
    { "trait_type": "CompatibleOverlays", "value": ["UniformGear", "TechHUD"] },
    { "trait_type": "BasePrice", "value": "0.1 SOL" },
    { "trait_type": "GenerationEngine", "value": "SDXL-General" }
  ]
}
```

---

## 7. Enhanced Quality Assurance

### 7.1 New Testing Requirements

- **Overlay Collision Test:** Verify 3 random overlay combinations don't occlude critical silhouette at 40-64px
- **Sprite Seam Test:** Confirm animation loop boundaries have no jump cuts
- **HUD Clarity Test:** Numeric/line elements remain legible at 40px (2px minimum strokes)
- **Series Consistency Test:** Verify IP-safe compliance for Rivalry/International/Charity variants

### 7.2 Micro-Legibility Standards (Enhanced)

- **Pixel Hinting:** Align key edges to pixel grid for 40-64px outputs
- **Edge Safety:** Keep primary silhouette ≥2px from canvas edge
- **Icon Baselines:** Maintain consistent optical baseline across families
- **WCAG Compliance:** ≥4.5:1 contrast for all base + hover states

---

## 8. Implementation Timeline

| Phase       | Deliverables                                    | Duration | Priority |
| ----------- | ----------------------------------------------- | -------- | -------- |
| **Phase 1** | Model rotation system, Dali Palette integration | 2 weeks  | High     |
| **Phase 2** | Overlay system, composable UI                   | 3 weeks  | High     |
| **Phase 3** | New series assets (Rituals, Halftime, TechHUD)  | 4 weeks  | Medium   |
| **Phase 4** | Animation micro-clips, sprite system            | 3 weeks  | Medium   |
| **Phase 5** | Remaining series, championship hardware         | 4 weeks  | Low      |

---

## 9. Cost & Resource Planning

### 9.1 Storage Estimates

- **Base NFTs:** 1024×1024 PNG ≈3MB each
- **Overlay Assets:** 1024×1024 PNG with alpha ≈2MB each
- **Micro-Clip Animations:** 3-second MP4 ≈5MB each
- **Total per 100-NFT Game:** ~500MB = 0.25 AR storage cost

### 9.2 GPU Budget

- **Model Rotation:** Reserve burst capacity for peak generation times
- **Micro-Clips:** Limit to Premium/VIP tiers initially
- **Fallback Strategy:** Static variants available if animation pipeline overloaded

---

## 10. Stadium Locker NFT Display System

### 10.1 Player Locker Integration

- **Back Wall Display**: NFT collections featured prominently on locker room back wall
- **Visibility Controls**: Players choose public/private locker access for other users
- **Locker Tiers**: 5 upgrade levels (rookie → pro → mvp → allstar → halloffame)
- **3D Premium Design**: Advanced photorealistic locker aesthetics (pending specialized 3D tools)

### 10.2 Display Requirements

- **Grid Layout**: NFT thumbnails arranged on back wall display grid
- **Featured NFT**: Large centerpiece display for player's favorite piece
- **Collection Stats**: Trophy count, total games, locker view metrics
- **Social Features**: Share locker, visit other players' rooms, discovery

### 10.3 Technical Implementation Status

- **✅ Infrastructure**: PlayerLockerRoom.tsx, StadiumLocker.tsx components built
- **✅ Tier System**: 5 material gradients and upgrade modal implemented
- **✅ NFT Integration**: Collection display and featured NFT selection
- **🔄 3D Models**: Premium locker designs pending (requires better 3D tooling)

### 10.4 Locker Tier Specifications

| Tier             | Materials                | Features              | Upgrade Path         |
| ---------------- | ------------------------ | --------------------- | -------------------- |
| **Rookie**       | Gray metal frame         | Basic display grid    | Starting tier        |
| **Pro**          | Bronze accents           | Enhanced lighting     | Win-based unlock     |
| **MVP**          | Purple premium gradients | Enhanced features     | Elite performance    |
| **AllStar**      | Blue premium finish      | Larger display area   | Season performance   |
| **Hall of Fame** | Gold luxury materials    | Maximum customization | Premium subscription |

### 10.5 Future Enhancement Pipeline

- **3D Locker Models**: Photorealistic locker room environments
- **AR Locker Tours**: Augmented reality walkthrough experience
- **Custom Decorations**: Player-controlled locker personalization options
- **Social Interactions**: Comments, reactions, locker visiting achievements

---

## 11. IP Safety & Compliance

### 10.1 Legal Guardrails

- **No Official Logos:** Generic team colors and abstract shapes only
- **Rivalry Series:** Use location/weather themes, avoid team-specific imagery
- **International Series:** Focus on cities/culture, not specific team branding
- **Human Likeness:** Stylized, non-identifiable characters only

### 10.2 Revenue Routing

- **Standard NFTs:** House treasury
- **Charity Series:** Dedicated charity wallet addresses
- **Overlay Sales:** Split between artist royalties and platform

---

## Appendix A: Palette JSON Schema

```json
{
  "palettes": {
    "greyscale": [
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#CCCCCC",
      "#FFFFFF"
    ],
    "neonCyberpunk": ["#ea00d9", "#0abdc6", "#711c91", "#133e7c", "#091833"],
    "pixelRetro": [
      "#000000",
      "#1D2B53",
      "#7E2553",
      "#008751",
      "#AB5236",
      "#5F574F",
      "#C2C3C7",
      "#FFF1E8",
      "#FF004D",
      "#FFA300",
      "#FFEC27",
      "#00E436",
      "#29ADFF",
      "#83769C",
      "#FF77A8",
      "#FFCCAA"
    ]
  }
}
```

---

**Document Version:** 2.1  
**Status:** Implementation Ready  
**Next Review:** Post Phase-1 completion
