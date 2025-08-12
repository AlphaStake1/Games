# NFT Creation Pricing Documentation

This document contains the official pricing structure for NFT creation services on the platform. This information is crucial for future LLM reference and maintaining pricing consistency across the application.

## Current Pricing Structure (Updated: 2025-08-12)

### NFT Creation Types and Pricing

| NFT Type                     | Price   | Description            | Features                                     |
| ---------------------------- | ------- | ---------------------- | -------------------------------------------- |
| **Custom Signature**         | **$3**  | Personalized marker    | Custom signature artwork creation            |
| **Custom Hand-Drawn Symbol** | **$3**  | Your unique design     | Hand-drawn custom symbol creation            |
| **Collections**              | **$7**  | Curated artwork        | Pre-made house-generated artwork collections |
| **Your Artwork**             | **$14** | AI-generated or upload | AI artwork generation OR custom art upload   |
| **Premium Animated**         | **$21** | Dynamic animations     | Advanced animated NFT creation               |

## Navigation Menu Pricing

The pricing displayed in the `CreateNFTNav` component should match the above structure exactly:

```typescript
const navItems = [
  {
    label: 'Custom Signature',
    href: '/create-nft/custom-signature',
    price: '$3',
    description: 'Personalized marker',
  },
  {
    label: 'Custom Hand-Drawn Symbol',
    href: '/create-nft/custom-hand-drawn-symbol',
    price: '$3',
    description: 'Your unique design',
  },
  {
    label: 'Collections',
    href: '/create-nft/house-generated-artwork',
    price: '$7',
    description: 'Curated artwork',
  },
  {
    label: 'Your Artwork',
    href: '/create-nft/ai-generated-artwork',
    price: '$14',
    description: 'AI-generated or upload',
  },
  {
    label: 'Premium Animated',
    href: '/create-nft/premium-animated',
    price: '$21',
    description: 'Dynamic animations',
  },
];
```

## Pricing History

### Previous Pricing (Incorrect - Do Not Use)

- Custom Signature: $2.99 ❌
- Custom Hand-Drawn Symbol: $4.99 ❌
- Collections: Free ❌
- Your Artwork: $1.99 ❌
- Premium Animated: $7.99 ❌

### Current Pricing (Correct - Use This)

- Custom Signature: $3 ✅
- Custom Hand-Drawn Symbol: $3 ✅
- Collections: $7 ✅
- Your Artwork: $14 ✅
- Premium Animated: $21 ✅

## Implementation Notes

1. **UI Components**: All pricing displays in the UI should use the current pricing structure
2. **Payment Integration**: Ensure payment systems are configured for the correct amounts
3. **Documentation Updates**: When pricing changes, update this file and all relevant components
4. **Testing**: Verify pricing displays correctly across all NFT creation pages

## Related Files

- `/components/CreateNFTNav.tsx` - Main navigation component with pricing
- `/lib/config/nftPricing.ts` - Technical pricing configuration (may contain legacy data)
- `/app/create-nft/*/page.tsx` - Individual NFT creation pages

## Important for Future Development

⚠️ **CRITICAL**: When working on NFT-related features, always reference this document for current pricing. Do not use pricing from the legacy `nftPricing.ts` file as it contains outdated tier information that doesn't match the current simplified pricing structure.

## Last Updated

- **Date**: August 12, 2025
- **Updated By**: User correction during Claude Code session
- **Reason**: Corrected incorrect pricing implementation in navigation component
