import { WhatAreNftsContent } from '@/components/WhatAreNftsContent';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'What Are NFTs? | Football Squares Digital Assets Guide',
  description:
    'Learn about NFTs, how they work in Football Squares, and discover Sol Incinerator for burning your digital assets on Solana.',
};

export default function WhatAreNftsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] transition-colors duration-300">
      <WhatAreNftsContent />
      <Footer />
    </div>
  );
}
