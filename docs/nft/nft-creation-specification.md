# NFT Creation Specification

## Overview

This document outlines the complete NFT creation process for the platform, including generation limits, tier systems, user workflows, and the new draft management system for different NFT types.

**Last Updated:** August 2025  
**Version:** 3.0

## Recent Updates (v3.0)

- Removed rarity badges from all NFT types
- Added automatic draft saving system
- Implemented "Try Again" and "Modify Prompt" options
- Added conditional download feature (3+ NFT purchases)
- Updated pricing structure ($3, $3, $7, $14, $21)

## NFT Types & Creation Processes

### 1. Colored Signatures

**Visual Requirements:**

- Color selector with real-time preview
- Neon glow effect (subtle, visible in both light/dark modes)
- 1:1 aspect ratio (square format)
- Transparent background

**User Flow:**

1. User enters/draws signature
2. Color picker appears with live preview
3. Neon glow intensity slider (optional)
4. Preview in both light/dark modes
5. Accept & mint

**Limits:** Unlimited color/style adjustments before minting

---

### 2. AI-Generated Artwork (Your Artwork - $14)

**Session Management:**

- **Duration:** 60 minutes with countdown timer
- **Pause Option:** Time-out button to pause session
- **Session End:** Must choose from generations or select refund/retry
- **Draft System:** All generations automatically saved as drafts
- **Draft Library:** Accessible via dedicated "Drafts" tab showing all session generations

**Generation Tiers by Account Type:**

#### Standard Users (40 attempts):

- Attempts 1-10: Economy models (fast, basic quality)
- Attempts 11-20: Mid-tier models (balanced quality/speed)
- Attempt 21: Dali Palette intervention
- Attempts 21-30: Mid-tier models (continued)
- Attempts 31-35: Premium models (highest quality)
- Attempt 36: Warning (4 attempts remaining)
- Attempts 37-40: Premium models (final attempts)

#### Premium Users (70 attempts):

- Attempts 1-30: Same as Standard
- Attempt 30: Dali Palette help offered
- Attempts 31-70: Premium models
- Download unlock still requires 3+ mints

#### VIP Users (70 attempts):

- Attempts 1-40: Same tier progression as Standard
- Attempts 41-50: Mid-tier models (extended session)
- Attempts 51-70: Premium models (final push)
- Download unlock still requires 3+ mints

**Dali Palette Intervention (at attempt 21):**

- Automatic popup: "Would you like help improving your prompt?"
- Free prompt optimization service
- Suggests modifications based on common patterns
- User can accept/decline assistance

**Image Requirements:**

- 1:1 aspect ratio (square)
- Automatic background removal
- No download option unless 3+ minted from batch

**Enhanced Preview Options:**

After each generation, users have access to:

- **Create NFT:** Primary action to mint the current artwork
- **Try Again:** Regenerate with same parameters (adds to draft library)
- **Modify Prompt:** Opens Advanced Mode for prompt customization
- **Download Preview:** Available after 3+ NFT purchases in session

**Draft Management System:**

- **Auto-Save:** Every generation automatically saved as numbered draft
- **Draft Counter:** Tab shows "Drafts (X)" with current count
- **Draft Selection:** Click any draft to load it back into preview
- **Session Persistence:** Drafts retained throughout entire session
- **Comparison:** Browse all generations to make informed decisions

**Final Selection Process:**

1. User can generate up to limit (40/70) reviewing drafts as they go
2. Select from draft library to mint preferred generations
3. If no selection made:
   - Option A: Full refund (all generations discarded)
   - Option B: Try again with new prompt (all generations discarded)
4. After first mint, Dali Palette encourages second mint
5. At 3+ mints: Download capability unlocked for session
6. Non-minted images retained for 60 days (internal policy)

---

### 3. User-Uploaded Images

**Processing Workflow:**

1. **Upload:** User selects image file
2. **Crop Interface:**
   - Auto-suggest 1:1 crop
   - Manual placement control (drag to reposition)
   - Zoom in/out for fine-tuning
   - Grid overlay for alignment
3. **Background Removal:**
   - "Process" button initiates removal
   - AI-powered background detection
   - Preview of result
4. **Accept/Reject:**
   - User reviews processed image
   - Can reject and restart process
   - Unlimited attempts until satisfied

**Technical Requirements:**

- Supported formats: PNG, JPG, WEBP, GIF (static)
- Max file size: 10MB (pre-process)
- Output: 1:1 ratio, transparent background
- Resolution: 2048x2048px optimal

---

### 4. Premium Animated NFTs ($21)

**Generation Limits:**

- **Total Attempts:** 4 animations per session
- **Quality Tiers (Football terminology):**
  - 1st Down: Basic animator (simple effects)
  - 2nd Down: Premium animator (advanced effects)
  - 3rd Down: Premium+ animator (complex animations)
  - 4th Down: Elite animator (highest quality)
- **Draft System:** Same auto-save functionality as AI-Generated artwork
- **Preview Options:** Try Again, Modify Prompt, Download (after 3+ purchases)

**Selection Process:**

1. All 4 animations displayed in gallery view
2. User selects one favorite
3. Selected animation is minted
4. Non-selected animations are permanently discarded

**Animation Specifications:**

- Format: MP4/GIF
- Duration: 3-10 seconds
- Loop: Seamless
- Resolution: 1024x1024px (1:1 ratio)

---

## Download & Ownership Rules

### Download Permissions:

- **Per Session:** 3+ mints unlock downloads for that session
- **Permanent Access:** Any minted NFT can be downloaded forever if wallet confirms ownership
- **File Format:** PNG files for all downloads
- **Rationale:** Encourages multiple mints, increases platform value

