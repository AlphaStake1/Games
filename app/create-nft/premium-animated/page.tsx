'use client';

import { useState } from 'react';
import CreateNFTNav from '@/components/CreateNFTNav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Upload, Play } from 'lucide-react';
import NFTGallery from '@/components/NFTGallery';
import { animatedNFTs } from '@/lib/mockNFTData';
import { NFTItem } from '@/components/NFTGallery';
import Image from 'next/image';

import { Wand2 } from 'lucide-react';

function AnimatedNFTCreator() {
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'upload' | 'gallery'>(
    'create',
  );
  const [prompt, setPrompt] = useState('');

  const handleSelect = (item: NFTItem) => {
    setSelectedNFT(item);
    setActiveTab('create');
  };

  const handleGenerateArt = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate AI generation process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Select a random NFT from examples as the "generated" result
    const randomNFT =
      animatedNFTs[Math.floor(Math.random() * animatedNFTs.length)];
    setSelectedNFT({
      ...randomNFT,
      name: 'AI Generated Animation',
      description: `Generated from prompt: "${prompt}" with premium animation`,
    });

    setIsGenerating(false);
  };

  const handleCreateNFT = async () => {
    if (!selectedNFT) return;

    setIsCreating(true);
    // Simulate NFT creation process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCreating(false);

    alert(`Animated NFT "${selectedNFT.name}" created successfully!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create/Upload/Gallery Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-amber-500/20">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'create' ? 'default' : 'outline'}
                onClick={() => setActiveTab('create')}
                className="flex-1"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Create Art
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upload')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Custom
              </Button>
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'outline'}
                onClick={() => setActiveTab('gallery')}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </div>

            {activeTab === 'create' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                    Describe your animated NFT vision
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: A dynamic football player with lightning effects, morphing between action poses with particle effects..."
                    className="w-full p-3 border border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white resize-none"
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-500">
                    Animation Settings
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                        Animation Style
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white">
                        <option value="particles">Particle Effects</option>
                        <option value="glow">Glow Animation</option>
                        <option value="rotation">3D Rotation</option>
                        <option value="morph">Shape Morphing</option>
                        <option value="pulse">Pulse & Breathing</option>
                        <option value="liquid">Liquid Motion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                        Speed
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white">
                        <option value="slow">Slow & Smooth</option>
                        <option value="medium">Medium Pace</option>
                        <option value="fast">Fast & Dynamic</option>
                        <option value="variable">Variable Speed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateArt}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-3"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                      Generating Animated Artwork...
                    </>
                  ) : (
                    <>
                      Generate Animated Artwork
                      <Wand2 className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {selectedNFT && prompt && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✨ Animated artwork generated! Check the preview on the
                      right.
                    </p>
                  </div>
                )}
              </div>
            ) : activeTab === 'upload' ? (
              <div className="space-y-6">
                <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-300">
                    Upload Your Custom Artwork
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-4 max-w-md mx-auto">
                    Upload an image or video to be transformed into a premium
                    animated NFT
                  </p>
                  <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold">
                    Choose File
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-500">
                    Upload Animation Settings
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                        Animation Style
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white">
                        <option value="particles">Particle Effects</option>
                        <option value="glow">Glow Animation</option>
                        <option value="rotation">3D Rotation</option>
                        <option value="morph">Shape Morphing</option>
                        <option value="pulse">Pulse & Breathing</option>
                        <option value="liquid">Liquid Motion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#004953] dark:text-white mb-2">
                        Speed
                      </label>
                      <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a2e] text-[#002244] dark:text-white">
                        <option value="slow">Slow & Smooth</option>
                        <option value="medium">Medium Pace</option>
                        <option value="fast">Fast & Dynamic</option>
                        <option value="variable">Variable Speed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {selectedNFT && (
                  <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✨ Ready to create your premium animated NFT! Check the
                      preview on the right.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-amber-500">
                  Premium Animated Collection
                </h3>
                <NFTGallery
                  items={animatedNFTs}
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
          <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-amber-500/20 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-amber-500">
              NFT Preview
            </h2>

            {selectedNFT ? (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  {selectedNFT.isAnimated && selectedNFT.videoUrl ? (
                    <video
                      src={selectedNFT.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={selectedNFT.imageUrl}
                      alt={selectedNFT.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                    ANIMATED VIP
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-amber-500">
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
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-bold py-3"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Creating Animated NFT...
                    </>
                  ) : (
                    <>
                      Create Animated NFT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload custom artwork or select from premium gallery</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumAnimatedNFTPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#1a1a2e] transition-colors duration-300 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <CreateNFTNav active="/create-nft/premium-animated" />
        <h1 className="text-4xl font-bold text-amber-500 mb-6 text-center">
          Create Premium Animated NFT
        </h1>
        <p className="text-lg text-[#002244] dark:text-white mb-8 text-center">
          Upload your custom or original art and have it converted to an
          animated NFT with premium features. This NFT will appear on your
          purchased squares.
        </p>

        <AnimatedNFTCreator />
      </div>
    </main>
  );
}
