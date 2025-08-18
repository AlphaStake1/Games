# Hero Component Implementation Guide

## Video Hero Configuration

The primary hero component uses a dynamic video background with looping and rotation capabilities.

### Features Implemented:

1.  **Dual Video Rotation**: The component rotates between a primary and secondary video.
2.  **Seamless Looping**: Each video loops continuously.
3.  **Smooth Transitions**: A fade effect is applied when switching between videos.
4.  **Customizable Timing**: The rotation interval can be configured.
5.  **Focal Point Control**: The video's object position can be adjusted to focus on a specific area.

### Configuration

The video settings are controlled through environment variables in `.env.local`:

```
NEXT_PUBLIC_HERO_MEDIA_URL=/Assets/dancing-look-back_4k.mp4
NEXT_PUBLIC_HERO_MEDIA_ALT=/Assets/dancing-feeling-it_4k_1080p_web.mp4
NEXT_PUBLIC_HERO_ROTATE_MS=12000
NEXT_PUBLIC_HERO_OBJECT_POSITION=50% 30%
```

- `NEXT_PUBLIC_HERO_MEDIA_URL`: Path to the primary video file.
- `NEXT_PUBLIC_HERO_MEDIA_ALT`: Path to the secondary video file.
- `NEXT_PUBLIC_HERO_ROTATE_MS`: Time in milliseconds between video rotations (e.g., 12000 for 12 seconds).
- `NEXT_PUBLIC_HERO_OBJECT_POSITION`: Sets the focal point of the video (e.g., "50% 30%").

### Implementation Details

The core logic for the video hero resides in the following locations:

1.  **.env.local**: Environment variables for URLs, timing, and positioning.
2.  **components/Hero.tsx**: The React component containing the implementation with loop/rotate logic.

The current setup automatically loops each video and rotates between them every 12 seconds with a smooth fade transition.

---

# (Legacy) Stadium Hero Implementation Guide

## What I've Created

I've built a sophisticated stadium hero banner component using SVG and Canvas graphics that creates the visual effect you described:

### Features Implemented:

1. **Stadium Field View**
   - Upper deck angled perspective using CSS 3D transforms
   - View from one endzone looking down the field
   - 10x10 grid representing football squares

2. **Visual Elements**
   - **Grass field pattern** - Alternating green stripes
   - **Home team endzone** - Generic blue gradient at far end
   - **Away team sideline** - Generic red gradient on left side
   - **Grid squares filled with**:
     - Signature scribbles (curved paths)
     - Player numbers
     - Football icons
     - Team initials (GB, NE, DAL, SF, KC, etc.)
   - **Stadium lights** - Glowing effects from above
   - **Goal posts** - At both ends with perspective sizing
   - **Animated crowd** - Pulsing crowd indicators on sidelines

3. **Component Usage**

The `StadiumHero` component is now available and can be used anywhere:

```tsx
import StadiumHero from '@/components/StadiumHero';

// Basic usage
<StadiumHero
  title="Your Title"
  subtitle="Your subtitle text"
  className="min-h-[700px]"
/>;
```

## How to Use on Home Page

To add this to your home page, replace the current Hero component:

```tsx
// In app/page.tsx, replace:
import Hero from '@/components/Hero';

// With:
import StadiumHero from '@/components/StadiumHero';

// Then replace:
<Hero />

// With:
<StadiumHero
  title="Football Squares"
  subtitle="The Ultimate NFL Betting Experience on Blockchain"
  className="min-h-[700px]"
/>
```

## Customization Options

### Team Colors

To customize team colors, modify these gradients in `StadiumHero.tsx`:

```jsx
// Home Team (currently blue)
<linearGradient id="homeEndzone">
  <stop stopColor="#YOUR_COLOR" />
</linearGradient>

// Away Team (currently red)
<linearGradient id="awaySideline">
  <stop stopColor="#YOUR_COLOR" />
</linearGradient>
```

### Square Content

The squares randomly display different content types:

- 30% chance: Signature scribbles
- 20% chance: Player numbers
- 20% chance: Football icons
- 15% chance: Team initials
- 15% chance: Empty

## For Actual Artwork

While I cannot generate unique images, here are your options for adding real artwork:

### Option 1: AI Image Generation

Use services like:

- **Midjourney**: Prompt: "aerial view football field with grid squares, stadium lights, packed crowd, perspective from endzone, digital art style"
- **DALL-E 3**: Similar prompt with emphasis on "10x10 grid overlay"
- **Stable Diffusion**: Add "highly detailed, 4k, digital painting" to the prompt

### Option 2: Professional Designer

Provide them with:

- The current SVG as a reference
- Request layered PSD/AI file with:
  - Background stadium photo
  - Grid overlay layer
  - Sample signatures/icons layer
  - Light effects layer

### Option 3: Stock Photo + Overlay

1. Purchase stadium aerial photo from Shutterstock/Getty
2. Use the SVG grid as an overlay
3. Add signature graphics in post-processing

### Implementation with Real Image:

```tsx
// Add to StadiumHero component
<div
  className="absolute inset-0"
  style={{
    backgroundImage: 'url("/path-to-your-stadium-image.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>
```

## Current Implementation

The current implementation uses:

- **Pure CSS/SVG graphics** - No external images needed
- **Responsive design** - Works on all screen sizes
- **Dark mode support** - Automatically adjusts
- **Performance optimized** - Uses CSS animations instead of JavaScript
- **Accessible** - Text remains readable with overlay gradients

The component is now live on your About page at `/about` and ready to be implemented on the home page whenever you're ready!
