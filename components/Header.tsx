"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ThemeToggle } from "./ui/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: "How To Play", href: "/how-to-play" },
    { label: "Rules", href: "/rules" },
    { label: "Fantasy", href: "/fantasy" },
    { label: "My NFTs", href: "/my-nfts" },
    { label: "What are NFTs?", href: "/what-are-nfts" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
            >
              <Image
                src="/Assets/Football Squares logo_nobg_ (4).png"
                alt="Football Squares Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Football Squares
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex space-x-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/wallet-guide"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Need a Wallet?
            </Link>
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-2 !rounded-lg !font-semibold !transition-colors !duration-200 !border-0 wallet-adapter-button-trigger" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle and Connect Wallet */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <Link
              href="/wallet-guide"
              className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center block"
              onClick={() => setIsMenuOpen(false)}
            >
              Need a Wallet?
            </Link>

            <WalletMultiButton className="!w-full !mt-2 !bg-blue-600 hover:!bg-blue-700 !text-white !px-6 !py-3 !rounded-lg !font-semibold !transition-colors !duration-200 !border-0 wallet-adapter-button-trigger" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
