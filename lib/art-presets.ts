// Art generation presets and configurations (v2 - Motion handled by AI)
export const SUBJECTS = ['character', 'object', 'food', 'emblem'] as const;
export type SubjectType = (typeof SUBJECTS)[number];

export const SUBJECT_LABELS: Record<SubjectType, string> = {
  character: 'Character',
  object: 'Object/Equipment',
  food: 'Food & Drink',
  emblem: 'Emblem/Symbol/Number',
};

export const SUBJECT_THUMBNAILS: Record<SubjectType, string> = {
  character: '/assets/style-previews/Ref 2.png',
  object: '/assets/style-previews/Shoulder pads.png',
  food: '/assets/style-previews/Stadium hotdog.png',
  emblem: '/assets/style-previews/Number college block.png',
};

export const ART_STYLES = [
  {
    id: 'sticker',
    label: 'Sticker Toon',
    description: 'Bold outline, flat color',
    prompt: 'bold outlines, flat colors, sticker style',
    thumbnail: '/assets/thumbnails/Ref sticker.png',
  },
  {
    id: 'chibi',
    label: 'Chibi Anime',
    description: 'Cute, saturated',
    prompt: 'chibi anime, cute proportions, saturated colors',
    thumbnail: '/assets/thumbnails/Ref Chibi.png',
  },
  {
    id: 'sketch',
    label: 'Line Sketch',
    description: 'Ink + light wash',
    prompt: 'ink line art, light watercolor wash',
    thumbnail: '/assets/thumbnails/Ref sketch.png',
  },
  {
    id: 'pixel',
    label: 'Retro Pixel',
    description: '8-bit/pixel grid',
    prompt: '8-bit pixel art, limited palette',
    thumbnail: '/assets/thumbnails/Ref 16-bit.png',
  },
  {
    id: 'fantasy',
    label: 'Fantasy Poster',
    description: 'Soft painterly',
    prompt: 'soft painterly lighting, gentle gradients',
    thumbnail: '/assets/thumbnails/Ref reto poster.png',
  },
] as const;

export const ENERGY_LEVELS = [
  {
    id: 'chill',
    label: 'Chill',
    description: 'Calm, relaxed',
    prompt: 'calm, relaxed, peaceful',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Moderate energy',
    prompt: 'balanced, natural',
  },
  {
    id: 'hype',
    label: 'Hype',
    description: 'High energy, exciting',
    prompt: 'dynamic, energetic, exciting',
  },
] as const;

export const BACKGROUND_OPTIONS = [
  {
    id: 'none',
    label: 'None',
    description: 'Transparent',
    prompt: 'transparent background',
  },
  {
    id: 'gradient',
    label: 'Gradient',
    description: 'Simple gradient',
    prompt: 'simple gradient background',
  },
  { id: 'scene', label: 'Scene', description: 'Contextual scene', prompt: '' }, // Dynamic based on subject
] as const;

export const FRAMING_OPTIONS = [
  {
    id: 'icon',
    label: 'Icon',
    description: 'Close crop',
    prompt: 'icon style, close crop',
  },
  {
    id: 'bust',
    label: 'Bust',
    description: 'Head and shoulders',
    prompt: 'bust shot, head and shoulders',
  },
  {
    id: 'full',
    label: 'Full',
    description: 'Full view',
    prompt: 'full body, complete view',
  },
] as const;

export const FINISH_OPTIONS = [
  { id: 'none', label: 'None', description: 'Clean finish' },
  { id: 'glow', label: 'Outline Glow', description: 'Soft edge lighting' },
  { id: 'halftone', label: 'Halftone Dots', description: 'Comic book style' },
  { id: 'sticker', label: 'Sticker Border', description: 'White cutout edge' },
  { id: 'holo', label: 'Holo Sheen', description: 'Iridescent overlay' },
  { id: 'grain', label: 'Grain + Vignette', description: 'Vintage texture' },
];

