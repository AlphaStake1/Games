'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, TrendingUp, Info } from 'lucide-react';

interface Conference {
  id: number;
  name: string;
  price: number;
  filled: number;
  capacity: number;
  featured?: boolean;
}

interface ConferenceLeaderboardProps {
  conference: Conference | undefined;
}

const ConferenceLeaderboard = ({ conference }: ConferenceLeaderboardProps) => {
  const router = useRouter();

  const getConferenceColor = (conferenceId: number) => {
    switch (conferenceId) {
      case 1:
        return 'text-green-500';
      case 2:
        return 'text-blue-500';
      case 3:
        return 'text-purple-500';
      case 4:
        return 'text-orange-500';
      case 5:
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!conference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:bg-none dark:bg-[#030712] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Conference not found</h1>
          <p className="mt-4">
            The conference you are looking for does not exist.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'Player 1', score: 1250 },
    { rank: 2, name: 'Player 2', score: 1100 },
    { rank: 3, name: 'Player 3', score: 1050 },
    { rank: 4, name: 'Player 4', score: 900 },
    { rank: 5, name: 'Player 5', score: 850 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:bg-none dark:bg-[#030712] text-gray-900 dark:text-white">
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-sm">
            <Trophy className="w-4 h-4 mr-2" />
            LEADERBOARD
          </Badge>
          <h1
            className={`text-5xl md:text-7xl font-bold mt-6 mb-4 ${getConferenceColor(
              conference.id,
            )}`}
          >
            {conference.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Tier {conference.id}
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card
            className={`bg-white/80 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 shadow-lg border-t-8 ${getConferenceColor(
              conference.id,
            ).replace('text', 'border')}`}
          >
            <CardHeader>
              <CardTitle className="text-center text-gray-900 dark:text-white">
                Top Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>
                        #{player.rank}
                      </Badge>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-bold">
                      {player.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ConferenceLeaderboard;
