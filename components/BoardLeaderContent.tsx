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
          Join our exclusive Community Board Leader program and earn revenue
          from hosting your own Football Squares boards. Build your community,
          set your own rules, and profit from every game.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold transition-colors duration-200">
            Become a CBL - $9.99
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3 text-lg"
          >
            Learn More
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
              Get 3% of every fully-sold board you host, while 2% goes to the
              House
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
              Create your own football squares community with custom pricing and
              rules
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
                    3% revenue share on all fully-sold boards
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
                  Season Period
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Board Limit
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Price Range
                </TableHead>
                <TableHead className="text-gray-900 dark:text-white">
                  Special Rules
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  Regular Season
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  Unlimited weekly boards + Bye-Week boards
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $5–$100 per square
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  Full creative control
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  Playoffs
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  1 board per round
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $25 per square minimum
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  Higher stakes, limited slots
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  Super Bowl
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  1 board maximum
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  $50 per square minimum
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  Premium event pricing
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
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Fill 9 Boards</h3>
              <p className="text-sm text-gray-400">
                Successfully fill and complete 9 community boards
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-2">🖼️</div>
              <h3 className="font-semibold mb-2">9 NFT Mints</h3>
              <p className="text-sm text-gray-400">
                Facilitate 9 NFT mints on your boards
              </p>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-semibold mb-2">One $50+ SB Board</h3>
              <p className="text-sm text-gray-400">
                Fill one Super Bowl board at $50+ per square
              </p>
            </div>
          </div>
          <p className="text-center mt-6 text-sm text-gray-400">
            Whichever milestone comes first will refund your origination fee!
          </p>
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
                "Paid back my fee in the first month. Now it's pure profit every
                week!"
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
          <Button className="bg-[#ed5925] hover:bg-[#d14513] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200">
            Apply Now - $9.99
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#002244] px-8 py-3 text-lg"
          >
            Contact Support
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
