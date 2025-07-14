'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BOARD_TIERS } from '@/lib/boardTypes';
import { formatCurrency } from '@/lib/utils';
import {
  Crown,
  Check,
  X,
  RotateCcw,
  Globe,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Users
} from 'lucide-react';

interface VipUpgradeModalProps {
  isOpen: boolean;
  onUpgrade: (tier: 'monthly' | 'yearly') => void;
  onClose: () => void;
  currentUserTeam?: string;
}

const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  isOpen,
  onUpgrade,
  onClose,
  currentUserTeam = 'Cowboys'
}) => {
  const [selectedTier, setSelectedTier] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const vipBenefits = [
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: "Unlimited Squares Per Board",
      description: "Select as many squares as you want on any board - no more 5 square limit!",
      highlight: true
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: "Premium Board Access",
      description: "Access to $250, $500, and $1000 per square boards with massive payouts",
      highlight: true
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "5% Bonus on All Winning Squares",
      description: "VIPs receive a 5% bonus payout on every winning square for the entire season.",
      highlight: true
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "All Teams Access",
      description: "View and participate in games from all 32 NFL teams, not just your region",
      highlight: false
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Early Game Access",
      description: "Get access to new games 24 hours before non-VIP users",
      highlight: false
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "More Seasonal Perks",
      description: "VIPs unlock exclusive perks and surprises throughout the season.",
      highlight: false
    }
  ];

  const pricingTiers = {
    monthly: {
      price: 29.99,
      period: 'month',
      savings: null,
      popular: false
    },
    yearly: {
      price: 97,
      period: 'season',
      savings: 203,
      popular: true
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      onUpgrade(selectedTier);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const premiumBoards = BOARD_TIERS.filter(tier => tier.isVIPOnly);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
              <div className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                Upgrade to VIP
              </div>
              <p className="text-center text-lg text-muted-foreground mt-2">
                Unlock unlimited squares, premium boards, and exclusive features
              </p>
            </div>
    
            <div className="space-y-8 px-6 pb-6">
              {/* Current Limitations */}
              <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <X className="w-5 h-5" />
                Current Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-red-700 dark:text-red-300">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Limited to 5 squares per board</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>No access to $250-$1000 boards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Only {currentUserTeam} games visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>No animated NFT board markers</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VIP Benefits */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">VIP Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {vipBenefits.map((benefit, index) => (
                <Card key={index} className={`${
                  benefit.highlight 
                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950' 
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        benefit.highlight 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {benefit.description}
                        </p>
                        {benefit.highlight && (
                          <Badge className="mt-2 bg-yellow-500 text-yellow-900">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Boards Preview */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">Unlock Premium Boards</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {premiumBoards.map((tier) => (
                <Card key={tier.id} className="border-yellow-400">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP Only
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(tier.pricePerSquare)}
                        </p>
                        <p className="text-xs text-gray-500">per square</p>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{tier.displayName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Q1:</span>
                        <span className="font-bold">{formatCurrency(tier.payouts.q1Regular)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q2:</span>
                        <span className="font-bold">{formatCurrency(tier.payouts.q2Regular)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q3:</span>
                        <span className="font-bold">{formatCurrency(tier.payouts.q3Regular)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q4:</span>
                        <span className="font-bold text-green-600">{formatCurrency(tier.payouts.q4Regular)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Potential (Q1+Q2+Q3+½Q4):</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(
                            tier.payouts.q1Regular +
                            tier.payouts.q2Regular +
                            tier.payouts.q3Regular +
                            (tier.payouts.q4Regular * 0.5)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Win (all 4 quarters):</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(
                            tier.payouts.q1Regular +
                            tier.payouts.q2Regular +
                            tier.payouts.q3Regular +
                            tier.payouts.q4Regular
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <p>Max Win: Win all 4 quarters (no split).</p>
                        <p>Total Potential: Win Q1, Q2, Q3, and half of Q4 (OT split).</p>
                        <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                          VIPs receive an extra 5% bonus on all winning squares!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Selection */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-center">Current Season</h3>
            <div className="flex justify-center">
              <Card
                className={`cursor-pointer transition-all duration-200 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-yellow-400`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-xl capitalize">Full Season</CardTitle>
                  <div className="space-y-1">
                    <p className="text-xl line-through text-gray-500">{formatCurrency(300)}</p>
                    <p className="text-4xl font-bold">{formatCurrency(97)}</p>
                    <p className="text-sm text-gray-600">per season</p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Save {formatCurrency(203)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Unlimited squares per board</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Premium board access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>All teams access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="text-center">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-lg"
              size="lg"
            >
              {isProcessing ? 'Processing...' : 'Secure My Spot'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VipUpgradeModal;