export const PALETTE_PRESETS = [
  {
    id: 'dali-choice',
    label: 'Let Dali Choose',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF00FF'],
    special: true,
  },
  {
    id: 'gridiron',
    label: 'Gridiron Classic',
    colors: ['#013369', '#D50A0A', '#FFFFFF'],
  },
  {
    id: 'neon',
    label: 'Neon Nights',
    colors: ['#FF006E', '#3A86FF', '#FFBE0B'],
  },
  {
    id: 'retro90s',
    label: "'90s Retro",
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
  },
  {
    id: 'pastel',
    label: 'Pastel Pop',
    colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF'],
  },
  {
    id: 'mono',
    label: 'Monochrome',
    colors: ['#000000', '#666666', '#FFFFFF'],
  },
  {
    id: 'chrome',
    label: 'Chrome & Gold',
    colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
  },
];

// Simplified guided input fields (max 2 per subject)
export const GUIDED_FIELDS: Record<
  SubjectType,
  { id: string; label: string; placeholder: string }[]
> = {
  character: [
    { id: 'role', label: 'Role', placeholder: 'referee, QB, coach, mascot...' },
    { id: 'prop', label: 'Prop', placeholder: 'whistle, football, trophy...' },
  ],
  object: [
    {
      id: 'item',
      label: 'Item',
      placeholder: 'helmet, shoulder pads, cleats...',
    },
    {
      id: 'condition',
      label: 'Condition',
      placeholder: 'pristine, vintage, muddy...',
    },
  ],
  food: [
    { id: 'item', label: 'Item', placeholder: 'hotdog, nachos, beer...' },
    {
      id: 'topping',
      label: 'Topping/Flavor',
      placeholder: 'mustard, loaded, ice cold...',
    },
  ],
  emblem: [
    {
      id: 'symbol',
      label: 'Symbol/Number',
      placeholder: '88, star, shield...',
    },
    {
      id: 'style',
      label: 'Style',
      placeholder: 'college block, neon, chrome...',
    },
  ],
};

// Scene backgrounds that auto-switch by subject
export const SCENE_BACKGROUNDS: Record<SubjectType, string> = {
  character: 'stadium tunnel, field sideline',
  object: 'locker shelf, equipment room',
  food: 'concession counter, stadium concourse',
  emblem: 'dark neon wall, scoreboard display',
};

// Recipe cards for one-click presets (no motion, simplified)
export interface RecipeCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  subject: SubjectType;
  style: string;
  palette: string;
  background: string;
  energy?: string;
  framing?: string;
  fields?: Record<string, string>;
  finish?: string;
}

