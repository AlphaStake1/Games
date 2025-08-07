'use client';

import Link from 'next/link';
import {
  Briefcase,
  Lock,
  FileText,
  Mail,
  Instagram,
  MessageCircle,
  Trophy,
  Heart,
} from 'lucide-react';

// X.com icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Telegram icon component
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export default function Footer() {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'How It Works', href: '/how-to-play' },
      {
        label: 'Business Inquiries',
        href: '/business-intake',
        icon: Briefcase,
      },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy', icon: Lock },
      { label: 'Terms of Service', href: '/terms', icon: FileText },
      { label: 'Contact Us', href: '#contact', icon: Mail },
    ],
    community: [
      { label: 'Host a Board', href: '/cbl/overview' },
      { label: 'Season Pass', href: '/season-pass' },
      { label: 'Rewards Program', href: '/rewards' },
    ],
    resources: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Wallet Guide', href: '/wallet-guide' },
      { label: 'NFT Guide', href: '/what-are-nfts' },
    ],
  };

  const socialLinks = [
    { icon: XIcon, href: '#', label: 'Follow us on X' },
    { icon: Instagram, href: '#', label: 'Follow us on Instagram' },
    { icon: TelegramIcon, href: '#', label: 'Join our Telegram' },
    { icon: MessageCircle, href: '#', label: 'Join our Discord' },
  ];

  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-white">
                Football Squares
              </span>
              {process.env.NEXT_PUBLIC_SOLANA_NETWORK !== 'mainnet-beta' && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                  {process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'testnet'
                    ? 'Testnet'
                    : 'Devnet'}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-4">
              The ultimate destination for NFL squares games. Win big, play
              fair, have fun!
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 Football Squares. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500" /> for NFL
                fans
              </span>
              <span>•</span>
              <span>Play Responsibly</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
