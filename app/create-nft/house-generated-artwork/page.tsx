'use client';

import { useState } from 'react';
import CreateNFTNav from '@/components/CreateNFTNav';
import NFTGallery from '@/components/NFTGallery';
import { houseArtworkNFTs } from '@/lib/mockNFTData';
import { Button } from '@/components/ui/button';
import { NFTItem } from '@/components/NFTGallery';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HouseGeneratedArtworkNFTPage() {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (item: NFTItem) => {
    setSelectedNFT(item);
  };

  const handleCreateNFT = async () => {
    if (!selectedNFT) return;

    setIsCreating(true);
    // Simulate NFT creation process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCreating(false);

    // Show success message (you can replace with actual notification)
    alert(`NFT "${selectedNFT.name}" created successfully!`);
  };

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/house-generated-artwork" />
        <h1 className="text-4xl font-bold text-[#004953] mb-6 text-center">
          Create House-Generated Artwork NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center max-w-3xl mx-auto">
          Choose from static full-color art produced by the Football Squares
          design team. This NFT will appear on your purchased squares.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gallery Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-[#004953]">
              <h2 className="text-2xl font-semibold mb-6 text-[#004953] dark:text-white">
                Select Your Artwork
              </h2>
              <NFTGallery
                items={houseArtworkNFTs}
                onSelect={handleSelect}
                selectedId={selectedNFT?.id}
                showCategories={true}
                maxColumns={3}
              />
            </div>
          </div>

          {/* Preview & Create Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-[#004953] sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-[#004953] dark:text-white">
                NFT Preview
              </h2>

              {selectedNFT ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={selectedNFT.imageUrl}
                      alt={selectedNFT.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#004953] dark:text-white">
                      {selectedNFT.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedNFT.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium capitalize px-3 py-1 rounded-full bg-gradient-to-r 
                        ${
                          selectedNFT.rarity === 'legendary'
                            ? 'from-amber-100 to-amber-200'
                            : selectedNFT.rarity === 'epic'
                              ? 'from-purple-100 to-purple-200'
                              : selectedNFT.rarity === 'rare'
                                ? 'from-blue-100 to-blue-200'
                                : 'from-gray-100 to-gray-200'
                        }`}
                      >
                        {selectedNFT.rarity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {selectedNFT.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateNFT}
                    disabled={isCreating}
                    className="w-full bg-gradient-to-r from-[#004953] to-[#006d7a] hover:from-[#003843] hover:to-[#005862] text-white font-bold py-3"
                  >
                    {isCreating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Creating NFT...
                      </>
                    ) : (
                      <>
                        Create NFT
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an artwork from the gallery to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
