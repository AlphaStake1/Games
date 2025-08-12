'use client';

import { useState } from 'react';
import CreateNFTNav from '@/components/CreateNFTNav';
import NFTGallery from '@/components/NFTGallery';
import { aiGeneratedNFTs } from '@/lib/mockNFTData';
import { Button } from '@/components/ui/button';
import { NFTItem } from '@/components/NFTGallery';
import Image from 'next/image';
import { ArrowRight, Sparkles, Upload, Wand2 } from 'lucide-react';

export default function AiGeneratedArtworkNFTPage() {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'examples'>(
    'generate',
  );

  const handleSelect = (item: NFTItem) => {
    setSelectedNFT(item);
    setActiveTab('generate');
  };

  const handleGenerateNFT = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate AI generation process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Select a random NFT from examples as the "generated" result
    const randomNFT =
      aiGeneratedNFTs[Math.floor(Math.random() * aiGeneratedNFTs.length)];
    setSelectedNFT({
      ...randomNFT,
      name: 'Custom AI Generated',
      description: `Generated from prompt: "${prompt}"`,
    });

    setIsGenerating(false);
  };

  const handleCreateNFT = async () => {
    if (!selectedNFT) return;

    // Simulate NFT minting process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert(`NFT "${selectedNFT.name}" created successfully!`);
  };

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/ai-generated-artwork" />
        <h1 className="text-4xl font-bold text-[#8d594d] mb-6 text-center">
          Create AI-Generated Artwork NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center max-w-3xl mx-auto">
          Generate a unique NFT from your text prompt or upload your own art to
          be transformed by AI. This NFT will appear on your purchased squares.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Generation/Examples Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-[#004953]">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={activeTab === 'generate' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('generate')}
                  className="flex-1"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate New
                </Button>
                <Button
                  variant={activeTab === 'examples' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('examples')}
                  className="flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Examples
                </Button>
              </div>

              {activeTab === 'generate' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                      Enter your creative prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: A futuristic football player with lightning effects in a neon stadium..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Or upload an image to transform
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateNFT}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-[#8d594d] to-[#a66d5d] hover:from-[#7a4d42] hover:to-[#935f50] text-white font-bold py-3"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                        Generating AI Artwork...
                      </>
                    ) : (
                      <>
                        Generate AI Artwork
                        <Wand2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {selectedNFT && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✨ AI artwork generated successfully! Check the preview
                        on the right.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[#004953] dark:text-white">
                    Example AI-Generated NFTs
                  </h3>
                  <NFTGallery
                    items={aiGeneratedNFTs}
                    onSelect={handleSelect}
                    selectedId={selectedNFT?.id}
                    showCategories={false}
                    maxColumns={2}
                  />
                </div>
              )}
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
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                      AI GENERATED
                    </div>
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
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateNFT}
                    className="w-full bg-gradient-to-r from-[#004953] to-[#006d7a] hover:from-[#003843] hover:to-[#005862] text-white font-bold py-3"
                  >
                    Create NFT
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate or select an AI artwork to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
