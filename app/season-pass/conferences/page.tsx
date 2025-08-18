'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Crown,
  Trophy,
  Star,
  Zap,
  Users,
  DollarSign,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Wallet,
  Shield,
  AlertCircle,
} from 'lucide-react';

interface Conference {
  id: number;
  name: string;
  basePrice: number;
  filled: number;
  capacity: number;
  description: string;
  prizePool: number;
  isActive: boolean;
  featured?: boolean;
}

interface PassPricing {
  passCount: number;
  price: number;
  multiplier: number;
  savings?: number;
}

const ConferencesPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connected, connecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [selectedConference, setSelectedConference] =
    useState<Conference | null>(null);
  const [selectedPassType, setSelectedPassType] = useState<'full' | 'half'>(
    'full',
  );
  const [selectedPassCount, setSelectedPassCount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  // Mock conferences data
  const conferences: Conference[] = [
    {
      id: 1,
      name: 'Northern Conference',
      basePrice: 100,
      filled: 87,
      capacity: 100,
      description: 'Entry-level conference with solid competition',
      prizePool: 10000,
      isActive: true,
    },
    {
      id: 2,
      name: 'Southern Conference',
      basePrice: 200,
      filled: 65,
      capacity: 100,
      description: 'Mid-tier conference for serious players',
      prizePool: 20000,
      isActive: true,
    },
    {
      id: 3,
      name: 'Eastern Conference',
      basePrice: 300,
      filled: 43,
      capacity: 100,
      description: 'High-stakes competition with premium rewards',
      prizePool: 30000,
      isActive: true,
    },
    {
      id: 4,
      name: 'Western Conference',
      basePrice: 400,
      filled: 22,
      capacity: 100,
      description: 'Elite conference for top-tier players',
      prizePool: 40000,
      isActive: true,
    },
    {
      id: 5,
      name: 'North-West Conference',
      basePrice: 500,
      filled: 8,
      capacity: 100,
      description: 'Ultimate championship conference',
      prizePool: 50000,
      isActive: true,
      featured: true,
    },
  ];

  // Initialize selected conference from URL params
  useEffect(() => {
    const conferenceId = searchParams.get('id');
    if (conferenceId) {
      const conference = conferences.find(
        (c) => c.id === parseInt(conferenceId),
      );
      if (conference) {
        setSelectedConference(conference);
      }
    }
  }, [searchParams, conferences]);

  // Calculate pricing for half-season passes
  const calculateHalfSeasonPricing = (basePrice: number): PassPricing[] => {
    const scaleCurve = [0, 1000, 2000, 3000, 4000]; // BPS values

    return scaleCurve.map((bps, index) => {
      const multiplier = (10000 + bps) / 10000;
      const price = Math.floor(basePrice * multiplier);

      return {
        passCount: index + 1,
        price,
        multiplier,
        savings:
          index > 0 ? Math.floor(basePrice * (index + 1) - price) : undefined,
      };
    });
  };

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleMintPass = async () => {
    if (!selectedConference || !connected) return;

    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      router.push('/season-pass/dashboard');
    }, 3000);
  };

  const ConferenceCard = ({
    conference,
    isSelected = false,
  }: {
    conference: Conference;
    isSelected?: boolean;
  }) => {
    const fillPercentage = (conference.filled / conference.capacity) * 100;
    const isAlmostFull = fillPercentage >= 85;
    const isFull = fillPercentage >= 100;

    const cardClasses = conference.featured
      ? `cursor-pointer transition-all duration-300 hover:shadow-lg border-2 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-400/50 dark:from-indigo-800/60 dark:to-purple-800/60 dark:border-indigo-300/40 ${
          isSelected
            ? 'border-yellow-400 bg-yellow-50/5'
            : 'hover:border-indigo-400'
        } ${isFull ? 'opacity-60' : ''}`
      : `cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
          isSelected
            ? 'border-yellow-400 bg-yellow-50/5'
            : 'border-4 border-black dark:border-white hover:border-gray-600'
        } ${isFull ? 'opacity-60' : ''}`;

    return (
      <Card
        className={cardClasses}
        onClick={() => !isFull && setSelectedConference(conference)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle
                className={`text-xl ${conference.featured ? 'text-indigo-100' : ''}`}
              >
                {conference.name}
              </CardTitle>
              {conference.featured && (
                <Badge className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  ⭐ FEATURED
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${conference.featured ? 'text-indigo-200' : 'text-green-600'}`}
              >
                ${conference.basePrice}
              </p>
              <p
                className={`text-xs ${conference.featured ? 'text-indigo-300' : 'text-gray-500'}`}
              >
                base price
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p
              className={`text-sm ${conference.featured ? 'text-indigo-300' : 'text-gray-400'}`}
            >
              {conference.description}
            </p>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={conference.featured ? 'text-indigo-200' : ''}>
                  Capacity
                </span>
                <span
                  className={`font-medium ${conference.featured ? 'text-indigo-100' : ''}`}
                >
                  {conference.filled}/100
                </span>
              </div>
              <Progress value={fillPercentage} className="h-2" />
              {isAlmostFull && !isFull && (
                <p className="text-xs text-orange-600 mt-1">🔥 Almost full!</p>
              )}
              {isFull && <p className="text-xs text-red-600 mt-1">❌ Full</p>}
            </div>

            {isSelected && (
              <div className="flex items-center gap-2 text-yellow-400 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Selected</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const halfSeasonPricing = selectedConference
    ? calculateHalfSeasonPricing(selectedConference.basePrice)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-4 border-black dark:border-white">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/season-pass')}
            className="mb-4 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Season Pass
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Select Your Conference</h1>
              <p className="text-gray-400 mt-2">
                Choose your conference and mint your Season-Pass NFT
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {!connected ? (
                <Button
                  onClick={handleConnectWallet}
                  disabled={connecting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {connecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Wallet Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conference Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Conferences</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {conferences.map((conference) => (
                <ConferenceCard
                  key={conference.id}
                  conference={conference}
                  isSelected={selectedConference?.id === conference.id}
                />
              ))}
            </div>
          </div>

          {/* Minting Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-gray-800/50 border-4 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Mint Season-Pass NFT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedConference ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conference to continue</p>
                  </div>
                ) : (
                  <>
                    {/* Pass Type Selection */}
                    <div>
                      <h3 className="font-semibold mb-3">Pass Type</h3>
                      <div className="p-3 bg-blue-950/30 border border-blue-800 rounded-lg">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          <span className="font-medium">Full-Season Pass</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Complete NFL season with playoff multipliers
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Selected Configuration */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        Selected Configuration
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Conference:</span>
                          <span className="font-medium">
                            {selectedConference.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pass Type:</span>
                          <span className="font-medium">Full-Season</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Total Cost */}
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">
                          Total Cost:
                        </span>
                        <span className="text-2xl font-bold text-green-400">
                          $
                          {selectedPassType === 'full'
                            ? selectedConference.basePrice
                            : halfSeasonPricing.find(
                                (p) => p.passCount === selectedPassCount,
                              )?.price || 0}
                        </span>
                      </div>

                      {selectedPassType === 'half' && selectedPassCount > 1 && (
                        <div className="text-xs text-gray-400">
                          Scaling multiplier:{' '}
                          {halfSeasonPricing
                            .find((p) => p.passCount === selectedPassCount)
                            ?.multiplier.toFixed(1)}
                          x
                        </div>
                      )}
                    </div>

                    {/* Mint Button */}
                    <Button
                      onClick={handleMintPass}
                      disabled={!connected || isMinting}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3"
                    >
                      {isMinting ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : !connected ? (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Connect Wallet First
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Mint Season-Pass NFT
                        </>
                      )}
                    </Button>

                    {/* Important Info */}
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 mt-0.5 text-yellow-400" />
                        <span>
                          Season-Pass NFTs are non-transferable and soulbound to
                          your wallet
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 mt-0.5 text-yellow-400" />
                        <span>
                          Payment is processed in USDC on Solana network
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConferencesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading Conferences...</p>
          </div>
        </div>
      }
    >
      <ConferencesPageContent />
    </Suspense>
  );
};

export default ConferencesPage;
