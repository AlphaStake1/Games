'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  getExamplePoints,
  getResultDescription,
  getResultExample,
  type Result,
} from '@/lib/scoring';
import {
  Crown,
  Trophy,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  Gift,
  ChevronRight,
  CheckCircle,
  Info,
} from 'lucide-react';

interface Conference {
  id: number;
  name: string;
  price: number;
  filled: number;
  capacity: number;
  featured?: boolean;
}

const LeaderboardPage = () => {
  const router = useRouter();

  // Conference data based on tier system from comprehensive docs
  const conferences: Conference[] = [
    {
      id: 1,
      name: 'Eastern Conference',
      price: 25,
      filled: 87,
      capacity: 100,
    },
    {
      id: 2,
      name: 'Southern Conference',
      price: 50,
      filled: 65,
      capacity: 100,
    },
    {
      id: 3,
      name: 'Northern Conference',
      price: 100,
      filled: 43,
      capacity: 100,
    },
    {
      id: 4,
      name: 'Western Conference',
      price: 200,
      filled: 22,
      capacity: 100,
    },
  ];

  const featuredConference: Conference = {
    id: 5,
    name: 'South-East Conference',
    price: 500,
    filled: 8,
    capacity: 100,
    featured: true,
  };

  const LeaderboardCard = ({ conference }: { conference: Conference }) => {
    const fillPercentage = (conference.filled / conference.capacity) * 100;
    const isAlmostFull = fillPercentage >= 85;
    const isFull = fillPercentage >= 100;

    const cardClasses = conference.featured
      ? 'relative transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 dark:from-indigo-900/80 dark:to-purple-900/80 dark:border-indigo-400/50 shadow-lg'
      : 'relative transition-all duration-300 hover:shadow-lg bg-white/70 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg';

    return (
      <Card className={`${cardClasses} ${isFull ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle
                className={`text-lg ${conference.featured ? 'text-indigo-800 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}
              >
                {conference.name}
              </CardTitle>
              {conference.featured && (
                <Badge className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                  ⭐ FEATURED
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${conference.featured ? 'text-indigo-700 dark:text-indigo-200' : 'text-green-600 dark:text-green-400'}`}
              >
                ${conference.price}
              </p>
              <p
                className={`text-xs ${conference.featured ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}
              >
                per pass
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span
                  className={
                    conference.featured
                      ? 'text-indigo-700 dark:text-indigo-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                >
                  Capacity
                </span>
                <span
                  className={`font-medium ${conference.featured ? 'text-indigo-800 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}
                >
                  {conference.filled}/100
                </span>
              </div>
              <Progress value={fillPercentage} className="h-2" />
              {isAlmostFull && !isFull && (
                <p className="text-xs text-orange-600 mt-1">🔥 Almost full!</p>
              )}
              {isFull && <p className="text-xs text-red-600 mt-1">❌ Full</p>}
            </div>

            <Button
              className={`w-full ${conference.featured ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white' : ''}`}
              disabled={isFull}
              onClick={() =>
                router.push(`/season-pass/leaderboard/${conference.id}`)
              }
            >
              {isFull ? 'Conference Full' : 'View Leaderboard'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:bg-none dark:bg-[#030712] text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-sm">
              🏆 SEASON-PASS LEADERBOARDS
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Season-Pass Leaderboards
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            View the leaderboards for each conference and track your progress
            throughout the season.
          </p>
        </div>
      </section>

      {/* Available Conferences */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Available Conferences
          </h2>

          {/* Regular conferences grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {conferences.map((conference) => (
              <LeaderboardCard key={conference.id} conference={conference} />
            ))}
          </div>

          {/* Featured conference - full width */}
          <div className="max-w-2xl mx-auto">
            <LeaderboardCard conference={featuredConference} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
