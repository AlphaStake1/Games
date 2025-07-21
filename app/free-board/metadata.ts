import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Free Football Squares Board - Dallas Cowboys vs Kansas City Chiefs | Football Squares',
  description:
    'Join our free Football Squares board featuring Dallas Cowboys vs Kansas City Chiefs. Claim your square and experience NFL squares with no cost. Interactive gameplay with NFT upgrades available.',
  keywords: [
    'football squares',
    'free football squares',
    'NFL squares',
    'Dallas Cowboys',
    'Kansas City Chiefs',
    'football grid',
    'sports betting',
    'NFT upgrades',
    'blockchain gaming',
    'Solana',
  ],
  authors: [{ name: 'Football Squares' }],
  creator: 'Football Squares',
  publisher: 'Football Squares',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Free Football Squares Board - Dallas Cowboys vs Kansas City Chiefs',
    description:
      'Join our free Football Squares board featuring Dallas Cowboys vs Kansas City Chiefs. Claim your square and experience NFL squares with no cost.',
    url: 'https://footballsquares.com/free-board',
    siteName: 'Football Squares',
    images: [
      {
        url: 'https://footballsquares.com/assets/free-board-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Football Squares Board - Dallas Cowboys vs Kansas City Chiefs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Football Squares Board - Dallas Cowboys vs Kansas City Chiefs',
    description:
      'Join our free Football Squares board featuring Dallas Cowboys vs Kansas City Chiefs. Claim your square and experience NFL squares with no cost.',
    images: ['https://footballsquares.com/assets/free-board-twitter.jpg'],
    creator: '@FootballSquares',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://footballsquares.com/free-board',
  },
};
