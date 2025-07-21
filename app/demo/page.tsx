'use client';

import React from 'react';
import EnhancedBoardGrid from '@/components/EnhancedBoardGrid';
import PricingPanel from '@/components/PricingPanel';
import {
  BoardConfiguration,
  SquareSelection,
  BOARD_TIERS,
} from '@/lib/boardTypes';
import { NFL_TEAMS } from '@/lib/nflTeams';

// Demo board configuration
const demoBoard: BoardConfiguration = {
  boardId: 'demo-board-001',
  gameId: 'demo-game-001',
  tier: BOARD_TIERS[1], // Use the $10 tier
  game: {
    gameId: 'demo-game',
    week: 15,
    homeTeam: NFL_TEAMS.find((t) => t.name === 'Chiefs') || NFL_TEAMS[0],
    awayTeam: NFL_TEAMS.find((t) => t.name === 'Bills') || NFL_TEAMS[1],
    gameDate: new Date('2024-12-15T20:00:00'),
    isPlayoffs: false,
    gameType: 'regular',
  },
  maxSquaresPerUser: 5,
  availableSquares: 55,
  totalSquaresSold: 45,
  isActive: true,
  createdAt: new Date(),
  gameStartTime: new Date('2024-12-15T20:00:00'),
};

export default function DemoPage() {
  const [currentSelection, setCurrentSelection] =
    React.useState<SquareSelection>();

  const handleSelectionChange = (selection: SquareSelection) => {
    setCurrentSelection(selection);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Demo: Enhanced Board Grid
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing the corrected board functionality with simulated user
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Board Grid - 2/3 width */}
          <div className="lg:col-span-2">
            <EnhancedBoardGrid
              board={demoBoard}
              userWalletAddress="demo-user-123"
              isVIP={false}
              onSquareSelectionChange={handleSelectionChange}
              currentSelection={currentSelection}
            />
          </div>

          {/* Pricing Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <PricingPanel
              selections={currentSelection ? [currentSelection] : []}
              onPurchaseConfirm={() => {
                console.log('Demo purchase confirmed');
                alert(
                  'Demo: Purchase confirmed! In real app, this would process payment.',
                );
              }}
              onClearSelections={() => {
                setCurrentSelection(undefined);
              }}
              isProcessing={false}
            />
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Testing Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">✅ Fixed Issues:</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Board number formatting with dashes (XXXX-XXXX-XXXX)</li>
                <li>• Infinite re-rendering loops resolved</li>
                <li>• NFT symbols display properly</li>
                <li>• R-A-N-D-O-M-I-Z-E-D headers</li>
                <li>• Watermark numbers for available squares</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔍 Test Features:</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Click squares to select (green checkmark)</li>
                <li>• Stable animations (no random flashing)</li>
                <li>• Real-time purchase simulations</li>
                <li>• Conflict resolution for simultaneous selections</li>
                <li>• Max Win details in pricing panel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
