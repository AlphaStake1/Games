"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ui/theme-toggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { label: "Fantasy", href: "/fantasy" },
    { label: "How To Play", href: "/how-to-play" },
    { label: "My NFTs", href: "/my-nfts" },
  ];

  return (
    <header className="bg-white dark:bg-[#002244] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/Assets/Football Squares logo_nobg_ (4).png"
                alt="Football Squares Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex space-x-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#708090] dark:text-[#96abdc] hover:text-[#002244] dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-2 rounded-full font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Connect Wallet
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#708090] dark:text-[#96abdc] hover:text-[#002244] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#004953] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#002244] dark:focus:ring-[#ed5925] transition-colors duration-200"
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
          className="md:hidden bg-white dark:bg-[#002244] border-t border-gray-200 dark:border-[#004953] transition-colors duration-300"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#708090] dark:text-[#96abdc] hover:text-[#002244] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#004953] block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Theme Toggle and Connect Wallet */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-[#708090] dark:text-[#96abdc] text-sm font-medium">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-full font-semibold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
