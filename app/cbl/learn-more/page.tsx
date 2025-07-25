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
import { DollarSign, Palette, Star, Trophy, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Lead the Lounge – Become a CBL | Football Squares',
  description:
    'Turn your friend group into a stadium full of excitement. Learn how to become a Community Board Leader and start earning revenue.',
};

const LearnMorePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Lead the Lounge – Become a CBL
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Turn your friend group into a stadium full of excitement.
          </p>
        </div>

        {/* What You'll Get */}
        <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              What You&apos;ll Get
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Revenue
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    3% commission once you fill 3 boards in 7 days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Palette className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Creative Control
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Price squares ($7–$100), set payouts, theme your board.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Blue Points
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Earn loyalty points toward our upcoming token air drop.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    NFT Commissions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    30% share on any commemorative NFTs minted via your boards.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Qualify */}
        <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              How to Qualify
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Register & pay the $9.99 season fee.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Pass a short rules quiz with Offensive Coordinator Phil
                  (OC-Phil).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill 3 full boards (each $7+ squares) within any rolling 7 day
                  window.
                </p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Congrats – Phil upgrades you to Season Earner and 3% kicks in
                for the rest of the season!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Season Milestones & Tiers */}
        <Card className="mb-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              Season Milestones & Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Level
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Requirement
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Rewards
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    First Stream CBL
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Register • pass quick rules quiz
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Skins • custom rules • dashboard
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    Drive Maker CBL
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    Fill **3 boards in any 7‑day window** (each $7+ squares)
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    3% rake share • Blue‑Point accrual • higher price caps
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    Franchise CBL
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    50 filled boards in season **OR** 4&#8239;000 squares sold
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    1.5× Blue Points • merch • Hall of Fame
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ready to Start */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold mb-4">
              Become a CBL – $9.99
            </Button>
            <p className="text-blue-100">
              Questions? Ping OC Phil inside your account dashboard.
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            CBL status lasts for the current NFL season. Blue points last
            forever.
          </p>
          <p>
            <strong>Refundable milestones:</strong> fill 9 boards • 9 NFT mints
            • 1 Super Bowl board @ $50+, whichever comes first.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;
