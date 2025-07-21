'use client';

import CreateNFTNav from '@/components/CreateNFTNav';
import { useUserPreferences } from '@/lib/userPreferences';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function PremiumAnimatedNFTPage() {
  const { publicKey } = useWallet();
  const { preferences, isLoading } = useUserPreferences(
    publicKey ? publicKey.toBase58() : null,
  );

  const isVIP = preferences?.isVIP || false;

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/premium-animated" />
        <h1 className="text-4xl font-bold text-amber-500 mb-6 text-center">
          Create Premium (VIP) Animated NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center">
          Upload your custom or original art and have it converted to an
          animated NFT with exclusive VIP features. This NFT will appear on your
          purchased squares.
        </p>

        {isLoading ? (
          <div className="text-center text-[#708090] dark:text-[#96abdc]">
            <p>Loading user status...</p>
          </div>
        ) : isVIP ? (
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-amber-500/20 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-amber-500 text-center">
              Animated NFT Creator
            </h2>
            <div className="text-center text-[#708090] dark:text-[#96abdc]">
              <p>Animated NFT creation UI coming soon...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-red-500/20 max-w-xl mx-auto text-center">
            <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-red-500">
              VIP Access Required
            </h2>
            <p className="text-[#708090] dark:text-[#96abdc] mb-6">
              This feature is exclusively for VIP members. Upgrade now to create
              premium animated NFTs.
            </p>
            <Link href="/season-pass/dashboard" passHref>
              <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold">
                Upgrade to VIP
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
