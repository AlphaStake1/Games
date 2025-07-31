'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Star,
  Trophy,
  Target,
  ArrowRight,
  Wallet,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

// Mock CBL data - these will be populated by actual CBLs
const cblProfiles = [
  {
    id: 'ocphil_community',
    name: "OC Phil's Elite Squad",
    handle: '@ocphil',
    theme: 'High-Performance Sports Analytics',
    culture: 'Data-driven champions who love deep analysis and strategic play',
    primaryTeams: ['Los Angeles Chargers', 'UCLA Bruins'],
    specialties: [
      'Advanced Analytics',
      'Betting Strategies',
      'Weekly Predictions',
    ],
    memberCount: 847,
    avgWinRate: '68%',
    description:
      'Join the most analytical community in squares! We dive deep into stats, trends, and winning strategies. Perfect for players who want to elevate their game with data-driven insights.',
    perks: [
      'Exclusive weekly prediction sheets',
      'Advanced stats dashboard access',
      'Private Discord analytics channel',
      'Monthly strategy webinars',
    ],
    testimonial:
      "OC Phil's community transformed how I approach squares. The analytics are game-changing!",
    referralCode: 'OCPHIL2025',
    avatar: '/avatars/ocphil.jpg',
    bannerColor: 'from-blue-600 to-purple-600',
  },
  {
    id: 'coachb_community',
    name: "Coach B's Winners Circle",
    handle: '@coachb',
    theme: 'Supportive Mentorship & Community',
    culture: 'Welcoming environment focused on learning and mutual support',
    primaryTeams: ['Green Bay Packers', 'Wisconsin Badgers'],
    specialties: [
      'Player Development',
      'Community Building',
      'Beginner Support',
    ],
    memberCount: 623,
    avgWinRate: '64%',
    description:
      'A supportive community where every player matters. Coach B focuses on helping you grow as a player while building lasting friendships. Great for both beginners and experienced players.',
    perks: [
      'Personal mentorship opportunities',
      '24/7 community support chat',
      'New player orientation program',
      'Monthly community challenges',
    ],
    testimonial:
      'Coach B made me feel welcome from day one. This community is like family!',
    referralCode: 'COACHB2025',
    avatar: '/avatars/coachb.jpg',
    bannerColor: 'from-green-600 to-emerald-600',
  },
  {
    id: 'jerry_community',
    name: "Jerry's High Rollers",
    handle: '@jerrysquares',
    theme: 'Luxury Gaming & Premium Experiences',
    culture:
      'Exclusive community for serious players who play big and win bigger',
    primaryTeams: ['Dallas Cowboys', 'Texas Longhorns'],
    specialties: ['High Stakes Games', 'VIP Experiences', 'Luxury Rewards'],
    memberCount: 312,
    avgWinRate: '71%',
    description:
      "For players who demand the best. Jerry's community offers premium experiences, exclusive high-stakes boards, and luxury perks. Minimum buy-ins apply.",
    perks: [
      'Access to $500+ entry boards',
      'Luxury prize upgrades',
      'VIP customer support',
      'Exclusive event invitations',
    ],
    testimonial:
      "Jerry's community is where champions play. The rewards are incredible!",
    referralCode: 'JERRY2025',
    avatar: '/avatars/jerry.jpg',
    bannerColor: 'from-yellow-600 to-orange-600',
  },
  {
    id: 'morgan_community',
    name: "Morgan's Social Squad",
    handle: '@morgansocial',
    theme: 'Social Gaming & Fun-First Approach',
    culture:
      'Vibrant community focused on fun, friendship, and social experiences',
    primaryTeams: ['Miami Dolphins', 'University of Miami'],
    specialties: ['Social Events', 'Group Play', 'Community Challenges'],
    memberCount: 1024,
    avgWinRate: '62%',
    description:
      'The most social community in squares! Morgan creates an atmosphere where gaming meets friendship. Regular social events, group challenges, and tons of fun.',
    perks: [
      'Weekly social gaming events',
      'Group discount opportunities',
      'Community leaderboards',
      'Social media exclusive content',
    ],
    testimonial:
      "Morgan's community made squares so much more fun. I've made great friends here!",
    referralCode: 'MORGAN2025',
    avatar: '/avatars/morgan.jpg',
    bannerColor: 'from-pink-600 to-rose-600',
  },
];

