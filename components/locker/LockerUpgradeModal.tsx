'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Crown,
  Star,
  Award,
  Sparkles,
  CheckCircle,
  X,
  Zap,
  Music,
  Palette,
  Eye,
} from 'lucide-react';

interface LockerUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle: string;
  onUpgrade: (style: string) => void;
}

const LOCKER_TIERS = [
  {
    id: 'rookie',
    name: 'Rookie',
    price: 'Free',
    icon: Award,
    color: 'border-gray-400 bg-gray-50',
    features: [
      'Basic metal locker',
      'Standard nameplate',
      'Simple NFT display',
    ],
    description: 'The starter locker for new players',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$6',
    icon: Award,
    color: 'border-amber-500 bg-amber-50',
    features: [
      'Wood paneling interior',
      'Bronze nameplate',
      'Trophy shelf',
      'Stats display',
    ],
    description: 'Upgrade your style with premium materials',
  },
  {
    id: 'allstar',
    name: 'All-Star',
    price: '$10',
    icon: Star,
    color: 'border-blue-500 bg-blue-50',
    features: [
      'Premium materials',
      'LED accent lighting',
      'Animated nameplate',
      'Featured NFT spotlight',
    ],
    description: 'Stand out with lighting effects and animations',
  },
  {
    id: 'halloffame',
    name: 'Hall of Fame',
    price: '$14',
    icon: Crown,
    color: 'border-yellow-500 bg-yellow-50',
    features: [
      'Gold trim finish',
      'Shimmer effects',
      'Trophy case display',
      'Custom team colors',
      'Priority in discovery',
    ],
    description: 'Elite status with gold accents and premium placement',
  },
  {
    id: 'vip',
    name: 'VIP Legendary',
    price: '$21',
    icon: Crown,
    color: 'border-purple-500 bg-purple-50',
    features: [
      'Holographic effects',
      'Custom entrance animation',
      'Exclusive VIP badge',
      'Background music option',
      'Unlimited customization',
      'Top discovery placement',
    ],
    description: 'The ultimate locker experience with exclusive features',
    popular: true,
  },
];

export function LockerUpgradeModal({
  isOpen,
  onClose,
  currentStyle,
  onUpgrade,
}: LockerUpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (selectedTier && selectedTier !== currentStyle) {
      onUpgrade(selectedTier);
      onClose();
    }
  };

  const currentTierIndex = LOCKER_TIERS.findIndex(
    (tier) => tier.id === currentStyle,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">
                Upgrade Your Locker
              </CardTitle>
              <p className="text-gray-600">
                Choose your new locker style and unlock premium features
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {LOCKER_TIERS.map((tier, index) => (
              <Card
                key={tier.id}
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:shadow-lg relative',
                  tier.color,
                  selectedTier === tier.id
                    ? 'ring-2 ring-purple-500 shadow-xl'
                    : '',
                  index <= currentTierIndex ? 'opacity-50' : '',
                  tier.id === currentStyle ? 'ring-2 ring-green-500' : '',
                )}
                onClick={() =>
                  index > currentTierIndex && setSelectedTier(tier.id)
                }
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {tier.id === currentStyle && (
                  <div className="absolute -top-3 right-3">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      CURRENT
                    </div>
                  </div>
                )}

                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-md">
                      <tier.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {tier.price}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 text-left"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {index <= currentTierIndex ? (
                    <Button
                      disabled
                      className="w-full"
                      variant={tier.id === currentStyle ? 'default' : 'outline'}
                    >
                      {tier.id === currentStyle ? 'Current Locker' : 'Owned'}
                    </Button>
                  ) : (
                    <Button
                      variant={selectedTier === tier.id ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      {selectedTier === tier.id ? 'Selected' : 'Select'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upgrade Features Preview */}
          {selectedTier && (
            <Card className="bg-purple-50 border-purple-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center">
                  🎉 What You'll Get with Your Upgrade
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-8 h-8 text-purple-500" />
                    <span className="text-sm font-medium">Premium Styling</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium">
                      Better Discovery
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <span className="text-sm font-medium">Special Effects</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Palette className="w-8 h-8 text-green-500" />
                    <span className="text-sm font-medium">Customization</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={!selectedTier || selectedTier === currentStyle}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8"
            >
              {selectedTier
                ? `Upgrade to ${LOCKER_TIERS.find((t) => t.id === selectedTier)?.name}`
                : 'Select a Tier'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
