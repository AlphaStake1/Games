'use client';

import React, { useState } from 'react';
import QuickPickModal from '@/components/QuickPickModal';
import BoardSelectorWithQuickPick from '@/components/BoardSelectorWithQuickPick';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoardConfiguration, GameSchedule } from '@/lib/boardTypes';
import { NFLTeam, getTeamById } from '@/lib/nflTeams';
import { Sparkles, Grid } from '@/lib/icons';

/**
 * Example implementation showing how to use the QuickPickModal component
 * in different scenarios within the Weekly Football Squares application.
 */
const QuickPickExample: React.FC = () => {
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [userTeam] = useState<NFLTeam>(
    getTeamById('buf') || {
      id: 'buf',
      name: 'Bills',
      city: 'Buffalo',
      abbreviation: 'BUF',
      conference: 'AFC',
      division: 'East',
      primaryColor: '#00338D',
      secondaryColor: '#C60C30',
      logoUrl: '/assets/teams/bills.png',
    },
  );
  const [isVIP] = useState(false);

  // Mock game data for demonstration
  const mockGames: GameSchedule[] = [
    {
      gameId: 'game-1',
      week: 1,
      homeTeam: userTeam,
      awayTeam: getTeamById('ne') || userTeam,
      gameDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isPlayoffs: false,
      gameType: 'regular',
    },
    {
      gameId: 'game-2',
      week: 2,
      homeTeam: getTeamById('mia') || userTeam,
      awayTeam: userTeam,
      gameDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isPlayoffs: false,
      gameType: 'regular',
    },
    {
      gameId: 'game-3',
      week: 3,
      homeTeam: getTeamById('nyj') || userTeam,
      awayTeam: getTeamById('dal') || userTeam,
      gameDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      isPlayoffs: false,
      gameType: 'regular',
    },
  ];

  const handleBoardSelect = (board: BoardConfiguration) => {
    console.log('Board selected:', board);
    setSelectedBoards((prev) => [...prev, board.boardId]);
  };

  const handleVIPUpgrade = () => {
    console.log('VIP upgrade requested');
    // In real implementation, this would trigger VIP upgrade flow
    alert('VIP upgrade flow would be triggered here');
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">QuickPick Modal Examples</h1>
        <p className="text-muted-foreground">
          Demonstrating the QuickPick functionality for enhanced user experience
        </p>
      </div>

      {/* Example 1: Standalone QuickPick Modal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Example 1: Standalone QuickPick Modal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use the QuickPick modal as a standalone component to help users find
            their perfect board quickly.
          </p>

          <QuickPickModal
            userTeam={userTeam}
            isVIP={isVIP}
            availableGames={mockGames}
            onBoardSelect={handleBoardSelect}
            onVIPUpgrade={handleVIPUpgrade}
          >
            <Button className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-2" />
              Open QuickPick Assistant
            </Button>
          </QuickPickModal>

          <div className="text-xs text-muted-foreground">
            Selected boards: {selectedBoards.length}
          </div>
        </CardContent>
      </Card>

      {/* Example 2: Integrated Board Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Example 2: Integrated Board Selector with QuickPick
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete board selection experience with QuickPick integration for
            new users.
          </p>

          <BoardSelectorWithQuickPick
            userTeam={userTeam}
            isVIP={isVIP}
            availableGames={mockGames}
            onBoardSelect={handleBoardSelect}
            onVIPUpgrade={handleVIPUpgrade}
            selectedBoards={selectedBoards}
          />
        </CardContent>
      </Card>

      {/* Example 3: VIP User Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Example 3: VIP User Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            See how the QuickPick experience changes for VIP users with access
            to premium boards.
          </p>

          <QuickPickModal
            userTeam={userTeam}
            isVIP={true}
            availableGames={mockGames}
            onBoardSelect={handleBoardSelect}
            onVIPUpgrade={handleVIPUpgrade}
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-2" />
              VIP QuickPick Experience
            </Button>
          </QuickPickModal>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <h4 className="font-medium">Key Features Implemented:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                Progressive disclosure: Shows 2 recommendations by default,
                expandable to more
              </li>
              <li>
                Smart recommendations based on user preferences (team, budget,
                risk tolerance)
              </li>
              <li>Mobile-responsive design with touch-friendly interactions</li>
              <li>
                Empty states for edge cases (no matching boards, VIP upgrades
                needed)
              </li>
              <li>Success states with clear next steps</li>
              <li>
                Integration with existing design system (shadcn/ui components)
              </li>
              <li>TypeScript support with proper type definitions</li>
            </ul>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="font-medium">UX Improvements:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Reduces cognitive load for new users</li>
              <li>Eliminates choice paralysis with guided recommendations</li>
              <li>Maintains access to full board selection for power users</li>
              <li>Provides educational context about board differences</li>
              <li>Streamlines the onboarding experience</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickPickExample;