interface TransferConfirmationProps {
  cbl: (typeof cblProfiles)[0];
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const TransferConfirmation: React.FC<TransferConfirmationProps> = ({
  cbl,
  onConfirm,
  onCancel,
  isProcessing,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Confirm Community Transfer
        </CardTitle>
        <CardDescription>
          You're about to join {cbl.name}. This action requires wallet
          signature.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">What happens next:</h4>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>
              • Your referral code will be updated to:{' '}
              <code className="bg-blue-200 px-1 rounded">
                {cbl.referralCode}
              </code>
            </li>
            <li>• Future NFT minting commissions (30%) go to {cbl.name}</li>
            <li>• No bonus points awarded (transfers only)</li>
            <li>• You'll gain access to {cbl.name}'s exclusive perks</li>
          </ul>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This transfer doesn't include bonus referral
            points - those are reserved for new player signups only.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isProcessing} className="flex-1">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Sign & Transfer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default function CommunityTransferPage() {
  const { user, isLoading } = useAuth('PLAYER_ROLE');
  const [selectedCBL, setSelectedCBL] = useState<
    (typeof cblProfiles)[0] | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);

  const handleTransferRequest = (cbl: (typeof cblProfiles)[0]) => {
    setSelectedCBL(cbl);
  };

  const handleConfirmTransfer = async () => {
    if (!selectedCBL) return;

    setIsProcessing(true);

    try {
      // Simulate wallet signature and transfer process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would:
      // 1. Request wallet signature
      // 2. Update player's referral code in database
      // 3. Set transfer_player flag to true
      // 4. Send confirmation notifications

      console.log(`Transfer to ${selectedCBL.name} completed`);
      setTransferComplete(true);
      setSelectedCBL(null);
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelTransfer = () => {
    setSelectedCBL(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (transferComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-900">Transfer Complete!</CardTitle>
            <CardDescription>
              You've successfully joined your new community. Welcome aboard!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => (window.location.href = '/player/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Perfect Community
            </h1>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover communities that match your playing style and interests.
              Each CBL offers unique perks, culture, and opportunities.
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <p className="text-sm text-blue-800">
                <strong>Exclusive Access:</strong> This page is only available
                through Coach B's recommendation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CBL Profiles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {cblProfiles.map((cbl) => (
            <Card
              key={cbl.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Banner */}
              <div
                className={`h-24 bg-gradient-to-r ${cbl.bannerColor} relative`}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{cbl.name}</h3>
                    <p className="text-white/90 text-sm">{cbl.handle}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    {cbl.memberCount} members
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Trophy className="h-3 w-3" />
                    {cbl.avgWinRate} avg win
                  </Badge>
                </div>

                {/* Theme & Culture */}
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      Theme
                    </h4>
                    <p className="text-sm text-gray-600">{cbl.theme}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      Culture
                    </h4>
                    <p className="text-sm text-gray-600">{cbl.culture}</p>
                  </div>
                </div>

                {/* Primary Teams */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Primary Teams
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cbl.primaryTeams.map((team) => (
                      <Badge key={team} variant="outline" className="text-xs">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">{cbl.description}</p>

                {/* Perks */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Member Perks
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {cbl.perks.slice(0, 3).map((perk, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {perk}
                      </li>
                    ))}
                    {cbl.perks.length > 3 && (
                      <li className="text-gray-400 italic">
                        +{cbl.perks.length - 3} more perks
                      </li>
                    )}
                  </ul>
                </div>

                {/* Testimonial */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-600 italic">
                    "{cbl.testimonial}"
                  </p>
                </div>

                {/* Referral Code Preview */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-blue-800">
                    <strong>Your new referral code:</strong>{' '}
                    <code className="bg-blue-200 px-1 rounded">
                      {cbl.referralCode}
                    </code>
                  </p>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6">
                <Button
                  onClick={() => handleTransferRequest(cbl)}
                  className="w-full"
                  variant="default"
                >
                  Join This Community
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How Community Transfers Work
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                1. Choose Your Community
              </h4>
              <p>
                Browse through CBL profiles and find the community that matches
                your style and interests.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                2. Wallet Signature
              </h4>
              <p>
                Sign with your wallet to confirm the transfer. Your referral
                code will be updated automatically.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                3. Enjoy New Perks
              </h4>
              <p>
                Access your new community's exclusive features, support, and
                member benefits immediately.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">
              Important Notes
            </h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>
                • Future NFT minting commissions (30%) will go to your new CBL
              </li>
              <li>
                • No bonus referral points are awarded for transfers (only for
                new player referrals)
              </li>
              <li>• Transfers are permanent - choose carefully</li>
              <li>
                • You'll lose access to your previous community's exclusive
                perks
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transfer Confirmation Modal */}
      {selectedCBL && (
        <TransferConfirmation
          cbl={selectedCBL}
          onConfirm={handleConfirmTransfer}
          onCancel={handleCancelTransfer}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
