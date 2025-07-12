'use client';

import { useState } from 'react';
import SquaresGrid from '@/components/SquaresGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [gameId, setGameId] = useState<number>(1);
  const [showBoard, setShowBoard] = useState(false);

  const handleJoinGame = () => {
    setShowBoard(true);
  };

  const handleCreateGame = () => {
    // In real implementation, this would create a new game via the Anchor program
    const newGameId = Math.floor(Math.random() * 10000) + 1;
    setGameId(newGameId);
    setShowBoard(true);
  };

  if (showBoard) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Football Squares</h1>
            <p className="text-gray-600">Decentralized football squares on Solana</p>
          </div>
          
          <SquaresGrid
            gameId={gameId}
            onSquarePurchase={(squareIndex) => {
              console.log(`Square ${squareIndex} purchase initiated`);
            }}
          />
          
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowBoard(false)}
            >
              ← Back to Games
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Football Squares
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Decentralized football squares on Solana. Fair, transparent, and trustless.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={handleCreateGame}>
                Create New Game
              </Button>
              <Button size="lg" variant="outline" onClick={handleJoinGame}>
                Join Existing Game
              </Button>
            </div>
          </div>

          {/* Game Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Join a Game</CardTitle>
                <CardDescription>
                  Enter a game ID to join an existing football squares game
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gameId">Game ID</Label>
                  <Input
                    id="gameId"
                    type="number"
                    value={gameId}
                    onChange={(e) => setGameId(parseInt(e.target.value) || 1)}
                    placeholder="Enter game ID"
                  />
                </div>
                <Button className="w-full" onClick={handleJoinGame}>
                  Join Game
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Game</CardTitle>
                <CardDescription>
                  Start a new football squares game for others to join
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Game Settings:</p>
                  <ul className="text-sm space-y-1">
                    <li>• 100 squares (10x10 grid)</li>
                    <li>• 0.01 SOL per square</li>
                    <li>• Winner takes all</li>
                    <li>• Automated payouts</li>
                  </ul>
                </div>
                <Button className="w-full" onClick={handleCreateGame}>
                  Create Game
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">1️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Buy Squares</h3>
                  <p className="text-sm text-gray-600">
                    Purchase squares on the 10x10 grid for 0.01 SOL each
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">2️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Numbers Assigned</h3>
                  <p className="text-sm text-gray-600">
                    Random numbers (0-9) are assigned to grid headers using VRF
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">3️⃣</span>
                  </div>
                  <h3 className="font-semibold mb-2">Winner Determined</h3>
                  <p className="text-sm text-gray-600">
                    Winner is determined by the last digit of each team's final score
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Our Platform?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Verifiable Randomness</h4>
                      <p className="text-sm text-gray-600">
                        Using Switchboard VRF for provably fair number generation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Automated Payouts</h4>
                      <p className="text-sm text-gray-600">
                        Winners are paid automatically via smart contract
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-time Updates</h4>
                      <p className="text-sm text-gray-600">
                        Live score updates and game state changes
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Transparent & Trustless</h4>
                      <p className="text-sm text-gray-600">
                        All game logic runs on-chain with full transparency
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Low Fees</h4>
                      <p className="text-sm text-gray-600">
                        Minimal transaction fees thanks to Solana's efficiency
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Email Notifications</h4>
                      <p className="text-sm text-gray-600">
                        Get notified when you win or when games start
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}