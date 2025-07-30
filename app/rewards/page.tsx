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
  Trophy,
  Star,
  Gift,
  Zap,
  Users,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

const RewardsSystemPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Handle URL parameters for direct tab navigation
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (
      tabParam &&
      ['overview', 'blue-points', 'orange-points', 'vip'].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  const bluePointTiers = [
    {
      tier: 'Free',
      price: 'Free boards',
      points: '100',
      vipOnly: false,
      limit: '3 boards/week',
    },
    { tier: '1', price: '$5', points: '150', vipOnly: false },
    { tier: '2', price: '$10', points: '200', vipOnly: false },
    { tier: '3', price: '$20', points: '400', vipOnly: false },
    { tier: '4', price: '$50', points: '600', vipOnly: false },
    { tier: '5', price: '$100', points: '1,000', vipOnly: true },
    { tier: '6', price: '$250', points: '1,500', vipOnly: true },
    { tier: '7', price: '$500+', points: '2,000', vipOnly: true },
  ];

  const orangePointActivities = [
    {
      activity: 'Referral signup',
      points: '20',
      frequency: 'Unlimited',
      description: 'Friend connects wallet',
    },
    {
      activity: 'Referral first play',
      points: '50',
      frequency: 'Per referral',
      description: 'Friend makes first paid play',
    },
    {
      activity: 'Social media share',
      points: '2',
      frequency: '1 per day',
      description: 'Share with proof required',
    },
    {
      activity: 'Weekly challenge',
      points: '25',
      frequency: '1 per week',
      description: 'Complete challenge goals',
    },
    {
      activity: 'Mint NFT',
      points: '50',
      frequency: 'Per mint',
      description: 'Mint premium NFTs',
    },
    {
      activity: '4-week consistency',
      points: '40',
      frequency: 'Per 4 weeks',
      description: '4 straight weeks of play',
    },
    {
      activity: 'VIP upgrade',
      points: '100',
      frequency: 'Once per season',
      description: 'Purchase VIP membership',
    },
    {
      activity: '4+ House boards/week',
      points: '40',
      frequency: '1 per week',
      description: 'Play multiple House boards',
    },
  ];

  const multipliers = [
    {
      name: 'VIP Status',
      effect: '1.5× all Blue Points',
      requirement: '$97 Season Pass',
    },
    {
      name: 'Extra Squares',
      effect: '+25% per additional square',
      requirement: 'Same board purchase',
    },
    {
      name: 'Weekly Activity',
      effect: '+500 Blue Points',
      requirement: '3+ boards in one week',
    },
    {
      name: 'Perfect Season',
      effect: '+5,000 Blue Points',
      requirement: 'Play every week (Week 18)',
    },
  ];

  const exampleEarnings = [
    {
      type: 'Free Player',
      activity: '2 free boards per week',
      bluePoints: '200',
      orangePoints: '0',
      description: 'Casual participation with free boards only',
    },
    {
      type: 'Regular Player',
      activity: '$25 board (2 squares) + $100 board + weekly bonus',
      bluePoints: '2,300',
      orangePoints: '27',
      description: 'Moderate spending with social engagement',
    },
    {
      type: 'VIP High-Roller',
      activity: '$100 board (3 squares) + $250 board (2 squares) + all bonuses',
      bluePoints: '11,000',
      orangePoints: '240',
      description: 'Premium player with maximum engagement',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Rewards System</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn Blue Points for gameplay and Orange Points for community
            activities. Build your rewards while competing in NFL squares!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blue-points">Blue Points</TabsTrigger>
            <TabsTrigger value="orange-points">Orange Points</TabsTrigger>
            <TabsTrigger value="vip">VIP Benefits</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Blue Points Overview */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    Blue Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 mb-4">
                    Earned through gameplay participation. Higher board prices =
                    more points!
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Free boards:</span>
                      <span className="font-semibold">100 points/board</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$5-$10 boards:</span>
                      <span className="font-semibold">150-200 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium boards:</span>
                      <span className="font-semibold">up to 2,000 points</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('blue-points')}
                  >
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Orange Points Overview */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    Orange Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 mb-4">
                    Earned through social activities and community engagement.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Friend referrals:</span>
                      <span className="font-semibold">20-50 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social sharing:</span>
                      <span className="font-semibold">2 points/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly challenges:</span>
                      <span className="font-semibold">25 points</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('orange-points')}
                  >
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Example Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Weekly Earning Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {exampleEarnings.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">
                        {example.type}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {example.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Blue Points:</span>
                          <span className="font-semibold">
                            {example.bluePoints}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-600">
                            Orange Points:
                          </span>
                          <span className="font-semibold">
                            {example.orangePoints}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {example.activity}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blue Points Tab */}
          <TabsContent value="blue-points" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Blue Points Earning Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier</TableHead>
                      <TableHead>Board Price</TableHead>
                      <TableHead>Points per Square</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bluePointTiers.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {tier.tier}
                        </TableCell>
                        <TableCell>{tier.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {tier.points} points
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tier.vipOnly ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              VIP Only
                            </Badge>
                          ) : (
                            <Badge variant="outline">All Players</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {tier.limit || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multipliers & Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {multipliers.map((multiplier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">{multiplier.name}</h4>
                      </div>
                      <p className="text-lg font-bold text-blue-600 mb-1">
                        {multiplier.effect}
                      </p>
                      <p className="text-sm text-gray-600">
                        {multiplier.requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orange Points Tab */}
          <TabsContent value="orange-points" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-orange-600" />
                  Orange Points Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Description</TableHead>
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
                        <TableCell className="text-sm text-gray-600">
                          {activity.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">
                  Community Board Leaders (CBL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 mb-4">
                  CBLs earn additional Orange Points for community building
                  activities:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Board reaches 95% fill</span>
                    <Badge className="bg-orange-600">50 points</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Perfect retention (4 weeks)</span>
                    <Badge className="bg-orange-600">100 points</Badge>
                  </div>
                </div>
                <Link href="/cbl/economics">
                  <Button variant="outline" className="w-full mt-4">
                    View CBL Economics <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VIP Benefits Tab */}
          <TabsContent value="vip" className="space-y-8">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Crown className="h-6 w-6" />
                  VIP Season Pass
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-yellow-600">$97</div>
                  <div>
                    <div className="text-sm text-gray-500 line-through">
                      Regular $299
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save $202!
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Core Benefits</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <span>
                          <strong>1.5×</strong> Blue Points multiplier
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-yellow-600" />
                        <span>Access to premium boards ($100+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-yellow-600" />
                        <span>Franchise Community Boards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-yellow-600" />
                        <span>100 Orange Points bonus</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Coming Soon</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Early NFT drops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          Free square placements
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Exclusive events</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                  <h5 className="font-semibold mb-2">VIP Earning Example</h5>
                  <p className="text-sm text-gray-700">
                    A VIP player buying 3 squares on a $100 board earns{' '}
                    <strong>4,500 Blue Points</strong>
                    (3,000 base × 1.5 multiplier) compared to 3,000 for regular
                    players.
                  </p>
                </div>

                <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700">
                  Upgrade to VIP <Crown className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-blue-100 mb-6">
                Connect your wallet and start accumulating Blue and Orange
                Points today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/player/dashboard">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    View My Dashboard
                  </Button>
                </Link>
                <Link href="/boards">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Browse Boards
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

export default RewardsSystemPage;
