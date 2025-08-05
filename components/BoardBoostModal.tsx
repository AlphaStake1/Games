'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Target,
  Rocket,
  Info,
  CheckCircle,
  Crown,
  Star,
  BarChart3,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

interface BoardBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: {
    id: string;
    name: string;
    gameInfo: string;
    entryFee: number;
    currentFillRate: number;
    playersCount: number;
    maxPlayers: number;
    gameDate: Date;
    isVipOnly?: boolean;
  };
  onBoost: (duration: number, amount: number) => Promise<void>;
}

export function BoardBoostModal({
  isOpen,
  onClose,
  board,
  onBoost,
}: BoardBoostModalProps) {
  const { connected } = useWallet();
  const [selectedDuration, setSelectedDuration] = useState<string>('3');
  const [isProcessing, setIsProcessing] = useState(false);

  const boostOptions = [
    {
      days: '1',
      cost: 0.05,
      label: '24 Hours',
      description: 'Quick visibility boost',
      features: [
        'Featured in discovery for 24 hours',
        'Priority in search results',
      ],
      recommended: false,
    },
    {
      days: '3',
      cost: 0.12,
      label: '3 Days',
      description: 'Recommended for most boards',
      features: ['Featured placement for 3 days', 'Best value for engagement'],
      recommended: true,
    },
    {
      days: '7',
      cost: 0.25,
      label: '1 Week',
      description: 'Maximum impact campaign',
      features: ['Premium placement for 7 days', 'Best for high-stakes boards'],
      recommended: false,
    },
  ];

  const selectedOption = boostOptions.find(
    (opt) => opt.days === selectedDuration,
  );

  const handleBoost = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedOption) return;

    setIsProcessing(true);
    try {
      await onBoost(parseInt(selectedOption.days), selectedOption.cost);
      toast.success(`Board boosted for ${selectedOption.label}! 🚀`, {
        description: 'Your board is now featured in discovery feeds.',
      });
      onClose();
    } catch (error) {
      console.error('Boost failed:', error);
      toast.error('Failed to boost board', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Zap className="h-5 w-5 text-purple-600" />
            Boost Your Board
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Board Info */}
          <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{board.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {board.gameInfo}
                  </p>
                  {board.isVipOnly && (
                    <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                      <Crown className="h-3 w-3 mr-1" />
                      VIP Only
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Game Date</p>
                  <p className="font-medium">
                    {board.gameDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boost Options */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Select Boost Duration
            </Label>
            <RadioGroup
              value={selectedDuration}
              onValueChange={setSelectedDuration}
              className="space-y-2"
            >
              {boostOptions.map((option) => (
                <div key={option.days}>
                  <RadioGroupItem
                    value={option.days}
                    id={`boost-${option.days}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`boost-${option.days}`}
                    className={`flex cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-900 ${
                      selectedDuration === option.days
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                        : 'border-gray-200 dark:border-gray-800'
                    } ${option.recommended ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">
                              {option.label}
                            </span>
                            {option.recommended && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Star className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">
                            {option.cost} SOL
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ≈ ${(option.cost * 55).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-1 mt-3">
                        {option.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>How Board Boost Works</AlertTitle>
            <AlertDescription className="mt-1">
              Boosted boards appear at the top of discovery feeds and search
              results. The algorithm considers CBL reputation, board fill rate,
              and community engagement for optimal placement.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">
              Boost starts immediately upon confirmation
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBoost}
              disabled={isProcessing || !connected}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Boost for {selectedOption?.cost} SOL
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
