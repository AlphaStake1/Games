import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  additionalMetaTags?: Record<string, string>;
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://footballsquares.app';
const defaultImage = `${baseUrl}/og/default.png`;

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = defaultImage,
    canonical,
    noIndex = false,
  } = config;

  const fullTitle = title.includes('Football Squares')
    ? title
    : `${title} | Football Squares`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),

    // OpenGraph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || baseUrl,
      siteName: 'Football Squares',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      site: '@FootballSquares',
      creator: '@FootballSquares',
    },

    // Additional meta tags
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    canonical: canonical,

    // Structured data will be handled separately
    other: {
      'theme-color': '#1D4ED8', // Blue theme color
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Football Squares',
    },
  };
}

// Pre-defined metadata for common pages
export const seoConfig = {
  home: {
    title: 'Football Squares - NFL Squares Games & Fantasy Football',
    description:
      'Join the ultimate NFL squares games platform. Play football squares for every game, win real prizes, and compete with friends. Simple, fair, and fun!',
    keywords: [
      'nfl squares',
      'football squares',
      'super bowl squares',
      'nfl games',
      'fantasy football',
      'sports betting',
      'football pool',
    ],
  },

  seasonPass: {
    title: 'Season Pass - Unlock Premium NFL Squares Features',
    description:
      'Get exclusive access to VIP boards, higher payouts, and premium features with the Football Squares Season Pass. Join the elite league of players!',
    keywords: [
      'season pass',
      'vip',
      'premium',
      'exclusive',
      'nfl squares premium',
    ],
    image: `${baseUrl}/og/season-pass.png`,
  },

  boards: {
    title: 'NFL Squares Boards - Join Live Football Games',
    description:
      'Browse and join live NFL squares boards. Multiple tiers available from free play to high stakes. Fair gameplay guaranteed with blockchain verification.',
    keywords: [
      'nfl boards',
      'squares boards',
      'join game',
      'football squares live',
    ],
    image: `${baseUrl}/og/boards.png`,
  },

  faq: {
    title: 'FAQ - How to Play Football Squares',
    description:
      'Learn how to play football squares, understand payouts, and get answers to common questions. New to squares? Start here!',
    keywords: [
      'how to play',
      'football squares rules',
      'faq',
      'help',
      'tutorial',
    ],
  },

  nftGuide: {
    title: 'NFT Guide - What are Football Squares NFTs?',
    description:
      'Understand how NFTs work in Football Squares. Learn about ownership, trading, and the benefits of blockchain-verified gameplay.',
    keywords: ['nft', 'blockchain', 'solana', 'crypto', 'digital ownership'],
    image: `${baseUrl}/og/nft-guide.png`,
  },

  walletGuide: {
    title: 'Wallet Guide - Connect Your Solana Wallet',
    description:
      'Step-by-step guide to connecting your Solana wallet and getting started with Football Squares. Phantom, Solflare, and more supported.',
    keywords: [
      'solana wallet',
      'phantom',
      'solflare',
      'connect wallet',
      'crypto wallet',
    ],
    image: `${baseUrl}/og/wallet-guide.png`,
  },

  dashboard: {
    title: 'Dashboard - Your Football Squares Hub',
    description:
      'Manage your squares, track winnings, and view your game history. Your central hub for all Football Squares activities.',
    keywords: ['dashboard', 'my games', 'winnings', 'history', 'account'],
    noIndex: true, // User-specific content
  },

  rewards: {
    title: 'Rewards Program - Earn Blue Points & Prizes',
    description:
      'Earn Blue Points with every game and redeem for exclusive rewards. The more you play, the more you earn!',
    keywords: ['rewards', 'blue points', 'loyalty program', 'prizes', 'earn'],
    image: `${baseUrl}/og/rewards.png`,
  },

  about: {
    title: 'About Football Squares - Fair, Fun, and Transparent',
    description:
      'Learn about our mission to create the fairest and most fun football squares experience using blockchain technology.',
    keywords: ['about us', 'mission', 'blockchain', 'fair play', 'transparent'],
  },

  howToPlay: {
    title: 'How to Play Football Squares - Complete Guide',
    description:
      'Complete guide to playing football squares. Learn the rules, strategies, and tips to maximize your winnings.',
    keywords: [
      'how to play',
      'rules',
      'strategy',
      'guide',
      'tutorial',
      'football squares rules',
    ],
    image: `${baseUrl}/og/how-to-play.png`,
  },

  privacy: {
    title: 'Privacy Policy - Your Data Protection',
    description:
      'Our commitment to protecting your privacy and data. Learn how we collect, use, and protect your information.',
    keywords: ['privacy policy', 'data protection', 'privacy'],
  },

  terms: {
    title: 'Terms of Service - Football Squares Terms',
    description:
      'Terms and conditions for using Football Squares. Fair play rules and platform guidelines.',
    keywords: ['terms of service', 'terms and conditions', 'rules'],
  },
} as const;

// Utility to get metadata for a specific page
export function getPageMetadata(page: keyof typeof seoConfig): Metadata {
  return generateMetadata(seoConfig[page]);
}

// Season-specific dynamic metadata
export function getSeasonMetadata(year: number): Metadata {
  return generateMetadata({
    title: `${year} NFL Season Squares - Football Squares`,
    description: `Play ${year} NFL squares for every game this season. Join boards, win prizes, and enjoy fair blockchain-verified gameplay.`,
    keywords: [
      `${year} nfl`,
      `${year} football`,
      'nfl season',
      'football squares',
    ],
    image: `${baseUrl}/og/season-${year}.png`,
  });
}

// Team-specific metadata
export function getTeamMetadata(teamName: string, teamAbbr: string): Metadata {
  return generateMetadata({
    title: `${teamName} Squares - NFL Team Games`,
    description: `Play football squares for all ${teamName} games. Join ${teamAbbr} fan boards and compete with fellow fans!`,
    keywords: [
      teamName.toLowerCase(),
      teamAbbr.toLowerCase(),
      'team squares',
      'fan boards',
    ],
    image: `${baseUrl}/og/teams/${teamAbbr.toLowerCase()}.png`,
  });
}
