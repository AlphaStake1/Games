'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HomeAwayExplainer from '@/components/HomeAwayExplainer';

const HowToPlayContent = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5] dark:bg-[#444341] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          How To Play Football Squares
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Football Squares is a fun, easy-to-play game that makes watching
              football even more exciting!
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Choose Your Board</h3>
                  <p>Select from different tiers and pricing options</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Pick Your Squares</h3>
                  <p>Choose squares on a 10x10 grid</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Watch & Win</h3>
                  <p>Win based on the score at the end of each quarter</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Game Rules
              <HomeAwayExplainer boardType="general" variant="tooltip" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The game is based on the last digit of each team's score at the
                end of each quarter.
              </p>
              <p>
                For example, if the score is HOME: 14, AWAY: 7, the winning
                square would be at the intersection of 4 and 7.
              </p>
              <p>
                Different quarters have different payout amounts depending on
                the tier you choose.
              </p>

              {/* Add inline explanation for better visibility */}
              <HomeAwayExplainer
                boardType="general"
                variant="card"
                className="mt-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Strategy & Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">⏰</span>
                <div>
                  <h4 className="font-semibold">Get Your Squares Early</h4>
                  <p>
                    The sooner you purchase, the more choices you have for your
                    NFT marker(s) in your favorite squares.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="font-semibold">Multiple Squares</h4>
                  <p>
                    Consider purchasing multiple squares to increase your
                    chances of winning.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🎲</span>
                <div>
                  <h4 className="font-semibold">Multiple Boards</h4>
                  <p>
                    Play boards at various price-points to spread your chances
                    of winning across different games.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">⭐</span>
                <div>
                  <h4 className="font-semibold">Join VIP</h4>
                  <p>Play any game, boost winnings, increased odds.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/boards">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
              Start Playing Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayContent;
