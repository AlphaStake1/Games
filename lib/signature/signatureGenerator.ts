import { createHash } from 'crypto';
import { PublicKey } from '@solana/web3.js';
import {
  SIGNATURE_STYLES,
  SIGNATURE_CONFIG,
  SignatureStyle,
  SignatureFont,
  SIGNATURE_FONTS,
} from './signatureConfig';

export interface SignatureData {
  firstName: string;
  lastInitial: string;
  walletPublicKey: string;
  seed: string;
  selectedStyleId: string;
  timestamp: number;
}

export interface SignatureRenderOptions {
  format: 'svg' | 'png' | 'base64';
  width?: number;
  height?: number;
  background?: string;
}

export class SignatureGenerator {
  private signatureData: SignatureData | null = null;

  /**
   * Generate deterministic seed from user data and wallet
   */
  generateSeed(
    firstName: string,
    lastInitial: string,
    walletPublicKey: string,
  ): string {
    const normalizedFirst = firstName.trim().toLowerCase();
    const normalizedLast = lastInitial.trim().toLowerCase().charAt(0);
    const seedInput = `${normalizedFirst}_${normalizedLast}_${walletPublicKey}`;

    return createHash('sha256').update(seedInput).digest('hex');
  }

  /**
   * Get deterministic style variations based on seed
   */
  getStyleVariations(seed: string, baseStyle: SignatureStyle): SignatureStyle {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const { slantRange, sizeRange, spacingRange, strokeRange } =
      SIGNATURE_CONFIG.seedVariations;

    // Generate deterministic variations
    const slantVariation = this.mapSeedToRange(
      seedNum,
      slantRange[0],
      slantRange[1],
      0,
    );
    const sizeVariation = this.mapSeedToRange(
      seedNum,
      sizeRange[0],
      sizeRange[1],
      1,
    );
    const spacingVariation = this.mapSeedToRange(
      seedNum,
      spacingRange[0],
      spacingRange[1],
      2,
    );
    const strokeVariation = this.mapSeedToRange(
      seedNum,
      strokeRange[0],
      strokeRange[1],
      3,
    );

    return {
      ...baseStyle,
      slant: baseStyle.slant + slantVariation,
      baseSize: baseStyle.baseSize + sizeVariation,
      letterSpacing: baseStyle.letterSpacing + spacingVariation,
      strokeWidth: baseStyle.strokeWidth + strokeVariation,
    };
  }

  /**
   * Map seed to a range deterministically
   */
  private mapSeedToRange(
    seed: number,
    min: number,
    max: number,
    offset: number,
  ): number {
    const adjustedSeed = (seed + offset * 12345) % 1000000;
    const normalized = adjustedSeed / 1000000;
    return min + normalized * (max - min);
  }

  /**
   * Generate signature styles for user selection
   */
  generateStyleGallery(seed: string, count: number = 9): SignatureStyle[] {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const styles = [...SIGNATURE_STYLES];

    // Deterministic shuffle based on seed
    for (let i = styles.length - 1; i > 0; i--) {
      const j = (seedNum + i) % (i + 1);
      [styles[i], styles[j]] = [styles[j], styles[i]];
    }

    // Apply variations and return requested count
    return styles
      .slice(0, count)
      .map((style) => this.getStyleVariations(seed, style));
  }

  /**
   * Initialize signature data
   */
  initializeSignature(
    firstName: string,
    lastInitial: string,
    walletPublicKey: string,
    selectedStyleId?: string,
  ): SignatureData {
    const seed = this.generateSeed(firstName, lastInitial, walletPublicKey);
    const gallery = this.generateStyleGallery(seed);

    this.signatureData = {
      firstName,
      lastInitial,
      walletPublicKey,
      seed,
      selectedStyleId: selectedStyleId || gallery[0].id,
      timestamp: Date.now(),
    };

    return this.signatureData;
  }

