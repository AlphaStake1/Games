'use client';
import Link from 'next/link';

const navItems = [
  { label: 'Custom Signature', href: '/create-nft/custom-signature' },
  {
    label: 'Custom Hand-Drawn Symbol',
    href: '/create-nft/custom-hand-drawn-symbol',
  },
  {
    label: 'House-Generated Artwork',
    href: '/create-nft/house-generated-artwork',
  },
  { label: 'AI-Generated Artwork', href: '/create-nft/ai-generated-artwork' },
  { label: 'Premium (VIP) Animated', href: '/create-nft/premium-animated' },
];

export default function CreateNFTNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-2 justify-center mb-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200
            ${
              active === item.href
                ? 'bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white shadow'
                : 'bg-gray-100 dark:bg-[#1a1a2e] text-[#002244] dark:text-white hover:bg-[#ed5925] hover:text-white'
            }
          `}
          aria-current={active === item.href ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
