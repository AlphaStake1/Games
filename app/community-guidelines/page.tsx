import { Metadata } from 'next';
import CommunityGuidelinesContent from '@/components/CommunityGuidelinesContent';

export const metadata: Metadata = {
  title: 'Community Guidelines | Football Squares',
  description:
    'Complete community guidelines for Football Squares including code of conduct, prohibited activities, reporting process, moderation actions, and safety tips for a respectful gaming environment.',
  keywords:
    'community guidelines, code of conduct, reporting, moderation, safety tips, prohibited activities, Football Squares community, online gaming etiquette',
  openGraph: {
    title: 'Community Guidelines | Football Squares',
    description:
      'Comprehensive community guidelines ensuring a safe, respectful, and enjoyable environment for all Football Squares players.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Guidelines | Football Squares',
    description:
      'Comprehensive community guidelines ensuring a safe, respectful, and enjoyable environment for all Football Squares players.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/community-guidelines',
  },
};

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesContent />;
}
