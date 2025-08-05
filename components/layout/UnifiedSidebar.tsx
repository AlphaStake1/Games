'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/lib/auth';
import { useWalletConnection } from '@/contexts/WalletConnectionProvider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Menu,
  X,
  Home,
  Trophy,
  HelpCircle,
  Star,
  BookOpen,
  Users,
  Crown,
  Wallet,
  Shield,
  FileText,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  Instagram,
  MessageCircle,
  Heart,
  Briefcase,
  Lock,
  Award,
  DollarSign,
  Play,
  Grid,
  CreditCard,
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

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: NavigationItem[];
}

export default function UnifiedSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth('PLAYER_ROLE');
  const { connected } = useWallet();
  const { showPopup } = useWalletConnection();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleWalletClick = () => {
    if (!connected) {
      showPopup('general');
    }
  };

  // Main navigation items
  const mainNavItems: NavigationItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Boards', href: '/boards', icon: Grid },
    { label: 'How To Play', href: '/how-to-play', icon: BookOpen },
    { label: 'Fantasy', href: '/fantasy', icon: Trophy },
    { label: 'Season Pass', href: '/season-pass', icon: Award },
    { label: 'Rewards', href: '/rewards', icon: Star },
    { label: 'What are NFTs?', href: '/what-are-nfts', icon: CreditCard },
    ...(connected
      ? [{ label: 'My NFTs', href: '/my-nfts', icon: Shield }]
      : []),
  ];

  // CBL-specific navigation
  const cblNavItems: NavigationItem[] = user?.isCBL
    ? [
        {
          label: 'CBL Dashboard',
          href: '/cbl/dashboard',
          icon: Crown,
          badge: 'CBL',
        },
      ]
    : [
        {
          label: 'Host a Board',
          href: '/cbl/overview',
          icon: Crown,
          badge: 'New',
        },
      ];

  // Resources navigation
  const resourceNavItems: NavigationItem[] = [
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    { label: 'Rules', href: '/rules', icon: FileText },
    { label: 'Wallet Guide', href: '/wallet-guide', icon: Wallet },
    { label: 'Crypto Basics', href: '/crypto-basics', icon: DollarSign },
    { label: 'Community', href: '/board-leader', icon: Users },
  ];

  // Footer links
  const footerNavItems: NavigationItem[] = [
    { label: 'Business', href: '/business-intake', icon: Briefcase },
    { label: 'Privacy', href: '/privacy', icon: Lock },
    { label: 'Terms', href: '/terms', icon: FileText },
    { label: 'Contact', href: '#contact', icon: Mail },
  ];

  const socialLinks = [
    { icon: XIcon, href: '#', label: 'Follow us on X' },
    { icon: Instagram, href: '#', label: 'Follow us on Instagram' },
    { icon: TelegramIcon, href: '#', label: 'Join our Telegram' },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Assets/Football Squares logo_nobg_ (4).png"
              alt="Football Squares"
              width={40}
              height={40}
              className="object-contain"
            />
            {!isCollapsed && (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Football Squares
              </span>
            )}
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          {connected ? (
            <div className="space-y-3">
              {/* My Dashboard Button - Prominent Green */}
              <Button
                asChild
                className={`w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md ${
                  isCollapsed ? 'px-2 py-3' : 'px-4 py-3'
                }`}
                title={isCollapsed ? 'My Dashboard' : undefined}
              >
                <Link
                  href={user?.isCBL ? '/cbl/dashboard' : '/player/dashboard'}
                >
                  <Trophy
                    className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-2'}`}
                  />
                  {!isCollapsed && 'My Dashboard'}
                </Link>
              </Button>

              {/* Wallet Button */}
              <WalletMultiButton
                className={`!w-full !bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg !font-medium !transition-colors !duration-200 !border-0 ${
                  isCollapsed ? '!px-2 !py-2' : '!px-4 !py-2'
                }`}
              />
            </div>
          ) : (
            <Button
              onClick={handleWalletClick}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 ${
                isCollapsed ? 'px-2 py-2' : 'px-4 py-2'
              }`}
            >
              <Wallet
                className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-2'}`}
              />
              {!isCollapsed && 'Connect Wallet'}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Navigation */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Main
              </h3>
            )}
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* CBL Section */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Community Boards
              </h3>
            )}
            <div className="space-y-1">
              {cblNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium flex-1">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Resources
              </h3>
            )}
            <div className="space-y-1">
              {resourceNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActiveRoute(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800">
          {/* Social Links */}
          {!isCollapsed && (
            <div className="p-4">
              <div className="flex gap-2 justify-center">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200"
                  >
                    <social.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Theme Toggle & Collapse */}
          <div className="p-4 flex items-center justify-between">
            <ThemeToggle />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Footer Links - Only visible when expanded */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 text-xs">
                {footerNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                © 2024 Football Squares
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