export const RECIPE_CARDS: RecipeCard[] = [
  {
    id: 'stadium-snack',
    title: 'Stadium Snack',
    description: 'Classic hotdog with mustard',
    icon: '🌭',
    subject: 'food',
    style: 'sticker',
    palette: 'gridiron',
    background: 'scene',
    energy: 'balanced',
    framing: 'icon',
    fields: { item: 'hotdog', topping: 'mustard' },
    finish: 'sticker',
  },
  {
    id: 'locker-shelf',
    title: 'Locker Shelf',
    description: 'Pristine shoulder pads',
    icon: '🏈',
    subject: 'object',
    style: 'sketch',
    palette: 'chrome',
    background: 'scene',
    energy: 'chill',
    framing: 'bust',
    fields: { item: 'shoulder pads', condition: 'pristine' },
  },
  {
    id: 'neon-88',
    title: 'Neon 88',
    description: 'Glowing jersey number',
    icon: '8️⃣8️⃣',
    subject: 'emblem',
    style: 'pixel',
    palette: 'neon',
    background: 'gradient',
    energy: 'hype',
    framing: 'icon',
    fields: { symbol: '88', style: 'college block' },
  },
  {
    id: 'ref-on-duty',
    title: 'Ref on Duty',
    description: 'Focused referee with whistle',
    icon: '👨‍⚖️',
    subject: 'character',
    style: 'sticker',
    palette: 'mono',
    background: 'scene',
    energy: 'balanced',
    framing: 'bust',
    fields: { role: 'referee', prop: 'whistle' },
    finish: 'glow',
  },
  {
    id: 'icy-drink',
    title: 'Ice Cold',
    description: 'Frosty game day beverage',
    icon: '🥤',
    subject: 'food',
    style: 'chibi',
    palette: 'pastel',
    background: 'gradient',
    energy: 'chill',
    framing: 'full',
    fields: { item: 'soda', topping: 'ice cold' },
    finish: 'holo',
  },
  {
    id: 'mvp-trophy',
    title: 'MVP Trophy',
    description: 'Championship trophy',
    icon: '🏆',
    subject: 'object',
    style: 'fantasy',
    palette: 'chrome',
    background: 'gradient',
    energy: 'hype',
    framing: 'full',
    fields: { item: 'trophy', condition: 'gleaming' },
    finish: 'holo',
  },
  {
    id: 'retro-badge',
    title: 'Vintage Badge',
    description: 'Old school team emblem',
    icon: '🛡️',
    subject: 'emblem',
    style: 'sketch',
    palette: 'retro90s',
    background: 'none',
    energy: 'chill',
    framing: 'icon',
    fields: { symbol: 'star badge', style: 'vintage' },
    finish: 'grain',
  },
  {
    id: 'anime-mascot',
    title: 'Anime MVP',
    description: 'Chibi style team mascot',
    icon: '🎭',
    subject: 'character',
    style: 'chibi',
    palette: 'neon',
    background: 'gradient',
    energy: 'hype',
    framing: 'full',
    fields: { role: 'mascot', prop: 'foam finger' },
    finish: 'sticker',
  },
];

// Helper function to build prompt from simplified fields
export function buildPromptFromFields(
  subject: SubjectType,
  style: string,
  energy: string,
  background: string,
  framing: string,
  fields: Record<string, string>,
  palette?: string,
): string {
  const styleData = ART_STYLES.find((s) => s.id === style);
  const energyData = ENERGY_LEVELS.find((e) => e.id === energy);
  const framingData = FRAMING_OPTIONS.find((f) => f.id === framing);
  const backgroundData = BACKGROUND_OPTIONS.find((b) => b.id === background);

  const fieldValues = Object.values(fields).filter((v) => v.trim());

  let basePrompt = '';

  // Add style
  if (styleData) {
    basePrompt += styleData.prompt + ', ';
  }

  // Add subject and fields
  if (subject === 'character') {
    basePrompt += fieldValues.join(' ') + ' character, ';
  } else if (subject === 'object') {
    basePrompt += fieldValues.join(', ') + ', ';
  } else if (subject === 'food') {
    basePrompt += fieldValues.join(' ') + ', ';
  } else if (subject === 'emblem') {
    basePrompt += fieldValues.join(' ') + ', ';
  }

  // Add energy
  if (energyData) {
    basePrompt += energyData.prompt + ', ';
  }

  // Add framing
  if (framingData) {
    basePrompt += framingData.prompt + ', ';
  }

  // Add background
  if (background === 'scene') {
    basePrompt += SCENE_BACKGROUNDS[subject] + ', ';
  } else if (backgroundData) {
    basePrompt += backgroundData.prompt + ', ';
  }

  // Add palette hint if provided
  if (palette) {
    const paletteData = PALETTE_PRESETS.find((p) => p.id === palette);
    if (paletteData) {
      basePrompt += `${paletteData.label.toLowerCase()} color palette, `;
    }
  }

  // Add safety suffixes
  basePrompt += 'no logos, no trademarks, team-agnostic, high quality';

  return basePrompt;
}

// Helper to get random palette
export function getRandomPalette(): string {
  return PALETTE_PRESETS[Math.floor(Math.random() * PALETTE_PRESETS.length)].id;
}
