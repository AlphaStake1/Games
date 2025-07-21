'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

import { useUserPreferences } from '@/lib/userPreferences';
import { useToast } from '@/hooks/use-toast';
import { NFLTeam } from '@/lib/nflTeams';
import { BoardConfiguration, SquareSelection } from '@/lib/boardTypes';
import {
  Crown,
  ArrowLeft,
  Wallet,
  Users,
  Grid,
  TrendingUp,
  Info
} from 'lucide-react';

const BoardsPage: React.FC = () => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const demoMode = searchParams.get('demo') === 'true';
  const walletAddress = publicKey?.toString() || (demoMode ? 'demo-wallet-address' : null);
  
  // Check if we're in demo mode or actually connected
  const isConnected = connected || demoMode;
  
  const { 
    preferences, 
    isLoading, 
    isFirstTime, 
    setFavoriteTeam, 
    setVIPStatus 
  } = useUserPreferences(walletAddress);

  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showVipUpgrade, setShowVipUpgrade] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardConfiguration | null>(null);
  const [activeSelections, setActiveSelections] = useState<SquareSelection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'selection' | 'board'>('selection');

  // Show team selection for first-time users
  useEffect(() => {
    if (isConnected && isFirstTime && !isLoading) {
      setShowTeamSelection(true);
    }
  }, [isConnected, isFirstTime, isLoading]);

  const handleTeamSelection = (team: NFLTeam) => {
    setFavoriteTeam(team);
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
    setActiveSelections(prev => {
      const filtered = prev.filter(s => s.boardId !== selection.boardId);
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

    setIsProcessing(true);
    const { id: toastId, update: updateToast } = toast({
      title: 'Processing Transaction',
      description: 'Please wait while we submit your transaction...',
    });

    try {
      const totalCost = activeSelections.reduce((acc, s) => acc + s.totalCost, 0);
      
      const recipientPublicKey = SystemProgram.programId;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: totalCost * 1000,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      
      updateToast({
        title: 'Transaction Submitted',
        description: `Waiting for confirmation...`,
        variant: 'default'
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
        description: error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
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

    setIsProcessing(true);
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
        })
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      updateToast({
        title: 'Transaction Submitted',
        description: `Waiting for confirmation...`,
        variant: 'default'
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
        description: error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Wallet className="w-8 h-8" />
                  Connect Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Connect your wallet to start playing Football Squares
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                  </div>
                </div>

                <div className="pt-4">
                  <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
                </div>

                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    New to crypto wallets? Check out our <a href="/wallet-guide" className="text-blue-600 hover:underline">wallet setup guide</a> to get started.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
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

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="py-12">
                <p className="text-lg text-red-600">Error loading user preferences</p>
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
              <h1 className="text-3xl font-bold">Football Squares</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {viewMode === 'selection' ? 'Select Your Game Board' : 'Choose Your Squares'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

        {viewMode === 'selection' ? (
          /* Board Selection Mode */
          <BoardSelector
            userTeam={preferences?.favoriteTeam || { id: 'dal', name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL', conference: 'NFC', division: 'East', primaryColor: '#041E42', secondaryColor: '#869397', logoUrl: '/assets/teams/dal.png' }}
            isVIP={preferences?.isVIP || false}
            onBoardSelect={handleBoardSelect}
            onVIPUpgrade={() => setShowVipUpgrade(true)}
            selectedBoards={preferences?.selectedBoards || []}
          />
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
                  currentSelection={activeSelections.find(s => s.boardId === selectedBoard.boardId)}
                />
              )}
            </div>

            {/* Pricing Panel */}
            <div className="lg:col-span-1">
              <PricingPanel
                selections={activeSelections}
                onPurchaseConfirm={handlePurchaseConfirm}
                onClearSelections={handleClearSelections}
                isProcessing={isProcessing}
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
      </div>
    </div>
  );
};

export default BoardsPage;