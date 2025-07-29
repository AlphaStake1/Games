'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle, DollarSign, Users, Trophy, Star } from 'lucide-react';

const BoardLeaderContent = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Community Board Leaders (CBLs)
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Lead the ultimate sports lounge for your friends and fans. Host
          Football Squares boards, control the rules, and earn rewards all
          season.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = '/cbl/apply')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
          >
            🚀 Ready to Apply – $9.99
          </Button>
          <Button
            onClick={() => (window.location.href = '/cbl/overview')}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 text-lg"
          >
            ← Back to Overview
          </Button>
        </div>
      </div>

      {/* Program Overview */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Earn 3% Revenue
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Unlock a 3% commission on every fully sold board once you qualify
              (see milestones below).
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              NFT Commissions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Earn 30% of all NFTs minted on your boards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Build Community
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create the ultimate sports lounge with custom pricing, themes, and
              house rules.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requirements & Pricing */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-500" />
            CBL Requirements & Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Requirements
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Be a verified user on the platform
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Pay one-time $9.99 origination fee (refundable via
                    milestones)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Create at least one board weekly to maintain active status
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Commit to hosting community boards for the current NFL
                    season
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Customize boards with your design
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    30% commission on NFT mints from your boards
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    CBL badge and recognition in the community
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CBL Levels & Season Milestones */}
      <div className="mb-12">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="px-6 py-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              CBL Levels & Season Milestones
            </h3>
          </div>
          <div className="px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Tier
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    How to Reach
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Active Perks
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <strong>First Stream CBL</strong>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Register + pass quick rules quiz
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Board skins, custom rules, dashboard • Blue Point accrual
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <strong>Drive Maker CBL</strong>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Fill <strong>3 boards in any 7 day window</strong> (each $7+
                    squares)
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    3% rake share • Enhanced Blue Point rate • $9.99 fee refund
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    <strong>Franchise CBL</strong>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    50 filled boards in season <strong>OR</strong> 4,000 squares
                    sold
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    3% rake + 1.5× Blue Point multiplier over Drive Maker rate •
                    merch • Orange Point accrual per board
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Board Limits & Pricing */}
      <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Board Limits & Pricing Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-white">
                  CBL Level
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Regular‑Season Price Cap
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Playoffs Cap
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Super Bowl Cap
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Rewards
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  First Stream CBL
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $1 – $100
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  up to $200
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $300
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  Skins • dashboard
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  Drive Maker CBL
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $1 – $250
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  up to $400
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $500
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  3 % rake • Blue‑Points
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  Franchise CBL
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $1 – $500
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  up to $1 000
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  No limit
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  1.5× Blue‑Points • merch
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* How to Earn Back Fee */}
      <Card className="mb-12 bg-black border border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            💰 How to Earn Back Your $9.99 Fee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-2">🏈</div>
              <h3 className="font-semibold mb-2">Become Drive Maker</h3>
              <p className="text-sm text-gray-400">
                Fill 3 boards ($7+ squares) in any 7-day window
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-2">⚏</div>
              <h3 className="font-semibold mb-2">Or Fill 14 Boards</h3>
              <p className="text-sm text-gray-400">
                Successfully fill 14 boards below $7 per square
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-2">📣</div>
              <h3 className="font-semibold mb-2">Or 9 NFT Mints</h3>
              <p className="text-sm text-gray-400">
                Facilitate 9 NFT mints on your boards
              </p>
            </div>
          </div>
          <p className="text-center mt-6 text-sm text-gray-400">
            Whichever milestone comes first will refund your origination fee!
          </p>
        </CardContent>
      </Card>

      {/* Activity & Commission Model */}
      <Card className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">
            ⚡ Activity & Commission Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                Staying Active
              </h3>
              <ul className="space-y-2 text-blue-900 dark:text-blue-100">
                <li>• Create at least one board each week</li>
                <li>• Grace period until Tuesday after Sunday games</li>
                <li>• Miss 3 Sundays in a row = Inactive status</li>
                <li>• Reactivate anytime by creating a filled board</li>
                <li>• Notifications sent before status changes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                Commission Structure
              </h3>
              <ul className="space-y-2 text-blue-900 dark:text-blue-100">
                <li>
                  • <strong>3% rake</strong>: From boards you create
                </li>
                <li>
                  • <strong>30% NFT commission</strong>: From players you
                  recruit (when active)
                </li>
                <li>
                  • <strong>Blue/Orange Points</strong>: Earned per board
                  created
                </li>
                <li>• All commissions pause when inactive</li>
                <li>• Players can always access House boards</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>💡 Pro Tip:</strong> Use the dashboard scheduling feature
              to auto-release your weekly boards at consistent times. Your
              community will appreciate the reliability!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CBL Rules & Guidelines */}
      <Card className="mb-12 bg-white dark:bg-[#002244] border-[#e5e7eb] dark:border-[#708090] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-[#002244] dark:text-white">
            📋 CBL Rules & Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#002244] dark:text-white">
                Community Standards
              </h3>
              <ul className="space-y-2 text-[#708090] dark:text-[#96abdc]">
                <li>
                  • Maintain respectful and inclusive community environment
                </li>
                <li>• Respond to community questions within 24 hours</li>
                <li>• Follow all platform terms of service</li>
                <li>• Promote fair play and transparency</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#002244] dark:text-white">
                Board Management
              </h3>
              <ul className="space-y-2 text-[#708090] dark:text-[#96abdc]">
                <li>
                  • Set clear board rules and communicate them effectively
                </li>
                <li>
                  • Ensure boards are properly marketed to fill completely
                </li>
                <li>
                  • Handle disputes fairly and according to platform guidelines
                </li>
                <li>• Maintain accurate records of all board activities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="mb-12 bg-[#faf9f5] dark:bg-[#444341] border-[#e5e7eb] dark:border-[#708090]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#002244] dark:text-white text-center">
            🌟 CBL Success Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#ed5925] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                JM
              </div>
              <h4 className="font-semibold text-[#002244] dark:text-white mb-2">
                John M.
              </h4>
              <p className="text-sm text-[#708090] dark:text-[#96abdc] mb-2">
                "Earned over $2,500 in my first season as a CBL. The community
                love the custom boards!"
              </p>
              <div className="text-xs text-[#ed5925] font-medium">
                45 Boards Hosted
              </div>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#96abdc] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                SK
              </div>
              <h4 className="font-semibold text-[#002244] dark:text-white mb-2">
                Sarah K.
              </h4>
              <p className="text-sm text-[#708090] dark:text-[#96abdc] mb-2">
                "Built a community of 200+ regular players. NFT commissions are
                amazing!"
              </p>
              <div className="text-xs text-[#ed5925] font-medium">
                78 NFT Mints
              </div>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-[#004953] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                RL
              </div>
              <h4 className="font-semibold text-[#002244] dark:text-white mb-2">
                Robert L.
              </h4>
              <p className="text-sm text-[#708090] dark:text-[#96abdc] mb-2">
                "Paid back my fee in the first month. Now it&apos;s pure profit
                every week!"
              </p>
              <div className="text-xs text-[#ed5925] font-medium">
                12 Weeks Active
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-[#002244] to-[#004953] rounded-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Become a Community Board Leader?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Start earning revenue from your own Football Squares community today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => (window.location.href = '/cbl/apply')}
            className="bg-[#ed5925] hover:bg-[#d14513] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
          >
            🚀 Apply Now – $9.99
          </Button>
          <Button
            onClick={() => (window.location.href = '/cbl/overview')}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#002244] px-8 py-3 text-lg"
          >
            ← Back to Overview
          </Button>
        </div>
        <p className="text-sm mt-4 opacity-75">
          * CBL status lasts for the current NFL season. Fee is refundable via
          achievement milestones.
        </p>
      </div>
    </div>
  );
};

export default BoardLeaderContent;
