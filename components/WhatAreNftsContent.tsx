'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Palette, 
  Wallet, 
  Shield, 
  Zap, 
  Trophy, 
  Flame, 
  ExternalLink, 
  ArrowRight, 
  Target, 
  Star, 
  Coins, 
  ChevronDown,
  Play,
  Gift,
  ImageIcon,
  Brush,
  Wand2,
  Eye,
  Download,
  Share2,
  CheckCircle,
  Info,
  Grid3X3,
  Layers,
  Lock,
  Unlock,
  Recycle
} from 'lucide-react';

export function WhatAreNftsContent() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nftTiers = [
    {
      id: 1,
      name: "Signature NFT",
      price: "$3",
      icon: Brush,
      description: "Your personalized digital signature with custom colors",
      features: ["Custom colored ink signature", "Replaces standard black text", "Use on unlimited squares", "Transferable ownership"],
      gradient: "from-[#ed5925] to-[#d14a1f]",
      bgColor: "bg-gradient-to-br from-[#ed5925]/10 to-[#d14a1f]/10",
      borderColor: "border-[#ed5925]/20",
      example: "Your signature in vibrant orange ink"
    },
    {
      id: 2,
      name: "House Collection",
      price: "$7",
      icon: Star,
      description: "Professional artwork - win free or redeem from winnings",
      features: ["Pre-designed professional art", "Win in free games", "Redeem from cash winnings", "High-quality designs"],
      gradient: "from-[#96abdc] to-[#7a95d1]",
      bgColor: "bg-gradient-to-br from-[#96abdc]/10 to-[#7a95d1]/10",
      borderColor: "border-[#96abdc]/20",
      example: "Championship trophies, team logos, football themes"
    },
    {
      id: 3,
      name: "Custom Artwork",
      price: "$14",
      icon: ImageIcon,
      description: "Upload your own unique images and artwork",
      features: ["Upload any image/photo", "Professional square formatting", "Personal artwork display", "Unique visual marker"],
      gradient: "from-[#004953] to-[#003a42]",
      bgColor: "bg-gradient-to-br from-[#004953]/10 to-[#003a42]/10",
      borderColor: "border-[#004953]/20",
      example: "Family photos, pet pictures, personal art"
    },
    {
      id: 4,
      name: "Animated NFT",
      price: "$21",
      icon: Zap,
      description: "Moving artwork with eye-catching animations",
      features: ["Custom animated effects", "Eye-catching movement", "Premium square presence", "Advanced visual features"],
      gradient: "from-[#8d594d] to-[#6b4238]",
      bgColor: "bg-gradient-to-br from-[#8d594d]/10 to-[#6b4238]/10",
      borderColor: "border-[#8d594d]/20",
      example: "Floating effects, color pulses, gentle rotations"
    }
  ];

  const blockchainFeatures = [
    {
      icon: Shield,
      title: "True Ownership",
      description: "Your NFTs are stored on the Solana blockchain, giving you complete ownership and control."
    },
    {
      icon: Zap,
      title: "Fast & Affordable",
      description: "Solana's high-speed, low-cost network makes minting and trading NFTs seamless."
    },
    {
      icon: Eye,
      title: "Visible in Wallet",
      description: "View your collection directly in your Phantom wallet's collectibles section."
    },
    {
      icon: Unlock,
      title: "Transferable",
      description: "Send, sell, or trade your NFTs to other wallets - they're truly yours forever."
    }
  ];

  const burnBenefits = [
    {
      icon: Coins,
      title: "Reclaim SOL",
      description: "Get back the rent fees (small amount of SOL) locked in your NFT when you burn it."
    },
    {
      icon: Recycle,
      title: "Clean Wallet",
      description: "Remove unwanted NFTs from your collection to keep your wallet organized."
    },
    {
      icon: Target,
      title: "Strategic Choice",
      description: "Burn NFTs you no longer need and use the reclaimed SOL for new purchases."
    }
  ];

  return (
    <main className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stunning Hero Section */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002244] via-[#004953] to-[#002244] text-white mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#ed5925]/20 to-[#96abdc]/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-[#96abdc]/20 to-[#8d594d]/20 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#ed5925] rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#96abdc] rounded-full animate-pulse"></div>
          </div>

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <Sparkles className="w-6 h-6 text-[#ed5925]" />
                  <span className="text-sm font-semibold">Digital Ownership on Solana</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#96abdc] to-[#ed5925] bg-clip-text text-transparent">
                  What Are NFTs?
                </h1>
                <p className="text-xl lg:text-2xl text-[#96abdc] mb-8 leading-relaxed">
                  Discover how Non-Fungible Tokens revolutionize digital ownership and personalize your Football Squares experience with unique, blockchain-verified markers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <Target className="w-12 h-12 text-[#ed5925] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Personalized Markers</h3>
                  <p className="text-[#96abdc] text-sm">Replace standard signatures with your unique NFT designs</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <Shield className="w-12 h-12 text-[#96abdc] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">True Ownership</h3>
                  <p className="text-[#96abdc] text-sm">Stored on Solana blockchain with verified ownership</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <Zap className="w-12 h-12 text-[#8d594d] mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Fast & Affordable</h3>
                  <p className="text-[#96abdc] text-sm">Low-cost minting and instant transfers on Solana</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-8 py-4 rounded-full font-bold text-lg hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating NFTs
                </Button>
                <Button variant="outline" className="border-2 border-[#002244] dark:border-white/30 text-[#002244] dark:text-white bg-white/90 dark:bg-transparent px-8 py-4 rounded-full font-bold text-lg hover:bg-[#002244] hover:text-white dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  <Gift className="w-5 h-5 mr-2" />
                  View My Collection
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* My NFTs Page Link - Prominent Above the Fold */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <CardContent className="relative z-10 p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Ready to Create Your NFT Collection?
                  </h2>
                  <p className="text-xl lg:text-2xl opacity-90 mb-6">
                    Visit your NFT dashboard to start minting personalized square markers
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      asChild
                      size="lg"
                      className="bg-white text-[#ed5925] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <a href="/my-nfts">
                        <Grid3X3 className="w-6 h-6 mr-2" />
                        Go to My NFTs
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </a>
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-2 border-[#002244] dark:border-white text-[#002244] dark:text-white bg-white/90 dark:bg-transparent px-8 py-4 rounded-full font-bold text-lg hover:bg-[#002244] hover:text-white dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Learn More Below
                      <ChevronDown className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
                        <Brush className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-150">
                        <Star className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center animate-pulse delay-500">
                        <Zap className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NFT Basics Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#002244] dark:text-white mb-6">
              Understanding NFTs
            </h2>
            <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto">
              Non-Fungible Tokens are unique digital assets that prove ownership and authenticity on the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Card className="bg-white dark:bg-[#002244] border-2 border-[#ed5925]/20 dark:border-[#ed5925]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ed5925] to-[#d14a1f] rounded-2xl flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#002244] dark:text-white">Fungible vs Non-Fungible</h3>
                      <p className="text-[#708090] dark:text-[#96abdc]">Understanding the difference</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#faf9f5] dark:bg-[#444341]/50 rounded-xl p-4">
                      <h4 className="font-bold text-[#002244] dark:text-white mb-2">💰 Fungible (Like Money)</h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm">One dollar bill = Another dollar bill. Interchangeable with equal value.</p>
                    </div>
                    <div className="bg-[#ed5925]/5 dark:bg-[#ed5925]/10 rounded-xl p-4 border border-[#ed5925]/20">
                      <h4 className="font-bold text-[#002244] dark:text-white mb-2">🎨 Non-Fungible (Like Art)</h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm">Mona Lisa ≠ Any other painting. Unique, one-of-a-kind, irreplaceable.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#002244] border-2 border-[#96abdc]/20 dark:border-[#96abdc]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#96abdc] to-[#7a95d1] rounded-2xl flex items-center justify-center">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#002244] dark:text-white">Digital Ownership</h3>
                      <p className="text-[#708090] dark:text-[#96abdc]">Blockchain-verified proof</p>
                    </div>
                  </div>
                  <p className="text-[#708090] dark:text-[#96abdc] leading-relaxed">
                    NFTs use blockchain technology to create a permanent, tamper-proof record of ownership. 
                    When you own an NFT, the blockchain serves as your digital certificate of authenticity - 
                    no one can dispute your ownership or create identical copies.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-[#004953]/10 to-[#002244]/10 dark:from-[#004953]/20 dark:to-[#002244]/20 rounded-3xl p-8 border border-[#004953]/20 dark:border-[#004953]/30">
              <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-6 text-center">
                NFTs in Football Squares
              </h3>
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-[#708090]/10">
                  <div className="flex items-center gap-4 mb-4">
                    <Target className="w-12 h-12 text-[#ed5925]" />
                    <div>
                      <h4 className="font-bold text-[#002244] dark:text-white">Personal Square Markers</h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm">Replace boring signatures</p>
                    </div>
                  </div>
                  <p className="text-[#708090] dark:text-[#96abdc] text-sm">
                    Your NFTs become visual markers on any square you purchase. Instead of seeing 
                    "John D." in basic black text, you'll see your custom NFT design.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-[#708090]/10">
                  <div className="flex items-center gap-4 mb-4">
                    <Trophy className="w-12 h-12 text-[#96abdc]" />
                    <div>
                      <h4 className="font-bold text-[#002244] dark:text-white">Collectible Value</h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm">Build your collection</p>
                    </div>
                  </div>
                  <p className="text-[#708090] dark:text-[#96abdc] text-sm">
                    Each NFT is a permanent collectible you own forever. Trade them, sell them, 
                    or showcase your collection in your digital wallet.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-[#708090]/10">
                  <div className="flex items-center gap-4 mb-4">
                    <Gift className="w-12 h-12 text-[#8d594d]" />
                    <div>
                      <h4 className="font-bold text-[#002244] dark:text-white">Win or Purchase</h4>
                      <p className="text-[#708090] dark:text-[#96abdc] text-sm">Multiple ways to obtain</p>
                    </div>
                  </div>
                  <p className="text-[#708090] dark:text-[#96abdc] text-sm">
                    Win NFTs in free games, purchase them directly, or redeem them from 
                    your game winnings. Start building your collection today!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Types/Tiers Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#002244] dark:text-white mb-6">
              NFT Square Marker Types
            </h2>
            <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto">
              Choose from four distinct types of NFT markers, each offering unique personalization options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nftTiers.map((tier, index) => (
              <Card 
                key={tier.id}
                className={`${tier.bgColor} border-2 ${tier.borderColor} dark:border-opacity-40 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer group overflow-hidden relative ${
                  selectedCard === tier.id ? 'ring-2 ring-[#ed5925] shadow-2xl' : ''
                }`}
                onClick={() => setSelectedCard(selectedCard === tier.id ? null : tier.id)}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${tier.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                      <tier.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <div className={`text-4xl font-bold bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent mb-3`}>
                      {tier.price}
                    </div>
                    <p className="text-[#708090] dark:text-[#96abdc] text-sm leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 text-[#ed5925] flex-shrink-0`} />
                        <span className="text-[#708090] dark:text-[#96abdc] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white dark:bg-[#002244]/50 rounded-xl p-4 border border-[#708090]/10">
                    <p className="text-xs text-[#708090] dark:text-[#96abdc] font-medium mb-1">Example:</p>
                    <p className="text-[#002244] dark:text-white text-sm font-medium">{tier.example}</p>
                  </div>

                  {selectedCard === tier.id && (
                    <div className="mt-6 pt-6 border-t border-[#708090]/20 animate-fade-in">
                      <Button 
                        className={`w-full bg-gradient-to-r ${tier.gradient} text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                      >
                        Create {tier.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Solana Blockchain Features */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-[#004953] to-[#002244] rounded-3xl p-8 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <Zap className="w-6 h-6 text-[#96abdc]" />
                  <span className="text-sm font-semibold">Powered by Solana</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Why Solana Blockchain?
                </h2>
                <p className="text-xl text-[#96abdc] max-w-3xl mx-auto">
                  Experience the fastest, most affordable NFT platform with instant transactions and minimal fees
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {blockchainFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <feature.icon className="w-12 h-12 text-[#96abdc] mb-4" />
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-[#96abdc] text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      View Your NFTs in Phantom Wallet
                    </h3>
                    <p className="text-[#96abdc] mb-6 leading-relaxed">
                      Once minted, your NFTs automatically appear in your Phantom wallet's collectibles section. 
                      You can view, manage, and transfer them just like any other digital asset.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        className="bg-white dark:bg-white text-[#002244] dark:text-[#002244] px-6 py-3 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        Connect Phantom
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-2 border-[#002244] dark:border-white/30 text-[#002244] dark:text-white bg-white/90 dark:bg-transparent px-6 py-3 rounded-full font-bold hover:bg-[#002244] hover:text-white dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Get Phantom Wallet
                      </Button>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="bg-white/20 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-[#96abdc] rounded-lg"></div>
                        <span className="font-bold">Phantom Wallet</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#ed5925] rounded-sm"></div>
                            <span className="text-sm">Golden Signature NFT</span>
                          </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#8d594d] rounded-sm"></div>
                            <span className="text-sm">Trophy Collection NFT</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#96abdc] text-center">Your NFTs in wallet collectibles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sol Incinerator Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-[#8d594d]/10 to-[#6b4238]/10 dark:from-[#8d594d]/20 dark:to-[#6b4238]/20 border-2 border-[#8d594d]/20 dark:border-[#8d594d]/30 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8d594d]/5 to-[#6b4238]/5"></div>
            
            <CardContent className="p-8 lg:p-16 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-[#8d594d]/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                  <Flame className="w-6 h-6 text-[#8d594d]" />
                  <span className="text-sm font-semibold text-[#002244] dark:text-white">NFT Burning</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#002244] dark:text-white mb-6">
                  Sol Incinerator: Burn Your NFTs
                </h2>
                <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto mb-8">
                  Permanently destroy unwanted NFTs and reclaim the small amount of SOL used for storage rent. 
                  Clean up your wallet and get back your Solana tokens.
                </p>
                
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#8d594d] to-[#6b4238] text-white px-8 py-4 rounded-full font-bold text-lg hover:from-[#6b4238] hover:to-[#4a2e26] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-12"
                >
                  <a href="https://sol-incinerator.com/" target="_blank" rel="noopener noreferrer">
                    <Flame className="w-6 h-6 mr-2" />
                    Visit Sol Incinerator
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-[#708090]/10">
                    <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-4">
                      What is NFT Burning?
                    </h3>
                    <p className="text-[#708090] dark:text-[#96abdc] leading-relaxed mb-4">
                      Burning an NFT means permanently destroying it on the blockchain. This process is irreversible - 
                      once burned, the NFT cannot be recovered or recreated.
                    </p>
                    <p className="text-[#708090] dark:text-[#96abdc] leading-relaxed">
                      When you burn an NFT on Solana, you reclaim the "rent" (a small amount of SOL) that was locked 
                      up to store the NFT data on the blockchain.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-[#002244] rounded-2xl p-6 shadow-lg border border-[#708090]/10">
                    <h3 className="text-2xl font-bold text-[#002244] dark:text-white mb-4">
                      Why Burn NFTs?
                    </h3>
                    <div className="space-y-4">
                      {burnBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8d594d] to-[#6b4238] rounded-xl flex items-center justify-center flex-shrink-0">
                            <benefit.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#002244] dark:text-white mb-1">{benefit.title}</h4>
                            <p className="text-[#708090] dark:text-[#96abdc] text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#8d594d] to-[#6b4238] rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-full"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 text-center">
                      How Sol Incinerator Works
                    </h3>
                    
                    <div className="space-y-6">
                      {[
                        { step: 1, title: "Connect Wallet", description: "Link your Phantom or other Solana wallet" },
                        { step: 2, title: "Select NFTs", description: "Choose which NFTs you want to burn" },
                        { step: 3, title: "Confirm Burning", description: "Permanently destroy the selected NFTs" },
                        { step: 4, title: "Reclaim SOL", description: "Get back the storage rent as SOL tokens" }
                      ].map((step) => (
                        <div key={step.step} className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="font-bold mb-1">{step.title}</h4>
                            <p className="text-white/80 text-sm">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-[#96abdc]" />
                        <span className="font-bold text-sm">Important Note</span>
                      </div>
                      <p className="text-white/90 text-sm">
                        Burning is permanent and cannot be undone. Only burn NFTs you're certain you no longer want.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#002244] dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[#708090] dark:text-[#96abdc] max-w-3xl mx-auto">
              Everything you need to know about NFTs in Football Squares
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "How do NFTs work as square markers in Football Squares?",
                  a: "When you purchase a square in any Football Squares game, your NFT appears as the visual marker instead of the standard black signature text. For example, instead of seeing 'John D.' in plain text, other players see your custom NFT design - whether it's a colorful signature, professional artwork, or animated graphics."
                },
                {
                  q: "What's the difference between the four NFT types?",
                  a: "Signature NFTs ($3) display your digital signature in custom colors. House Collection NFTs ($7) are professionally designed artwork that can be won in free games or redeemed from winnings. Custom Artwork NFTs ($14) let you upload your own images. Animated NFTs ($21) feature moving graphics with special effects."
                },
                {
                  q: "Can I use the same NFT on multiple squares?",
                  a: "Yes! Once you own an NFT, you can use it as your marker on unlimited squares across all future games. Your NFT becomes your permanent digital signature that replaces the standard black text wherever you play."
                },
                {
                  q: "How do I get House Collection NFTs for free?",
                  a: "House Collection NFTs can be won as prizes in free Football Squares games. You can also choose to redeem them when you win cash games - the $7 cost gets deducted from your payout, so you're essentially using your winnings to get the NFT."
                },
                {
                  q: "Where can I view my NFT collection?",
                  a: "Your NFTs appear automatically in your connected Solana wallet (like Phantom) under the 'Collectibles' or 'NFTs' section. You can view, transfer, or manage them just like any other digital asset in your wallet."
                },
                {
                  q: "What happens if I sell or transfer my NFT?",
                  a: "If you sell or transfer your NFT to another wallet, you'll lose the ability to use it as your square marker. You'll need to create a new NFT or revert to using the standard black signature text for future square purchases."
                },
                {
                  q: "Why should I burn my NFTs with Sol Incinerator?",
                  a: "Burning NFTs with Sol Incinerator helps you reclaim the small amount of SOL (storage rent) locked up in unwanted NFTs. It also cleans up your wallet by permanently removing NFTs you no longer want, keeping your collection organized."
                },
                {
                  q: "Are my NFTs stored on the Solana blockchain?",
                  a: "Yes, all Football Squares NFTs are minted and stored on the Solana blockchain. This gives you true ownership, fast transactions, low fees, and the ability to verify authenticity. The blockchain serves as your permanent certificate of ownership."
                },
                {
                  q: "Can I create animated NFTs with my own artwork?",
                  a: "Yes! For Animated NFTs ($21), you upload your artwork and we add professional animation effects like floating glow, particle effects, color pulses, or gentle rotation. You choose which effects to apply to make your square marker truly eye-catching."
                },
                {
                  q: "What file formats can I upload for Custom Artwork NFTs?",
                  a: "Custom Artwork NFTs support JPG, PNG, and GIF files up to 10MB. We automatically format your uploaded image to fit perfectly within square markers while maintaining quality and visual appeal."
                }
              ].map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white dark:bg-[#002244] border-2 border-[#708090]/10 dark:border-[#004953]/30 rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <AccordionTrigger className="text-left font-bold text-[#002244] dark:text-white hover:text-[#ed5925] transition-colors duration-200 py-6">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#708090] dark:text-[#96abdc] leading-relaxed pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-[#002244] via-[#004953] to-[#002244] text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-50" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <CardContent className="p-12 lg:p-20 relative z-10">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  Ready to Start Your NFT Journey?
                </h2>
                <p className="text-xl lg:text-2xl text-[#96abdc] mb-12 leading-relaxed">
                  Transform your Football Squares experience with personalized NFT markers. 
                  Stand out from the crowd and build your unique digital collection.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ed5925] to-[#d14a1f] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Brush className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Start Simple</h3>
                    <p className="text-[#96abdc] text-sm">Begin with a $3 signature NFT</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#96abdc] to-[#7a95d1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Play for Free</h3>
                    <p className="text-[#96abdc] text-sm">Win House NFTs in free games</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#8d594d] to-[#6b4238] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Go Premium</h3>
                    <p className="text-[#96abdc] text-sm">Create animated masterpieces</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-[#ed5925] to-[#96abdc] text-white px-10 py-5 rounded-full font-bold text-xl hover:from-[#d14a1f] hover:to-[#7a95d1] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <a href="/my-nfts">
                      <Sparkles className="w-6 h-6 mr-3" />
                      Create Your First NFT
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </a>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#002244] dark:border-white/30 text-[#002244] dark:text-white bg-white/90 dark:bg-transparent px-10 py-5 rounded-full font-bold text-xl hover:bg-[#002244] hover:text-white dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Play Free Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
