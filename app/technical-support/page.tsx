import TechnicalSupportContent from '@/components/TechnicalSupportContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Support Guide - Football Squares Help & Troubleshooting',
  description:
    'Get help with technical issues, troubleshoot common problems, and learn how to resolve account, payment, and gaming issues on Football Squares.',
  keywords: [
    'football squares technical support',
    'troubleshooting guide',
    'wallet connection issues',
    'payment problems',
    'browser compatibility',
    'crypto wallet help',
    'MetaMask issues',
    'Phantom wallet problems',
    'login problems',
    'account issues',
    'transaction errors',
    'network problems',
    'browser support',
    'device compatibility',
    'gaming platform help',
    'customer support',
    'error codes',
    'bug fixes',
  ],
  openGraph: {
    title: 'Technical Support Guide - Football Squares',
    description:
      'Comprehensive technical support and troubleshooting guide for Football Squares platform issues.',
    type: 'website',
    url: '/technical-support',
    images: [
      {
        url: '/Assets/football_squares_logo.png',
        width: 1200,
        height: 630,
        alt: 'Football Squares Technical Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Support Guide - Football Squares',
    description:
      'Get help with technical issues and troubleshoot common problems on Football Squares.',
    images: ['/Assets/football_squares_logo.png'],
  },
  alternates: {
    canonical: '/technical-support',
  },
};

export default function TechnicalSupportPage() {
  return <TechnicalSupportContent />;
}