  /**
   * Render signature to SVG
   */
  renderToSVG(data: SignatureData, style: SignatureStyle): string {
    const { canvasWidth, canvasHeight, padding } = SIGNATURE_CONFIG;
    const font = SIGNATURE_FONTS.find((f) => f.id === style.fontId);
    if (!font) throw new Error(`Font ${style.fontId} not found`);

    const text = `${data.firstName} ${data.lastInitial}.`;

    // Use fallback fonts that work in SVG data URIs
    const fontFamily = this.getFallbackFontFamily(font.category);
    const fontSize = style.baseSize;
    const x = canvasWidth / 2;
    const y = canvasHeight / 2 + fontSize / 3;

    const svg = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
  <text x="${x}" y="${y}" 
        font-family="${fontFamily}" 
        font-size="${fontSize}px" 
        font-weight="${font.weight}" 
        letter-spacing="${style.letterSpacing}em" 
        fill="${style.color}" 
        text-anchor="middle" 
        transform="rotate(${style.slant} ${x} ${y})"
        ${font.italic ? 'font-style="italic"' : ''}>${text}</text>
  <text x="${canvasWidth - 5}" y="${canvasHeight - 5}" 
        font-size="8" fill="#cccccc" text-anchor="end" opacity="0.3">
    ${data.seed.substring(0, 8)}
  </text>
</svg>`;

    return svg.trim();
  }

  /**
   * Get web-safe font family based on category
   */
  private getFallbackFontFamily(category: string): string {
    switch (category) {
      case 'handwritten':
        return 'Brush Script MT, cursive';
      case 'script':
        return 'Lucida Handwriting, cursive';
      case 'pro':
        return 'Edwardian Script ITC, cursive';
      default:
        return 'cursive';
    }
  }

  /**
   * Convert SVG to path-only format (for NFT storage)
   */
  async convertToPathSVG(svgString: string): Promise<string> {
    // This would use a library like opentype.js to convert text to paths
    // For now, returning the original SVG
    // In production, you'd convert all text elements to path elements
    return svgString;
  }

  /**
   * Generate signature metadata for NFT
   */
  generateNFTMetadata(
    data: SignatureData,
    style: SignatureStyle,
    imageUri: string,
  ): object {
    const { nftMetadata } = SIGNATURE_CONFIG;
    const font = SIGNATURE_FONTS.find((f) => f.id === style.fontId);

    return {
      name: `Signature - ${data.firstName} ${data.lastInitial}.`,
      symbol: nftMetadata.symbol,
      description: `Digital signature NFT for ${data.firstName} ${data.lastInitial}.`,
      image: imageUri,
      external_url: 'https://fsq.game/signatures',
      attributes: [
        {
          trait_type: 'First Name',
          value: data.firstName,
        },
        {
          trait_type: 'Last Initial',
          value: data.lastInitial,
        },
        {
          trait_type: 'Style',
          value: style.id,
        },
        {
          trait_type: 'Font',
          value: font?.name || 'Unknown',
        },
        {
          trait_type: 'Font Category',
          value: font?.category || 'unknown',
        },
        {
          trait_type: 'Baseline',
          value: style.baseline,
        },
        {
          trait_type: 'Seed',
          value: data.seed.substring(0, 8),
        },
        {
          trait_type: 'Render Version',
          value: nftMetadata.renderVersion,
        },
        {
          trait_type: 'Created',
          value: new Date(data.timestamp).toISOString(),
        },
      ],
      properties: {
        category: nftMetadata.category,
        creators: [
          {
            address: data.walletPublicKey,
            share: 100,
          },
        ],
        files: [
          {
            uri: imageUri,
            type: 'image/svg+xml',
          },
        ],
      },
      collection: {
        name: nftMetadata.collection,
        family: 'FSQ',
      },
      seller_fee_basis_points: nftMetadata.sellerFeeBasisPoints,
    };
  }

  /**
   * Validate signature input
   */
  validateInput(
    firstName: string,
    lastInitial: string,
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate first name
    if (!firstName || firstName.trim().length === 0) {
      errors.push('First name is required');
    } else if (firstName.length > 30) {
      errors.push('First name must be 30 characters or less');
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
      errors.push(
        'First name can only contain letters, spaces, hyphens, and apostrophes',
      );
    }

    // Validate last initial
    if (!lastInitial || lastInitial.trim().length === 0) {
      errors.push('Last initial is required');
    } else if (lastInitial.trim().length !== 1) {
      errors.push('Last initial must be exactly one character');
    } else if (!/^[a-zA-Z]$/.test(lastInitial.trim())) {
      errors.push('Last initial must be a letter');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get signature text for display
   */
  getSignatureText(data: SignatureData): string {
    return `${data.firstName} ${data.lastInitial}.`;
  }
}
