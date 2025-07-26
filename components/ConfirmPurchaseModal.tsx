'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Loader2,
  Wallet,
  Info,
} from 'lucide-react';

interface ConferenceQuote {
  slug: string;
  name: string;
  price: number;
  passesSold: number;
  seatsLeft: number;
  tier: number;
  gasEstimate: number;
  priceUSD: number;
}

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: ConferenceQuote | null;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
  walletConnected: boolean;
  onConnectWallet: () => Promise<void>;
}

const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({
  isOpen,
  onClose,
  quote,
  onConfirm,
  isProcessing,
  walletConnected,
  onConnectWallet,
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  if (!quote) return null;

  const getTierColor = (tier: number) => {
    const colors = {
      1: 'bg-green-600',
      2: 'bg-blue-600',
      3: 'bg-purple-600',
      4: 'bg-orange-600',
      5: 'bg-yellow-600',
    };
    return colors[tier as keyof typeof colors] || 'bg-gray-600';
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await onConnectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConfirm = async () => {
    if (!walletConnected) {
      await handleConnectWallet();
      return;
    }

    if (!acceptTerms) return;
    await onConfirm();
  };

  const canProceed = walletConnected && acceptTerms && !isProcessing;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${getTierColor(quote.tier)}`} />
            Purchase {quote.name} Season Pass
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Price Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Season Pass</span>
              <div className="text-right">
                <div className="font-bold">${quote.price}</div>
                <div className="text-xs text-gray-500">
                  ≈ {(quote.price / 100).toFixed(3)} SOL
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-sm">
              <span>Network Fee (est.)</span>
              <span>≈ ${quote.gasEstimate.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${(quote.price + quote.gasEstimate).toFixed(2)}</span>
            </div>
          </div>

          {/* Conference Info */}
          <div className="flex justify-between text-sm">
            <span>Passes Available:</span>
            <span className="font-medium">
              {quote.seatsLeft} of 100 remaining
            </span>
          </div>

          {/* Urgency Alert */}
          {quote.seatsLeft <= 10 && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Only {quote.seatsLeft} passes left! Secure your spot now.
              </AlertDescription>
            </Alert>
          )}

          {/* Wallet Connection */}
          {!walletConnected && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Wallet Required</span>
              </div>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full"
                variant="outline"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                disabled={!walletConnected}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I understand that:
                <ul className="mt-1 ml-4 space-y-1 list-disc text-xs text-gray-600 dark:text-gray-400">
                  <li>
                    Square positions are randomly shuffled before each game
                  </li>
                  <li>Row/column digits are drawn via provably-fair VRF</li>
                  <li>
                    Refunds are only available if the conference doesn't fill
                  </li>
                  <li>Season passes are non-transferable NFTs</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!canProceed}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !walletConnected ? (
                'Connect & Pay'
              ) : (
                'Confirm & Pay'
              )}
            </Button>
          </div>

          {/* Help Link */}
          <div className="text-center">
            <a
              href="/wallet-guide"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Info className="w-3 h-3" />
              Need help with wallets?
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPurchaseModal;
