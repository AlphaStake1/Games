'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InfoTooltip from '@/components/InfoTooltip';
import {
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Calculator,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Crown,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const CBLEconomicsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pricingTiers = [
    {
      price: '$1-$4',
      blueForCBL: '0',
      blueForPlayers: 'up to 100',
      rakeEligible: false,
    },
    {
      price: '$5-$6',
      blueForCBL: '0',
      blueForPlayers: 'up to 150',
      rakeEligible: false,
    },
    {
      price: '$7-$9',
      blueForCBL: 'up to 225',
      blueForPlayers: 'up to 150',
      rakeEligible: true,
    },
    {
      price: '$10-$19',
      blueForCBL: 'up to 300',
      blueForPlayers: 'up to 200',
      rakeEligible: true,
    },
    {
      price: '$20-$49',
      blueForCBL: 'up to 600',
      blueForPlayers: 'up to 400',
      rakeEligible: true,
    },
    {
      price: '$50+',
      blueForCBL: '9,000+',
      blueForPlayers: '6,000+',
      rakeEligible: true,
      vipOnly: true,
    },
  ];

  const orangePointActivities = [
    {
      activity: 'Board reaches 95% fill',
      points: '50',
      frequency: 'Per board',
      requirement: 'Any price tier',
    },
    {
      activity: 'Perfect retention bonus',
      points: '100',
      frequency: 'Per 4-week period',
      requirement: '95% fill rate for 4 consecutive weeks',
    },
    {
      activity: 'Referral signup',
      points: '20',
      frequency: 'Unlimited',
      requirement: 'New wallet connection through your link',
    },
    {
      activity: 'Referral first play',
      points: '50',
      frequency: 'Per referral',
      requirement: 'Referred player makes first paid play',
    },
  ];

  const exampleScenarios = [
    {
      scenario: 'Budget CBL',
      boardPrice: '$5',
      boardsFilled: '2 per week',
      avgFillRate: '85%',
      calculation:
        'Players earn up to 750 Blue (5 squares × 150), CBL earns 0 Blue + occasional Orange',
      monthlyBlue: '0',
      monthlyOrange: '~100',
      monthlyRake: '$0',
    },
    {
      scenario: 'Entry-Level CBL',
      boardPrice: '$10',
      boardsFilled: '3 per week',
      avgFillRate: '95%',
      calculation:
        'Player max: 5 squares × 200 = 1,000 points. CBL: 1,000 × 1.5 = 1,500 per board × 3 boards = 4,500 Blue + 150 Orange',
      monthlyBlue: '~18,000',
      monthlyOrange: '~600',
      monthlyRake: '3% of filled boards',
    },
    {
      scenario: 'Premium CBL',
      boardPrice: '$50',
      boardsFilled: '2 per week',
      avgFillRate: '98%',
      calculation:
        'Player max: 10 squares × 600 = 6,000 points. CBL: 6,000 × 1.5 = 9,000 per board × 2 boards = 18,000 Blue + 400 Orange',
      monthlyBlue: '~72,000',
      monthlyOrange: '~1,600',
      monthlyRake: '3% of $10,000+ monthly volume',
    },
  ];

  const strategicTips = [
    {
      title: 'Price for Points',
      description:
        'Price boards at $7+ to earn Blue Points. Sub-$7 boards earn 0 Blue Points for CBLs.',
      icon: Target,
      priority: 'Critical',
    },
    {
      title: 'Consistency Pays',
      description:
        'Maintain 95%+ fill rates for 4 consecutive weeks to earn the 100 Orange Point retention bonus.',
      icon: TrendingUp,
      priority: 'High',
    },
    {
      title: 'NFT Strategy',
      description:
        "Promote NFT mints (the unique stamp mark representing each player's square) to players for 30% commission earnings. Focus on driving NFT creation and sales.",
      icon: Crown,
      priority: 'High',
    },
    {
      title: 'Player Engagement',
      description:
        'Keep players excited and engaged! Create fun themes, celebrate wins, and build a community atmosphere that keeps players coming back.',
      icon: Zap,
      priority: 'High',
    },
    {
      title: 'Volume Strategy',
      description:
        'Each additional board filled in the same week earns +500 Blue Points bonus.',
      icon: BarChart3,
      priority: 'Medium',
    },
    {
      title: 'Community Building',
      description:
        'Focus on referrals and social engagement for steady Orange Point income.',
      icon: Users,
      priority: 'Medium',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              CBL Economics
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete guide to Community Board Leader point earnings, pricing
            strategies, and revenue optimization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Points</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Blue Points Card */}
              <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Target className="h-6 w-6" />
                    Blue Points (CBL)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        $7+ boards only
                      </span>
                      <Badge className="bg-blue-600">Required</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        95% fill rate
                      </span>
                      <Badge className="bg-blue-600">Required</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        CBL multiplier vs Players
                      </span>
                      <Badge className="bg-blue-600">1.5×</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Multi-board bonus
                      </span>
                      <Badge className="bg-blue-600">+500</Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900/30 rounded border-l-2 border-blue-500">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">
                      CBL Multiplier Explained:
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      When a CBL fills their board, they earn 1.5× the Blue
                      Points that a single Player could earn at maximum
                      participation on that board (5 squares for non-VIP, 10
                      squares for VIP boards). This fairly rewards board
                      creators relative to individual player earning potential.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Orange Points Card */}
              <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <Users className="h-6 w-6" />
                    Orange Points (CBL)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        95% fill
                      </span>
                      <Badge className="bg-orange-600">50 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        4-week retention
                      </span>
                      <Badge className="bg-orange-600">100 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Referral signup
                      </span>
                      <Badge className="bg-orange-600">20 pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Referral play
                      </span>
                      <Badge className="bg-orange-600">50 pts</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-4">
                    Earned on all boards regardless of price tier
                  </p>
                </CardContent>
              </Card>

              {/* Rake Revenue Card */}
              <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <DollarSign className="h-6 w-6" />
                    Rake Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Drive Maker CBL
                      </span>
                      <Badge className="bg-green-600">3%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Franchise CBL
                      </span>
                      <Badge variant="outline">TBD</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm dark:text-gray-300">
                        Minimum price
                      </span>
                      <Badge className="bg-green-600">$7</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-4">
                    Rake only applies to boards priced $7+ per square
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Rules */}
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="h-6 w-6" />
                  Critical CBL Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold dark:text-gray-200">
                      Blue Point Requirements
                    </h4>
                    <ul className="space-y-2 text-sm dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        Board must be priced $7+ per square
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        Must reach 95% fill rate (95+ squares)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-red-600" />
                        CBL earns 1.5× the max points a single Player can earn
                        on that board
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold dark:text-gray-200">
                      Important Notes
                    </h4>
                    <ul className="space-y-2 text-sm dark:text-gray-300">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Sub-$7 boards: CBL earns 0 Blue Points
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Players still earn points on sub-$7 CBL boards
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Orange Points earned on all boards (any price)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Points Tab */}
          <TabsContent value="pricing" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-green-600" />
                  CBL Point Earning by Price Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Board Price</TableHead>
                      <TableHead>CBL Blue Points</TableHead>
                      <TableHead>Player Blue Points</TableHead>
                      <TableHead>Rake Eligible</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingTiers.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {tier.price}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tier.blueForCBL === '0'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={
                              tier.blueForCBL === '0'
                                ? ''
                                : 'bg-blue-100 text-blue-800'
                            }
                          >
                            {tier.blueForCBL}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {tier.blueForPlayers}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tier.rakeEligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                          {tier.vipOnly && (
                            <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                              VIP Only
                            </Badge>
                          )}
                          {tier.blueForCBL === '0' && 'No Blue Points for CBL'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orange Point Activities (CBL-Specific)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Requirement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orangePointActivities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {activity.activity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800"
                          >
                            {activity.points} points
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {activity.frequency}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.requirement}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50/50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">
                  VIP Player Benefits & Board Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 mb-4">
                  VIP members get enhanced benefits and flexible board access
                  options.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">VIP Benefits</h4>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>• Up to 10 squares (vs 5 for non-VIP)</li>
                      <li>• 5% bonus on House board winnings</li>
                      <li>• 3% bonus on CBL board winnings</li>
                      <li>• Access to exclusive $100+ House boards</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">CBL Board Options</h4>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>• Can create mixed or VIP-only boards</li>
                      <li>• $50+ boards with enhanced rake structure</li>
                      <li>• Flexible community targeting</li>
                      <li>• Premium positioning opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-8">
            <div className="grid gap-8">
              {exampleScenarios.map((scenario, index) => (
                <Card key={index} className="border-l-4 border-l-green-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                      {scenario.scenario}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold dark:text-gray-200">
                          Scenario Details
                        </h4>
                        <div className="space-y-2 text-sm dark:text-gray-300">
                          <div className="flex justify-between">
                            <span>Board Price:</span>
                            <span className="font-semibold">
                              {scenario.boardPrice}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Boards Filled:</span>
                            <span className="font-semibold">
                              {scenario.boardsFilled}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Avg Fill Rate:</span>
                            <span className="font-semibold">
                              {scenario.avgFillRate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold dark:text-gray-200">
                          Monthly Earnings
                        </h4>
                        <div className="space-y-2 text-sm dark:text-gray-300">
                          <div className="flex justify-between">
                            <span className="text-blue-600 dark:text-blue-400">
                              Blue Points:
                            </span>
                            <span className="font-semibold">
                              {scenario.monthlyBlue}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-orange-600 dark:text-orange-400">
                              Orange Points:
                            </span>
                            <span className="font-semibold">
                              {scenario.monthlyOrange}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600 dark:text-green-400">
                              Rake Revenue:
                            </span>
                            <span className="font-semibold">
                              {scenario.monthlyRake}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h5 className="font-semibold text-sm mb-1 dark:text-gray-200">
                        Calculation:
                      </h5>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {scenario.calculation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50/50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Point Calculation Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      CBL Blue Points (per board)
                    </h4>
                    <code className="text-sm dark:text-gray-200">
                      CBL Points = (Max Player Points × 1.5) + Multi-board Bonus
                    </code>
                    <p className="text-xs mt-2 text-blue-700 dark:text-blue-300">
                      <strong>Non-VIP Example:</strong> $10 board, Player max =
                      5 squares × 200 points = 1,000 points. CBL earns 1,000 ×
                      1.5 = 1,500 Blue Points
                      <br />
                      <strong>VIP Example:</strong> $50 board, Player max = 10
                      squares × 600 points = 6,000 points. CBL earns 6,000 × 1.5
                      = 9,000 Blue Points
                    </p>
                  </div>
                  <div className="p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      CBL Orange Points
                    </h4>
                    <code className="text-sm dark:text-gray-200">
                      50 points per 95% filled board + 100 points per 4-week
                      retention period
                    </code>
                  </div>
                  <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      Multi-board Bonus
                    </h4>
                    <code className="text-sm dark:text-gray-200">
                      +500 Blue Points for each additional board filled in the
                      same week
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {strategicTips.map((tip, index) => (
                <Card key={index} className="border-l-4 border-l-purple-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tip.icon className="h-6 w-6 text-purple-600" />
                      {tip.title}
                      <Badge
                        variant={
                          tip.priority === 'Critical'
                            ? 'destructive'
                            : tip.priority === 'High'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {tip.priority}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-600 dark:text-green-400">
                      Pricing Strategy
                    </h4>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                      <li>• Start at $10 for good Blue Point earnings</li>
                      <li>• Test $20-$25 for higher rewards</li>
                      <li>• Consider VIP-only $50+ for premium positioning</li>
                      <li>• Avoid sub-$7 pricing unless for charity/promo</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">
                      Volume Strategy
                    </h4>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                      <li>• Aim for 2-3 boards per week minimum</li>
                      <li>• Time board releases for maximum participation</li>
                      <li>• Build consistent community engagement</li>
                      <li>• Focus on 95%+ fill rates over volume</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">
                      NFT & Revenue
                    </h4>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                      <li>• Promote NFT mints for 30% commission</li>
                      <li>
                        • Goal: 9 NFT mints recovers your $9.99 initiation fee
                      </li>
                      <li>• Drive NFT creation and customization</li>
                      <li>• Encourage player artistic expression</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400">
                      Player Engagement
                    </h4>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                      <li>• Create fun board themes and narratives</li>
                      <li>• Celebrate wins and build excitement</li>
                      <li>• Host contests and bonus events</li>
                      <li>• Maintain active community chat</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200">
                  Advanced CBL Tactics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg dark:border-gray-600">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      Franchise CBL Path
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Achieve consistent performance to unlock Franchise CBL
                      status with additional benefits.
                    </p>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>• Enhanced rake: 5% on $50+ premium boards</li>
                      <li>• House takes 3%, you keep 5% (vs 3% standard)</li>
                      <li>• Exclusive board features</li>
                      <li>• Premium community access</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-gray-600">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      NFT Monetization Strategy
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Maximize revenue through strategic NFT promotion and VIP
                      experiences.
                    </p>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>• Earn 30% commission on every NFT mint</li>
                      <li>• Encourage custom NFT creation and artwork</li>
                      <li>• Promote NFT personalization and uniqueness</li>
                      <li>• Build community around player creativity</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-gray-600">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      Fun & Engagement Mastery
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Keep players excited and coming back with creative
                      engagement tactics.
                    </p>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>
                        • Create themed boards (holidays, rivalries, memes)
                      </li>
                      <li>• Celebrate big wins with community shoutouts</li>
                      <li>• Run mini-contests and bonus square events</li>
                      <li>• Share behind-the-scenes stories and insights</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg dark:border-gray-600">
                    <h4 className="font-semibold mb-2 dark:text-gray-200">
                      Seasonal Planning
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Plan your CBL strategy across the full 18-week NFL season.
                    </p>
                    <ul className="text-sm space-y-1 dark:text-gray-300">
                      <li>• Higher engagement during playoff weeks</li>
                      <li>
                        • Build momentum through consistent weekly presence
                      </li>
                      <li>• Leverage rivalry games for premium pricing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Become a CBL?
              </h2>
              <p className="text-green-100 mb-6">
                Start earning Blue and Orange Points while building your
                community and generating rake revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cbl/apply">
                  <Button className="bg-white text-green-600 hover:bg-gray-100">
                    Apply for CBL Status
                  </Button>
                </Link>
                <Link href="/rewards">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    View Full Rewards System{' '}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CBLEconomicsPage;
