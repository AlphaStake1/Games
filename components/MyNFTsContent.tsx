'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Sparkles,
  Trophy,
  Zap,
  Info,
  Plus,
  Download,
  Share2,
  Eye,
  Wallet,
  Shield,
  Star,
  Play,
  Image as ImageIcon,
  Brush,
  Wand2,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Grid3X3,
  Target,
  Gift,
  Flame,
  PenTool,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const MyNFTsContent = () => {
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('#ed5925');
  const [signatureText, setSignatureText] = useState('');
  const [activeCreationType, setActiveCreationType] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState('collection');

  // Sample NFTs data - showing how they appear on squares
  const sampleNFTs = [
    {
      id: 1,
      name: 'Golden Signature',
      image:
        'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'Signature NFT',
      usedInGames: 3,
      totalSquares: 12,
      lastUsed: 'Cowboys vs Eagles',
      rarity: 'Personal',
      mintDate: '2024-01-15',
      cost: '$3',
    },
    {
      id: 2,
      name: 'Championship Trophy',
      image:
        'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'House NFT',
      usedInGames: 1,
      totalSquares: 4,
      lastUsed: 'Lions vs Packers',
      rarity: 'Won in Free Game',
      mintDate: '2024-01-22',
      cost: 'Free',
    },
    {
      id: 3,
      name: 'Custom Artwork',
      image:
        'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'Custom NFT',
      usedInGames: 2,
      totalSquares: 8,
      lastUsed: 'Chiefs vs Bills',
      rarity: 'Unique',
      mintDate: '2024-01-30',
      cost: '$14',
    },
  ];

  // NFT Creation Tiers
  const creationTiers = [
    {
      id: 'default-signature',
      name: 'Default Signature',
      price: '$0',
      icon: Brush,
      description:
        'Plain black, handwritten &apos;First Name + Last Initial&apos; the system grants every player automatically.',
      features: [
        'Standard black signature',
        'Default for all players',
        'No cost, always available',
        'Non-transferable',
      ],
      color: 'from-gray-400 to-gray-600',
    },
    {
      id: 'custom-signature',
      name: 'Custom Signature',
      price: '$3',
      icon: Brush,
      description: 'Same handwritten look, but in any color.',
      features: [
        'Your signature in custom colored ink',
        'Personalized marker',
        'Use on any square you purchase',
        'Transferable to any wallet',
      ],
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'custom-hand-drawn-symbol',
      name: 'Custom Hand-Drawn Symbol',
      price: '$3',
      icon: PenTool,
      description:
        'Draw your own simple symbol or doodle directly on the website using our whiteboard tool.',
      features: [
        'Draw your symbol or doodle on the site',
        'Hand-drawn using the web whiteboard',
        'Unique personal marker',
        'Use on any square you purchase',
      ],
      color: 'from-[#96abdc] to-[#7a95d1]',
    },
    {
      id: 'house-generated-artwork',
      name: 'House-Generated Artwork',
      price: '$7',
      icon: ImageIcon,
      description:
        'Static full-color art produced by the Football Squares design team.',
      features: [
        'Pre-designed professional art',
        'Win in free games or redeem from winnings',
        'High-quality display on game boards',
        'Cost deducted from winnings ($7)',
      ],
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'ai-generated-artwork',
      name: 'AI-Generated Artwork',
      price: '$14',
      icon: Play,
      description:
        'AI image created from the player&apos;s text prompt or transformed from their user-generated or user-uploaded art.',
      features: [
        'AI-generated from your prompt or art',
        'Unique, one-of-a-kind marker',
        'Professional formatting for squares',
        'High-quality display on game boards',
      ],
      color: 'from-[#8d594d] to-[#6b4238]',
    },
    {
      id: 'premium-animated',
      name: 'Premium (VIP) Animated',
      price: '$21',
      icon: Star,
      description:
        'User-generated or user-uploaded art that we convert to an animated NFT; VIP-only access.',
      features: [
        'Custom animated artwork',
        'Eye-catching movement on game boards',
        'Premium square marker',
        'Exclusive animated features',
      ],
      color: 'from-yellow-400 to-amber-600',
    },
  ];

  // Featured House NFTs
  const houseNFTs = [
    {
      id: 1,
      name: 'Golden Trophy',
      image:
        'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?auto=compress&cs=tinysrgb&w=300',
      theme: 'Victory',
      availability: 'Win in free games or redeem for $7',
    },
    {
      id: 2,
      name: 'Football Field',
      image:
        'https://images.pexels.com/photos/1374295/pexels-photo-1374295.jpeg?auto=compress&cs=tinysrgb&w=300',
      theme: 'Classic',
      availability: 'Win in free games or redeem for $7',
    },
    {
      id: 3,
      name: 'Team Spirit',
      image:
        'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=300',
      theme: 'Modern',
      availability: 'Win in free games or redeem for $7',
    },
    {
      id: 4,
      name: 'Championship',
      image:
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=300',
      theme: 'Elite',
      availability: 'Win in free games or redeem for $7',
    },
  ];

  // Color options for signature NFTs
  const colorOptions = [
    { name: 'Orange', value: '#ed5925' },
    { name: 'Blue', value: '#96abdc' },
    { name: 'Teal', value: '#004953' },
    { name: 'Navy', value: '#002244' },
    { name: 'Brown', value: '#8d594d' },
    { name: 'Purple', value: '#6b46c1' },
    { name: 'Green', value: '#059669' },
    { name: 'Red', value: '#dc2626' },
  ];

  // NFT Education FAQ
  const nftFAQ = [
    {
      q: 'How do NFTs work in Football Squares?',
      a: 'NFTs serve as personalized markers for squares you purchase. Instead of seeing a standard black signature (first name and last initial) that all players get by default, your custom NFT image will be displayed on any square you buy in future games.',
    },
    {
      q: "What's the difference between NFT types?",
      a: 'Default Signature ($0) is the standard black signature. Custom Signature ($3) lets you choose any color for your signature. Custom Hand-Drawn Symbol ($3) allows you to upload a simple doodle or icon. House-Generated Artwork ($7) is professional art from the Football Squares team. AI-Generated Artwork ($14) is created from your prompt or art. Premium (VIP) Animated ($21) is user-generated or user-uploaded art with animation, available to VIPs.',
    },
    {
      q: 'How can I get House NFTs for free?',
      a: 'House NFTs can be won as prizes in free games. You can also choose to redeem them during cash game payouts - the $7 cost will be deducted from your winnings.',
    },
    {
      q: 'Can I use the same NFT on multiple squares?',
      a: 'Yes! Once you own an NFT, you can use it as your marker on any square you purchase in any game. It replaces the standard black signature with your personalized design.',
    },
    {
      q: 'Do I own the NFT forever?',
      a: 'Yes, you own the NFT and can transfer it to other wallets, sell it, or keep using it as your square marker. The blockchain ensures permanent ownership verification.',
    },
    {
      q: 'What happens if I sell my NFT?',
      a: "If you sell or transfer your NFT, you'll no longer be able to use it as your square marker. You'll need to create a new NFT or use the standard black signature for future square purchases.",
    },
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#002244] dark:text-white mb-6 transition-colors duration-300">
            My NFT Square Markers
          </h1>
          <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8 transition-colors duration-300">
            Create personalized markers for your Football Squares. Your NFTs
            replace the standard black signature (first name and last initial)
            with your unique design on every square you purchase.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/create-nft/custom-signature">
              <Button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-3 rounded-full font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Marker
              </Button>
            </Link>
            <Button
              variant="outline"
              className="px-8 py-3 rounded-full font-bold border-2 border-[#708090] text-[#708090] dark:text-[#96abdc] hover:bg-[#708090] hover:text-white dark:hover:bg-[#96abdc] dark:hover:text-[#002244] transition-all duration-200 inline-flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          </div>
        </div>

        {/* What Are NFTs Link - Prominent Above the Fold */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-[#004953] to-[#002244] border-0 text-white overflow-hidden relative shadow-2xl">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
            <CardContent className="relative z-10 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    New to NFTs? Learn the Basics
                  </h2>
                  <p className="text-xl lg:text-2xl text-[#96abdc] mb-6">
                    Discover how NFTs work, why they're valuable, and how Sol
                    Incinerator can help manage your collection
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-[#004953] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <a href="/what-are-nfts">
                        <Info className="w-6 h-6 mr-2" />
                        What Are NFTs?
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
                        <Shield className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-150">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-300">
                        <Wallet className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-500">
                        <Flame className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How NFTs Work Demo */}
        <div className="bg-gradient-to-r from-[#002244] to-[#004953] rounded-2xl p-8 lg:p-12 text-white mb-16">
          <div className="text-center mb-8">
            <Grid3X3 className="w-16 h-16 text-[#96abdc] mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              How NFT Square Markers Work
            </h2>
            <p className="text-[#96abdc] text-lg max-w-3xl mx-auto">
              Your NFTs become personalized markers that appear on any square
              you purchase, replacing the standard black signature that all
              players get by default.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Before/After Comparison */}
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Standard vs NFT Signatures
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Standard Square */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 mb-2">
                      <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded mx-auto flex items-center justify-center">
                        <span
                          className="text-black text-xs font-medium"
                          style={{ fontFamily: 'cursive' }}
                        >
                          John D.
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#96abdc]">
                      Standard Black Signature
                    </p>
                    <p className="text-xs text-[#96abdc] opacity-75">
                      (Default for all players)
                    </p>
                  </div>

                  {/* NFT Square */}
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 mb-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#ed5925] to-[#96abdc] rounded mx-auto flex items-center justify-center">
                        <span
                          className="text-white text-xs font-bold"
                          style={{ fontFamily: 'cursive' }}
                        >
                          John D.
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#96abdc]">Your NFT Signature</p>
                    <p className="text-xs text-[#96abdc] opacity-75">
                      (Personalized marker)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Create Your NFT',
                  description: 'Design your personalized square marker',
                },
                {
                  step: 2,
                  title: 'Purchase Squares',
                  description: 'Buy squares in any Football Squares game',
                },
                {
                  step: 3,
                  title: 'Your Marker Appears',
                  description: 'Your NFT replaces the standard black signature',
                },
                {
                  step: 4,
                  title: 'Use Forever',
                  description: 'Reuse your NFT marker on all future squares',
                },
              ].map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="bg-[#ed5925] w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className="text-[#96abdc] text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-[#002244] border border-gray-200 dark:border-[#004953] rounded-xl p-1 transition-colors duration-300">
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ed5925] data-[state=active]:to-[#96abdc] data-[state=active]:text-white rounded-lg font-semibold transition-all duration-200"
            >
              My Markers
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ed5925] data-[state=active]:to-[#96abdc] data-[state=active]:text-white rounded-lg font-semibold transition-all duration-200"
            >
              Create Markers
            </TabsTrigger>
            <TabsTrigger
              value="learn"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ed5925] data-[state=active]:to-[#96abdc] data-[state=active]:text-white rounded-lg font-semibold transition-all duration-200"
            >
              How It Works
            </TabsTrigger>
          </TabsList>

          {/* My Collection Tab */}
          <TabsContent value="collection" className="mt-8">
            {sampleNFTs.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white dark:bg-[#002244] rounded-2xl p-12 shadow-lg transition-colors duration-300">
                  <Target className="w-16 h-16 text-[#708090] dark:text-[#96abdc] mx-auto mb-6 transition-colors duration-300" />
                  <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-4 transition-colors duration-300">
                    No Square Markers Yet
                  </h3>
                  <p className="text-[#708090] dark:text-[#96abdc] mb-8 transition-colors duration-300">
                    Create your first NFT marker to personalize your squares in
                    Football Squares games!
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-6 py-3 rounded-full font-bold hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-200">
                      Create First Marker
                    </Button>
                    <a href="/what-are-nfts">
                      <Button
                        variant="outline"
                        className="px-6 py-3 rounded-full font-bold"
                      >
                        Learn More
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sampleNFTs.map((nft) => (
                  <Card
                    key={nft.id}
                    className="bg-white dark:bg-[#002244] border border-gray-200 dark:border-[#004953] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                    onClick={() =>
                      setSelectedNFT(selectedNFT === nft.id ? null : nft.id)
                    }
                  >
                    <CardContent className="p-0">
                      {/* NFT Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                              nft.rarity === 'Unique'
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : nft.rarity === 'Won in Free Game'
                                  ? 'bg-gradient-to-r from-green-500 to-teal-500'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                          >
                            {nft.rarity}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-bold">
                            {nft.cost}
                          </span>
                        </div>
                      </div>

                      {/* NFT Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#002244] dark:text-white mb-1 transition-colors duration-300">
                              {nft.name}
                            </h3>
                            <p className="text-sm text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              {nft.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#ed5925]">
                              {nft.totalSquares}
                            </p>
                            <p className="text-xs text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Total Uses
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Games Used:
                            </span>
                            <span className="text-[#002244] dark:text-white font-medium transition-colors duration-300">
                              {nft.usedInGames}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Last Used:
                            </span>
                            <span className="text-[#002244] dark:text-white font-medium transition-colors duration-300">
                              {nft.lastUsed}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                              Created:
                            </span>
                            <span className="text-[#002244] dark:text-white font-medium transition-colors duration-300">
                              {nft.mintDate}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 text-xs bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white hover:from-[#d14a1f] hover:to-[#7a95d1]"
                          >
                            <Target className="w-4 h-4 mr-1" />
                            Use on Square
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Transfer
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {selectedNFT === nft.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#004953] animate-fade-in">
                            <div className="bg-[#faf9f5] dark:bg-[#1a1a2e] rounded-lg p-4 transition-colors duration-300">
                              <h4 className="font-semibold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                                Usage Statistics
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    Average per game:
                                  </span>
                                  <span className="text-[#002244] dark:text-white font-mono transition-colors duration-300">
                                    {(
                                      nft.totalSquares / nft.usedInGames
                                    ).toFixed(1)}{' '}
                                    squares
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    Token Standard:
                                  </span>
                                  <span className="text-[#002244] dark:text-white transition-colors duration-300">
                                    ERC-721
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    Blockchain:
                                  </span>
                                  <span className="text-[#002244] dark:text-white transition-colors duration-300">
                                    Ethereum
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create NFTs Tab */}
          <TabsContent value="create" className="mt-8">
            <div className="space-y-12">
              {/* Creation Tiers */}
              <div id="choose-marker-type">
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                  Choose Your Square Marker Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {creationTiers
                    .filter((tier) => tier.id !== 'default-signature')
                    .map((tier) => {
                      // Map tier.id to the correct route
                      let href = '#';
                      if (tier.id === 'custom-signature')
                        href = '/create-nft/custom-signature';
                      if (tier.id === 'custom-hand-drawn-symbol')
                        href = '/create-nft/custom-hand-drawn-symbol';
                      if (tier.id === 'house-generated-artwork')
                        href = '/create-nft/house-generated-artwork';
                      if (tier.id === 'ai-generated-artwork')
                        href = '/create-nft/ai-generated-artwork';
                      if (tier.id === 'premium-animated')
                        href = '/create-nft/premium-animated';
                      return (
                        <Card
                          key={tier.id}
                          className="bg-white dark:bg-[#002244] border-2 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-gray-200 dark:border-[#004953] hover:border-[#ed5925]"
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`bg-gradient-to-r ${tier.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                            >
                              <tier.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-[#002244] dark:text-white mb-2 transition-colors duration-300">
                              {tier.name}
                            </h3>
                            <div className="text-3xl font-bold text-[#ed5925] mb-3">
                              {tier.price}
                            </div>
                            <p className="text-[#708090] dark:text-[#96abdc] text-sm mb-4 transition-colors duration-300">
                              {tier.description}
                            </p>
                            <ul className="space-y-2 text-left">
                              {tier.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="w-4 h-4 text-[#ed5925] mt-0.5 flex-shrink-0" />
                                  <span className="text-[#708090] dark:text-[#96abdc] transition-colors duration-300">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <a href={href}>
                              <Button className="w-full mt-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-[#ed5925] hover:text-white dark:hover:bg-[#ed5925] dark:hover:text-white transition-all duration-200">
                                Select Type
                              </Button>
                            </a>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>

              {/* House Collection Special Section */}
              <div className="bg-gradient-to-r from-[#96abdc] to-[#7a95d1] rounded-2xl p-8 text-white">
                <div className="text-center mb-8">
                  <Gift className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">
                    Get House NFTs for FREE!
                  </h3>
                  <p className="text-lg opacity-90 max-w-2xl mx-auto">
                    House NFTs can be won as prizes in free games, or you can
                    choose to redeem them during cash game payouts. The $7 cost
                    will be deducted from your winnings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                    <Play className="w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">
                      Win in Free Games
                    </h4>
                    <p className="opacity-90">
                      Play free Football Squares games and win House NFTs as
                      prizes
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-4" />
                    <h4 className="text-xl font-bold mb-2">
                      Redeem from Winnings
                    </h4>
                    <p className="opacity-90">
                      Choose to get a House NFT when you win - cost deducted
                      from payout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Learn About NFTs Tab */}
          <TabsContent value="learn" className="mt-8">
            <div className="space-y-12">
              {/* FAQ Section */}
              <div>
                <h2 className="text-3xl font-bold text-[#002244] dark:text-white mb-8 text-center transition-colors duration-300">
                  Frequently Asked Questions
                </h2>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {nftFAQ.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-white dark:bg-[#002244] border border-gray-200 dark:border-[#004953] rounded-xl px-6 transition-colors duration-300"
                    >
                      <AccordionTrigger className="text-left font-semibold text-[#002244] dark:text-white hover:text-[#ed5925] transition-colors duration-200">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#708090] dark:text-[#96abdc] leading-relaxed transition-colors duration-300">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="text-center mt-8">
                  <a
                    href="/what-are-nfts"
                    className="text-[#ed5925] hover:underline font-bold"
                  >
                    Learn more about NFTs
                  </a>
                </div>
              </div>

              {/* Getting Started CTA */}
              <div className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] rounded-2xl p-8 lg:p-12 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Create Your First Square Marker?
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Start with a simple signature marker for just $3, or try to
                  win House NFTs in free games. Make your squares stand out from
                  the standard black signatures!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-[#ed5925] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 inline-flex items-center gap-2">
                    <Brush className="w-5 h-5" />
                    Create Signature Marker
                  </Button>
                  <Button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#ed5925] transition-all duration-200 inline-flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Play Free Game
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default MyNFTsContent;
