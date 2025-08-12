'use client';
import Link from 'next/link';

const navItems = [
  {
    label: 'Custom Signature',
    href: '/create-nft/custom-signature',
    price: '$3',
    description: 'Personalized marker',
  },
  {
    label: 'Custom Hand-Drawn Symbol',
    href: '/create-nft/custom-hand-drawn-symbol',
    price: '$3',
    description: 'Your unique design',
  },
  {
    label: 'Collections',
    href: '/create-nft/house-generated-artwork',
    price: '$7',
    description: 'Curated artwork',
  },
  {
    label: 'Your Artwork',
    href: '/create-nft/ai-generated-artwork',
    price: '$14',
    description: 'AI-generated or upload',
  },
  {
    label: 'Premium Animated',
    href: '/create-nft/premium-animated',
    price: '$21',
    description: 'Dynamic animations',
  },
];

export default function CreateNFTNav({ active }: { active?: string }) {
  return (
    <nav className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center mb-8 max-w-6xl mx-auto">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg
            ${
              active === item.href
                ? 'bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white border-transparent shadow-lg'
                : 'bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white border-gray-200 dark:border-gray-700 hover:border-[#ed5925] hover:bg-[#ed5925]/5'
            }
          `}
          aria-current={active === item.href ? 'page' : undefined}
        >
          <div className="text-center">
            <div className="font-bold text-lg mb-1">{item.label}</div>
            <div
              className={`text-sm mb-2 ${active === item.href ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {item.description}
            </div>
            <div
              className={`font-bold text-lg ${
                item.price === 'Free'
                  ? 'text-green-500'
                  : active === item.href
                    ? 'text-white'
                    : 'text-[#ed5925]'
              }`}
            >
              {item.price}
            </div>
          </div>
        </Link>
      ))}
    </nav>
  );
}
