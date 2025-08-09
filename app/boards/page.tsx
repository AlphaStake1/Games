'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSearchParams } from 'next/navigation';

import TeamSelectionModal from '@/components/TeamSelectionModal';
import BoardSelector from '@/components/BoardSelector';
import EnhancedBoardGrid from '@/components/EnhancedBoardGrid';
import PricingPanel from '@/components/PricingPanel';
import VipUpgradeModal from '@/components/VipUpgradeModal';
import CBLCallToActionCard from '@/components/CBLCallToActionCard';
import ConfirmPurchaseModal from '@/components/ConfirmPurchaseModal';
import HomeAwayExplainer from '@/components/HomeAwayExplainer';

import { usePurchasePass } from '@/hooks/usePurchasePass';

import { useUserPreferences } from '@/lib/userPreferences';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { NFLTeam } from '@/lib/nflTeams';
import { BoardConfiguration, SquareSelection } from '@/lib/boardTypes';
import {
  Crown,
  ArrowLeft,
  Wallet,
  Users,
  Grid,
  TrendingUp,
  Info,
} from 'lucide-react';

const BoardsPageContent: React.FC = () => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const { user } = useAuth('PLAYER_ROLE');
  const searchParams = useSearchParams();
  const demoMode = searchParams.get('demo') === 'true';
  const seasonalMode = searchParams.get('mode') === 'seasonal';
  const walletAddress =
    publicKey?.toString() || (demoMode ? 'demo-wallet-address' : null);

  // Purchase flow integration
  const {
    isModalOpen,
    isProcessing,
    currentQuote,
    walletConnected,
    openModal,
    closeModal,
    connectWallet,
    confirmPurchase,
  } = usePurchasePass();

  // Check if we're in demo mode or actually connected
  const isConnected = connected || demoMode;

  const { preferences, isLoading, isFirstTime, setFavoriteTeam, setVIPStatus } =
    useUserPreferences(walletAddress);

  // For demo mode, bypass all loading and go straight to Miami Dolphins
  const demoPreferences = demoMode
    ? {
        walletAddress: 'demo-wallet-address',
        favoriteTeam: {
          id: 'dal',
          name: 'Cowboys',
          city: 'Dallas',
          abbreviation: 'DAL',
          conference: 'NFC' as const,
          division: 'East' as const,
          primaryColor: '#041E42',
          secondaryColor: '#869397',
          logoUrl: '/assets/teams/cowboys.png',
        },
        isVIP: false,
        selectedBoards: [],
        activeSelections: [],
        lastUpdated: Date.now(),
      }
    : null;

  // Use demo preferences in demo mode, otherwise use real preferences
  const effectivePreferences = demoMode ? demoPreferences : preferences;
  const effectiveIsLoading = demoMode ? false : isLoading;

  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showVipUpgrade, setShowVipUpgrade] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardConfiguration | null>(
    null,
  );
  const [activeSelections, setActiveSelections] = useState<SquareSelection[]>(
    [],
  );
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'selection' | 'board'>('selection');

  // Team selection is now automatic via geolocation
  // VIP users can change teams, non-VIP users get location-based assignment
  useEffect(() => {
    // No manual team selection needed - teams are auto-assigned by location
    setShowTeamSelection(false);
  }, [demoMode]);

  const handleTeamSelection = async (team: NFLTeam) => {
    if (!demoMode) {
      // In real mode, use the actual preferences system
      await setFavoriteTeam(team);
    }
    // In demo mode, no need to update anything as it's hardcoded
    setShowTeamSelection(false);
  };

  const handleBoardSelect = (board: BoardConfiguration) => {
    setSelectedBoard(board);
    setViewMode('board');
  };

  const handleBackToSelection = () => {
    setSelectedBoard(null);
    setViewMode('selection');
  };

  const handleSquareSelectionChange = (selection: SquareSelection) => {
    setActiveSelections((prev) => {
      const filtered = prev.filter((s) => s.boardId !== selection.boardId);
      if (selection.squareIndices.length > 0) {
        return [...filtered, selection];
      }
      return filtered;
    });
  };

  const handlePurchaseConfirm = useCallback(async () => {
    if (!publicKey || !sendTransaction) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to make a purchase.',
        variant: 'destructive',
      });
      return;
    }

    setIsLocalProcessing(true);
    const { id: toastId, update: updateToast } = toast({
      title: 'Processing Transaction',
      description: 'Please wait while we submit your transaction...',
    });

    try {
      const totalCost = activeSelections.reduce(
        (acc, s) => acc + s.totalCost,
        0,
      );

      const recipientPublicKey = SystemProgram.programId;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: totalCost * 1000,
        }),
      );

      const signature = await sendTransaction(transaction, connection);

      updateToast({
        title: 'Transaction Submitted',
        description: `Waiting for confirmation...`,
        variant: 'default',
      });

      await connection.confirmTransaction(signature, 'processed');

      updateToast({
        title: 'Purchase Successful!',
        description: 'Your squares have been secured.',
        variant: 'default',
      });

      setActiveSelections([]);
    } catch (error: any) {
      console.error('Purchase failed', error);
      updateToast({
        title: 'Purchase Failed',
        description:
          error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLocalProcessing(false);
    }
  }, [publicKey, sendTransaction, connection, activeSelections, toast]);

  const handleClearSelections = () => {
    setActiveSelections([]);
  };

  // Platform's wallet address for VIP payments (replace with real address)
  const VIP_RECIPIENT = new PublicKey('11111111111111111111111111111112'); // System Program ID as placeholder

  // USD to SOL conversion (replace with dynamic price lookup in production)
  const USD_TO_SOL = 0.01; // 1 USD = 0.01 SOL (example: 1 SOL = $100)
  const VIP_PRICE_USD = 97;
  const VIP_PRICE_SOL = VIP_PRICE_USD * USD_TO_SOL;

  const handleVipUpgrade = async (tier: 'monthly' | 'yearly') => {
    if (!publicKey || !sendTransaction) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to upgrade.',
        variant: 'destructive',
      });
      return;
    }

    setIsLocalProcessing(true);
    const { update: updateToast } = toast({
      title: 'Processing VIP Payment',
      description: 'Please approve the transaction in your wallet...',
    });

    try {
      // Construct transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: VIP_RECIPIENT,
          lamports: Math.round(VIP_PRICE_SOL * LAMPORTS_PER_SOL),
        }),
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      updateToast({
        title: 'Transaction Submitted',
        description: `Waiting for confirmation...`,
        variant: 'default',
      });

      await connection.confirmTransaction(signature, 'processed');

      updateToast({
        title: 'VIP Upgrade Successful!',
        description: 'You are now a VIP member.',
        variant: 'default',
      });

      setVIPStatus(true);
      setShowVipUpgrade(false);
    } catch (error: any) {
      console.error('VIP upgrade failed', error);
      updateToast({
        title: 'VIP Upgrade Failed',
        description:
          error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLocalProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-4 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Wallet className="w-8 h-8" />
                  Connect Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {seasonalMode
                      ? 'Connect your wallet to purchase a Season Pass'
                      : 'Connect your wallet to start playing Football Squares'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {seasonalMode ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Grid className="w-5 h-5 text-blue-600" />
                          <span>One pass = one square for entire season</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span>
                            Earn points each game, playoffs worth more
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span>Top 21 players get paid at season end</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Grid className="w-5 h-5 text-blue-600" />
                          <span>Select squares on game boards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span>Win instant payouts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span>Join thousands of players</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    New to crypto wallets? Check out our{' '}
                    <a
                      href="/wallet-guide"
                      className="text-blue-600 hover:underline"
                    >
                      wallet setup guide
                    </a>{' '}
                    to get started.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-4 border-black dark:border-white">
              <CardContent className="py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg">Loading your preferences...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!effectivePreferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-4 border-black dark:border-white">
              <CardContent className="py-12">
                <p className="text-lg text-red-600">
                  Error loading user preferences
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {viewMode === 'board' && (
              <Button
                onClick={handleBackToSelection}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Selection
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                {seasonalMode ? 'Season Pass Conferences' : 'Football Squares'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {seasonalMode
                  ? 'Purchase a season pass for one permanent square through playoffs. Positions & digits randomized before every game for fairness.'
                  : viewMode === 'selection'
                    ? 'Select Your Game Board'
                    : 'Choose Your Squares'}
              </p>
              {viewMode === 'board' && (
                <div className="mt-2">
                  <HomeAwayExplainer
                    boardType={
                      seasonalMode
                        ? 'season'
                        : preferences?.isVIP
                          ? 'vip'
                          : 'geographic'
                    }
                    variant="inline"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={!seasonalMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => (window.location.href = '/boards')}
                className="text-xs"
              >
                Weekly
              </Button>
              <Button
                variant={seasonalMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => (window.location.href = '/boards?mode=seasonal')}
                className="text-xs"
              >
                Season Pass
              </Button>
            </div>
            {preferences?.isVIP && (
              <>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                  <Crown className="w-4 h-4 mr-1" />
                  VIP Member
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVIPStatus(false)}
                  className="ml-2"
                >
                  Clear VIP (Test)
                </Button>
              </>
            )}
            <WalletMultiButton />
          </div>
        </div>

        {seasonalMode ? (
          /* Conference Selection Mode */
          <div className="max-w-6xl mx-auto">
            <Card className="mb-6 border-4 border-black dark:border-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Choose Your Conference
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Select your competition level and buy into the next available
                  board
                </p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div
                      className="flex items-center gap-1"
                      title="Tier 1 - $25 season pass"
                    >
                      <div className="w-3 h-3 bg-green-600 rounded shadow-sm"></div>
                      <span>Tier 1</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      title="Tier 2 - $50 season pass"
                    >
                      <div className="w-3 h-3 bg-blue-600 rounded shadow-sm"></div>
                      <span>Tier 2</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      title="Tier 3 - $100 season pass"
                    >
                      <div className="w-3 h-3 bg-purple-600 rounded shadow-sm"></div>
                      <span>Tier 3</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      title="Tier 4 - $200 season pass"
                    >
                      <div className="w-3 h-3 bg-orange-600 rounded shadow-sm"></div>
                      <span>Tier 4</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      title="Tier 5 - $500 season pass"
                    >
                      <div className="w-3 h-3 bg-yellow-600 rounded shadow-sm"></div>
                      <span>Tier 5</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Eastern Conference - Tier 1 */}
                  <Card className="border-4 border-black dark:border-white hover:border-green-400 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-green-700">
                          Eastern
                        </CardTitle>
                        <Badge className="bg-green-700 text-white">
                          Tier 1
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$25</p>
                        <p className="text-sm text-gray-500">season pass</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Current Pool:</span>
                          <span className="font-bold">$1,675</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passes Sold:</span>
                          <span className="font-bold">67/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{ width: '67%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span>1st Place @ Full Board:</span>
                          <span className="font-bold text-green-600">
                            ~$875
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top 21 Paid:</span>
                          <span className="font-bold">Yes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-green-700 hover:bg-green-800 text-white"
                          onClick={() => openModal('eastern')}
                          disabled={isLocalProcessing}
                        >
                          {isLocalProcessing
                            ? 'Loading...'
                            : 'Buy Eastern Pass – $25'}
                        </Button>
                        <a
                          href="/season-pass/leaderboard/1"
                          className="text-xs text-green-600 hover:underline block text-center"
                        >
                          View Eastern Leaderboard
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Southern Conference - Tier 2 */}
                  <Card className="border-4 border-black dark:border-white hover:border-blue-400 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-blue-700">
                          Southern
                        </CardTitle>
                        <Badge className="bg-blue-700 text-white">Tier 2</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">$50</p>
                        <p className="text-sm text-gray-500">season pass</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Current Pool:</span>
                          <span className="font-bold">$2,150</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passes Sold:</span>
                          <span className="font-bold">43/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: '43%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span>1st Place @ Full Board:</span>
                          <span className="font-bold text-blue-600">
                            ~$1,750
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top 21 Paid:</span>
                          <span className="font-bold">Yes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                          onClick={() => openModal('southern')}
                          disabled={isLocalProcessing}
                        >
                          {isLocalProcessing
                            ? 'Loading...'
                            : 'Buy Southern Pass – $50'}
                        </Button>
                        <a
                          href="/season-pass/leaderboard/2"
                          className="text-xs text-blue-600 hover:underline block text-center"
                        >
                          View Southern Leaderboard
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Northern Conference - Tier 3 */}
                  <Card className="border-4 border-black dark:border-white hover:border-purple-400 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-purple-700">
                          Northern
                        </CardTitle>
                        <Badge className="bg-purple-700 text-white">
                          Tier 3
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          $100
                        </p>
                        <p className="text-sm text-gray-500">season pass</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Current Pool:</span>
                          <span className="font-bold">$2,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passes Sold:</span>
                          <span className="font-bold">28/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: '28%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span>1st Place @ Full Board:</span>
                          <span className="font-bold text-purple-600">
                            ~$3,500
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top 21 Paid:</span>
                          <span className="font-bold">Yes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-purple-700 hover:bg-purple-800 text-white"
                          onClick={() => openModal('northern')}
                          disabled={isLocalProcessing}
                        >
                          {isLocalProcessing
                            ? 'Loading...'
                            : 'Buy Northern Pass – $100'}
                        </Button>
                        <a
                          href="/season-pass/leaderboard/3"
                          className="text-xs text-purple-600 hover:underline block text-center"
                        >
                          View Northern Leaderboard
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Western Conference - Tier 4 */}
                  <Card className="border-4 border-black dark:border-white hover:border-orange-400 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-orange-700">
                          Western
                        </CardTitle>
                        <Badge className="bg-orange-700 text-white">
                          Tier 4
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          $200
                        </p>
                        <p className="text-sm text-gray-500">season pass</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Current Pool:</span>
                          <span className="font-bold">$3,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passes Sold:</span>
                          <span className="font-bold">15/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                          <div
                            className="bg-orange-600 h-1.5 rounded-full"
                            style={{ width: '15%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <span>1st Place @ Full Board:</span>
                          <span className="font-bold text-orange-600">
                            ~$7,000
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Top 21 Paid:</span>
                          <span className="font-bold">Yes</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-orange-700 hover:bg-orange-800 text-white"
                          onClick={() => openModal('western')}
                          disabled={isLocalProcessing}
                        >
                          {isLocalProcessing
                            ? 'Loading...'
                            : 'Buy Western Pass – $200'}
                        </Button>
                        <a
                          href="/season-pass/leaderboard/4"
                          className="text-xs text-orange-600 hover:underline block text-center"
                        >
                          View Western Leaderboard
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* South-East Conference - Tier 5 */}
                  <Card className="border-4 border-black dark:border-white hover:border-yellow-400 transition-colors cursor-pointer lg:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-yellow-700">
                          South-East
                        </CardTitle>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                          <Crown className="w-3 h-3 mr-1" />
                          Tier 5
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">
                          $500
                        </p>
                        <p className="text-sm text-gray-500">season pass</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Current Pool:</span>
                            <span className="font-semibold">$3,500</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Passes Sold:</span>
                            <span>7/100</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>1st Place @ Full Board:</span>
                            <span className="font-bold text-yellow-600">
                              ~$17,500
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Top 21 Paid:</span>
                            <span className="font-semibold">Yes</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-yellow-900"
                          onClick={() => openModal('south-east')}
                          disabled={isLocalProcessing}
                        >
                          {isLocalProcessing
                            ? 'Loading...'
                            : 'Buy South-East Pass – $500'}
                        </Button>
                        <a
                          href="/season-pass/leaderboard/5"
                          className="text-xs text-yellow-700 hover:underline block text-center"
                        >
                          View South-East Leaderboard
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="border-4 border-black dark:border-white">
              <CardHeader>
                <CardTitle>How Season Pass Conferences Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold">1. Buy Season Pass</h4>
                    <p>
                      Purchase a season pass in your preferred conference. One
                      pass = one permanent square for the entire season (Week 1
                      → Super Bowl).
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">2. Fair Randomization</h4>
                    <p>
                      Before each game, positions shuffle and new digits are
                      drawn. Every square has equal winning chances over the
                      season.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">3. Accumulate Points</h4>
                    <p>
                      Earn Green Points each game. Playoff games have bonus
                      multipliers, with Super Bowl worth 5× normal points.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">4. Season Payouts</h4>
                    <p>
                      Top 21 players in each conference receive payouts at
                      season end. Winners at all levels get rewarded.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : viewMode === 'selection' ? (
          /* Board Selection Mode */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Board Selector - Takes up 3 columns */}
            <div className="lg:col-span-3">
              <BoardSelector
                userTeam={
                  effectivePreferences?.favoriteTeam || {
                    id: 'mia',
                    name: 'Dolphins',
                    city: 'Miami',
                    abbreviation: 'MIA',
                    conference: 'AFC',
                    division: 'East',
                    primaryColor: '#008E97',
                    secondaryColor: '#FC4C02',
                    logoUrl: '/assets/teams/dolphins.png',
                  }
                }
                isVIP={effectivePreferences?.isVIP || false}
                onBoardSelect={handleBoardSelect}
                onVIPUpgrade={() => setShowVipUpgrade(true)}
                selectedBoards={effectivePreferences?.selectedBoards || []}
              />
            </div>

            {/* Right Column - CBL CTA */}
            <div className="lg:col-span-1">
              {(!user || !user.isCBL) && (
                <CBLCallToActionCard className="sticky top-8" />
              )}
            </div>
          </div>
        ) : (
          /* Board Grid Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Board Grid */}
            <div className="lg:col-span-2">
              {selectedBoard && (
                <EnhancedBoardGrid
                  board={selectedBoard}
                  userWalletAddress={walletAddress}
                  isVIP={preferences?.isVIP || false}
                  onSquareSelectionChange={handleSquareSelectionChange}
                  currentSelection={activeSelections.find(
                    (s) => s.boardId === selectedBoard.boardId,
                  )}
                  boardType={
                    seasonalMode
                      ? 'season'
                      : preferences?.isVIP
                        ? 'vip'
                        : 'geographic'
                  }
                  userTeam={
                    effectivePreferences?.favoriteTeam || {
                      id: 'mia',
                      name: 'Dolphins',
                      city: 'Miami',
                      abbreviation: 'MIA',
                      primaryColor: '#008E97',
                      secondaryColor: '#FC4C02',
                    }
                  }
                />
              )}
            </div>

            {/* Pricing Panel */}
            <div className="lg:col-span-1">
              <PricingPanel
                selections={activeSelections}
                onPurchaseConfirm={handlePurchaseConfirm}
                onClearSelections={handleClearSelections}
                isProcessing={isLocalProcessing}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        <TeamSelectionModal
          isOpen={showTeamSelection}
          onTeamSelect={handleTeamSelection}
          onClose={() => setShowTeamSelection(false)}
        />

        <VipUpgradeModal
          isOpen={showVipUpgrade}
          onUpgrade={handleVipUpgrade}
          onClose={() => setShowVipUpgrade(false)}
          currentUserTeam={preferences?.favoriteTeam?.name || 'Unknown Team'}
        />

        <ConfirmPurchaseModal
          isOpen={isModalOpen}
          onClose={closeModal}
          quote={currentQuote}
          onConfirm={confirmPurchase}
          isProcessing={isProcessing}
          walletConnected={walletConnected}
          onConnectWallet={connectWallet}
        />
      </div>
    </div>
  );
};

const BoardsPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading Boards...</p>
          </div>
        </div>
      }
    >
      <BoardsPageContent />
    </Suspense>
  );
};

export default BoardsPage;