### Ownership Rights:

- **Minted NFTs:** Full ownership transferred to user
- **Storage Policy:**
  - Minted: Permanent storage with ownership verification
  - Non-minted: 60-day retention (internal policy, not disclosed)
- **Downloaded files:** Personal use permitted, commercial use requires minting

### Dali's "Incinerator Recovery":

- Users can request previously generated (non-minted) images within 60 days
- Dali presents this as "attempting to retrieve from the incinerator"
- Creates engagement and urgency without revealing actual retention period

---

## User Experience Enhancements

### Progress Indicators:

- Generation counter: "Attempt 15 of 40"
- Quality tier indicator: "Using Mid-Tier Model"
- Time estimates: "~30 seconds remaining"
- Draft counter in tab: "Drafts (15)"

### Batch Management:

- Thumbnail grid view for all generations
- Automatic draft saving with numbered labels
- Comparison mode (side-by-side view)
- Batch actions (mint multiple, clear all)
- Draft library for reviewing all session generations

### Enhanced Generation Flow:

- **Immediate Options:** After each generation, users can:
  - Create NFT immediately
  - Try Again with same settings
  - Modify Prompt in Advanced Mode
  - Download (if 3+ NFTs purchased)
- **No Rarity System:** Focus on artwork quality, not artificial rarity
- **Session Flexibility:** Continue generating until satisfied or limit reached

### Accessibility:

- Keyboard navigation for all controls
- Screen reader support for image descriptions
- High contrast mode for UI elements
- Touch-friendly controls for mobile

---

## Content Moderation Policy

### Generation Standards:

- **Input Filtering:** Strictest art generator standards applied to prompts
- **Prohibited Content:** Follows industry-standard NSFW/illegal content filters
- **User Freedom:** Maximum creative freedom within legal bounds

### Display Policies:

#### Public Boards:

- **Flagged Content:** Automatically blurred or pixelated
- **User Control:** Option to view blurred content with warning
- **Community Standards:** Family-friendly public display

#### Private Spaces:

- **Player Locker Room:** No censorship, full content display
- **CBL Sports Lounge:** No censorship for CBL members
- **Ownership Rights:** Users own all minted content regardless of flags

### Technical Implementation:

- **Auto-Detection:** AI-powered content flagging system
- **Manual Review:** Community reporting system for missed flags
- **Appeal Process:** Users can contest incorrect flags

---

## Finalized Specifications

### Pricing & Payment:

1. **NFT Creation Pricing (Current as of August 2025):**
   - **Custom Signature:** $3
   - **Custom Hand-Drawn Symbol:** $3
   - **Collections (House-Generated):** $7
   - **Your Artwork (AI-Generated/Upload):** $14
   - **Premium Animated:** $21

2. **Cost Structure:**
   - One-time purchase for session access (40-70 attempts based on tier)
   - All model tiers included in single purchase
   - Minting fees separate from generation fees
   - Platform covers all gas fees

3. **Refund Policy:**
   - Full refund if no images selected after all attempts
   - All generations discarded upon refund
   - Option to retry with new prompt (discards all previous)
   - Technical failures handled with session extension

### Technical Implementation:

3. **Model Specifics:**
   - AI models: Currently being evaluated and compared
   - Background removal: Automated for all generations
   - Animation tools: 4-tier system using football down terminology

4. **Storage & Performance:**
   - **Temporary Storage:** 60-day retention for all generations
   - **Permanent Storage:** Minted NFTs stored indefinitely
   - **Retrieval Database:** Optimized for fastest access
   - **"Incinerator" Feature:** Gamified recovery within 60 days

### Business Logic:

5. **Session Management:**
   - **Duration:** 60 minutes with visible countdown
   - **Pause Feature:** Time-out button preserves progress
   - **New Cycle:** Triggered by new purchase only

6. **NFT Minting:**
   - **Blockchain:** Solana
   - **Gas Fees:** Platform pays all fees
   - **Metadata Storage:** Fastest available solution (TBD after research)

7. **Quality Control:**
   - **Generation Filter:** Industry-standard NSFW prevention
   - **Display Control:** Public/private space differentiation
   - **User Rights:** Full ownership of minted content

### User Account:

8. **Tier System Integration:**
   - **Standard:** 40 attempts per session
   - **Premium:** 70 attempts (intervention at 30)
   - **VIP:** 70 attempts (extended quality tiers)
   - **All Tiers:** 3+ mints unlock downloads

9. **History & Analytics:**
   - **Tracking:** Per wallet address
   - **Retention:** 60 days (not disclosed to users)
   - **Future Features:** Success analytics & recommendations

### Additional Features:

10. **Collaboration:**
    - Share drafts with others for feedback?
    - Team accounts with shared attempts?

11. **Templates & Presets:**
    - Save successful prompts as templates?
    - Community prompt marketplace?

12. **Mobile Experience:**
    - Native app or web-based?
    - Reduced quality for mobile generation?

---

## Implementation Priority

### Phase 1 (MVP):

- Basic AI generation (single tier)
- Upload & crop with background removal
- Simple colored signatures
- Basic minting flow

### Phase 2 (Enhanced):

- Tiered generation models
- Dali Palette intervention
- Animated NFTs
- Batch minting

### Phase 3 (Premium):

- Advanced analytics
- Template marketplace
- Collaboration features
- Mobile optimization

---

## Success Metrics

- Average attempts before satisfaction
- Mint conversion rate
- User retention after first mint
- Support ticket volume
- Generation quality scores
