export interface SignatureFont {
  id: string;
  name: string;
  family: string;
  category: 'handwritten' | 'script' | 'pro';
  weight: number;
  italic: boolean;
  features?: string[]; // OpenType features
}

export const SIGNATURE_FONTS: SignatureFont[] = [
  // Handwritten fonts
  {
    id: 'patrick-hand',
    name: 'Patrick Hand',
    family: 'var(--font-patrick-hand)',
    category: 'handwritten',
    weight: 400,
    italic: false,
  },
  {
    id: 'caveat',
    name: 'Caveat',
    family: 'var(--font-caveat)',
    category: 'handwritten',
    weight: 400,
    italic: false,
  },
  {
    id: 'shadows-into-light',
    name: 'Shadows Into Light',
    family: 'var(--font-shadows-into-light)',
    category: 'handwritten',
    weight: 400,
    italic: false,
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie',
    family: 'Reenie Beanie',
    category: 'handwritten',
    weight: 400,
    italic: false,
  },
  {
    id: 'cac-champagne',
    name: 'CAC Champagne',
    family: 'CAC Champagne',
    category: 'script',
    weight: 400,
    italic: false,
  },
  {
    id: 'the-girl-next-door',
    name: 'The Girl Next Door',
    family: 'The Girl Next Door',
    category: 'handwritten',
    weight: 400,
    italic: false,
  },
  // Script fonts
  {
    id: 'arizona',
    name: 'Arizona',
    family: 'Arizona',
    category: 'script',
    weight: 400,
    italic: false,
  },
  {
    id: 'black-jack',
    name: 'Black Jack',
    family: 'Black Jack',
    category: 'script',
    weight: 400,
    italic: false,
  },
  {
    id: 'la-luxes-script',
    name: 'La Luxes Script',
    family: 'La Luxes Script',
    category: 'script',
    weight: 400,
    italic: false,
  },
  {
    id: 'qwigley',
    name: 'Qwigley',
    family: 'var(--font-qwigley)',
    category: 'script',
    weight: 400,
    italic: false,
  },
  {
    id: 'pinyon-script',
    name: 'Pinyon Script',
    family: 'Pinyon Script',
    category: 'script',
    weight: 400,
    italic: false,
  },
  // Pro-level fonts
  {
    id: 'madelyn',
    name: 'Madelyn',
    family: 'Madelyn',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt'],
  },
  {
    id: 'warm-script',
    name: 'Warm Script',
    family: 'Warm Script',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt', 'swsh'],
  },
  {
    id: 'stephen-type',
    name: 'Stephen Type',
    family: 'Stephen Type',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt'],
  },
  {
    id: 'alamanda',
    name: 'Alamanda',
    family: 'Alamanda',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt', 'swsh'],
  },
  {
    id: 'violet-bee',
    name: 'Violet Bee',
    family: 'Violet Bee',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt'],
  },
  {
    id: 'majesty',
    name: 'Majesty',
    family: 'Majesty',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt', 'swsh'],
  },
  {
    id: 'snell-roundhand',
    name: 'Snell Roundhand',
    family: 'Snell Roundhand',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt'],
  },
  {
    id: 'citadel-script',
    name: 'Citadel Script',
    family: 'Citadel Script',
    category: 'pro',
    weight: 400,
    italic: false,
    features: ['liga', 'calt', 'swsh'],
  },
];

export interface SignatureStyle {
  id: string;
  fontId: string;
  baseSize: number;
  letterSpacing: number;
  strokeWidth: number;
  slant: number;
  baseline: 'straight' | 'curved' | 'rising';
  pressure: 'uniform' | 'variable';
  color: string;
}

// Pre-defined signature styles combining fonts with visual attributes
export const SIGNATURE_STYLES: SignatureStyle[] = [
  {
    id: 'casual-1',
    fontId: 'patrick-hand',
    baseSize: 48,
    letterSpacing: 0.02,
    strokeWidth: 2,
    slant: 0,
    baseline: 'straight',
    pressure: 'uniform',
    color: '#000000',
  },
  {
    id: 'elegant-1',
    fontId: 'pinyon-script',
    baseSize: 56,
    letterSpacing: 0.05,
    strokeWidth: 1.5,
    slant: 5,
    baseline: 'curved',
    pressure: 'variable',
    color: '#1a1a1a',
  },
  {
    id: 'professional-1',
    fontId: 'qwigley',
    baseSize: 64,
    letterSpacing: 0.03,
    strokeWidth: 1.8,
    slant: -15,
    baseline: 'rising',
    pressure: 'variable',
    color: '#1a1a1a',
  },
  {
    id: 'artistic-1',
    fontId: 'madelyn',
    baseSize: 60,
    letterSpacing: 0.04,
    strokeWidth: 2.2,
    slant: 3,
    baseline: 'curved',
    pressure: 'variable',
    color: '#000000',
  },
  {
    id: 'casual-2',
    fontId: 'caveat',
    baseSize: 50,
    letterSpacing: 0.02,
    strokeWidth: 2,
    slant: -2,
    baseline: 'straight',
    pressure: 'uniform',
    color: '#222222',
  },
  {
    id: 'elegant-2',
    fontId: 'la-luxes-script',
    baseSize: 54,
    letterSpacing: 0.06,
    strokeWidth: 1.6,
    slant: 6,
    baseline: 'curved',
    pressure: 'variable',
    color: '#000044',
  },
  {
    id: 'professional-2',
    fontId: 'warm-script',
    baseSize: 52,
    letterSpacing: 0.03,
    strokeWidth: 1.9,
    slant: -12,
    baseline: 'rising',
    pressure: 'variable',
    color: '#000000',
  },
  {
    id: 'artistic-2',
    fontId: 'violet-bee',
    baseSize: 58,
    letterSpacing: 0.05,
    strokeWidth: 2.1,
    slant: 2,
    baseline: 'curved',
    pressure: 'variable',
    color: '#1a1a1a',
  },
  {
    id: 'modern-1',
    fontId: 'reenie-beanie',
    baseSize: 54,
    letterSpacing: 0.08,
    strokeWidth: 1.4,
    slant: 12,
    baseline: 'rising',
    pressure: 'uniform',
    color: '#1a1a1a',
  },
];

export const SIGNATURE_CONFIG = {
  // Canvas dimensions for rendering
  canvasWidth: 400,
  canvasHeight: 150,
  padding: 20,

  // Export formats
  exportFormats: ['svg', 'png'],
  pngScale: 2, // 2x for retina

  // Deterministic variations
  seedVariations: {
    slantRange: [-2, 2],
    sizeRange: [-4, 4],
    spacingRange: [-0.01, 0.01],
    strokeRange: [-0.2, 0.2],
  },

  // Default selection
  defaultStyleCount: 9, // Show 9 styles by default
  maxPreviewStyles: 12,

  // NFT metadata
  nftMetadata: {
    collection: 'FSQ Signatures',
    symbol: 'FSQSIG',
    sellerFeeBasisPoints: 250, // 2.5%
    category: 'signature',
    renderVersion: '1.0.0',
  },
};
