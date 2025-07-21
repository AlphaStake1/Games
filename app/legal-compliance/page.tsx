import { Metadata } from 'next';
import LegalComplianceContent from '@/components/LegalComplianceContent';

export const metadata: Metadata = {
  title: 'Legal & Compliance Guide | Football Squares',
  description:
    'Comprehensive legal and compliance guide for Football Squares including terms of service, privacy policy, responsible gaming, geographic restrictions, and dispute resolution procedures.',
  keywords:
    'legal compliance, terms of service, privacy policy, responsible gaming, geographic restrictions, dispute resolution, data protection, user rights, Football Squares legal',
  openGraph: {
    title: 'Legal & Compliance Guide | Football Squares',
    description:
      'Complete legal and compliance information for Football Squares users including privacy rights, terms of service, and responsible gaming guidelines.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal & Compliance Guide | Football Squares',
    description:
      'Complete legal and compliance information for Football Squares users including privacy rights, terms of service, and responsible gaming guidelines.',
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
    canonical: '/legal-compliance',
  },
};

export default function LegalCompliancePage() {
  return <LegalComplianceContent />;
}
